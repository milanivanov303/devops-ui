<template>
  <div class="card" v-if="vm">
    <div class="card-content">
      <div class="card-title truncate">
        {{ vm.name }}
      </div>

      <div v-if="vm.esxi">
        <b>Esxi: </b>
        <a class="esxi-name" :href="`../esxiHosts/${vm.esxi.name}`">{{ vm.esxi.name}}</a>
      </div>
      <div v-if="vm.details && vm.details['guest_full_name']">
        <b>OS: </b><span>{{ vm.details['guest_full_name'] }}</span>
      </div>
      <div v-if="vm.hardware && vm.hardware.num_c_p_u">
        <b>RAM: </b><span>{{ $esxi(vm.hardware.memory).bytesToSizeLabel()}}</span>,
        <b>CPU: </b><span>{{ vm.hardware.num_c_p_u }} cores</span>
      </div>
      <br>

      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s6">
              <a href="#instances">INSTANCES</a>
            </li>
            <li class="tab col s6">
              <a href="#components">COMPONENTS</a>
            </li>
          </ul>
          <div id="instances">
            <Instances v-if="vm.instances && vm.instances.length > 0" :instances="vm.instances"/>
            <div v-else class="validator">
              <div class="red-text">
                <br>
                <p v-if="vm.instances.error">{{ vm.instances.error }}</p>
                <p v-else>There are no instances for this virtual machine</p>
              </div>
            </div>
          </div>
          <div id="components">
            <ComponentsTable v-if="vm.components" :components="vm.components"/>
            <div v-else class="validator">
              <div class="red-text">
                <br>
                <p>There are no components for this virtual machine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Instances = () => import('../instances/Instances');
const ComponentsTable = () => import('../components/ComponentsTable');

export default {
  components: {
    Instances,
    ComponentsTable,
  },

  props: {
    vm: Object,
  },

  data() {
    return {
      search: this.$route.query.search,
    };
  },

  computed: {
    VMs() {
      return this.$store.state.esxi.virtualMachines;
    },
    instances() {
      // getter
      return [];
    },

    cpus() {
      if (!this.item.details) {
        return null;
      }

      return this.item.details.cpu_details;
    },
  },

  methods: {
    // esxiHosts
    updateEsxiInfo() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch('esxi/updateEsxiHost', this.item)
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }
          this.$M.toast({
            html: `Updating ESXi host ${this.item.name} details in background.
             Please, check in a few minutes.`,
            classes: 'toast-seccess',
          });
        })
        .catch((error) => {
          this.$M.toast({ html: error });
        }).finally(() => loader.hide());
    },
    getFreeMemoryInPerc() {
      if (!this.item.details.memory) {
        return null;
      }
      return (this.$store.getters['esxi/getVmsMemory'](this.item) * 100) / this.item.details.memory.physical_memory;
    },
    getHostFreeMemory(host) {
      return this.$store.getters['esxi/getHostFreeMemory'](host);
    },

  },

  watch: {
    search(value) {
      const query = { ...this.$route.query };

      delete query.search;
      if (value) {
        query.search = value;
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

.esxi-name {
  text-decoration: underline;
  font-size: 15px;
}
</style>
