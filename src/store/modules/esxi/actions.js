// https://vuex.vuejs.org/en/actions.html

export default {
  getEsxiHosts({ commit }) {
    const promise = api('devops').get('esxi');

    promise
      .then((response) => commit('esxiHosts', response.data.data))
      .catch(() => commit('error', 'Could not get servers list', { root: true }));

    return promise;
  },
};
