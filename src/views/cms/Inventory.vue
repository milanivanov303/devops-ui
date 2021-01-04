<template>
  <div class="col s12 l12">
    <h1 class="center">Inventory</h1>
    <div class="frame">
      <form @submit.prevent="submitted" class="searchForm">
        <div class="row">
          <Select
            class="col s6"
            label="Projects"
            icon="laptop_mac"
            displayed="name"
            v-model="project"
            :options="getProjects"
            @change="selectedProject"
          />
          <Select
            class="col s6"
            label="Delivery chain type"
            icon="linear_scale"
            displayed="type"
            v-model="deliveryChainType"
            :options="getDeliveryChainTypes"
            @change="selectedDeliveryChainType"
          />
        </div>
        <div class="row">
          <Select
            class="col s6"
            label="First instance"
            icon="storage"
            displayed="name"
            v-model="firstInstance"
            :options="getFirstInstances"
            @change="firstSelectedInstance"
          />
          <Select
            class="col s6"
            label="Second instance"
            icon="storage"
            displayed="name"
            v-model="secondInstance"
            :options="getSecondInstances"
            @change="secondSelectedInstance"
          />
        </div>
      </form>
      <add-rsp-modal
        :project="project"
        v-if="openModal"
        @return="openModal = false"/>
      <Table
        v-if="getVariables.length"
        :data="getVariables"
        :pagination="true"
        sort-by="variable_name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false">
        <Column show="id"/>
        <Column show="variable_name"/>
        <Column
          :show="this.$store.state.cms.firstSelectedInstance.name"
        />
        <Column
          :show="this.$store.state.cms.secondSelectedInstance.name"
        />
      </Table>
      <div class="row">
        <span data-badge-caption="" class="left new badge red">Last change date</span>:
        The red date tag corresponds to last change date from instance.rsp file.
        <a
          v-if="project.name"
          class="waves-effect waves-light btn right"
          @click="openModal = true">
          import rsp file
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import AddRspFile from '@/components/cms/AddRspFile';

export default {
  components: {
    'add-rsp-modal': AddRspFile,
  },
  mounted() {
    this.loadProjects();
  },
  data() {
    return {
      project: {},
      deliveryChainType: {},
      getDeliveryChainTypes: [],
      loader: '',
      openModal: false,
      firstInstance: [],
      secondInstance: [],
    };
  },
  computed: {
    getProjects() {
      return this.$store.state.mmpi.projects;
    },
    // getDeliveryChainTypes() {
    //   return this.$store.getters['mmpi/deliveryChains'];
    // },
    getFirstInstances() {
      return this.$store.getters['cms/getInventoryInstances']('');
    },
    getSecondInstances() {
      return this.$store.getters['cms/getInventoryInstances'](this.$store.state.cms.firstSelectedInstance);
    },
    getVariables() {
      return this.$store.getters['cms/getFilteredVariables'];
    },
  },
  methods: {
    async loadProjects() {
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('mmpi/getProjects', {
        inactive: 0,
        order_by: 'name asc',
      });
      await this.$store.dispatch('mmpi/getDeliveryChainsCMS');
      loader.hide();
    },
    selectedProject() {
      this.resetInstances();
      this.$store.state.cms.inventoryInstances = [];
      this.getDeliveryChainTypes = this.$store.getters['mmpi/deliveryChainTypes'];
    },
    selectedDeliveryChainType(value) {
      this.resetInstances();
      this.firstInstance = '';
      this.secondInstance = '';
      const instances = this.$store.getters['mmpi/instancesByTypeAndProject'](value, this.project);
      this.loadInstances(instances);
    },
    loadInstances(instancesType) {
      this.loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/getInventoryInstances', instancesType).then(() => {
        this.loader.hide();
      });
    },
    firstSelectedInstance(value) {
      if (this.getVariables.length) {
        this.secondInstance = '';
        this.$store.dispatch('cms/secondInstanceVariables', '');
      }
      this.loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/getFirstSelectedInstance', value);
      this.$store.dispatch('cms/firstInstanceVariables', value).then(() => {
        this.loader.hide();
      });
    },
    async secondSelectedInstance(value) {
      if (this.getVariables.length) {
        await this.$store.dispatch('cms/secondInstanceVariables', '');
      }
      this.loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/getSecondSelectedInstance', value);
      this.$store.dispatch('cms/secondInstanceVariables', value).then(() => {
        this.loader.hide();
      });
    },
    resetInstances() {
      this.$store.dispatch('cms/firstInstanceVariables', '');
      this.$store.dispatch('cms/secondInstanceVariables', '');
    },
  },
};
</script>
