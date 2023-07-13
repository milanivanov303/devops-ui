// https://vuex.vuejs.org/en/actions.html

export default {
  getBranches({ commit }) {
    const promise = api('devops').get('extranet-x5/branches');

    promise
      .then((response) => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  getHost({ commit }) {
    const promise = api('devops').get('extranet-x5/host');

    promise
      .then((response) => {
        commit('host', response.data.host);
      })
      .catch(() => commit('error', 'Could not get host name', { root: true }));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api('devops').post('extranet-x5/build', payload);
    promise.catch((error) => commit('error', error, { root: true }));
    return promise;
  },

  getBackendUrl({ commit }, payload) {
    const promise = api('devops').get('extranet-x5/get-be-url', payload);

    commit('promise', { promise }, { root: true });

    promise
      .then((response) => commit('be_url', response.data.be_url))
      .catch(() => commit('error', 'Could not get backend url from instance'));
    return promise;
  },
};
