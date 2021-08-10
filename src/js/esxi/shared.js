export default {
  bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (!bytes || bytes < 0) {
      return '0 Byte';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / 1024 ** i)}  ${sizes[i]}`;
  },

  hertzToGigahertz(hertz) {
    if (!hertz) {
      return '0 Hertz';
    }

    return `${Math.round((hertz / 1000000 / 1000) * 100) / 100} GHz`;
  },

  getVmsMemory(esxiHost) {
    if (!esxiHost.vms_details) {
      return 0;
    }

    return esxiHost.vms_details.reduce((accumulator, currentValue) => {
      let sum = accumulator;
      if (currentValue.powered !== 'off') {
        sum += currentValue.hardware.memory;
      }
      return sum;
    },
    0);
  },

  getServerFreeMemory(esxiHost) {
    if (!esxiHost.details.memory) {
      return 0;
    }

    return (this.getVmsMemory(esxiHost) * 100) / esxiHost.details.memory.physical_memory;
  },

  freeMemory(esxiHost) {
    if (!esxiHost.details) {
      return 0;
    }

    return esxiHost.details.memory.physical_memory - this.getVmsMemory(esxiHost);
  },

  getCpuCoreSpeed(cpuDetails) {
    if (!cpuDetails[0]) {
      return null;
    }

    return this.hertzToGigahertz(cpuDetails[0].core_speed);
  },

};
