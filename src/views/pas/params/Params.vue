<template>
  <div class="row">
    <div class="col s12">
      <div ref="params" class="row">
        <div class="col s12">
          <div class="data-table">
            <Table
                :data="params"
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
                          v-model="category"
                          displayed="name"
                          :options="categories"
                          @change="(e) => setCurrentCategory(e)"
                />
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
      category: '',
      typeOptions: ['x4', 'x5'],
      categoryOptions: ['config', 'project'],
    };
  },
  computed: {
    params() {
      return this.$store.state.pas.params
        .filter((param) => param.type === this.type && param.category === this.category);
    },
    categories() {
      const categories = this.$store.state.pas.params.map((params) => params.category);
      return categories.filter((key, idx) => categories.indexOf(key) === idx);
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
              this.selected = { type: this.type };
              return;
            }

            const param = this.params.find(
              (param) => param.id === parseInt(this.$route.params.id, 10),
            );

            if (param) {
              this.showAddEditModal = true;
              this.action = 'update';
              this.selected = { ...param, type: this.type, category: this.category };
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
    },
    setCurrentCategory(category) {
      this.category = category;
      this.$router.push({ params: { category: this.category } });
    },

    openAddEditModal(item, action) {
      this.selected = { ...item };
      this.action = action;
      this.showAddEditModal = true;

      this.$router.push({
        path: `/pas/params/${this.type}/${this.category}/${encodeURIComponent(item.id || 'new')}`,
      });
    },
    closeAddEditModal() {
      this.showAddEditModal = false;

      this.$router.push({
        path: `/pas/params/${this.type}/${this.category}`,
      });
    },

    openDeleteModal(item) {
      this.selected = item;
      this.showRemoveModal = true;
    },

  },

  mounted() {
    this.type = this.$route.params.type;
    this.category = this.$route.params.category;
    this.getData();
  },
};
</script>
