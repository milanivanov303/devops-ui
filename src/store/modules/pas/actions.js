// https://vuex.vuejs.org/en/actions.html

export default {
  getConfigurations({ commit }) {
    const name = 'configurations';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('pas/configurations', {
      with: JSON.stringify(['deliveryChain']),
    });

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

  getParams({ commit }) {
    const promise = api('devops').get('pas/params');

    promise
      .then((response) => commit('params', response.data.data))
      .catch(() => commit('error', 'Could not get parameters list', { root: true }));
    return promise;
  },
  createParam({ commit }, payload) {
    const promise = api('devops').post('pas/params', payload);

    promise
      .then((response) => commit('createParam', response.data.data))
      .catch(() => commit('error', 'Could not create parameter', { root: true }));

    return promise;
  },
  updateParam({ commit }, payload) {
    const promise = api('devops').put(`pas/params/${payload.id}`, payload);

    promise
      .then((response) => commit('updateParam', response.data.data))
      .catch(() => commit('error', 'Could not update parameter', { root: true }));

    return promise;
  },
  deleteParam({ commit }, id) {
    const promise = api('devops').delete(`pas/params/${id}`);

    promise
      .then(() => commit('deleteParam', id))
      .catch(() => commit('error', 'Could not delete parameter', { root: true }));

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
