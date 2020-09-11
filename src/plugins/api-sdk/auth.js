/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getExpire"] }] */

import Axios from 'axios';
import Storage from './storage';
import { deleteParam, getParam, getReturnUri } from './helpers';

class Auth {
  constructor(url, code, options = {}) {
    this.url = url;
    this.code = code;

    this.storage = new Storage(options.session_name || 'app_session');
    this.expire = this.getExpire(options.session_expire || '1 hour');

    this.username = options.username || null;
    this.password = options.password || null;

    this.axios = Axios.create({
      baseURL: url,
    });
    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
    this.axios.interceptors.response.use(null, this.errorInterceptor.bind(this));
  }

  requestInterceptor(config) {
    const token = this.storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  errorInterceptor(error) {
    debugger;
    if (error.response.status === 401 && this.username && this.password) {
      return this.login(this.username, this.password).then((response) => {
        error.config.headers.Authorization = `Bearer ${response.data.token}`;
        return Axios.create().request(error.config);
      });
    }
    return Promise.reject(error);
  }

  sessionExpired() {
    const lastActivity = this.storage.get('last-activity') || Date.now();

    // update last activity
    this.storage.set('last-activity', Date.now());

    return (Date.now() - this.expire) > lastActivity;
  }

  getExpire(expire) {
    const expireInt = parseInt(expire, 10);

    if (expire.match('hour')) {
      return expireInt * 60 * 60 * 1000;
    }

    if (expire.match('minute')) {
      return expireInt * 60 * 1000;
    }

    if (expire.match('seconds')) {
      return expireInt * 1000;
    }

    return expireInt;
  }

  login(username, password) {
    const promise = this.axios.post('auth/login', { username, password, code: this.code });

    promise
      .then((response) => {
        this.storage.set('user', response.data.user);
        this.storage.set('token', response.data.token);
      });

    return promise;
  }

  loginSSO() {
    const token = getParam('token');
    if (!token) {
      window.location.href = `${this.getSsoUrl()}&code=${this.code}`;
      return Promise.resolve();
    }

    this.storage.set('token', token);

    // remove token param from URL and browser history
    deleteParam('token');

    return this.getIdentity();
  }

  getSsoUrl() {
    let redirectUrl = `${window.location.origin}/login`;
    const returnUri = getReturnUri();
    if (returnUri) {
      redirectUrl += `?sso_login=true&return_uri=${returnUri}`;
    }
    return `${this.url}/../login?redirect_url=${encodeURIComponent(redirectUrl)}`;
  }

  logout() {
    this.storage.removeAll();
  }

  getIdentity() {
    const promise = this.axios.get(`auth/identity?code=${this.code}`);
    promise.then(response => this.storage.set('user', response.data));
    return promise;
  }

  getApiToken(code) {
    const token = this.storage.get(`token.${code}`);
    if (token) {
      return Promise.resolve(token);
    }

    return this.getNewApiToken(code);
  }

  getNewApiToken(code) {
    const promise = this.axios.get(`auth/token?code=${code}`);

    promise.then(
      response => this.storage.set(`token.${code}`, response.data.token),
    );

    return promise;
  }

  getUser() {
    if (this.sessionExpired()) {
      this.storage.removeAll();
    }

    return this.storage.get('user');
  }

  can(action) {
    const user = this.getUser();

    if (!user || typeof user.permissions === 'undefined') {
      return false;
    }

    if (user.permissions === '*') {
      return true;
    }

    return user.permissions.indexOf(action) !== -1;
  }
}

export default Auth;
