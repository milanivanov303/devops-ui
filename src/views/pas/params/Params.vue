<template>
  <div class="row">
    <div class="col s12">
      <div ref="params" class="row">
        <div class="col s12">
          <div class="data-table">
            <Table
                :data="params"
                sort-by="type"
                sort-dir="asc"
                :export-btn="false"
                :view-btn="false"
                @add="openAddEditModal({type: type}, 'create')"
                @edit="(row) => openAddEditModal(row, 'update')"
                @delete="(row) => openDeleteModal(row)"
            >
              <Column show="name"/>
              <Column show="type" :sortable="false" filter-type="dropdown"/>/>
              <Column show="category" :sortable="false" filter-type="dropdown"/>/>
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
              @close="showRemoveModal = false;"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
const AddUpdateModal = () => import('./AddUpdateModal');
const DeleteModal = () => import('./DeleteModal');

export default {
  components: { AddUpdateModal, DeleteModal },
  data() {
    return {
      showAddEditModal: false,
      showRemoveModal: false,
      selected: {},
      action: '',
    };
  },
  computed: {
    params() {
      return this.$store.state.pas.params;
    },
  },
  methods: {
    getData() {
      const loader = this.$loading.show({ container: this.$refs.params });

      this.$store.dispatch('pas/getParams')
        .then(() => {
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              this.showAddEditModal = true;
              this.action = 'create';
              this.selected = { };
              return;
            }

            const param = this.params.find(
              (param) => param.id === parseInt(this.$route.params.id, 10),
            );

            if (param) {
              this.showAddEditModal = true;
              this.action = 'update';
              this.selected = { ...param };
              return;
            }

            this.$M.toast({
              html: 'This parameter does not exist!',
              classes: 'toast-fail',
            });
          }
        })
        .catch((error) => this.$M.toast({ html: error, classes: 'toast-fail' }))
        .finally(() => loader.hide());
    },

    openAddEditModal(item, action) {
      this.selected = { ...item };
      this.action = action;
      this.showAddEditModal = true;

      this.$router.push({
        path: `/pas/params/${encodeURIComponent(item.id || 'new')}`,
      });
    },
    closeAddEditModal() {
      this.showAddEditModal = false;

      this.$router.push({ path: '/pas/params' });
    },

    openDeleteModal(item) {
      this.selected = item;
      this.showRemoveModal = true;
    },

  },

  mounted() {
    this.getData();
  },
};
</script>
