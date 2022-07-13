<template>
  <div>
    <h5 class="center">Submodules</h5>
    <Table
        :data="submodules"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="true"
        :edit-btn="false"
        :delete-btn="true"
        @delete="(row) => openDeleteModal(row, 'delete')"
        @add="() => openAddEditSubmoduleModal({}, 'add')"
        @update="(row) => openAddEditSubmoduleModal(row, 'update')">
      <Column show="name"/>
      <Column show="abbreviation"/>
      <template v-slot:actions-before="{ row }">
        <a
            @click="openAddEditSubmoduleModal(row, 'update')"
            data-tooltip="Check/Update data"
            class="tooltipped">
          <i class="material-icons update">edit</i>
        </a>
      </template>
    </Table>

    <create-update-submodules
        v-if="showAddEditSubmoduleModal"
        @close="showAddEditSubmoduleModal = false"
        :selectedSubmodule="selectedSubmodule"
        :action="action"
    />

    <delete-submodule
        v-if="showRemoveModal"
        :selectedSubmodule="selectedSubmodule"
        @close="closeDeleteModal()"
    />
  </div>
</template>

<script>

import CreateUpdateSubmodules from '@/components/cms/CreateUpdateSubmodules';
import DeleteSubmodule from './DeleteSubmodule';

export default {
  components: {
    CreateUpdateSubmodules,
    DeleteSubmodule,
  },
  data() {
    return {
      showRemoveModal: false,
      showAddEditSubmoduleModal: false,
      error: '',
      action: null,
      selectedSubmodule: {},
    };
  },
  computed: {
    submodules() {
      return this.$store.getters['cms/submodules'];
    },
  },
  methods: {
    openAddEditSubmoduleModal(submoduleDetails, action) {
      this.selectedSubmodule = { ...submoduleDetails };
      this.action = action;
      this.showAddEditSubmoduleModal = true;
    },
    openDeleteModal(selectedSubmodule) {
      this.selectedSubmodule = selectedSubmodule;
      this.showRemoveModal = true;
    },
    closeDeleteModal() {
      this.selectedSubmodule = {};
      this.showRemoveModal = false;
    },
  },
  created() {
    this.$store.dispatch('cms/getSubmodules');
  },
};
</script>
