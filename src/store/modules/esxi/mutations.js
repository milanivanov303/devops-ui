// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  esxiHosts(state, esxiHosts) {
    state.esxiHosts = esxiHosts;
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
    if (!host.error) {
      const { esxiHosts } = state;
      const index = esxiHosts.findIndex((esxiHost) => esxiHost.hostname === host.hostname);
      esxiHosts.splice(index, 1, host);
      Vue.set(state, 'esxiHosts', esxiHosts);
    }
  },
};
