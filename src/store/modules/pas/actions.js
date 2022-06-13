// https://vuex.vuejs.org/en/actions.html

export default {
  getConfigurations({ commit }) {
    const name = 'configurations';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('pas/configurations');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('configurations', response.data.data))
      .catch(() => commit('error', 'Could not get configurations list', { root: true }));
    return promise;
  },

  createConfiguration({ commit }, payload) {
    const promise = api('devops').post('pas/configurations', payload);

    promise
      .then((response) => commit('createConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not create configuration', { root: true }));

    return promise;
  },

  buildConfiguration({ commit }, { id, payload }) {
    const promise = api('devops').post(`pas/configurations/${id}/build`, payload);
    promise.catch((error) => commit('error', error, { root: true }));
    return promise;
  },

  updateConfiguration({ commit }, payload) {
    const promise = api('devops').put(`pas/configurations/${payload.id}`, payload);

    promise
      .then((response) => commit('updateConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not update configuration', { root: true }));

    return promise;
  },

  deleteConfiguration({ commit }, id) {
    const promise = api('devops').delete(`pas/configurations/${id}`);

    promise
      .then(() => commit('deleteConfiguration', id))
      .catch(() => commit('error', 'Could not delete configuration', { root: true }));

    return promise;
  },
  getClients({ commit }) {
    const name = 'clients';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('pas/clients');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('clients', response.data.data))
      .catch(() => commit('error', 'Could not get clients list', { root: true }));
    return promise;
  },
  createClient({ commit }, payload) {
    const promise = api('devops').post('pas/clients', payload);

    promise
      .then((response) => commit('createClient', response.data.data))
      .catch(() => commit('error', 'Could not create client', { root: true }));

    return promise;
  },
  updateClient({ commit }, payload) {
    const promise = api('devops').put(`pas/clients/${payload.id}`, payload);

    promise
      .then((response) => commit('updateClient', response.data.data))
      .catch(() => commit('error', 'Could not update client', { root: true }));

    return promise;
  },
  deleteClient({ commit }, id) {
    const promise = api('devops').delete(`pas/clients/${id}`);

    promise
      .then(() => commit('deleteClient', id))
      .catch(() => commit('error', 'Could not delete client', { root: true }));

    return promise;
  },

  getHashes({ commit }, branch) {
    const promise = api('devops').get('extranet/hashes', { branch });

    promise
      .then((response) => commit('hashes', response.data))
      .catch(() => commit('error', 'Could not get hashes list', { root: true }));
    return promise;
  },

  getFeHashes({ commit }, branch) {
    const promise = api('devops').get('extranet/fe-hashes', { branch });

    promise
      .then((response) => commit('feHashes', response.data))
      .catch(() => commit('error', 'Could not get hashes list', { root: true }));
    return promise;
  },
};
