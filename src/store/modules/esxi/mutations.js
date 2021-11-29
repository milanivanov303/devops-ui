// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  esxiHosts(state, esxiHosts) {
    state.esxiHosts = esxiHosts;
  },
  allVirtualMachines(state, virtualMachines) {
    state.allVirtualMachines = virtualMachines;
  },
  virtualMachines(state, virtualMachines) {
    state.virtualMachines = virtualMachines;
  },
  instances(state, instances) {
    state.instances = instances;
  },
  error(state, error) {
    state.error = error;
  },
  createHost(state, host) {
    const { esxiHosts } = state;
    esxiHosts.push(host);
    Vue.set(state, 'esxiHosts', esxiHosts);
  },
  updateHost(state, host) {
    state.esxiHosts.map((h) => {
      if (h.id === host.id) {
        Vue.set(state.esxiHosts, state.esxiHosts.indexOf(h), host);
      }
      return state.esxiHosts;
    });
  },
};
