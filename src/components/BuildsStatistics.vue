<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Builds by {{ aggregateBy }}</span>
      <div class="row">
        <div class="col s12 l6 right">
          <Select
            v-model="days"
            :options="options"
            icon="today"
            displayed="name"
            :defaultOption="false"
          />
        </div>
        <div class="col s12">
          <BarChart :data="chartData" :height="200"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/event-bus';
import { upperFirst } from 'lodash';

const BarChart = () => import('@/components/BarChart');

export default {
  components: {
    BarChart,
  },

  props: {
    module: String,
    aggregateBy: String,
  },

  data() {
    return {
      options: [
        {
          name: 'Last 24 hours',
          value: 1,
        },
        {
          name: 'Last 7 days',
          value: 7,
        },
        {
          name: 'Last 30 days',
          value: 30,
        },
      ],
      days: {
        name: 'Last 24 hours',
        value: 1,
      },
    };
  },

  computed: {
    stateName() {
      return `${this.module}-${this.aggregateBy}-builds`;
    },

    getterName() {
      return `builds/getBy${upperFirst(this.aggregateBy)}`;
    },

    chartData() {
      const builds = this.$store.getters[this.getterName](this.stateName, this.module);
      return {
        labels: Object.keys(builds),
        datasets: [{ data: Object.values(builds) }],
      };
    },
  },

  methods: {
    getBuilds() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch(
        'builds/getBuildsForPeriod',
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
  },

  watch: {
    days() {
      this.getBuilds();
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
.card{
  min-height: 400px;
}
</style>
