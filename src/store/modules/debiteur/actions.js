// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getClients({ commit }) {
    const name = 'debiteur-clients';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('debiteur/clients');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('clients', response.data))
      .catch(() => commit('error', 'Could not get clients list', { root: true }));
    return promise;
  },

  getBranches({ commit }) {
    const name = 'debiteur-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('debiteur/branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  getHost({ commit }) {
    const promise = api.get('debiteur/host');

    promise
      .then((response) => {
        commit('host', response.data.host);
      })
      .catch(() => commit('error', 'Could not get host name', { root: true }));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api.post('debiteur/build', payload);
    promise.catch(error => commit('error', error, { root: true }));
    return promise;
  },

  removeBuild({ commit }, id) {
    const promise = api.delete(`debiteur/build/${id}`);
    promise
      .then(() => commit('removeBuild', id))
      .catch(error => commit('error', error, { root: true }));
    return promise;
  },
};
