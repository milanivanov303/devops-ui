// https://vuex.vuejs.org/en/actions.html

export default {
  updateHostInfo({ commit }, payload) {
    const promise = api('devops').post('inventory/start-update', payload);

    promise
      .catch((error) => commit('error', error));
    return promise;
  },

  getEsxiHosts({ commit }) {
    const promise = api('devops').get('inventory/esxi-hosts', {
      with: JSON.stringify(['virtualMachines']),
    });

    promise
      .then((response) => {
        commit('esxiHosts', response.data.data);
      })
      .catch(() => commit('error', 'Could not get servers\' list', { root: true }));
    return promise;
  },
  createHost({ commit }, payload) {
    const promise = api('devops').post('inventory/esxi-hosts', payload);

    promise
      .then((response) => commit('createHost', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  updateHost({ commit }, payload) {
    const promise = api('devops').put(`inventory/esxi-hosts/${payload.id}`, payload);

    promise
      .then((response) => commit('updateHost', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  getVirtualMachines({ commit }) {
    const promise = api('devops').get('inventory/virtual-machines', {
      with: JSON.stringify(['esxiHost', 'instances']),
    });

    promise
      .then((response) => {
        commit('virtualMachines', response.data.data);
      })
      .catch(() => commit('error', 'Could not get virtual machines', { root: true }));
    return promise;
  },
  updateVirtualMachine({ commit }, payload) {
    const promise = api('devops').put(`inventory/virtual-machines/${payload.id}`, payload);

    promise
      .then((response) => commit('updateVirtualMachine', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  getInstances({ commit }) {
    const promise = api('devops').get('inventory/instances', {
      with: JSON.stringify({
        virtualMachine: {
          esxiHost: {},
        },
      }),
    });

    promise
      .then((response) => {
        commit('instances', response.data.data);
      })
      .catch(() => commit('error', 'Could not get instances\' list', { root: true }));
    return promise;
  },

  getImxComponents({ commit }) {
    const promise = api('devops').get('inventory/imx-components');

    promise
      .then((response) => {
        commit('imxComponents', response.data.data);
      })
      .catch(() => commit('error', 'Could not get iMX components', { root: true }));
    return promise;
  },
  createImxComponent({ commit }, payload) {
    const promise = api('devops').post('inventory/imx-components', payload);

    promise
      .then((response) => commit('createImxComponent', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  updateImxComponent({ commit }, payload) {
    const promise = api('devops').put(`inventory/imx-components/${payload.id}`, payload);

    promise
      .then((response) => commit('updateImxComponent', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

};
