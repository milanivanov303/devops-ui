<template>
  <router-link :to="getTo()">
    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col s8 card-title truncate">
            {{ esxiHost.hostname }}
          </div>
          <div class="col s4">
            <span class="new badge red" data-badge-caption="">
              {{ getOnOffVMsCount(esxiHost, 'off') }} off</span>
            <span class="new badge green" data-badge-caption="">
              {{ getOnOffVMsCount(esxiHost, 'on') }} on</span>
          </div>
        </div>

        <div v-if="esxiHost.details && esxiHost.details.cpu">
          <b>CPU:</b>
          <span v-if="esxiHost.details.cpu.num_cpu_cores">
            {{ esxiHost.details.cpu.num_cpu_cores }} cores
          </span>
          <span v-if="esxiHost.details.cpu_details">
            x {{ getCpuCoreSpeed(esxiHost.details.cpu_details) }}
          </span>
        </div>

        <div v-if="esxiHost.details && esxiHost.details.memory">
          <b>RAM:</b> {{ esxiHost.details.memory ?
          $esxi(esxiHost.details.memory.physical_memory).bytesToSizeLabel() : '' }},
          <b>Free:</b> {{ $esxi(getHostFreeMemory(esxiHost)).bytesToSizeLabel() }}
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
        path: `/inventory/esxiHosts/${encodeURIComponent(this.esxiHost.hostname)}`,
      };
    },
    getOnOffVMsCount(host, status) {
      let counter = 0;
      if (host.vms_details && host.vms_details.length > 0) {
        host.vms_details.forEach((vms) => {
          if (vms.powered === status) {
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

    updateEsxiInfo() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = { ...this.esxiHost };

      this.$store.dispatch('esxi/updateEsxiHost', payload)
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }

          this.$M.toast({
            html: `Updating ESXi host ${this.esxiHost.hostname} details in background.
             Please, check in a few minutes.`,
            classes: 'toast-seccess',
          });
        })
        .catch((error) => {
          this.$M.toast({ html: error });
        }).finally(() => loader.hide());
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

</style>
