/* eslint class-methods-use-this: "off" */

import Axios from 'axios';
import config from '@/config';
import { getParam, deleteParam, getSsoUrl } from '@/plugins/helpers';
import Storage from '@/plugins/storage';

class Auth {
  constructor(storage, code) {
    this.storage = storage;
    this.code = code;

    this.axios = Axios.create({
      baseURL: config['user-management'].url,
    });
    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));

    if (this.getUser()) {
      this.getIdentity();
    }
  }

  requestInterceptor(config) {
    const token = this.storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  sessionExpired() {
    const lastActivity = this.storage.get('last-activity') || Date.now();

    // update last activity
    this.storage.set('last-activity', Date.now());

    return (Date.now() - 1*60*1000) > lastActivity;
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
    this.storage.set('sso-login', true);

    const token = getParam('token');
    if (!token) {
      window.location.href = `${getSsoUrl()}&code=${this.code}`;
      return Promise.resolve();
    }

    this.storage.set('token', token);

    // remove token param from URL and browser history
    deleteParam('token');

    return this.getIdentity();
  }

  loginWithSSO() {
    return this.storage.get('sso-login') === true;
  }

  logout() {
    this.storage.removeAll();
    this.storage.set('sso-login', false);
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
    promise.then((response) => this.storage.set(`token.${code}`, response.data.token));
    return promise;
  }

  getUser() {
    if (this.sessionExpired()) {
      const ssoLogin = this.storage.get('sso-login');
      this.storage.removeAll();
      this.storage.set('sso-login', ssoLogin);
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

const auth = new Auth(new Storage("app_session"), config.devops.code);

export default auth;
