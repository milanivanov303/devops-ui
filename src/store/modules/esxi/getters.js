// https://vuex.vuejs.org/en/getters.html

export default {
  getError: (state) => state.error,
  esxiHosts: (state) => state.esxiHosts,

  getHostFreeMemory: (state, getters) => (host) => {
    if (!host.memory) {
      return 0;
    }
    return host.memory.physical_memory - getters.getVmsMemory(host);
  },
  getVmsMemory: () => (host) => {
    if (!host.virtual_machines) {
      return 0;
    }

    return host.virtual_machines.reduce((accumulator, currentValue) => {
      let sum = accumulator;
      if (currentValue.powered === 'on') {
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
      if (esxiHost.memory) {
        total += esxiHost.memory.physical_memory;
      }
    });

    return total;
  },

  getTotalMemoryByHosts: (state) => {
    const memoryByHosts = [];
    state.esxiHosts.forEach((esxiHost) => {
      if (esxiHost.memory.physical_memory) {
        memoryByHosts.push(Math.round(esxiHost.memory.physical_memory / 1024 ** 3));
      } else {
        memoryByHosts.push(0);
      }
    });

    return memoryByHosts;
  },
};
