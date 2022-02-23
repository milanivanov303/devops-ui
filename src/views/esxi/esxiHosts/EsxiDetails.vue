<template>
  <div class="row esxi-details">
    <ul v-if="esxiHost" class="collection with-header ul-collection">
      <div class="col s12 l6">
        <li class="collection-header">
          <span class="collection-section">MAIN DETAILS</span>
        </li>
        <li v-if="esxiHost.board_info" class="collection-item">
          <b>Motherboard: </b>{{ esxiHost.board_info.product }},
          {{ esxiHost.board_info.version }},
          {{ esxiHost.board_info.manufacturer }}
        </li>
        <li v-if="esxiHost.version" class="collection-item">
          <b>Hypervisor: </b>{{ esxiHost.version.product }},
                             {{ esxiHost.version.version }}
        </li>
        <li v-if="esxiHost.platform" class="collection-item">
          <b>Model: </b>{{esxiHost.platform.product_name}}
            {{ esxiHost.platform.vendor_name }}
        </li>
        <li v-if="esxiHost.platform" class="collection-item">
          <b>Serial Num: </b>{{ esxiHost.platform.serial_number }}
        </li>
        <li v-if="esxiHost.created_on" class="collection-item">
          <b>Created on: </b>{{ $date(esxiHost.created_on).toHuman() }}
        </li>
      </div>
      <div class="col s12 l6">
        <li v-if="esxiHost.cpu" class="collection-header">
          <span class="collection-section">CPU DETAILS</span>
        </li>
        <li v-if="esxiHost.cpu_details" class="collection-item">
          <b>Brand: </b>{{ getCpuBrand(esxiHost.cpu_details) }}
        </li>
        <li v-if="esxiHost.cpu_details" class="collection-item">
          <b>Processor Type: </b>{{ esxiHost.cpu.cpu_model }}
        </li>

        <li v-if="esxiHost.cpu" class="collection-item">
          <b>Packages: </b>{{ esxiHost.cpu.num_cpu_pkgs }}
        </li>
        <li v-if="esxiHost.cpu" class="collection-item">
          <b>Cores: </b>{{ esxiHost.cpu.num_cpu_cores }}
          <span v-if="esxiHost.cpu_details">
            x {{ getCpuCoreSpeed(esxiHost.cpu_details) }}
          </span>
        </li>
        <li v-if="esxiHost.cpu" class="collection-item">
          <b>Threads: </b>{{ esxiHost.cpu.num_cpu_threads }}
        </li>
      </div>
    </ul>
    <span v-else>Sorry! There is no data. Please update and try again.</span>
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

<style scoped>
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
