// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config['user-management'].url, config['user-management'].code);

export default {
  getUsers({ state, commit }) {
    const name = 'users';

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = api.get('users', {
      with: JSON.stringify(['department', 'roles']),
      filters: JSON.stringify({
        allOf: [
          {
            status: 1,
          },
        ],
      }),
    });

    commit('promise', { name, promise });

    promise
      .then(response => commit('users', response.data.data))
      .catch(() => commit('error', 'Could not get users list'));

    return promise;
  },

  getUser({ commit }) {
    const promise = api.get(`auth/identity?code=${config.devops.code}`);

    promise
      .then((response) => {
        commit('user', response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      });

    return promise;
  },

  getRoles({ state, commit }) {
    const name = 'roles';

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = api.get('roles', {
      with: JSON.stringify(['', 'users', 'actions']),
      filters: JSON.stringify({
        allOf: [
          {
            application: {
              allOf: [
                {
                  code: config.devops.code,
                },
              ],
            },
          },
        ],
      }),
    });

    commit('promise', { name, promise });

    promise
      .then(response => commit('roles', response.data.data))
      .catch(() => commit('error', 'Could not get roles list'));

    return promise;
  },

  getActions({ state, commit }) {
    const name = 'actions';

    if (state.promises[name]) {
      return state.promises[name];
    }

    const promise = api.get('actions', {
      filters: JSON.stringify({
        allOf: [
          {
            application: {
              allOf: [
                {
                  code: config.devops.code,
                },
              ],
            },
          },
        ],
      }),
    });

    promise
      .then((response) => {
        commit('actions', response.data.data);
      })
      .catch(error => commit('error', error));

    commit('promise', { name, promise });

    return promise;
  },

  createRole({ commit }, payload) {
    const promise = api.post('roles', payload);
    promise
      .then(response => commit('addRole', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },

  updateRole({ commit }, { id, payload }) {
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

  updateUserRoles({ commit }, payload) {
    const promise = api.put(`users/${payload.username}/${config.devops.code}/roles`, payload.roles);
    promise
      .then(response => commit('updateUserRoles', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },
};
