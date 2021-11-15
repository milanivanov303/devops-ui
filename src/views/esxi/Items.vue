<template>
  <div class="row">
    <div class="col s12">
      <div class="row">
        <div class="col s12 m6">
          <TextInput label="Search..." icon="search" v-model="search"/>
        </div>
        <div class="col s12 m6 l1 right" >
          <button
            v-if="module === 'esxiHosts' && $auth.can('esxi.add')"
            class="btn-floating waves-effect waves-light right"
            data-tooltip="Add"
            @click="showAddHostModal=true"
          >
            <i class="material-icons left">add</i>
          </button>
          <Select v-if="module === 'virtualMachines'"
                  v-model="status"
                  :options="statusOptions"
                  displayed="name"
          />
        </div>
      </div>

      <div v-if="!item" class="row">
        <div v-for="item in paginatedItems" :key="item.name" class="col s12 m6 l4">
          <Host v-if="module === 'esxiHosts'" :esxiHost="item"/>
          <VirtualMachine v-if="module === 'virtualMachines'" :vm="item"/>
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
          <div v-for="(item, id) in items" :key="id">
            <Host v-if="module === 'esxiHosts'" :esxiHost="item"/>
            <VirtualMachine v-if="module === 'virtualMachines'" :vm="item"/>
          </div>
          <div v-if="loading && items.length <= 0">
            <BranchSkeleton v-for="index in perPage" :key="index"/>
          </div>
        </div>
        <div class="col s12 m6 l7" >
          <HostDetails v-if="module === 'esxiHosts'" :esxiHost="item"/>
          <VmDetails v-if="module === 'virtualMachines'" :vm="item"/>
        </div>
      </div>

      <AddHostModal
        v-if="module === 'esxiHosts' && showAddHostModal"
        @close="showAddHostModal = false"
      />
    </div>
  </div>
</template>

<script>
const BranchSkeleton = () => import('@/components/BranchSkeleton');
const Paginate = () => import('@/components/partials/Paginate');

const Host = () => import('./esxiHosts/Host');
const HostDetails = () => import('./esxiHosts/HostDetails');
const AddHostModal = () => import('./esxiHosts/AddHostModal');

const VirtualMachine = () => import('./virtualMachines/VirtualMachine');
const VmDetails = () => import('./virtualMachines/VmDetails');

export default {
  components: {
    BranchSkeleton,
    Paginate,
    Host,
    HostDetails,
    AddHostModal,
    VirtualMachine,
    VmDetails,
  },

  props: {
    module: String,
  },

  data() {
    return {
      loading: false,
      search: this.$route.query.search,
      page: 1,
      perPage: 9,
      lastPage: 0,
      perPageOptions: [6, 9, 12, 15],
      showAddHostModal: false,
      status: {
        name: 'On',
        value: 'on',
      },
      statusOptions: [
        {
          name: 'On',
          value: 'on',
        },
        {
          name: 'Off',
          value: 'off',
        },
        {
          name: 'All',
          value: 'all',
        },
      ],
    };
  },
  computed: {
    items() {
      let items = this.$store.state.esxi[this.module];

      items = this.filterItemsBySearch(items);

      if (this.module === 'virtualMachines') {
        items = this.filterItemsByStatus(items);
      }

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
      const query = this.$route.query[this.module.slice(0, -1)];
      if (!query || !this.items.length) {
        return null;
      }

      const item = this.items.find(
        (i) => decodeURIComponent(query) === (i.hostname || i.name),
      );

      return item;
    },
  },

  methods: {
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
        if (item.hostname && item.hostname.match(regexp)) {
          return true;
        }
        if (item.name && item.name.match(regexp)) {
          return true;
        }
        // search for vm machines and instances

        return false;
      });
    },

    filterItemsByStatus(items) {
      if (this.status.value === 'all') {
        return items;
      }

      return items.filter((item) => item.powered === this.status.value);
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
    this.$M.Tooltip.init(this.$el.querySelectorAll('[data-tooltip]'));
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
</style>
