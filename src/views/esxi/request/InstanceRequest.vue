<template>
  <div class="row">
    <div class="col s12">
        <div class="data-table" ref="requested">
          <Table
              :data="requestedInstances"
              sort-by="id"
              sort-dir="asc"
              :export-btn="false"
              :view-btn="false"
              :delete-btn="false"
              @add="openAddEditModal({}, 'create')"
              @edit="(row) => openAddEditModal(row, 'update')"
          >
            <Column show="project"/>
            <Column show="delivery_chain"/>
            <Column show="delivery_chain_type"/>
            <Column show="instance_type"/>
            <Column show="comments"/>
            <Column label="Requested on" name="requested_on"
                    :show="(request) => $date(request.created_on).toHuman()"/>
            <Column label="Requested by" name="requested_by"
                    :show="(request) => request.created_by"/>
          </Table>
        </div>

      <AddEditModal
          v-if="showAddEditModal"
          :request="selected"
          :action="action"
          @close="closeAddEditModal()"
      />

    </div>
  </div>
</template>

<script>
const AddEditModal = () => import('./AddEditModal');

export default {
  components: { AddEditModal },
  data() {
    return {
      selected: {},
      action: '',
      showAddEditModal: false,
    };
  },
  computed: {
    requestedInstances() {
      return this.$store.state.esxi.requestedInstances || [];
    },
  },
  methods: {
    // getStatus(status) {
    //   if (status === 'on') {
    //     return `<span class="new badge green" data-badge-caption="">${status}</span>`;
    //   }
    //   if (status === 'off') {
    //     return `<span class="new badge red" data-badge-caption="">${status}</span>`;
    //   }
    //   return `<span class="new badge" data-badge-caption="">${status}</span>`;
    // },
    getRequested() {
      const loader = this.$loading.show({ container: this.$refs.requested });
      this.$store.dispatch('esxi/getRequestedInstances')
        .then(() => {
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              return this.openAddEditModal({}, 'create');
            }

            const request = this.$store.state.esxi.requestedInstances.find((request) => {
              if (request.id === parseInt(this.$route.params.id, 10)) {
                return true;
              }
              return false;
            });

            if (request) {
              return this.openAddEditModal(request, 'update');
            }

            this.$M.toast({ html: 'This instance request does not exist!', classes: 'toast-fail' });
          }
          return false;
        })
        .finally(() => loader.hide());
    },

    openAddEditModal(request, action) {
      this.selected = { ...request };
      this.action = action;
      this.showAddEditModal = true;
      this.$router.push({
        path: `/inventory/request/${encodeURIComponent(this.selected.id || 'new')}`,
      });
    },
    closeAddEditModal() {
      this.showAddEditModal = false;
      this.$router.history.replace({
        path: '/inventory/request',
      });
    },
  },

  created() {
    this.getRequested();
  },
};
</script>
