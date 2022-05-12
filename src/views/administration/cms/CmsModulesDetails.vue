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
        @delete="(row) => deleteModule(row, 'delete')"
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
  </div>
</template>

<script>

import CreateUpdateModules from '@/components/cms/CreateUpdateModules';

export default {
  components: {
    CreateUpdateModules,
  },
  data() {
    return {
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
    deleteModule(data) {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/deleteModule', data.id)
        .then(() => {
          this.$M.toast({ html: 'Module has been deleted!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      loader.hide();
    },
  },
  created() {
    this.$store.dispatch('cms/getModules');
    this.$store.dispatch('cms/getSubmodules');
  },
};
</script>
