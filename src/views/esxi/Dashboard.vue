<template>
  <div class="row">
    <div v-for="server in servers" :key="server.id" class="col s4">
      <div class="card">
        <div class="card-content">
          <div class="card-title truncate">
            {{ server.hostname }}
          </div>

          <div>CPU: {{ server.details ? server.details.cpu.c_p_u_cores : ''}}</div>
          <div>Memory: {{ bytesToSize(server.details ? server.details.memory.physical_memory : '') }}</div>
          <div class="progress">
            <div class="determinate" :style="{width: getServerFreeMemory(server) + '%'}"></div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    servers() {
      return this.$store.state.esxi.servers;
    },
  },

  methods: {
    getServers() {
      this.$store.dispatch('esxi/getServers');
    },

    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (!bytes) {
        return '0 Byte';
      }

      const i = Math.floor(Math.log(bytes) / Math.log(1024));

      return `${Math.round(bytes / 1024 ** i)}  ${sizes[i]}`;
    },

    getVmsMemory(server) {
      if (!server.vms_details) {
        return 0;
      }

      return server.vms_details.reduce(
        (accumulator, currentValue) => accumulator.hardware.memory + currentValue.hardware.memory,
      );
    },

    getServerFreeMemory(server) {
      if (!server.details) {
        return 0;
      }

      return (this.getVmsMemory(server) * 100) / server.details.memory.physical_memory;
    },
  },

  created() {
    this.getServers();
  },
};
</script>
