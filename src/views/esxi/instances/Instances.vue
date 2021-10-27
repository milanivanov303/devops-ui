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
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
      >
        <Column label="Instance" name="name" :show="(instance) => instance.name"/>
        <Column label="Project" name="project" :show="(instance) => getProjectName(instance.name)"/>
        <Column label="Virtual Machine" name="vm"
          :show="(instance) => getVMLink(instance.vm.name)"/>
        <Column label="Esxi Host" name="esxi"
          :show="(instance) => getHostLink(instance.esxi.name)"/>
        <Column label="Home path" name="home-path" :show="(instance) => instance.home_path"/>
        <Column label="Patch config path" name="patch-conf"
          :show="(instance) => instance.patch_conf"/>
        <template v-slot:actions-before="{ row }">
<!--          <a target="_blank"-->
<!--             data-tooltip="Extranet"-->
<!--             class="tooltipped">-->
<!--            <i class="material-icons">laptop_chromebook</i>-->
<!--          </a>-->
          <a v-if="row.components"
            @click="showComponentsModal = true, instance = row"
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
        {{ instance.name.toUpperCase() }}'s components
      </template>
      <template v-slot:content>
        <ComponentsTable :components="getInstanceComponents()"/>
      </template>
      <template v-slot:footer></template>
    </Modal>
  </div>
</template>

<script>
const ComponentsTable = () => import('../components/ComponentsTable');

export default {
  components: { ComponentsTable },
  props: {
    instances: {
      type: [Array, String],
    },
  },
  data() {
    return {
      showComponentsModal: false,
      instance: null,
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
    getHostLink(name) {
      return `<a href="esxiHosts?esxiHost=${name}">${name}</a>`;
    },
    getVMLink(name) {
      return `<a href="virtualMachines?virtualMachine=${name}">${name}</a>`;
    },
    getExtranetLink() {
      return '';
    },

    getEsxiHosts() {
      const loader = this.$loading.show({ container: this.$refs.instances });

      this.$store.dispatch('esxi/getEsxiHosts')
        .finally(() => loader.hide());
    },

    getInstanceComponents() {
      const components = [];
      Object.entries(this.instance.components).forEach(([component, version]) => {
        components.push({
          name: component,
          version,
        });
      });
      return components;
    },
  },

  created() {
    this.getEsxiHosts();
    this.$store.dispatch('mmpi/getProjects');
  },
};
</script>
