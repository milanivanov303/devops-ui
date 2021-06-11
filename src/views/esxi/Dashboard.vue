<template>
  <div class="row">
    <div v-for="esxiHost in esxiHosts" :key="esxiHost.id" class="col s4">
      <div class="card">
        <div class="card-content">
          <div class="card-title truncate">
            {{ esxiHost.hostname }}
          </div>

          <div v-if="esxiHost.details && esxiHost.details.cpu">
            CPU: {{ esxiHost.details.cpu.c_p_u_cores ? esxiHost.details.cpu.c_p_u_cores : ''}}
          </div>
          <div v-if="esxiHost.details && esxiHost.details.memory">
            Memory:
            {{ bytesToSize(esxiHost.details ? esxiHost.details.memory.physical_memory : '') }}
          </div>
          <div v-if="esxiHost.details" class="progress">
            <div class="determinate" :style="{width: getServerFreeMemory(esxiHost) + '%'}"></div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    esxiHosts() {
      return this.$store.state.esxi.esxiHosts;
    },
  },

  methods: {
    getEsxiHosts() {
      this.$store.dispatch('esxi/getEsxiHosts');
    },

    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (!bytes) {
        return '0 Byte';
      }

      const i = Math.floor(Math.log(bytes) / Math.log(1024));

      return `${Math.round(bytes / 1024 ** i)}  ${sizes[i]}`;
    },

    getVmsMemory(esxiHost) {
      if (!esxiHost.vms_details) {
        return 0;
      }

      return esxiHost.vms_details.reduce(
        (accumulator, currentValue) => accumulator.hardware.memory + currentValue.hardware.memory,
      );
    },

    getServerFreeMemory(esxiHost) {
      if (!esxiHost.details.memory) {
        return 0;
      }

      return (this.getVmsMemory(esxiHost) * 100) / esxiHost.details.memory.physical_memory;
    },
  },

  created() {
    this.getEsxiHosts();
  },
};
</script>
