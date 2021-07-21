<template>
  <ul v-if="esxiHost.details" class="collection with-header ul-collection">

    <li class="collection-header">
      <span class="collection-section">Main</span>
    </li>

    <li v-if="esxiHost.details.version" class="collection-item">
      OS {{ esxiHost.details.version.product }} {{ esxiHost.details.version.version }}
    </li>

    <li v-if="esxiHost.details.platform" class="collection-item">
      {{esxiHost.details.platform.product_name}} {{ esxiHost.details.platform.vendor_name }},
      SN: {{ esxiHost.details.platform.serial_number }}
    </li>

    <li v-if="esxiHost.details.date" class="collection-item">
      ESXi date: {{ $date(esxiHost.details.date).toHuman() }}
    </li>

    <li v-if="esxiHost.details.cpu" class="collection-header">
      <span class="collection-section">CPU details</span>
    </li>

    <li v-if="esxiHost.details.cpu_details" class="collection-item">
      Brand: {{ getCpuBrand(esxiHost.details.cpu_details) }}
    </li>

    <li v-if="esxiHost.details.cpu" class="collection-item">
      Packages: {{ esxiHost.details.cpu.c_p_u_packages }}
    </li>

    <li v-if="esxiHost.details.cpu" class="collection-item">
      Cores: {{ esxiHost.details.cpu.c_p_u_cores }}
      <span v-if="esxiHost.details.cpu_details">
        x {{ getCpuCoreSpeed(esxiHost.details.cpu_details) }}
      </span>
    </li>

    <li v-if="esxiHost.details.cpu" class="collection-item">
      Threads: {{ esxiHost.details.cpu.c_p_u_threads }}
    </li>

  </ul>
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
    getCpuBrand(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }

      return cpuDetails[0].brand;
    },
  },

  created() {
    this.hertzToGigahertz = shared.hertzToGigahertz;
    this.getCpuCoreSpeed = shared.getCpuCoreSpeed;
  },

};
</script>

<style scoped>
  .collection-section{
    font-size: 1.2em;
  }

  .ul-collection{
    border-color: #fcfafa;
  }
</style>
