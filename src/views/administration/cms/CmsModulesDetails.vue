<template>
  <div>
    <h5 class="center">Modules</h5>
    <Table
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
      <Column show="submodules"/>
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
import DeleteModule from '../../../components/cms/DeleteModule';

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
    };
  },
  computed: {
    modules() {
      return this.$store.getters['cms/modules'];
    },
    submodules() {
      return this.$store.getters['cms/submodules'];
    },
  },
  methods: {
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
    this.$store.dispatch('cms/getModules');
    this.$store.dispatch('cms/getSubmodules');
  },
};
</script>
