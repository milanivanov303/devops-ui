<template>
  <div class="row esxi-details">
    <ul v-if="esxiHost" class="col s12 collection with-header ul-collection">
      <div class="row">
        <div class="col s12 l6">
          <li class="collection-header">
            <span class="collection-section">MAIN DETAILS</span>
          </li>
          <li v-if="esxiHost.board_info" class="collection-item">
            <b>Motherboard: </b>{{ esxiHost.board_info.product }},
            <span v-if="esxiHost.board_info.version">{{ esxiHost.board_info.version }} ,</span>
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
          <li v-if="esxiHost.ip_address" class="collection-item">
            <b>IP Address: </b>{{ esxiHost.ip_address }}
          </li>
        </div>
        <div class="col s12 l6">
          <li class="collection-header">
            <span class="collection-section">IMPORTANT DATES</span>
          </li>
          <li v-if="esxiHost.created_on" class="collection-item">
            <b>Creation date: </b>{{ $date(esxiHost.created_on).toHuman() }}
          </li>
          <li v-if="esxiHost.purchase_date" class="collection-item">
            <b>Purchase date: </b>{{ $date(esxiHost.purchase_date).toHuman() }}
          </li>
          <li v-if="esxiHost.installation_date" class="collection-item">
            <b>Installation date: </b>{{ $date(esxiHost.installation_date).toHuman() }}
          </li>
          <li v-if="esxiHost.expiration_date" class="collection-item"
              :class="{'red-text': isDateExpired(esxiHost.expiration_date)}">
            <b>Expiration date: </b>{{ $date(esxiHost.expiration_date).toHuman() }}
          </li>
          <li v-if="esxiHost.purchase_date" class="collection-item">
            <b>Server's age: </b>{{ getServersAge(esxiHost.purchase_date) }}
          </li>
        </div>
      </div>
      <div class="row">
        <div class="col s12 l6">
          <li v-if="esxiHost.cpu || esxiHost.cpu_details" class="collection-header">
            <span class="collection-section">CPU DETAILS</span>
          </li>
          <li v-if="esxiHost.cpu_details" class="collection-item">
            <b>Brand: </b>{{ getCpuBrand(esxiHost.cpu_details) }}
          </li>
          <li v-if="esxiHost.cpu" class="collection-item">
            <b>Processor Type: </b>{{ esxiHost.cpu.cpu_model }}
          </li>
          <li v-if="esxiHost.cpu" class="collection-item">
            <b>Packages: </b>{{ esxiHost.cpu.cpu_pkgs }}
          </li>
          <li v-if="esxiHost.cpu" class="collection-item">
            <b>Cores: </b>{{ esxiHost.cpu.cpu_cores }}
            <span v-if="esxiHost.cpu_details">
            x {{ getCpuCoreSpeed(esxiHost.cpu_details) }}
          </span>
          </li>
          <li v-if="esxiHost.cpu" class="collection-item">
            <b>Threads: </b>{{ esxiHost.cpu.cpu_threads }}
          </li>
        </div>
        <div class="col s12 l6" v-if="esxiHost.account_list" >
          <li class="collection-header">
            <span class="collection-section">ACCOUNT LIST</span>
          </li>
          <li class="collection-item"
              v-for="[key, value] in Object.entries(esxiHost.account_list)" :key="key.id">
            <b>{{ key }} </b>- {{ value }}
          </li>
        </div>
      </div>
      <div class="row">
        <div class="col s12 l6" v-if="esxiHost.power_details">
          <li class="collection-header">
            <span class="collection-section">POWER DETAILS</span>
          </li>
          <li class="collection-item"><b>Power allocated watts:</b>
            {{ esxiHost.power_details.power_allocated_watts }}
          </li>
          <li class="collection-item"><b>Average consumed watts:</b>
            {{ esxiHost.power_details.average_consumed_watts }}
          </li>
          <li class="collection-item"><b>Max consumed watts:</b>
            {{ esxiHost.power_details.max_consumed_watts }}
          </li>
          <li class="collection-item" v-for="slot in esxiHost.power_details.slots" :key="slot.id">
            <b>{{ slot.name }}:</b> State: {{ slot.status.State }}, Health: {{ slot.status.Health }}
          </li>
        </div>
        <div class="col s12 l6" v-if="esxiHost.firmware">
          <li class="collection-header">
            <span class="collection-section">FIRMWARE</span>
          </li>
          <li v-for="member in esxiHost.firmware" :key="member.id" class="collection-item">
            <b>Name: </b>{{ member.name }}, <b> Version: </b>{{ member.version }}
          </li>
        </div>
      </div>
    </ul>
    <span v-else class="col s12">Sorry! There is no data. Please update and try again.</span>
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
    isDateExpired(date) {
      return date < Date.now() / 1000;
    },
    getServersAge(purchaseDate) {
      const seconds = Math.floor(Date.now() / 1000) - purchaseDate;
      const years = Math.floor(seconds / 31536000);
      const months = Math.floor((seconds % 31536000) / 2628000);
      const days = Math.floor(((seconds % 31536000) % 2628000) / 86400);

      return `${years} years ${months} months ${days} days`;
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
