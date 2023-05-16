<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Builds by {{ aggregateBy }}</span>
        <ul class="collection center-align green-border">
          <li v-if="champion" class="collection-item">
            Congratulations {{ champion }}
            <i class="material-icons">sentiment_very_satisfied</i> !! <br>
            You are the champion of the builds for the selected period
            <i class="material-icons">local_fire_department</i> !!
          </li>
        </ul>
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
    <div class="card-content" v-if="aggregateBy === 'user'">
      <span class="card-title">Top Builders</span>
      <ul class="collection">
        <li class="collection-item" v-for="(aggregate, index) in topUsers" :key="aggregate.aggregate">
          <div class="left">{{ aggregate.aggregate }} - </div>
          <div class="right"> Number of builds  : {{ aggregate.builds }}</div>
          <i class="material-icons">
            {{ index === 0 ? 'emoji_events' : index === 1 ? 'military_tech' : 'grade' }}
          </i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import EventBus from '@/event-bus';
import { upperFirst } from 'lodash';

const BarChart = () => import('@/components/charts/BarChart');

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
    
    topUsers() {
      if (this.aggregateBy !== 'user') {
        return [];
      }
      const builds = this.$store.getters[this.getterName](this.stateName, this.module);
      const Users = Object.keys(builds);
      const aggregateBuilds = Users.map(aggregate => ({ aggregate, builds: builds[aggregate] }));
      const sortedAggregateBuilds = aggregateBuilds.sort((a, b) => b.builds - a.builds);
      const topUsers = sortedAggregateBuilds.slice(0, 3);
      return topUsers.map(aggregate => ({ aggregate: aggregate.aggregate, builds: aggregate.builds }));
    },

    champion() {
      if (this.aggregateBy === 'user') {
        const builds = this.$store.getters[this.getterName](this.stateName, this.module);
        const Users = Object.keys(builds);
        const aggregateBuilds = Users.map(aggregate => ({ aggregate, builds: builds[aggregate] }));
        const sortedAggregateBuilds = aggregateBuilds.sort((a, b) => b.builds - a.builds);
        const topUser = sortedAggregateBuilds[0];
        return topUser ? topUser.aggregate : null;
      }
      return null;
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

.green-border {
  border: 2px solid #00ff00; /* Replace #00ff00 with your desired bright green color */
  border-radius: 5px; /* Optional: Add rounded corners */
}
</style>