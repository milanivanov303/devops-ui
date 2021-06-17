<template>
  <div class="card">
    <div class="card-content">

      <div class="card-title truncate">
        {{ esxiHost.hostname }}
        <div v-if="esxiHost.updated_on" class="right date">
          Updated on {{ $date(esxiHost.updated_on).toHuman() }}
        </div>
      </div>

      <div v-if="esxiHost.details.memory">
        <b>Memory:</b>
        {{ bytesToSize(esxiHost.details ? esxiHost.details.memory.physical_memory : '') }},
        Free {{ bytesToSize(freeMemory(esxiHost)) }}
      </div>
      <div v-if="esxiHost.details" class="progress">
        <div class="determinate" :style="{width: getServerFreeMemory(esxiHost) + '%'}"></div>
      </div>

      <div class="wrapper">
        <div class="row">

          <ul class="tabs col s12">
            <li class="tab col s6">
              <a href="#esxi_details">DETAILS</a>
            </li>
            <li class="tab col s6">
              <a href="#vms">VIRTUAL MACHINES</a>
            </li>
          </ul>

          <div id="esxi_details">
            <EsxiDetails
              :esxiHost="esxiHost"
            />
          </div>

          <div id="vms">
            <VirtualMachines
              :virtualMachines="virtualMachines"
            />
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>

import shared from '@/js/esxi/shared';
import VirtualMachines from './components/VirtualMachines';
import EsxiDetails from './components/EsxiDetails';

export default {
  data() {
    return {
      searchVm: this.$route.query.searchVm,
    };
  },

  components: {
    VirtualMachines,
    EsxiDetails,
  },

  props: {
    module: String,
    esxiHost: Object,
  },

  computed: {
    virtualMachines() {
      if (!this.esxiHost.vms_details) {
        return null;
      }

      let virtualMachines = this.esxiHost.vms_details;

      if (this.searchVm) {
        const regexp = new RegExp(this.searchVm, 'i');
        virtualMachines = virtualMachines.filter(
          (virtualMachine) => virtualMachine.main_info.name.match(regexp),
        );
      }

      return virtualMachines;
    },

    cpus() {
      if (!this.esxiHost.details) {
        return null;
      }

      return this.esxiHost.details.cpu_details;
    },
  },

  methods: {
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

    freeMemory(esxiHost) {
      if (!esxiHost.details) {
        return 0;
      }

      return esxiHost.details.memory.physical_memory - this.getVmsMemory(esxiHost);
    },
  },

  watch: {
    searchVm(value) {
      const query = { ...this.$route.query };

      delete query.searchVm;
      if (value) {
        query.searchVm = value;
      }

      this.$router.push({ query });
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
  },

  mounted() {
    const elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);
  },
};
</script>

<style scoped>
  .card-title{
    font-size: 2em;
  }

  .date{
    font-size: 0.4em;
    color: #999;
  }
</style>
