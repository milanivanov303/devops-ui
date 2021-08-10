// https://vuex.vuejs.org/en/actions.html

export default {
  getClients({ commit }) {
    const name = 'extranet-clients';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('extranet/clients');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('clients', response.data))
      .catch(() => commit('error', 'Could not get clients list', { root: true }));
    return promise;
  },

  getBranches({ commit }) {
    const name = 'extranet-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('extranet/branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  getHost({ commit }) {
    const promise = api('devops').get('extranet/host');

    promise
      .then((response) => {
        commit('host', response.data.host);
      })
      .catch(() => commit('error', 'Could not get host name', { root: true }));
    return promise;
  },

  getImages({ commit }) {
    const promise = api('devops').get('extranet/images');

    promise
      .then((response) => {
        commit('images', response.data);
      })
      .catch(() => commit('error', 'Could not get images', { root: true }));
    return promise;
  },

  getFeBranches({ commit }) {
    const name = 'extranet-fe-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('extranet/fe-branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('feBranches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api('devops').post('extranet/build', payload);
    promise.catch((error) => commit('error', error, { root: true }));
    return promise;
  },

  removeBuild({ commit }, id) {
    const promise = api('devops').delete(`extranet/build/${id}`);
    promise
      .then(() => commit('removeBuild', id))
      .catch((error) => commit('error', error, { root: true }));
    return promise;
  },

  getConfigurations({ commit }) {
    const name = 'extranet-configurations';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('extranet/configurations');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('configurations', response.data.data))
      .catch(() => commit('error', 'Could not get configurations list', { root: true }));
    return promise;
  },

  createConfiguration({ commit }, payload) {
    const promise = api('devops').post('extranet/configurations', payload);

    promise
      .then((response) => commit('createConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not create configuration', { root: true }));

    return promise;
  },

  buildConfiguration({ commit }, { id, payload }) {
    const promise = api('devops').post(`extranet/configurations/${id}/build`, payload);
    promise.catch((error) => commit('error', error, { root: true }));
    return promise;
  },

  updateConfiguration({ commit }, payload) {
    const promise = api('devops').put(`extranet/configurations/${payload.id}`, payload);

    promise
      .then((response) => commit('updateConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not update configuration', { root: true }));

    return promise;
  },

  deleteConfiguration({ commit }, id) {
    const promise = api('devops').delete(`extranet/configurations/${id}`);

    promise
      .then(() => commit('deleteConfiguration', id))
      .catch(() => commit('error', 'Could not delete configuration', { root: true }));

    return promise;
  },
};
