<template>
  <div class="row">
    <div class="col s12">
      <div>Result: <b>{{items.length}} records</b></div>

      <div class="row">
        <div class="col s12 m6">
          <TextInput label="Search..." icon="search" v-model="search"/>
        </div>
        <div class="col s12 m6">
          <button
              v-if="module === 'esxiHosts' && $auth.can('esxi.add') && !item"
              class="btn-floating waves-effect waves-light right"
              data-tooltip="Add"
              @click="showModal=true"
            >
              <i class="material-icons left">add</i>
          </button>
        </div>
      </div>

      <div v-if="!item" class="row">
        <div v-for="item in paginatedItems" :key="item.name" class="col s12 m6 l4">
          <Host v-if="module === 'esxiHosts'" :esxiHost="item"/>
        </div>
        <div v-if="loading && items.length <= 0">
          <div v-for="index in perPage" :key="index" class="col s12 m6 l4">
            <BranchSkeleton/>
          </div>
        </div>
      </div>

      <div v-if="!item && items.length" class="row">
        <div class="col s12 m6 l9">
          <Paginate v-if="lastPage > 1" v-model="page" :page-count="lastPage"/>
        </div>
        <div class="col s12 m6 l3 per-page">
          <Select v-model="perPage" :options="perPageOptions" :defaultOption="false" class="right"/>
          <p class="right right-align">Items per page:</p>
        </div>
      </div>

      <div v-if="item" class="row">
        <div class="col s12 m6 l5 scroll">
          <div v-for="item in items" :key="item.name">
            <Host v-if="module === 'esxiHosts'" :esxiHost="item"/>
          </div>
          <div v-if="loading && items.length <= 0">
            <BranchSkeleton v-for="index in perPage" :key="index"/>
          </div>
        </div>
        <div class="col s12 m6 l7" >
          <HostDetails v-if="module === 'esxiHosts'" :esxiHost="item"/>
        </div>
      </div>

      <span class="no-data-text" v-if="!loading && getNoDataText()" v-html="getNoDataText()"></span>

      <AddEditHostModal
          v-if="showModal"
          action="create"
          :currentHost="{}"
          @close="showModal = false"
      />
    </div>
  </div>
</template>

<script>
const BranchSkeleton = () => import('@/components/BranchSkeleton');
const Paginate = () => import('@/components/partials/Paginate');

const Host = () => import('./esxiHosts/Host');
const HostDetails = () => import('./esxiHosts/HostDetails');
const AddEditHostModal = () => import('./esxiHosts/AddEditHostModal');

export default {
  components: {
    BranchSkeleton,
    Paginate,
    Host,
    HostDetails,
    AddEditHostModal,
  },

  props: {
    module: String,
  },

  data() {
    return {
      showUpdateBtn: false,
      loading: false,
      search: this.$route.query.search,
      page: 1,
      perPage: 9,
      lastPage: 0,
      perPageOptions: [6, 9, 12, 15],
      showModal: false,
      status: 'on',
      statusOptions: ['on', 'off', 'all'],
    };
  },
  computed: {
    items() {
      let items = this.$store.state.esxi[this.module];

      items = this.filterItemsBySearch(items);

      return items;
    },

    paginatedItems() {
      const { items } = this;

      const from = (this.page * this.perPage) - this.perPage;
      const to = (this.page * this.perPage);

      this.setLastPage(Math.ceil(items.length / this.perPage));

      return items.slice(from, to);
    },

    item() {
      const { name } = this.$route.params;
      if (!name || !this.items.length) {
        return null;
      }

      const item = this.items.find((i) => name === i.name);
      return item;
    },
  },

  methods: {
    getNoDataText() {
      if (!this.$store.state.esxi.esxiHosts.length) {
        return 'There are no ESXi Host created.';
      }
      if (this.module === 'virtualMachines' && !this.$store.state.esxi.virtualMachines.length) {
        this.showUpdateBtn = true;
        return 'There are no Virtual Machines. Please update and try again later.';
      }
      return null;
    },

    getItems() {
      this.loading = true;

      this.$store.dispatch('esxi/getEsxiHosts').then(() => {
        setTimeout(this.scrollBranchIntoView, 100);
      })
        .finally(() => { this.loading = false; });
    },

    scrollBranchIntoView() {
      const item = document.querySelector('.router-link-exact-active');
      if (item) {
        item.scrollIntoView({
          block: 'start',
          inline: 'nearest',
        });
      }
    },

    setLastPage(lastPage) {
      this.lastPage = lastPage;
    },

    filterItemsBySearch(items) {
      if (this.search === '') {
        return items;
      }

      const regexp = new RegExp(this.search, 'i');

      return items.filter((item) => {
        if (item.name && item.name.match(regexp)) {
          return true;
        }
        // search for vm machines and instances

        return false;
      });
    },

  },

  watch: {
    search(value) {
      const query = { ...this.$route.query };

      delete query.search;
      if (value) {
        query.search = value;
      }

      this.$router.push({ query });
    },

    perPage() {
      this.page = 1;
    },
  },

  created() {
    this.getItems();
  },

  updated() {
    if (this.$el) {
      this.$M.Tooltip.init(this.$el.querySelectorAll('[data-tooltip]'));
    }
  },
};

</script>

<style lang="scss" scoped>
  .scroll {
    max-height: 80vh;
    overflow-x: auto;
  }
  .per-page {
    .input-field {
      width: 60px;
    }
    p {
      margin: 13px 0;
    }
  }
  .no-data-text {
    padding-left: 40px;
  }
</style>
