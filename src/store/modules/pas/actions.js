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
  getX4Params({ commit }, type) {
    const promise = api('devops').get('pas/x4-params', {
      filters: JSON.stringify({
        allOf: [
          {
            type,
          },
        ],
      }),

    });

    promise
      .then((response) => commit('x4params', response.data.data))
      .catch(() => commit('error', 'Could not get X4 parameters list', { root: true }));
    return promise;
  },
  createX4Param({ commit }, payload) {
    const promise = api('devops').post('pas/x4-params', payload);

    promise
      .then((response) => commit('createX4Param', response.data.data))
      .catch(() => commit('error', 'Could not create X4 parameter', { root: true }));

    return promise;
  },
  updateX4Param({ commit }, payload) {
    const promise = api('devops').put(`pas/x4-params/${payload.id}`, payload);

    promise
      .then((response) => commit('updateX4Param', response.data.data))
      .catch(() => commit('error', 'Could not update X4 parameter', { root: true }));

    return promise;
  },
  deleteX4Param({ commit }, id) {
    const promise = api('devops').delete(`pas/x4-params/${id}`);

    promise
      .then(() => commit('deleteX4Param', id))
      .catch(() => commit('error', 'Could not delete X4 parameter', { root: true }));

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
