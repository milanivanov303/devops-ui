<template>
  <div ref="host-details">
    <div class="card" v-if="esxiHost">
      <div class="card-content">
        <div class="card-title truncate">
          <div class="row">
            <div class="col s12 m6 l9">
              {{ esxiHost.hostname }}
            </div>
            <div class="col s12 m6 l3 esxi-icons">
              <a :href="`https://${esxiHost.hostname}.codixfr.private/`"
                 target="_blank"
                 data-tooltip="ESXi for administration"
                 class="right">
                <i class="material-icons">laptop_chromebook</i>
              </a>
              <a v-if="esxiHost.doc_url"
                 :href="esxiHost.doc_url"
                 target="_blank"
                 data-tooltip="Documentation"
                 class="right">
                <i class="material-icons">chrome_reader_mode</i>
              </a>
              <a @click="openModal()"
                 v-if="$auth.can('esxi.add')"
                 target="_blank"
                 data-tooltip="Edit ESXi"
                 class="right">
                <i class="material-icons">create</i>
              </a>
            </div>
            <div class="col s12 m6 l8">
              <div v-if="esxiHost.notes" class="notes">
                <b>Notes: </b>{{ esxiHost.notes }}
              </div>
            </div>
            <div class="col s12 m6 l4">
              <a class="right"
                 data-tooltip="Refresh info"
                 v-if="$auth.can('esxi.add')"
                 @click.prevent="updateEsxiInfo()">
                <i class="material-icons">refresh</i>
              </a>
              <div v-if="esxiHost.updated_on" class="right updated-on">
                Last updated on {{ $date(esxiHost.updated_on).toHuman() }}
              </div>
            </div>
          </div>
        </div>
        <div class="row progress-bar">
          <div class="col s12">
            <div v-if="esxiHost.details && esxiHost.details.memory">
              <b>Memory: </b>{{ esxiHost.details ?
                $esxi(esxiHost.details.memory.physical_memory).bytesToSizeLabel() : '' }},
              <b>Free: </b> {{ $esxi(getHostFreeMemory(esxiHost)).bytesToSizeLabel() }}
            </div>
            <div v-if="esxiHost.details" class="progress">
              <div class="determinate" :style="{width: getFreeMemoryInPerc(esxiHost) + '%'}"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <ul class="tabs row">
              <li class="tab col s4">
                <a href="#esxi_details">DETAILS</a>
              </li>
              <li class="tab col s4">
                <a href="#memory_slots">MEMORY SLOTS</a>
              </li>
              <li class="tab col s4">
                <a href="#vms">VIRTUAL MACHINES</a>
              </li>
            </ul>
            <div id="esxi_details">
              <EsxiDetails :esxiHost="esxiHost"/>
            </div>
            <div id="memory_slots">
              <MemorySlots :esxiHost="esxiHost"/>
            </div>
            <div id="vms">
              <VirtualMachinesTable :VMs="VMs"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddEditHostModal
        v-if="showModal"
        action="update"
        :currentHost="this.currentHost"
        @close="showModal = false"
    />
  </div>
</template>

<script>
const VirtualMachinesTable = () => import('../components/VirtualMachinesTable');
const EsxiDetails = () => import('./EsxiDetails');
const MemorySlots = () => import('./MemorySlots');
const AddEditHostModal = () => import('./AddEditHostModal');

export default {
  components: {
    VirtualMachinesTable,
    EsxiDetails,
    MemorySlots,
    AddEditHostModal,
  },

  props: {
    esxiHost: Object,
  },

  data() {
    return {
      vmsearch: this.$route.query.vmsearch,
      currentHost: {},
      showModal: false,
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
          (virtualMachine) => virtualMachine.name.match(regexp),
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
    openModal() {
      this.currentHost = { ...this.esxiHost };
      this.showModal = true;
      // this.$router.push({
      //   path: `${encodeURIComponent('edit')}`,
      // });
    },
    updateEsxiInfo() {
      const loader = this.$loading.show({ container: this.$refs['host-details'] });

      this.$store.dispatch('esxi/updateHostInfo', this.esxiHost)
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }
          this.$M.toast({
            html: `Updating ESXi host ${this.esxiHost.hostname} details in background.
             Please check in a few minutes.`,
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

<style lang="scss" scoped>
  .card-title {
    .row {
      margin-bottom: 0px;
    }
    font-size: 2em;
  }

  .updated-on {
    font-size: 0.4em;
    margin-right: 8px;
  }

  .esxi-icons {
    a {
      padding: 0 2px 0 2px;
    }
  }
  .notes {
    font-size: 13px !important;
  }
</style>
