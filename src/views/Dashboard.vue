<template>
  <div class="dashboard row">
    <div class="col s12 l8">
      <div class="card" ref="my_builds">
        <div class="card-content">
          <span class="card-title">My builds</span>
          <Builds v-if="$auth.getUser()" :created-by="$auth.getUser().username"></Builds>
        </div>
      </div>
      <div class="card" ref="builds_by_module">
        <div class="card-content">
          <span class="card-title">Active builds by module</span>
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Builds</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(build, index) in activeBuildsGroupedByModule" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <router-link :to="'/' + build.module +'/dashboard'">
                    {{ build.module }}
                  </router-link>
                </td>
                <td>
                  <span v-if="build.builds.building"
                        class="new badge blue"
                        data-badge-caption="building">{{ build.builds.building }}
                  </span>
                  <span v-if="build.builds.running"
                        class="new badge green"
                        data-badge-caption="running">{{ build.builds.running }}
                  </span>
                  <span v-if="build.builds.stopped"
                        class="new badge red"
                        data-badge-caption="stopped">{{ build.builds.stopped }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
      <div class="card" ref="stats_by_user">
        <div class="card-content">
          <span class="card-title">Number of builds by user</span>
          <div class="col s12 l6 right">
            <div class="input-field">
              <Select class="col s12"
                      icon="today"
                      displayed="name"
                      v-model="userStatisticsDays"
                      :options="dateOptions"
                />
            </div>
          </div>
          <BarChart :data="usersChartData" :height="200"></BarChart>
        </div>
      </div>
      <div class="card" ref="stats_by_module">
        <div class="card-content">
          <span class="card-title">Number of builds by module</span>
          <div class="col s12 l6 right">
            <div class="input-field">
              <Select class="col s12"
                      icon="today"
                      displayed="name"
                      v-model="moduleStatisticsDays"
                      :options="dateOptions"
                />
            </div>
          </div>
          <BarChart :data="modulesChartData" :height="150"></BarChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart';
import Builds from '@/components/Builds';
import EventBus from '@/event-bus';

export default {
  components: {
    BarChart,
    Builds,
  },
  data() {
    return {
      startDate: 30,
      dateOptions: [
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
      userStatisticsDays: {
        name: 'Last 24 hours',
        value: 1,
      },
      moduleStatisticsDays: {
        name: 'Last 24 hours',
        value: 1,
      },
    };
  },
  computed: {
    activeBuildsGroupedByModule() {
      return this.$store.getters['builds/getActiveGroupedByModule'];
    },
    modulesChartData() {
      const builds = this.$store.getters['builds/getByModule']('module-builds');
      return {
        labels: Object.keys(builds),
        datasets: [{ data: Object.values(builds) }],
      };
    },
    usersChartData() {
      const builds = this.$store.getters['builds/getByUser']('users-builds');
      return {
        labels: Object.keys(builds),
        datasets: [{ data: Object.values(builds) }],
      };
    },
  },
  methods: {
    getBuilds() {
      const loader1 = this.$loading.show({ container: this.$refs.my_builds });
      const loader2 = this.$loading.show({ container: this.$refs.builds_by_module });
      const promise1 = this.$store.dispatch('builds/getActive');
      const promise2 = this.$store.dispatch('extranet/getHost');
      const promise3 = this.$store.dispatch('debiteur/getHost');
      const promise4 = this.$store.dispatch('imx_fe/getHost');

      Promise.all([promise1, promise2, promise3, promise4]).finally(() => {
        loader1.hide();
        loader2.hide();
      });
    },
    getModuleStatistics() {
      const loader = this.$loading.show({ container: this.$refs.stats_by_module });
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {
          startDate: this.getStartDate(this.moduleStatisticsDays.value || this.startDate),
          stateName: 'module-builds',
        },
      ).finally(() => loader.hide());
    },
    getUserStatistics() {
      const loader = this.$loading.show({ container: this.$refs.stats_by_user });
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {
          startDate: this.getStartDate(this.userStatisticsDays.value || this.startDate),
          stateName: 'users-builds',
        },
      ).finally(() => loader.hide());
    },
    getStartDate(value) {
      const newDate = new Date(
        new Date().setTime(new Date().getTime() - (value * 24 * 60 * 60 * 1000)),
      );

      return Math.round(new Date(newDate).getTime() / 1000);
    },
    capitalize(string) {
      if (typeof string !== 'string') return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  watch: {
    userStatisticsDays() {
      this.getUserStatistics();
    },
    moduleStatisticsDays() {
      this.getModuleStatistics();
    },
  },
  mounted() {
    this.getBuilds();
    this.getModuleStatistics();
    this.getUserStatistics();
  },

  created() {
    EventBus.$on('build.created', () => {
      this.getBuilds();
      this.getModuleStatistics();
      this.getUserStatistics();
    });
  },
};
</script>
<style scoped>
  .card {
    margin-bottom: 1.5rem;
  }
</style>
