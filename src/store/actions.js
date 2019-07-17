// https://vuex.vuejs.org/en/actions.html
import Axios from 'axios';
import { getParam, getSsoUrl, getReturnUri } from '../plugins/helpers';
import config from '../config';

const axios = Axios.create({
  baseURL: `${config['user-management'].url}/v1`,
});

axios.interceptors.request.use((config) => {
  config.withCredentials = true;

  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  login({ commit }, userData) {
    return new Promise((resolve, reject) => {
      commit('loggingIn', true);
      commit('hasError', false);
      axios.post(`${config['user-management'].url}/v1/auth/login`,
        { username: userData.username, password: userData.password })
        .then((response) => {
          const user = response.data;
          commit('user', user);
          sessionStorage.setItem('user', JSON.stringify(user));
          commit('loggingIn', false);
          resolve(user);
        })
        .catch((err) => {
          console.log('login error');
          commit('hasError', true);
          commit('loggingIn', false);
          commit('error', 'Incorrect username or password');
          reject(err);
        });
    });
  },
  async loginSSO({ commit }) {
    commit('loggingInSSO', true);
    commit('hasError', false);

    localStorage.setItem('sso-login', 'true');

    const token = getParam('token');

    if (token) {
      sessionStorage.setItem('token', token);
    }
    if (!token) {
      window.location.href = getSsoUrl();
    }
    try {
      const response = await axios.get('/auth/identity');
      const user = response.data;
      commit('user', user);
      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.replace(getReturnUri());
    } catch (error) {
      commit('hasError', true);
      commit(
        'error',
        'Could not login with SSO. Please try again later or use the login form',
      );
    }

    return commit('loggingInSSO', false);
  },
  logout({ commit }) {
    commit('loggedOut');
    localStorage.setItem('sso-login', 'false');
    sessionStorage.clear();
  },
  getToken({ commit }, code) {
    return axios.get('/auth/token',
      {
        params: {
          code,
        },
      })
      .then(response => response.data.token)
      .catch((err) => {
        commit('hasError', true);
        return err;
      });
  },
};
