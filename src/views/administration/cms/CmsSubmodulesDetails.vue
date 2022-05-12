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
        @delete="(row) => deleteSubmodule(row, 'delete')"
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
  </div>
</template>

<script>

import CreateUpdateSubmodules from '@/components/cms/CreateUpdateSubmodules';

export default {
  components: {
    CreateUpdateSubmodules,
  },
  data() {
    return {
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
    deleteSubmodule(data) {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/deleteSubmodule', data.id)
        .then(() => {
          this.$M.toast({ html: 'Submodule has been deleted!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      loader.hide();
    },
  },
  created() {
    this.$store.dispatch('cms/getSubmodules');
  },
};
</script>
