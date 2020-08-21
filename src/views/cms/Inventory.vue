<template>
  <div class="col s12 l12">
    <h1 class="center">Inventory</h1>
    <div class="frame">
      <form @submit.prevent="submitted" class="searchForm">
        <div class="row">
          <SelectModel
            class="col s6"
            label="Projects"
            icon="laptop_mac"
            displayed="name"
            v-model="project"
            :options="getProjects"
            @change="selectedProject"
          />
          <SelectModel
            class="col s6"
            label="Delivery chains"
            icon="linear_scale"
            displayed="title"
            v-model="deliveryChain"
            :options="getDeliveryChains"
            @change="selectedDeliveryChain"
          />
        </div>
        <div class="row">
          <SelectModel
            class="col s6"
            label="First instance"
            icon="storage"
            displayed="name"
            :options="getFirstInstances"
            @change="firstSelectedInstance"
          />
          <SelectModel
            class="col s6"
            label="Second instance"
            icon="storage"
            displayed="name"
            :options="getSecondInstances"
            @change="secondSelectedInstance"
          />
        </div>
      </form>
      <add-rsp-modal
        :selected="{project, deliveryChain}"
        :projects="getProjects"
        :chains="getDeliveryChains"
        v-if="openModal"
        @return="openModal = false"/>
      <Table
        v-if="$store.getters['cms/getFilteredVariables'].length"
        :request="getVariables"
        @add="openModal = true"/>
    </div>
  </div>
</template>
<script>
import AddRspFile from '@/components/cms/AddRspFile';
import SelectModel from '@/components/partials/SelectModel';
import Table from '@/components/partials/Table';

export default {
  components: {
    SelectModel,
    'add-rsp-modal': AddRspFile,
    Table,
  },
  mounted() {
    this.loadProjects();
  },
  data() {
    return {
      project: [],
      deliveryChain: [],
      loader: '',
      openModal: false,
    };
  },
  computed: {
    getProjects() {
      return this.$store.state.projects.projects;
    },
    getDeliveryChains() {
      return this.$store.getters['deliveryChains/deliveryChains']('');
    },
    getFirstInstances() {
      return this.$store.getters['cms/getInventoryInstances']('');
    },
    getSecondInstances() {
      return this.$store.getters['cms/getInventoryInstances'](this.$store.state.cms.firstSelectedInstance);
    },
    getVariables() {  
      const variables = {
        data: 'cms/getFilteredVariables',
        columns: {
          id: '',
          variable_name: '',
        },
        searchable: true,
        add: true,
      };
      const firstInstance = this.$store.state.cms.firstSelectedInstance;
      const secondInstance = this.$store.state.cms.secondSelectedInstance;

      variables.columns[firstInstance.name] = '';
      variables.columns[secondInstance.name] = '';

      return variables;
    },
  },
  methods: {
    loadProjects() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('projects/getProjects', {
        inactive: 0,
        order_by: 'name asc',
      }).then(() => {
        loader.hide();
      });
    },
    selectedProject(value) {
      const loader = this.$loading.show({ container: this.$el });
      this.resetInstances();
      this.$store.state.cms.inventoryInstances = [];
      this.$store.dispatch('deliveryChains/getDeliveryChains', {
        project: value.id,
        status: 'active',
        order_by: 'title asc',
        with: JSON.stringify({
          instances: {},
        }),
      }).then(() => {
        loader.hide();
      });
    },
    selectedDeliveryChain(value) {
      this.resetInstances();
      this.loadInstances(value.instances);
    },
    loadInstances(instances) {
      this.loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/getInventoryInstances', instances).then(() => {
        this.loader.hide();
      });
    },
    firstSelectedInstance(value) {
      this.loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/getFirstSelectedInstance', value);
      this.$store.dispatch('cms/firstInstanceVariables', value).then(() => {
        this.loader.hide();
      });
    },
    secondSelectedInstance(value) {
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
