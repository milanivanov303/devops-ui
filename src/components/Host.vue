<template>
  <router-link :to="getTo()">
    <div class="card">
      <div class="card-content">

        <div class="card-title truncate">
          {{ esxiHost.hostname }}
          <span v-if="esxiHost.details && esxiHost.details.version">
            / {{ esxiHost.details.version.product }} - {{esxiHost.details.version.version }} /
          </span>
        </div>

        <div v-if="esxiHost.details">
          <p v-if="esxiHost.details.platform">
            {{ esxiHost.details.platform.product_name }} {{ esxiHost.details.platform.vendor_name  }} SN: {{ esxiHost.details.platform.serial_number }}
          </p>

          <p v-if="esxiHost.details.cpu">
            CPU details: cores - {{ esxiHost.details.cpu.c_p_u_cores }}, packages - {{ esxiHost.details.cpu.c_p_u_packages }}, HV support - {{ esxiHost.details.cpu.h_v_support }}
          </p>

          <p v-if="esxiHost.details.memory">
            RAM {{ bytesToSize(esxiHost.details.memory ? esxiHost.details.memory.physical_memory : '') }}
          </p>

          <div class="blue-grey lighten-3">
            <p v-if="esxiHost.details">ESXi host date: {{ esxiHost.details ? $date(esxiHost.details.date).toHuman() : '' }}</p>
            <p v-if="esxiHost.updated_on">Updated on: {{ esxiHost.updated_on ? $date(esxiHost.updated_on).toHuman() : '' }}</p>
          </div>
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
      required: true
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
