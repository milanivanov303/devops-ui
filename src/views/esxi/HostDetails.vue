<template>
  <div class="card" v-if="esxiHost">
    <div class="card-content">
      <div class="card-title truncate">
        {{ esxiHost.hostname }}
        <a class="right"
           data-tooltip="Update info"
           v-if="$auth.can('esxi.add')"
           @click.prevent="updateEsxiInfo()">
          <i class="material-icons">refresh</i>
        </a>
        <div v-if="esxiHost.updated_on" class="right updated-on">
          Updated on {{ $date(esxiHost.updated_on).toHuman() }}
        </div>
      </div>

      <div v-if="esxiHost.details && esxiHost.details.memory">
        <b>Memory:</b>{{ esxiHost.details ?
          $esxi(esxiHost.details.memory.physical_memory).bytesToSizeLabel() : '' }},
        <b>Free:</b> {{ $esxi(getHostFreeMemory(esxiHost)).bytesToSizeLabel() }}
      </div>
      <div v-if="esxiHost.details" class="progress">
        <div class="determinate" :style="{width: getFreeMemoryInPerc(esxiHost) + '%'}"></div>
      </div>

      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s6">
              <a href="#esxi_details">DETAILS</a>
            </li>
            <li class="tab col s6">
              <a href="#vms">VIRTUAL MACHINES</a>
            </li>
          </ul>
          <div v-if="esxiHost.details" id="esxi_details">
            <EsxiDetails :esxiHost="esxiHost"/>
          </div>
          <div v-if="esxiHost.vms_details" id="vms">
            <VirtualMachines :VMs="VMs"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VirtualMachines from './components/VirtualMachines';
import EsxiDetails from './components/EsxiDetails';

export default {
  components: {
    VirtualMachines,
    EsxiDetails,
  },

  props: {
    module: String,
    esxiHost: Object,
  },

  data() {
    return {
      vmsearch: this.$route.query.vmsearch,
    };
  },

  computed: {
    VMs() {
      if (!this.esxiHost.vms_details) {
        return null;
      }

      let VMs = this.esxiHost.vms_details;

      if (this.vmsearch) {
        const regexp = new RegExp(this.vmsearch, 'i');
        VMs = VMs.filter(
          (virtualMachine) => virtualMachine.main_info.name.match(regexp),
        );
      }

      return VMs;
    },

    cpus() {
      if (!this.esxiHost.details) {
        return null;
      }

      return this.esxiHost.details.cpu_details;
    },
  },

  methods: {
    updateEsxiInfo() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch('esxi/updateEsxiHost', this.esxiHost)
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
    getFreeMemoryInPerc() {
      if (!this.esxiHost.details.memory) {
        return null;
      }
      return (this.$store.getters['esxi/getVmsMemory'](this.esxiHost) * 100) / this.esxiHost.details.memory.physical_memory;
    },
    getHostFreeMemory(host) {
      return this.$store.getters['esxi/getHostFreeMemory'](host);
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

  .updated-on{
    font-size: 0.4em;
    margin-top: 5px;
  }
</style>
