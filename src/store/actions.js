// https://vuex.vuejs.org/en/actions.html
import Axios from 'axios';
// import { getParam, getSsoUrl } from '../plugins/helpers';
import config from '../config';


export default {
  login({ commit }, payload) {
    const promise = Axios.post(`${config['user-management'].url}/auth/login`, payload);

    promise
      .then((response) => {
        commit('user', response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      });

    return promise;
  },

  loginSSO({ commit }, token) {
    localStorage.setItem('token', token);

    const promise = Axios.get(
      `${config['user-management'].url}/auth/identity?code=${config.devops.code}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    promise
      .then((response) => {
        commit('user', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      });

    return promise;
  },

  logout({ commit }) {
    commit('loggedOut');
    localStorage.clear();
    localStorage.setItem('sso-login', 'false');
  },

  getToken({ state, commit }, code) {
    const name = `token.${code}`;

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = Axios.get(
      `${config['user-management'].url}/auth/token?code=${code}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    );

    commit('promise', { name, promise });

    promise
      .catch(() => commit('error', 'Could not get token'));

    return promise;
  },
};
