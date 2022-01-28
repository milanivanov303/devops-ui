<template>
  <div class="configurations">
    <div class="data-table">

      <Table
        :data="configurations"
        sort-by="project"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="$auth.can('pas.manage-configurations')"
        :edit-btn="$auth.can('pas.manage-configurations')"
        :delete-btn="$auth.can('pas.manage-configurations')"
        @add="openAddEditModal('create')"
        @edit="(row) => openAddEditModal('update', row)"
        @delete="openDeleteModal"
      >
        <Column show="project" :sortable="false" filter-type="search"/>
        <Column show="project_type" :sortable="false" filter-type="dropdown"/>
        <Column show="delivery_chain"/>
        <Column show="dev_instance"/>
        <Column show="val_instance"/>
        <Column show="deploy_instance"/>
        <Column show="app_type" :sortable="false" filter-type="dropdown"/>
        <Column show="app_version" :sortable="false" filter-type="dropdown"/>
        <Column show="branch" :sortable="false" filter-type="search"/>
        <Column show="prefix"/>
        <Column show="servlet_container"/>
        <Column show="jdk"/>
        <Column show="jre"/>
        <Column
          label="Additional info"
          :show="(row) => getAdditionalInfoLink(row.additional_info)"
          />
        <template v-slot:actions-before="{ row }">
          <a @click="openBuildModal('build', row)" class="green-text" title="Start Build">
            <i class="material-icons">send</i>
          </a>
        </template>
      </Table>

    </div>

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
      return this.$store.state.pas.configurations;
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
            if (this.$route.params.build === 'build') {
              return this.openBuildModal('build', configuration);
            }
            return this.openAddEditModal('update', configuration);
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
        path: `/pas/configurations/${encodeURIComponent(this.configuration.id || 'new')}`,
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