<template>
  <div class="row">
      <div class="col s12 l8">
        <MyBuilds :module="module" :key="module"/>
        <BuildsByBranch :module="module" :loading="loading"/>
      </div>
      <div class="col s12 l4">
        <BuildsStatistics :module="module" aggregate-by="user"/>
        <BuildsStatistics :module="module" aggregate-by="branch"/>
      </div>
  </div>
</template>

<script>

import EventBus from '@/event-bus';

const BuildsStatistics = () => import('@/components/BuildsStatistics');
const MyBuilds = () => import('@/components/MyBuilds');
const BuildsByBranch = () => import('@/components/BuildsByBranch');

export default {
  components: {
    BuildsStatistics,
    MyBuilds,
    BuildsByBranch,
  },

  props: {
    module: String,
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    getBuilds() {
      this.loading = true;
      this.$store.dispatch('builds/getActive').finally(() => {
        this.loading = false;
      });
    },
  },

  mounted() {
    this.getBuilds();
  },

  created() {
    EventBus.$on('build.created', () => {
      this.getBuilds();
    });
  },
};
</script>
<style scoped>
  .card {
    margin-bottom: 1.5rem;
  }
</style>
