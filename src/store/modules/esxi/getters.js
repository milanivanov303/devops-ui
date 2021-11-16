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

  getVirtualMachines: (state, getters) => {
    const vms = {};
    if (state.esxiHosts.length > 0) {
      state.esxiHosts.forEach((h) => {
        if (h.vms_details) {
          h.vms_details.forEach((vm) => {
            if (vm.powered === 'off' && Object.prototype.hasOwnProperty.call(vms, vm.main_info.name)) {
              return;
            }
            vms[vm.main_info.name] = {
              id: vm.vm_id,
              name: vm.main_info.name,
              powered: vm.powered,
              details: vm.main_info,
              hardware: vm.hardware,
              components: vm.powered === 'on' ? getters.getVMsComponents(h, vm) : null,
              flags: vm.flags,
              esxi: { name: h.hostname },
              instances: (vm.instances && vm.instances.length > 0) ? vm.instances : null,
            };
          });
        }
      });
    }
    return Object.values(vms).sort((a, b) => a.name.localeCompare(b.name));
  },
  getVMsComponents: () => (host, virtualMachine) => {
    if (host.vms_components[virtualMachine.main_info.name]) {
      return host.vms_components[virtualMachine.main_info.name];
    }
    if (host.vms_components.error && host.vms_components.error[virtualMachine.main_info.name]) {
      return { error: host.vms_components.error[virtualMachine.main_info.name] };
    }
    return null;

  },
  getInstances: (state) => {
    const instances = [];
    if (state.esxiHosts.length > 0) {
      state.esxiHosts.forEach((h) => {
        if (h.vms_details) {
          h.vms_details.forEach((vm) => {
            if (vm.instances.length > 0) {
              vm.instances.forEach((i) => {
                i.components = !h.instances_components || !h.instances_components[i.name] ||
                  h.instances_components[i.name].length <= 0 ?
                    null : h.instances_components[i.name];
                i.vm = { name: vm.main_info.name };
                i.esxi = { name: h.hostname };
                instances.push(i);
              });
            }
          });
        }
      });
    }
    return instances;
  },

};
