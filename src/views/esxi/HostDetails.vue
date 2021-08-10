<template>
  <div class="card">
    <div class="card-content">

      <div class="card-title truncate">
        {{ esxiHost.hostname }}
        <div v-if="esxiHost.updated_on" class="right date">
          Updated on {{ $date(esxiHost.updated_on).toHuman() }}
        </div>
      </div>

      <div v-if="esxiHost.details && esxiHost.details.memory">
        <b>Memory:</b>
        {{ bytesToSize(esxiHost.details ? esxiHost.details.memory.physical_memory : '') }},
        Free {{ bytesToSize(freeMemory(esxiHost)) }}
      </div>
      <div v-if="esxiHost.details" class="progress">
        <div class="determinate" :style="{width: getServerFreeMemory(esxiHost) + '%'}"></div>
      </div>

      <div class="wrapper">
        <div class="row">

          <ul class="tabs">
            <li class="tab col s6">
              <a href="#esxi_details">DETAILS</a>
            </li>
            <li class="tab col s6">
              <a href="#vms">VIRTUAL MACHINES</a>
            </li>
          </ul>

          <div v-if="esxiHost.details" id="esxi_details">
            <EsxiDetails
              :esxiHost="esxiHost"
            />
          </div>

          <div v-if="esxiHost.vms_details" id="vms">
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
      vmsearch: this.$route.query.vmsearch,
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

      if (this.vmsearch) {
        const regexp = new RegExp(this.vmsearch, 'i');
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

  watch: {
    vmsearch(value) {
      const query = { ...this.$route.query };

      delete query.vmsearch;
      if (value) {
        query.vmsearch = value;
      }

      this.$router.push({ query });
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
    this.getVmsMemory = shared.getVmsMemory;
    this.getServerFreeMemory = shared.getServerFreeMemory;
    this.freeMemory = shared.freeMemory;
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
