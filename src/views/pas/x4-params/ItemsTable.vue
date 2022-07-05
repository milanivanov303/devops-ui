<template>
  <div class="row" ref="params">
    <div class="data-table col s12">
      <Table
          :data="items"
          sort-by="name"
          :export-btn="false"
          :view-btn="false"
          @add="openAddEditModal('create', {})"
          @edit="(row) => openAddEditModal('update', row)"
          @delete="openDeleteModal"
      >
        <Column show="name"/>
        <Column show="description"/>
        <Column label="Created on" :show="(item) => $date(item.created_on).toHuman()"/>
        <Column show="created_by"/>
        <Column label="Updated on"
                :show="(item) => item.updated_on ? $date(item.updated_on).toHuman() : ''"/>
        <Column show="updated_by"/>
      </Table>
    </div>
    <AddUpdateModal
        v-if="showAddEditModal"
        :action="action"
        :selected="selected"
        @close="closeAddEditModal()"
    />
    <DeleteModal
        v-if="showRemoveModal"
        :selected="selected"
        @close="closeDeleteModal()"
    />
  </div>
</template>

<script>
const AddUpdateModal = () => import('./AddUpdateModal');
const DeleteModal = () => import('./DeleteModal');

export default {
  props: {
    items: Array ,
  },
  components: {
    AddUpdateModal,
    DeleteModal,
  },
  data() {
    return {
      showAddEditModal: false,
      showRemoveModal: false,
      action: '',
      selected: {},
      type: this.$route.params.type,
    };
  },
  methods: {
    openAddEditModal(action, item) {
      this.action = action;
      this.selected = { ...item, type: this.type };
      this.showAddEditModal = true;

      this.$router.push({
        path: `/pas/x4-params/${this.type}/${encodeURIComponent(this.selected.id || 'new')}`,
      });
    },

    closeAddEditModal() {
      this.selected = {};
      this.$router.push({
        path: `/pas/x4-params/${this.type}`,
      });
      this.showAddEditModal = false;
    },

    openDeleteModal(item) {
      this.selected = item;
      this.showRemoveModal = true;
    },

    closeDeleteModal() {
      this.selected = {};
      this.showRemoveModal = false;
    },
  },
  mounted() {
  }
};
</script>

<style scoped>

</style>
