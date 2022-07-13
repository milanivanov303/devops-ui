<template>
  <div>
    <h5 class="center">Modules</h5>
    <Table
        :key="componentKey"
        :data="modules"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="true"
        :edit-btn="false"
        :delete-btn="true"
        @delete="(row) => openDeleteModal(row, 'delete')"
        @add="() => openAddEditModuleModal({}, 'add')"
        @update="(row) => openAddEditModuleModal(row, 'update')">
      <Column show="name"/>
      <Column show="abbreviation"/>
      <Column
          label="Submodules"
          :show="(row) => showSubmodules(row)"/>
      <template v-slot:actions-before="{ row }">
        <a
            @click="openAddEditModuleModal(row, 'update')"
            data-tooltip="Check/Update data"
            class="tooltipped">
          <i class="material-icons update">edit</i>
        </a>
      </template>
    </Table>

    <create-update-modules
        v-if="showAddEditModuleModal"
        @close="showAddEditModuleModal = false"
        @rerender="forceRerender()"
        :selectedModule="selectedModule"
        :action="action"
    />
    <DeleteModule
        v-if="showRemoveModal"
        :selectedModule="selectedModule"
        @close="closeDeleteModal()"
    />
  </div>
</template>

<script>

import CreateUpdateModules from '@/components/cms/CreateUpdateModules';
import DeleteModule from './DeleteModule';

export default {
  components: {
    DeleteModule,
    CreateUpdateModules,
  },
  data() {
    return {
      showRemoveModal: false,
      showAddEditModuleModal: false,
      error: '',
      action: null,
      selectedModule: {},
      componentKey: 0,
      modules: [],
      loading: '',
    };
  },
  methods: {
    async getModules() {
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('cms/getModules')
        .then(() => { this.modules = this.$store.state.cms.modules; });
      loader.hide();
    },
    forceRerender() {
      this.componentKey += 1;
      if (this.componentKey === 1) {
        this.$store.dispatch('cms/getModules')
          .then(() => { this.modules = this.$store.state.cms.modules; });
      }
      this.componentKey = 0;
    },
    showSubmodules(value) {
      if (value.submodules) {
        return value.submodules.map((s) => s.name).toString();
      }
      return [];
    },
    openAddEditModuleModal(moduleDetails, action) {
      this.selectedModule = { ...moduleDetails };
      this.action = action;
      this.showAddEditModuleModal = true;
    },
    openDeleteModal(selectedModule) {
      this.selectedModule = selectedModule;
      this.showRemoveModal = true;
    },
    closeDeleteModal() {
      this.selectedSubmodule = {};
      this.showRemoveModal = false;
    },
  },
  created() {
    this.getModules();
  },
};
</script>
