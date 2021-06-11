<template>
  <div class="card">
    <div class="card-content">

      <div class="card-title truncate">
        {{ esxiHost.hostname }}
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
        <tabs>
          <tab v-if="cpus" title="CPUs">
            <div class="row">
              <div v-for="cpu in cpus" :key="cpu.id" class="col s12 m6 l12">
                <Cpu
                  :module="module"
                  :cpu="cpu"
                />
              </div>
            </div>
          </tab>
          <tab v-if="virtualMachines" title="Virtual machines">
            <div class="row">
              Total number: {{ virtualMachines.length }}
            </div>
            <div class="row">
              <div class="col s12 m6 l5">
                <TextInput label="Search VMs" icon="search" v-model="searchVm"/>
              </div>
            </div>

            <div class="row">
              <div v-for="virtualMachine in virtualMachines"
                   :key="virtualMachine.name" class="col s12 m6 l12">
                <VirtualMachine
                  :module="module"
                  :virtualMachine="virtualMachine"
                  :esxhiHost="esxiHost"
                />
              </div>
            </div>
          </tab>
        </tabs>
      </div>

    </div>
  </div>
</template>

<script>

import VirtualMachine from "../views/esxi/components/VirtualMachine";
import Cpu from "../views/esxi/components/Cpu";
import shared from '@/js/esxi/shared';
import Tab from '../views/esxi/components/Tab'
import Tabs from '../views/esxi/components/Tabs'

export default {
  data() {
    return {
      searchVm: this.$route.query.searchVm,
    }
  },

  components: {
    VirtualMachine,
    Cpu,
    Tab,
    Tabs,
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

      let virtualMachines  = this.esxiHost.vms_details;

      if (this.searchVm) {
        const regexp = new RegExp(this.searchVm, 'i');
        virtualMachines =
          virtualMachines.filter((virtualMachine) => virtualMachine.main_info.name.match(regexp));
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
};
</script>

<style scoped>
  .card-title{
    font-size: 2em;
  }
</style>
