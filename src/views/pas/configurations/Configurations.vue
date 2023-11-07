<template>
  <div class="configurations">
    <Table
      :data="configurations"
      :export-btn="false"
      :add-btn="$auth.can('pas.manage-configurations')"
      :edit-btn="$auth.can('pas.manage-configurations')"
      :delete-btn="$auth.can('pas.manage-configurations')"
      @add="openAddEditModal('create')"
      @edit="(row) => openAddEditModal('update', row)"
      @view="(row) => openAddEditModal('view', row)"
      @delete="openDeleteModal"
    >
      <Column show="project" :sortable="false" filter-type="search"/>
      <Column show="app_type" :sortable="false" filter-type="dropdown"/>
      <Column show="branch" :sortable="false" filter-type="search"/>
      <Column show="dev_instance"/>
      <Column show="val_instance"/>
      <Column label="Delivery chain"
        :show="(row) => row.delivery_chain ? row.delivery_chain.name : ''"/>
      <Column show="prefix"/>
      <Column show="app_version" :sortable="false" filter-type="dropdown"/>
      <Column show="servlet_container" :sortable="false" filter-type="dropdown"/>
      <Column
        label="Additional info" name="additional_info"
        :show="(row) => getAdditionalInfoLink(row.additional_info)"
      />
      <span class="new badge"></span>
      <template v-slot:actions-after="{ row }">
        <span v-if="isNew(row.created_on)" class="new badge"></span>
      </template>
      <template v-slot:actions-before="{ row }">
        <a
          v-if="canBeBuilt(row)"
          @click="openBuildModal('build', row)"
          class="green-text"
          title="Start Build">
          <i class="material-icons">send</i>
        </a>
      </template>
    </Table>

    <AddUpdateConfig
        v-if="showAddEditModal"
        :action="action"
        :configuration="configuration"
        @close="closeAddEditModal()"
    />

    <BuildConfiguration
        v-if="showBuildModal"
        :action="action"
        :configuration="configuration"
        @close="closeBuildModal()"
    />

    <DeleteConfig
        v-if="showRemoveModal"
        :configuration="configuration"
        @close="closeDeleteModal()"
    />
  </div>
</template>

<script>

import BuildConfiguration from '@/views/pas/configurations/BuildConfiguration';
import AddUpdateConfig from '@/views/pas/configurations/AddUpdateConfig';
import DeleteConfig from '@/views/pas/configurations/DeleteConfig';

export default {
  components: {
    AddUpdateConfig,
    BuildConfiguration,
    DeleteConfig,
  },
  data() {
    return {
      showAddEditModal: false,
      action: '',
      configuration: {},
      showRemoveModal: false,
      showBuildModal: false,
    };
  },
  computed: {
    configurations() {
      return this.$store.getters['pas/getConfigurations'];
    },
  },
  methods: {
    getData() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('pas/getConfigurations').finally(() => {
        loader.hide();

        if (this.$route.params.id) {
          if (this.$route.params.id === 'new') {
            return this.openAddEditModal('create');
          }

          const configuration = this.configurations.find(
            (configuration) => configuration.id === parseInt(this.$route.params.id, 10),
          );
          if (configuration) {
            if (this.$route.params.action === 'build') {
              return this.openBuildModal('build', configuration);
            }
            return this.openAddEditModal(this.$route.params.action, configuration);
          }

          this.$M.toast({
            html: 'This configuration does not exist!',
            classes: 'toast-fail',
          });
        }

        return true;
      });
    },

    openAddEditModal(action, configuration = {}) {
      this.action = action;
      this.configuration = { ...configuration };
      this.showAddEditModal = true;
      this.$router.history.replace({
        path: `/pas/configurations/${this.configuration.id
          ? (`${encodeURIComponent(this.configuration.id)}/${action}`) : 'new'} `,
      });
    },

    closeAddEditModal() {
      this.configuration = {};
      this.$router.history.replace({
        path: '/pas/configurations',
      });
      this.showAddEditModal = false;
    },

    openBuildModal(action, configuration = {}) {
      this.action = action;
      this.configuration = { ...configuration };
      this.showBuildModal = true;
      this.$router.history.replace({
        path: `/pas/configurations/${encodeURIComponent(this.configuration.id)}/build`,
      });
    },

    closeBuildModal() {
      this.configuration = {};
      this.$router.history.replace({
        path: '/pas/configurations',
      });
      this.showBuildModal = false;
    },

    openDeleteModal(configuration) {
      this.configuration = configuration;
      this.showRemoveModal = true;
    },

    closeDeleteModal() {
      this.configuration = {};
      this.showRemoveModal = false;
    },

    getAdditionalInfoLink(data) {
      if (!data) {
        return null;
      }
      if (!data.includes('http')) {
        return data;
      }
      const dataToDisplay = `${data.substring(0, 15)}..`;
      return `<a href="${data}" target="_blank"> ${dataToDisplay} </a>`;
    },

    canBeBuilt(configuration) {
      if (configuration.project_type && configuration.branch && configuration.prefix
          && configuration.standard_deploy === 1
          && this.$auth.can('pas.manage-configurations')) {
        return true;
      }

      return false;
    },
    isNew(date) {
      // two days = 172800 seconds
      return date > Date.now() / 1000 - 172800;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" >
  .log {
    height: 60vh;
    overflow: auto;
    white-space: pre;
  }
</style>
