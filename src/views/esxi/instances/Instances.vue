<template>
  <div ref="instances">
    <div v-if="currentInstances.error" class="validator">
      <div class="red-text">
        <p>{{ currentInstances.error }}</p>
      </div>
    </div>
    <div class="data-table">
      <Table
        :data="currentInstances"
        sort-by="name"
        sort-dir="asc"
        query-prefix="instances_"
        :noDataText="getNoDataText()"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
      >
        <Column label="Instance" name="name"
                :show="(instance) => hideActions ? instance.name : getInstanceLink(instance.name)"
        />
        <Column label="Project" name="project" :show="(instance) => getProjectName(instance.name)"/>
        <Column label="Delivery Chain" name="delivery_chain"
          :show="(instance) => getDeliveryChain(instance.name)"/>
        <Column v-if="!instances" label="Virtual Machine" name="vm"
          :show="(instance) => getVMLink(instance.vm.name)"/>
        <Column v-if="!instances" label="Esxi Host" name="esxi"
          :show="(instance) => getHostLink(instance.esxi.name)"/>
        <Column show="version"/>
        <Column show="pwd_hash_type"/>
        <Column label="Home path" name="home-path" :show="(instance) => instance.home_path"/>
        <Column label="Patch config path" name="patch-conf"
          :show="(instance) => instance.patch_conf"/>
        <template v-slot:actions-before="{ row }">
<!--          <a target="_blank"-->
<!--             data-tooltip="Extranet"-->
<!--             class="tooltipped">-->
<!--            <i class="material-icons">laptop_chromebook</i>-->
<!--          </a>-->
          <a v-if="row.filesystem && row.filesystem.files"
             @click="openDetailsModal(row)"
             target="_blank"
             data-tooltip="Filesystem"
             class="tooltipped">
            <i class="material-icons">view_list</i>
          </a>
          <a v-if="row.components"
            @click="showComponentsModal = true, selected = row"
             target="_blank"
             data-tooltip="Components"
             class="tooltipped">
            <i class="material-icons">widgets</i>
          </a>

        </template>
      </Table>
    </div>

    <Modal v-if="showComponentsModal" @close="showComponentsModal = false" class="right-sheet">
       <template v-slot:header>
        {{ selected.name.toUpperCase() }}'s components
      </template>
      <template v-slot:content>
        <ComponentsTable :components="getInstanceComponents()"/>
      </template>
      <template v-slot:footer></template>
    </Modal>

    <InstanceDetailsModal
        v-if="showDetailsModal"
        @close="showDetailsModal=false"
        :instance="selected"
    />

  </div>
</template>

<script>
const InstanceDetailsModal = () => import('../components/InstanceDetailsModal');
const ComponentsTable = () => import('../components/ComponentsTable');

export default {
  components: { InstanceDetailsModal, ComponentsTable },
  props: {
    instances: {
      type: [Array, String],
    },
    hideActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showDetailsModal: false,
      showComponentsModal: false,
      selected: null,
    };
  },
  computed: {
    currentInstances() {
      return this.instances ? this.instances : this.$store.state.esxi.instances;
    },
    projects() {
      return this.$store.state.mmpi.projects;
    },
  },
  methods: {
    getNoDataText() {
      if (this.$store.state.esxi.esxiHosts.length === 0) {
        return 'There are no ESXi Host created.';
      }
      if (this.$store.state.esxi.virtualMachines.length === 0) {
        return 'There are no Virtual Machines. Please update and try again in a few minutes.';
      }
      return 'There are no records';
    },
    getProjectName(instance) {
      let project = null;
      this.projects.forEach((p) => {
        p.delivery_chains.forEach((d) => {
          d.instances.forEach((i) => {
            if (i.name === instance) {
              project = p;
            }
          });
        });
      });
      return project ? project.name : '-';
    },
    getDeliveryChain(instance) {
      let deliveryChain = null;
      this.projects.forEach((p) => {
        p.delivery_chains.forEach((d) => {
          d.instances.forEach((i) => {
            if (i.name === instance) {
              deliveryChain = d;
            }
          });
        });
      });
      return deliveryChain ? deliveryChain.title : '-';
    },
    getHostLink(name) {
      return `<a href="esxiHosts/${name}" style="text-decoration: underline">${name}</a>`;
    },
    getVMLink(name) {
      return `<a href="virtualMachines/${name}" style="text-decoration: underline">${name}</a>`;
    },
    getInstanceLink(name) {
      return `<a href="../instances?instances_search=${name}" style="text-decoration: underline">${name}</a>`;
    },

    getEsxiHosts() {
      const loader = this.$loading.show({ container: this.$refs.instances });

      this.$store.dispatch('esxi/getEsxiHosts')
        .finally(() => loader.hide());
    },

    getInstanceComponents() {
      const components = [];
      Object.entries(this.selected.components).forEach(([component, version]) => {
        components.push({
          name: component,
          version,
        });
      });
      return components;
    },

    openDetailsModal(instance) {
      this.showDetailsModal = true;
      this.selected = instance;
    },
  },

  created() {
    this.getEsxiHosts();
    this.$store.dispatch('mmpi/getProjects');
  },
};
</script>
