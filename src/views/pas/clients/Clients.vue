<template>
  <div class="clients" ref="clients">
    <div class="data-table">
      <Table
          :data="clients"
          sort-by="config"
          :export-btn="false"
          :view-btn="false"
          @add="openAddEditModal('create', {})"
          @edit="(row) => openAddEditModal('update', row)"
          @delete="openDeleteModal"
      >
        <Column show="config"/>
        <Column show="description"/>
        <Column label="Created on" :show="(client) => $date(client.created_on).toHuman()"/>
        <Column show="created_by"/>
        <Column label="Updated on"
                :show="(client) => client.updated_on ? $date(client.updated_on).toHuman() : ''"/>
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
    };
  },
  computed: {
    clients() {
      return this.$store.state.pas.clients;
    },
  },
  methods: {
    getData() {
      const loader = this.$loading.show({ container: this.$refs.clients });
      this.$store.dispatch('pas/getClients')
        .then(() => {
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              return this.openAddEditModal('create', {});
            }

            const client = this.clients.find(
              (client) => client.id === parseInt(this.$route.params.id, 10),
            );

            if (client) {
              return this.openAddEditModal('update', client);
            }

            this.$M.toast({
              html: 'This client does not exist!',
              classes: 'toast-fail',
            });
          }
          return true;
        })
        .catch((error) => this.$M.toast({ html: error, classes: 'toast-fail' }))
        .finally(() => loader.hide());
    },

    openAddEditModal(action, client) {
      this.action = action;
      this.selected = { ...client };
      this.showAddEditModal = true;

      this.$router.push({
        path: `/pas/clients/${encodeURIComponent(this.selected.id || 'new')}`,
      });
    },

    closeAddEditModal() {
      this.selected = {};
      this.$router.push({
        path: '/pas/clients',
      });
      this.showAddEditModal = false;
    },

    openDeleteModal(client) {
      this.selected = client;
      this.showRemoveModal = true;
    },

    closeDeleteModal() {
      this.selected = {};
      this.showRemoveModal = false;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>

</style>
