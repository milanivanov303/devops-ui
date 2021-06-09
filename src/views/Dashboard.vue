<template>
  <div class="dashboard row">
    <div class="col s12 l8">
      <MyBuilds/>
      <BuildsByModule :loading="loading"/>
      <div class="card" ref="search_build">
        <div class="card-content">
          <span class="card-title">Search all builds</span>
          <div class="row">
            <div class="col s12">
              <Builds :fetch-on-create="false"></Builds>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col s12 l4">
      <BuildsStatistics aggregate-by="user"/>
      <BuildsStatistics aggregate-by="module"/>
    </div>
  </div>
</template>

<script>
import Builds from '@/components/Builds';
import EventBus from '@/event-bus';
import BuildsStatistics from '@/components/BuildsStatistics';
import MyBuilds from '@/components/MyBuilds';
import BuildsByModule from '@/components/BuildsByModule';

export default {
  components: {
    BuildsByModule,
    MyBuilds,
    BuildsStatistics,
    Builds,
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    getBuilds() {
      this.loading = true;

      const promise1 = this.$store.dispatch('builds/getActive');
      const promise2 = this.$store.dispatch('extranet/getHost');
      const promise3 = this.$store.dispatch('debiteur/getHost');
      const promise4 = this.$store.dispatch('imx_be/getHost');
      const promise5 = this.$store.dispatch('imx_fe/getHost');

      Promise.all(
        [promise1, promise2, promise3, promise4, promise5],
      )
        .finally(() => {
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
