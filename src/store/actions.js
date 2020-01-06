// https://vuex.vuejs.org/en/actions.html
import { getParam, getSsoUrl } from '../plugins/helpers';
import config from '../config';
import Api from "../plugins/api";
import Axios from "axios";

const api = new Api(config['user-management'].url, config['user-management'].code);

export default {
  login({ commit }, payload) {
    const promise = Axios.post(`${config['user-management'].url}/auth/login`, payload);

    promise
      .then(response => {
        commit('user', response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
      });

    return promise;
  },

  loginSSO({ commit }, token) {
    localStorage.setItem('token', token);

    const promise = Axios.get(
      `${config['user-management'].url}/auth/identity`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    promise
      .then(response => {
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );

    commit('promise', {name, promise});

    promise
      .catch(() => commit('error', 'Could not get token'));

    return promise;
  },

  getUsers({ state, commit }) {
    const name = 'users';

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = api.get('users', {
      with: JSON.stringify(['department', 'roles']),
    });

    commit('promise', {name, promise});

    promise
      .then(response => commit('users', response.data.data))
      .catch(() => commit('error', 'Could not get users list'));

    return promise;
  },

  getRoles({ state, commit }) {
    const name = 'roles';

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = api.get('roles', {
      with: JSON.stringify(['users']),
    });

    commit('promise', {name, promise});

    promise
      .then(response => commit('roles', response.data.data))
      .catch(() => commit('error', 'Could not get roles list'));

    return promise;
  },

  getActions({ state, commit }, payload) {
    const name = 'actions';

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = api.get('actions', payload);

    promise
      .then(response => {
        commit('actions', response.data.data);
      })
      .catch(error => commit('error', error));

    commit('promise', {name, promise});

    return promise;
  },

  createRole({ commit }, payload) {
    const promise = api.post(`roles`, payload);
    promise
      .then(response => commit('addRole', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },

  updateRole({ commit }, {id, payload}) {
    const promise = api.put(`roles/${id}`, payload);
    promise
      .then(response => commit('updateRole', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },

  deleteRole({ commit }, id) {
    const promise = api.delete(`roles/${id}`);
    promise
      .then(() => commit('deleteRole', id))
      .catch(error => commit('error', error));
    return promise;
  },
};
