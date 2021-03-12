import Axios from 'axios';
import config from '../../config';
import Storage from './storage';

class Auth {
  constructor(url, code, options = {}) {
    this.url = url;
    this.code = code;
    this.applications = config.auth.applications.split(',');

    this.storage = new Storage(options.session_name || 'app_session');
    this.expire = config.auth.session_expire;

    this.username = options.username || null;
    this.password = options.password || null;

    this.axios = Axios.create({
      baseURL: url,
    });
    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
    this.axios.interceptors.response.use(null, this.errorInterceptor.bind(this));

    this.promices = {};
  }

  requestInterceptor(config) {
    const token = this.storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  errorInterceptor(error) {
    if (error.response.status === 401 && this.username && this.password) {
      return this.login(this.username, this.password).then((response) => {
        error.config.headers.Authorization = `Bearer ${response.data.token}`;
        return Axios.create().request(error.config);
      });
    }
    return Promise.reject(error);
  }

  login(username, password) {
    let query = [];
    this.applications.forEach((appCode) => {
      query.push(`applications[]=${appCode}`);
    });
    query = query.join('&');

    const promise = this.axios.post(`auth/login?${query}`, { username, password });

    promise
      .then((response) => {
        this.storage.set('user', response.data.user);
        this.storage.set('token', response.data.token);
      });

    return promise;
  }

  logout() {
    this.storage.removeAll();
  }

  setUser(user) {
    this.storage.set('user', user);
  }

  getUser() {
    return this.storage.get('user');
  }

  getIdentity() {
    let query = [];
    this.applications.forEach((appCode) => {
      query.push(`applications[]=${appCode}`);
    });
    query = query.join('&');

    return this.axios.get(`auth/identity?${query}`);
  }

  getApiToken(code) {
    const token = this.storage.get(`token.${code}`);
    if (token) {
      return Promise.resolve(token);
    }

    const promise = this.getNewApiToken(code);

    promise.then(
      response => this.storage.set(`token.${code}`, response.data.token),
    );

    return promise;
  }

  getNewApiToken(code) {
    // if get token request for this code was already sent reuse it
    if (this.promices[code]) {
      return this.promices[code];
    }

    const promise = this.axios.get(`auth/token?code=${code}`)
      .finally(() => delete this.promices[code]);

    this.promices[code] = promise;

    return promise;
  }

  can(action, code = this.code) {
    const user = this.getUser();

    if (!user || typeof user.permissions === 'undefined' || typeof user.permissions[code] === 'undefined') {
      return false;
    }

    if (user.permissions[code] === '*') {
      return true;
    }
    return user.permissions[code].indexOf(action) !== -1;
  }
}

export default Auth;
