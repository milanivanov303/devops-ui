// https://vuex.vuejs.org/en/actions.html
export default {
  getBranches({ commit }) {
    const name = 'imx_fe_branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('imx-fe/branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list'));

    return promise;
  },

  getHost({ commit }) {
    const promise = api('devops').get('imx-fe/host');

    promise
      .then((response) => {
        commit('host', response.data.host);
      })
      .catch(() => commit('error', 'Could not get host name', { root: true }));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api('devops').post('imx/build', payload);
    promise.catch(error => commit('error', error));
    return promise;
  },

  removeBuild({ commit }, id) {
    const promise = api('devops').delete(`imx-fe/build/${id}`);
    promise
      .then(() => commit('removeBuild', id))
      .catch(error => commit('error', error, { root: true }));
    return promise;
  },
};
