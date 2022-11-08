<template>
  <div ref="instances">
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
        <template v-slot:top-actions-before>
          <div class="table-btns right" v-if="$auth.can('esxi.add') && $auth.can('imx-component.add')">
            <a @click="updateComponents()"
               class="btn-floating waves-effect waves-light right"
               data-tooltip="Refresh components"
            >
              <i class="material-icons">refresh</i>
            </a>
          </div>
        </template>
        <Column label="Instance" name="name" :show="(instance) => instance.name"/>
        <Column label="Project" name="project" :show="(instance) => getProjectName(instance.name)"/>
        <Column label="Delivery Chain" name="delivery_chain"
          :show="(instance) => getDeliveryChain(instance.name)"/>
        <Column v-if="!instances" label="Virtual Machine" name="vm"
          :show="(instance) => getVMLink(instance.virtual_machine.name)"/>
        <Column show="activity" width="10%"/>
        <Column show="version" class="dont-break-out" width="10%"/>
        <Column show="pwd_hash_type" width="10%"/>
        <Column label="Home path" name="home-path" :show="(instance) => instance.home_path"/>
        <Column show="patch_config_path"/>
        <template v-slot:actions-before="{ row }">
<!--          <a target="_blank"-->
<!--             data-tooltip="Extranet"-->
<!--             class="tooltipped">-->
<!--            <i class="material-icons">laptop_chromebook</i>-->
<!--          </a>-->
          <a v-if="row.error"
             target="_blank"
             :data-tooltip="row.error"
             class="tooltipped">
            <i class="material-icons red-text">error</i>
          </a>
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
            if (i.name.toLowerCase() === instance.toLowerCase()) {
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
            if (i.name.toLowerCase() === instance.toLowerCase()) {
              deliveryChain = d;
            }
          });
        });
      });
      return deliveryChain ? deliveryChain.title : '-';
    },
    getHostLink(name) {
      return `<a href="esxiHosts/${name}" class="tbl-link">${name}</a>`;
    },
    getVMLink(name) {
      return `<a href="virtualMachines/${name}" class="tbl-link">${name}</a>`;
    },
    getInstances() {
      const loader = this.$loading.show({ container: this.$refs.instances });

      this.$store.dispatch('esxi/getInstances')
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
    updateComponents() {
      const loader = this.$loading.show({ container: this.$refs.virtualMachines });

      this.$store.dispatch('esxi/updateComponents')
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }
          this.$M.toast({
            html: 'Updating all components in background. Please check in a few minutes.',
            classes: 'toast-success',
          });
        })
        .catch((error) => {
          this.$M.toast({ html: error });
        }).finally(() => loader.hide());
    },
  },

  created() {
    this.getInstances();
    this.$store.dispatch('mmpi/getProjects');
  },
};
</script>
<style>
.dont-break-out {

  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;

}
</style>
