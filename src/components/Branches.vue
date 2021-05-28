<template>
  <div>
    <div class="row">
      <div class="col s12 m6 l5">
        <TextInput label="Search" icon="search" v-model="search"/>
      </div>
    </div>

    <div v-if="!branch" class="row">
      <div v-for="branch in paginatedBranches" :key="branch.name" class="col s12 m6 l4">
        <Branch
          :module="module"
          :branch="branch"
          :count="getActiveByBranch(branch.name)"
        />
      </div>
      <div v-if="loading">
        <div v-for="index in perPage" :key="index" class="col s12 m6 l4">
          <BranchSkeleton/>
        </div>
      </div>
    </div>

    <div v-if="!branch && branches.length" class="row">
      <div class="col s12 m6 l9">
        <Paginate v-if="lastPage > 1" v-model="page" :page-count="lastPage"/>
      </div>
      <div class="col s12 m6 l3 per-page">
        <Select v-model="perPage" :options="perPageOptions" :defaultOption="false" class="right"/>
        <p class="right right-align">Items per page:</p>
      </div>
    </div>

    <div v-if="branch" class="row">
      <div class="col s12 m6 l5 scroll">
        <Branch
          v-for="branch in branches"
          :key="branch.name"
          :module="module"
          :branch="branch"
          :count="getActiveByBranch(branch.name)"
          :ref="branch.name"
        />
        <div v-if="loading">
          <BranchSkeleton v-for="index in perPage" :key="index"/>
        </div>
      </div>
      <div class="col s12 m6 l7" >
        <BranchDetails
          :module="module"
          :branch="branch"
          :key="branch.name"
        />
      </div>
    </div>

  </div>
</template>

<script>

import EventBus from '@/event-bus';

const Branch = () => import('@/components/Branch');
const BranchSkeleton = () => import('@/components/BranchSkeleton');
const BranchDetails = () => import('@/components/BranchDetails');
const Paginate = () => import('@/components/partials/Paginate');

export default {
  components: {
    Branch,
    Paginate,
    BranchSkeleton,
    BranchDetails,
  },

  props: {
    module: String,
  },

  data() {
    return {
      loading: false,
      search: this.$route.query.search,
      page: 1,
      perPage: 12,
      lastPage: 0,
      perPageOptions: [6, 9, 12, 15],
    };
  },

  computed: {
    branches() {
      let { branches } = this.$store.state[this.module];

      if (this.search) {
        const regexp = new RegExp(this.search, 'i');
        branches = branches.filter((branch) => branch.name.match(regexp));
      }

      branches = branches.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.last_nom) {
          return 1;
        }

        return 0;
      });

      return branches;
    },

    paginatedBranches() {
      const { branches } = this;

      const from = (this.page * this.perPage) - this.perPage;
      const to = (this.page * this.perPage);

      this.setLastPage(Math.ceil(branches.length / this.perPage));

      return branches.slice(from, to);
    },

    branch() {
      if (!this.$route.query.branch) {
        return null;
      }

      const branch = {
        name: decodeURIComponent(this.$route.query.branch),
      };

      const { branches } = this.$store.state[this.module];

      if (branches.length && !branches.find((_branch) => _branch.name === branch.name)) {
        branch.removed = true;
      }

      return branch;
    },
  },
  methods: {
    getActiveBuilds() {
      this.$store.dispatch('builds/getActive');
    },

    getActiveByBranch(branch) {
      return this.$store.getters['builds/getActiveByBranch'](this.module, branch).length;
    },

    getBranches() {
      this.loading = true;

      this.$store.dispatch(`${this.module}/getBranches`).then(() => {
        setTimeout(this.scrollBranchIntoView, 500);
      })
        .finally(() => { this.loading = false; });
    },

    scrollBranchIntoView() {
      const branch = document.querySelector('.router-link-exact-active');
      if (branch) {
        branch.scrollIntoView({
          block: 'start',
          inline: 'nearest',
        });
      }
    },

    setLastPage(lastPage) {
      this.lastPage = lastPage;
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
    this.getBranches();
    this.getActiveBuilds();

    EventBus.$on('build.created', () => {
      this.getActiveBuilds();
    });
  },
};
</script>

<style lang="scss" scoped>
  .scroll {
    max-height: 72.5vh;
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
