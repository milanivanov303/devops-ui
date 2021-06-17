<template>
  <div>

    <div class="row">
      <div class="col s12 m6 l5">
        <TextInput label="Search" icon="search" v-model="search"/>
      </div>
    </div>

    <div v-if="!esxiHost" class="row">
      <div v-for="esxiHost in paginatedEsxiHosts" :key="esxiHost.name" class="col s12 m6 l6">
        <Host
          :module="module"
          :esxiHost="esxiHost"
        />
      </div>
      <div v-if="loading">
        <div v-for="index in perPage" :key="index" class="col s12 m6 l4">
          <BranchSkeleton/>
        </div>
      </div>
    </div>

    <div v-if="!esxiHost && esxiHosts.length" class="row">
      <div class="col s12 m6 l9">
        <Paginate v-if="lastPage > 1" v-model="page" :page-count="lastPage"/>
      </div>
      <div class="col s12 m6 l3 per-page">
        <Select v-model="perPage" :options="perPageOptions" :defaultOption="false" class="right"/>
        <p class="right right-align">Items per page:</p>
      </div>
    </div>

    <div v-if="esxiHost" class="row">
      <div class="col s12 m6 l5 scroll">
        <Host
          v-for="esxiHost in esxiHosts"
          :key="esxiHost.hostname"
          :module="module"
          :esxiHost="esxiHost"
          :ref="esxiHost.hostname"
        />
        <div v-if="loading">
          <BranchSkeleton v-for="index in perPage" :key="index"/>
        </div>
      </div>
      <div class="col s12 m6 l7" >
        <HostDetails
          :module="module"
          :esxiHost="esxiHost"
          :key="esxiHost.hostname"
        />
      </div>
    </div>

  </div>
</template>

<script>

const Host = () => import('@/views/esxi/Host');
const BranchSkeleton = () => import('@/components/BranchSkeleton');
const HostDetails = () => import('@/views/esxi/HostDetails');
const Paginate = () => import('@/components/partials/Paginate');

export default {
  components: {
    Host,
    Paginate,
    BranchSkeleton,
    HostDetails,
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
    esxiHosts() {
      let { esxiHosts } = this.$store.state[this.module];

      if (this.search) {
        const regexp = new RegExp(this.search, 'i');
        esxiHosts = esxiHosts.filter((esxiHost) => esxiHost.hostname.match(regexp));
      }

      return esxiHosts;
    },

    paginatedEsxiHosts() {
      const { esxiHosts } = this;

      const from = (this.page * this.perPage) - this.perPage;
      const to = (this.page * this.perPage);

      this.setLastPage(Math.ceil(esxiHosts.length / this.perPage));

      return esxiHosts.slice(from, to);
    },

    esxiHost() {
      const { esxiHosts } = this.$store.state[this.module];

      if (!this.$route.query.esxiHost || !esxiHosts.length) {
        return null;
      }

      const esxiHost = esxiHosts.find(
        (x) => x.hostname === decodeURIComponent(this.$route.query.esxiHost),
      );

      return esxiHost;
    },
  },

  methods: {
    getEsxiHosts() {
      this.$store.dispatch('esxi/getEsxiHosts');
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
    this.getEsxiHosts();
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
