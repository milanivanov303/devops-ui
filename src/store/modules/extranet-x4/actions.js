// https://vuex.vuejs.org/en/actions.html

export default {
  getBranches({ commit }) {
    const promise = api('devops').get('extranet-x4/branches');

    promise
      .then((response) => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list', { root: true }));
    return promise;
  },

  getHost({ commit }) {
    const promise = api('devops').get('extranet-x4/host');

    promise
      .then((response) => {
        commit('host', response.data.host);
      })
      .catch(() => commit('error', 'Could not get host name', { root: true }));
    return promise;
  },

  getImages({ commit }) {
    const promise = api('devops').get('extranet-x4/images');

    promise
      .then((response) => {
        commit('images', response.data);
      })
      .catch(() => commit('error', 'Could not get images', { root: true }));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api('devops').post('extranet-x4/build', payload);
    promise.catch((error) => commit('error', error, { root: true }));
    return promise;
  },
};
