// https://vuex.vuejs.org/en/actions.html
import Axios from 'axios';
import { getParam, getSsoUrl, getReturnUri } from '../plugins/helpers';
import config from '../config';
import queryString from "query-string";

const axios = Axios.create({
  baseURL: `${config['user-management'].url}/v1`,
});

axios.interceptors.request.use((config) => {
  config.withCredentials = true;

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  async login({ commit }, userData) {
    commit('loggingIn', true);
    commit('hasError', false);

    try {
      const response = await axios.post('/auth/login',
        { username: userData.username, password: userData.password });
      const user = response.data;
      commit('user', user);
      localStorage.setItem('user', JSON.stringify(user));
      commit('loggingIn', false);
    } catch (error) {
      commit('hasError', true);
      commit('loggingIn', false);
      commit('error', 'Incorrect username or password');
    }

    commit('loggingIn', false);
  },
  async loginSSO({ commit }) {
    commit('loggingInSSO', true);
    commit('hasError', false);

    localStorage.setItem('sso-login', 'true');

    const token = getParam('token');

    if (token) {
      localStorage.setItem('token', token);
    }
    if (!token) {
      window.location.href = getSsoUrl();
    }
    try {
      const response = await axios.get('/auth/identity');
      const user = response.data;
      commit('user', user);
      localStorage.setItem('user', JSON.stringify(user));
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
    // localStorage.setItem('sso-login', 'false');
    localStorage.clear();
  },

  async getToken({ commit }, code) {
    try {
      const response = await axios.get('/auth/token', {
        params: {
          code,
        },
      });
      return response.data.token;
    } catch (err) {
      commit('hasError', true);
      return err;
    }
  },

  async getUsers({ commit }, payload) {
    const query = queryString.stringify(payload, { arrayFormat: 'index' });
    return await axios.get('/users?' + query)
      .then(response => {
        commit('users', response.data.data);
      })
      .catch(error => commit('error', error));
  },
  async getRoles({ commit }, payload) {
    const query = queryString.stringify(payload, { arrayFormat: 'index' });
    return await axios.get('/roles?' + query)
      .then(response => {
        commit('roles', response.data.data);
      })
      .catch(error => commit('error', error));
  },
  async getActions({ commit }, payload) {
    const query = queryString.stringify(payload, { arrayFormat: 'index' });
    return await axios.get('/actions?' + query)
      .then(response => {
        commit('actions', response.data.data);
      })
      .catch(error => commit('error', error));
  },

  async createRole({ commit }, payload) {
    return await axios.post('/roles', payload)
      .then(response => {
        commit('actions', response.data.data);
      })
      .catch(error => commit('error', error));
  },

  async updateRole({ commit }, payload) {
    debugger;
    return await axios.put(`/roles/${payload.id}`, payload)
      .then(response => {
        console.log(response.data)
        //commit('actions', response.data.data);
      })
      .catch(error => commit('error', error));
  },

};
