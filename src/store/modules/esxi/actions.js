// https://vuex.vuejs.org/en/actions.html

export default {
  getEsxiHosts({ commit, getters }) {
    const promise = api('devops').get('esxi');

    promise
      .then((response) => {
        commit('esxiHosts', response.data.data);
        commit('allVirtualMachines', getters.getAllVirtualMachines);
        commit('virtualMachines', getters.getVirtualMachines);
        commit('instances', getters.getInstances);
      })
      .catch(() => commit('error', 'Could not get servers list', { root: true }));

    return promise;
  },

  createHost({ commit }, payload) {
    const promise = api('devops').post('esxi', payload);
    promise
      .then((response) => commit('createHost', response.data.data))
      .catch((error) => commit('error', error));

    return promise;
  },

  updateEsxiHost({ commit }, payload) {
    const promise = api('devops').post('esxi/start-update', payload);

    promise
      .then((response) => commit('updateHost', response.data))
      .catch((error) => commit('error', error));

    return promise;
  },

};
