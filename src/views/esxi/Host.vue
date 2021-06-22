<template>
  <router-link :to="getTo()">
    <div class="card">
      <div class="card-content">

        <div class="card-title truncate">
          {{ esxiHost.hostname }}
        </div>

        <div v-if="esxiHost.details && esxiHost.details.cpu">
          CPU: {{ esxiHost.details.cpu.c_p_u_cores ? esxiHost.details.cpu.c_p_u_cores : ''}} cores
          <span v-if="esxiHost.details.cpu_details">
            x {{ getCpuCoreSpeed(esxiHost.details.cpu_details) }}
          </span>
        </div>

        <div v-if="esxiHost.details && esxiHost.details.memory">
          RAM
          {{ bytesToSize(esxiHost.details.memory ? esxiHost.details.memory.physical_memory : '') }},
          Free {{ bytesToSize(freeMemory(esxiHost)) }}
        </div>

      </div>

    </div>
  </router-link>
</template>

<script>
import shared from '@/js/esxi/shared';

export default {
  props: {
    esxiHost: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getTo() {
      const query = { ...this.$route.query };
      query.esxiHost = this.esxiHost.hostname;

      return { query };
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
    this.hertzToGigahertz = shared.hertzToGigahertz;
    this.getVmsMemory = shared.getVmsMemory;
    this.freeMemory = shared.freeMemory;
    this.getCpuCoreSpeed = shared.getCpuCoreSpeed;
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
