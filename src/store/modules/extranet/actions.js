// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getClients({ commit }) {
    const name = 'extranet-clients';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/clients');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('clients', response.data))
      .catch(() => commit('error', 'Could not get clients list', { root: true }));
    return promise;
  },

  getDebiteurClients({ commit }) {
    const name = 'extranet-debiteur-clients';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/debiteur-clients');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('debiteurClients', response.data))
      .catch(() => commit('error', 'Could not get debiteur clients list', { root: true }));
    return promise;
  },

  getBranches({ commit }) {
    const name = 'extranet-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  getContainers({ commit }) {
    const promise = api.get('extranet/containers');

    promise
      .then((response) => {
        commit('containers', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get containers list', { root: true }));
    return promise;
  },

  getFeBranches({ commit }) {
    const name = 'extranet-fe-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/fe-branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('feBranches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  getDebiteurBranches({ commit }) {
    const name = 'extranet-debiteur-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/debiteur-branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('debiteurBranches', response.data))
      .catch(() => commit('error', 'Could not get debiteur branches list', { root: true }));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api.post('extranet/build', payload);
    promise.catch(error => commit('error', error, { root: true }));
    return promise;
  },

  removeBuild({ commit }, id) {
    const promise = api.delete(`extranet/build/${id}`);
    promise
      .then(() => commit('removeBuild', id))
      .catch(error => commit('error', error, { root: true }));
    return promise;
  },

  getConfigurations({ commit }) {
    const name = 'extranet-configurations';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/configurations');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('configurations', response.data.data))
      .catch(() => commit('error', 'Could not get configurations list', { root: true }));
    return promise;
  },

  createConfiguration({ commit }, payload) {
    const promise = api.post('extranet/configurations', payload);

    promise
      .then(response => commit('createConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not create configuration', { root: true }));

    return promise;
  },

  updateConfiguration({ commit }, payload) {
    const promise = api.put(`extranet/configurations/${payload.id}`, payload);

    promise
      .then(response => commit('updateConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not update configuration', { root: true }));

    return promise;
  },

  deleteConfiguration({ commit }, id) {
    const promise = api.delete(`extranet/configurations/${id}`);

    promise
      .then(() => commit('deleteConfiguration', id))
      .catch(() => commit('error', 'Could not delete configuration', { root: true }));

    return promise;
  },
};
