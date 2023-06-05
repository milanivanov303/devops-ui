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
            <Column show="dc_role"/>
            <Column show="instance_type"/>
            <Column show="environment_type"/>
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

      const loader = this.$loading.show({ container: this.$refs.requested });
      const promise1 = this.$store.dispatch('mmpi/getProjectsForInstanceRequest');
      const promise2 = this.$store.dispatch('mmpi/getDeliveryChainRoles');
      const promise3 = this.$store.dispatch('mmpi/getEnvironmentTypes');
      const promise4 = this.$store.dispatch('mmpi/getInstanceTypesVersions');
      const promise5 = this.$store.dispatch('esxi/getImxComponents');

      Promise.all([promise1, promise2, promise3, promise4, promise5])
        .then(() => {
          this.showAddEditModal = true;
          this.$router.push({
            path: `/inventory/request/${encodeURIComponent(this.selected.id || 'new')}`,
          });
        })
        .catch((error) => this.$M.toast({ html: error, classes: 'toast-fail' }))
        .finally(() => loader.hide());
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
