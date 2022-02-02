// https://vuex.vuejs.org/en/actions.html

export default {
  getEsxiHosts({ commit, getters }) {
    const name = 'esxi';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('esxi');
    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        commit('esxiHosts', response.data.data);
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
  updateHost({ commit }, payload) {
    const promise = api('devops').put(`esxi/${payload.id}`, payload);
    promise
      .then((response) => commit('updateHost', response.data.data))
      .catch((error) => commit('error', error));

    return promise;
  },

  updateHostInfo({ commit }, payload) {
    const promise = api('devops').post('esxi/start-update', payload);

    promise
      .catch((error) => commit('error', error));

    return promise;
  },

  getImxComponents({ commit }) {
    const promise = api('devops').get('imx-components');

    promise
      .then((response) => {
        commit('imxComponents', response.data.data);
      })
      .catch(() => commit('error', 'Could not get iMX components', { root: true }));

    return promise;
  },
  createImxComponent({ commit }, payload) {
    const promise = api('devops').post('imx-components', payload);
    promise
      .then((response) => commit('createImxComponent', response.data.data))
      .catch((error) => commit('error', error));

    return promise;
  },
  updateImxComponent({ commit }, payload) {
    const promise = api('devops').put(`imx-components/${payload.id}`, payload);
    promise
      .then((response) => commit('updateImxComponent', response.data.data))
      .catch((error) => commit('error', error));

    return promise;
  },

};
