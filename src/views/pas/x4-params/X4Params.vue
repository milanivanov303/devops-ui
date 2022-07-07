<template>
  <div class="row">
    <div class="col s12">
      <div ref="x4-params" class="row">
        <div class="col s12">
          <div class="data-table">
            <Table
                :data="x4params"
                sort-by="name"
                sort-dir="asc"
                :export-btn="false"
                :view-btn="false"
                @add="openAddEditModal({type: type}, 'create')"
                @edit="(row) => openAddEditModal(row, 'update')"
                @delete="(row) => openDeleteModal(row)"
            >
              <template v-slot:top-actions-after>
                <Select class="col s12 m4"
                        v-model="type"
                        displayed="name"
                        :options="typeOptions"
                        @change="(e) => setCurrentType(e)"
                />
              </template>
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
      type: '',
      typeOptions: ['config', 'project'],
    };
  },
  computed: {
    x4params() {
      return this.$store.state.pas.x4params;
    },
  },
  methods: {
    getData() {
      const loader = this.$loading.show({ container: this.$refs['x4-params'] });

      this.$store.dispatch('pas/getX4Params', this.type)
        .then(() => {
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              this.showAddEditModal = true;
              this.action = 'create';
              this.selected = { type: this.type };
              return;
            }

            const param = this.x4params.find(
              (param) => param.id === parseInt(this.$route.params.id, 10),
            );

            if (param) {
              this.showAddEditModal = true;
              this.action = 'update';
              this.selected = { ...param, type: this.type };
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

    setCurrentType(type) {
      this.type = type;
      this.$router.push({ params: { type: this.type } });
      this.getData();
    },

    openAddEditModal(item, action) {
      this.selected = { ...item };
      this.action = action;
      this.showAddEditModal = true;

      this.$router.push({
        path: `/pas/x4-params/${this.type}/${encodeURIComponent(item.id || 'new')}`,
      });
    },
    closeAddEditModal() {
      this.showAddEditModal = false;

      this.$router.push({
        path: `/pas/x4-params/${this.type}`,
      });
    },

    openDeleteModal(item) {
      this.selected = item;
      this.showRemoveModal = true;
    },

  },

  mounted() {
    this.type = this.typeOptions.find((t) => t === this.$route.params.type);
    this.getData();
  },
};
</script>
