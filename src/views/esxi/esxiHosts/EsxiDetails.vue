<template>
  <div class="row esxi-details">
    <ul v-if="esxiHost.details" class="collection with-header ul-collection">
      <div class="col s12 l6">
        <li class="collection-header">
          <span class="collection-section">MAIN DETAILS</span>
        </li>
        <li v-if="esxiHost.details.version" class="collection-item">
          <b>OS: </b>{{ esxiHost.details.version.product }}, {{ esxiHost.details.version.version }}
        </li>
        <li v-if="esxiHost.details.platform" class="collection-item">
          <b>Platform: </b>{{esxiHost.details.platform.product_name}}
            {{ esxiHost.details.platform.vendor_name }}
        </li>
        <li v-if="esxiHost.details.platform" class="collection-item">
          <b>Serial Num: </b>{{ esxiHost.details.platform.serial_number }}
        </li>
        <li v-if="esxiHost.details.date" class="collection-item">
          <b>ESXi date: </b>{{ $date(esxiHost.details.date).toHuman() }}
        </li>
      </div>
      <div class="col s12 l6">
        <li v-if="esxiHost.details.cpu" class="collection-header">
          <span class="collection-section">CPU DETAILS</span>
        </li>
        <li v-if="esxiHost.details.cpu_details" class="collection-item">
          <b>Brand: </b>{{ getCpuBrand(esxiHost.details.cpu_details) }}
        </li>
        <li v-if="esxiHost.details.cpu" class="collection-item">
          <b>Packages: </b>{{ esxiHost.details.cpu.c_p_u_packages }}
        </li>
        <li v-if="esxiHost.details.cpu" class="collection-item">
          <b>Cores: </b>{{ esxiHost.details.cpu.c_p_u_cores }}
          <span v-if="esxiHost.details.cpu_details">
            x {{ getCpuCoreSpeed(esxiHost.details.cpu_details) }}
          </span>
        </li>
        <li v-if="esxiHost.details.cpu" class="collection-item">
          <b>Threads: </b>{{ esxiHost.details.cpu.c_p_u_threads }}
        </li>
      </div>
    </ul>
  </div>

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
    getCpuBrand(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }

      return cpuDetails[0].brand;
    },
    getCpuCoreSpeed(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }
      return this.$esxi(cpuDetails[0].core_speed).hertzToGigahertz();
    },
  },

};
</script>

<style lang="scss" scoped>
  .collection-section{
    font-size: 1.2em;
  }
  .ul-collection{
    border-color: #fcfafa;
  }
  .esxi-details {
    padding-top: 20px;
  }
</style>
