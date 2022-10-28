<template>
  <router-link :to="getTo()">
    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col s8 card-title truncate">
            {{ esxiHost.name }}
          </div>
          <div class="col s4">
            <span class="new badge red" data-badge-caption="">
              {{ getOnOffVMsCount(esxiHost, 'off') }} off</span>
            <span class="new badge green" data-badge-caption="">
              {{ getOnOffVMsCount(esxiHost, 'on') }} on</span>
          </div>
        </div>

        <div v-if="esxiHost.error">
          <b class="red-text">{{ esxiHost.error }}</b>
        </div>
        <div v-else>
          <div v-if="esxiHost.version">
            <b>Hypervisor: </b>{{ esxiHost.version.product }}, {{ esxiHost.version.version }}
          </div>
          <div v-if="esxiHost.platform" class="collection-item">
            <b>Model: </b>{{esxiHost.platform.product_name}} {{ esxiHost.platform.vendor_name }}
          </div>
          <div v-if="esxiHost.cpu">
            <b>CPU:</b>
            <span v-if="esxiHost.cpu.num_cpu_cores">
              {{ esxiHost.cpu.num_cpu_cores }} cores
            </span>
              <span v-if="esxiHost.cpu_details">
              x {{ getCpuCoreSpeed(esxiHost.cpu_details) }}
            </span>
          </div>
          <div v-if="esxiHost.memory">
            <b>RAM:</b> {{ $esxi(esxiHost.memory.physical_memory).bytesToSizeLabel()}},
            <b>Free:</b> {{ $esxi(getHostFreeMemory(esxiHost)).bytesToSizeLabel() }}
          </div>
        </div>

      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    esxiHost: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getTo() {
      return {
        path: `/inventory/esxiHosts/${encodeURIComponent(this.esxiHost.name)}`,
      };
    },
    getOnOffVMsCount(host, status) {
      let counter = 0;
      if (host.virtual_machines && host.virtual_machines.length > 0) {
        host.virtual_machines.forEach((vm) => {
          if (vm.powered === status) {
            counter += 1;
          }
        });
      }
      return counter;
    },
    getCpuCoreSpeed(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }
      return this.$esxi(cpuDetails[0].core_speed).hertzToGigahertz();
    },
    getHostFreeMemory(host) {
      return this.$store.getters['esxi/getHostFreeMemory'](host);
    },

  },
};

</script>

<style lang="scss" scoped>
.card-title {
  span {
    font-size: 12px;
  }
}
.card-content {
  height: 180px;
}

</style>
