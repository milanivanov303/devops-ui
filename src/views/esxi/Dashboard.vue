<template>
  <div>
    <div>
      <EsxiRamStatistics :esxiHosts="esxiHosts"/>
    </div>
  </div>
</template>

<script>
import EsxiRamStatistics from '@/views/esxi/components/EsxiRamStatistics';

export default {

  data() {
    return {
      days: {
        name: 'Last 24 hours',
        value: 1,
      },
    };
  },

  components: {
    EsxiRamStatistics,
  },

  computed: {
    esxiHosts() {
      return this.$store.state.esxi.esxiHosts;
    },
  },

  methods: {
    getEsxiHosts() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch(
        'esxi/getEsxiHosts',
        {
          startDate: this.getStartDate(),
          stateName: this.stateName,
        },
      ).finally(() => loader.hide());
    },

    getStartDate() {
      const newDate = new Date(
        new Date().getTime() - (this.days.value * 24 * 60 * 60 * 1000),
      );

      return Math.round(new Date(newDate).getTime() / 1000);
    },

    // const loader = this.$loading.show({ container: this.$el });
    //
    // this.$store.dispatch(
    //   'builds/getBuildsForPeriod',
    //   {
    //     startDate: this.getStartDate(),
    //     stateName: this.stateName,
    //   },
    // ).finally(() => loader.hide());
  },

  created() {
    this.getEsxiHosts();
  },

};
</script>
