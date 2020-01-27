/* eslint class-methods-use-this: "off" */

import Axios from 'axios';
import config from '@/config';
import { getParam, deleteParam, getSsoUrl } from '@/plugins/helpers';
import Storage from '@/plugins/storage';

class Auth {
  constructor() {
    this.storage = new Storage(config.auth.session_name);
    this.code = config.auth.code;
    this.expire = this.getExpire(config.auth.session_expire);

    this.axios = Axios.create({
      baseURL: config.um.url,
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
      window.location.href = `${getSsoUrl()}&code=${this.code}`;
      return Promise.resolve();
    }

    this.storage.set('token', token);

    // remove token param from URL and browser history
    deleteParam('token');

    return this.getIdentity();
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
    promise.then(response => this.storage.set(`token.${code}`, response.data.token));
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

export default new Auth();
