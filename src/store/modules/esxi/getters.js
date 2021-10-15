// https://vuex.vuejs.org/en/getters.html

export default {
  getError: (state) => state.error,
  esxiHosts: (state) => state.esxiHosts,
  getHostByHostname: (state) => (hostname) => state.esxiHosts.find((h) => h.hostname === hostname),
  getVmsMemory: () => (host) => {
    if (!host.vms_details) {
      return 0;
    }

    return host.vms_details.reduce((accumulator, currentValue) => {
      let sum = accumulator;
      if (currentValue.powered !== 'off') {
        sum += currentValue.hardware.memory;
      }
      return sum;
    }, 0);
  },
  getTotalMemory: (state) => {
    if (!state.esxiHosts || state.esxiHosts.length === 0) {
      return 0;
    }

    let total = 0;
    state.esxiHosts.forEach((esxiHost) => {
      if (esxiHost.details && esxiHost.details.memory) {
        total += esxiHost.details.memory.physical_memory;
      }
    });

    return total;
  },
  getTotalMemoryByHosts: (state) => {
    const memoryByHosts = [];
    state.esxiHosts.forEach((esxiHost) => {
      if (esxiHost.details && esxiHost.details.memory.physical_memory) {
        memoryByHosts.push(Math.round(esxiHost.details.memory.physical_memory / 1024 ** 3));
      } else {
        memoryByHosts.push(0);
      }
    });

    return memoryByHosts;
  },
  getHostFreeMemory: (state, getters) => (host) => {
    if (!host.details) {
      return 0;
    }
    return host.details.memory.physical_memory - getters.getVmsMemory(host);
  },

};
