<template>
  <div class="row" ref="x4-params">
    <div class="col s12">
      <ul class="tabs row">
        <li class="tab col s6">
          <a href="#config" @click="setQueryParam('config')">Config</a>
        </li>
        <li class="tab col s6">
          <a href="#project" @click="setQueryParam('project')">Projects</a>
        </li>
      </ul>
      <br>
      <div id="config">
        <ItemsTable :items="x4params"/>
      </div>
      <div id="project">
        <ItemsTable :items="x4params"/>
      </div>
    </div>
  </div>
</template>

<script>
const ItemsTable = () => import('./ItemsTable');

export default {
  components: {
    ItemsTable,
  },
  computed: {
    x4params() {
      return this.$store.state.pas.x4params;
    }
  },
  methods: {
    setQueryParam(type) {
      if (this.$route.params.type !== type) {
        this.$router.push({
          path: `/pas/x4-params/${type}`,
        });
        this.getData();
      }
    },

    getData() {
      const loader = this.$loading.show({container: this.$refs['x4-params']});
      this.$store.dispatch('pas/getX4Params', this.$route.params.type)
        .then(() => {
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              return this.openAddEditModal('create', {});
            }

            const item = this.items.find(
                (item) => item.id === parseInt(this.$route.params.id, 10),
            );

            if (item) {
              return this.openAddEditModal('update', item);
            }

            this.$M.toast({
              html: 'This parameter does not exist!',
              classes: 'toast-fail',
            });
          }
          return true;
        })
        .catch((error) => this.$M.toast({html: error, classes: 'toast-fail'}))
        .finally(() => loader.hide());
    },
  },
  mounted() {
  const elems = document.querySelectorAll('.tabs');
  this.$M.Tabs.init(elems);
  this.getData();
  },
};
</script>

<style scoped>

</style>
