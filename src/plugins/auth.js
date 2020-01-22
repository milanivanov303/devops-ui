/* eslint class-methods-use-this: "off" */

import Axios from 'axios';
import config from '@/config';
import { getParam, deleteParam, getSsoUrl } from '@/plugins/helpers';
import store from '@/store';

class Auth {
  constructor() {
    this.axios = Axios.create({
      baseURL: config['user-management'].url,
    });
    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));

    if (this.getUser()) {
      this.getIdentity();
    }
  }

  requestInterceptor(config) {
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  login(username, password, code = '') {
    const promise = this.axios.post('auth/login', { username, password, code });

    promise
      .then((response) => {
        this.setUser(response.data.user);
        this.setToken(response.data.token);
      });

    return promise;
  }

  loginSSO() {
    localStorage.setItem('sso-login', 'true');

    const token = getParam('token');
    if (!token) {
      window.location.href = getSsoUrl();
      return Promise.resolve();
    }

    this.setToken(token);

    // remove token param from URL and browser history
    deleteParam('token');

    return this.getIdentity();
  }

  loginWithSSO() {
    return localStorage.getItem('sso-login') === 'true';
  }

  logout() {
    localStorage.clear();
    localStorage.setItem('sso-login', 'false');
  }

  getIdentity() {
    const promise = this.axios.get(`auth/identity?code=${config.devops.code}`);
    promise.then(response => this.setUser(response.data));
    return promise;
  }

  getApiToken(code) {
    const name = `token.${code}`;

    if (store.state.promises[name]) {
      return store.state.promises[name];
    }

    const promise = this.axios.get(`auth/token?code=${code}`);

    store.commit('promise', { name, promise });

    promise.catch(() => store.commit('error', 'Could not get token'));

    return promise;
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  can(action) {
    const user = this.getUser();

    if (!user || typeof user.permissions === 'undefined') {
      return false;
    }

    if (user.permissions === '*') {
      return true;
    }

    if (user.permissions.indexOf(action) !== -1) {
      return true;
    }

    return false;
  }
}

export default new Auth();
