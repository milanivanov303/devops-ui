<template>
  <div class="extranet">
    <div v-if="$route.meta.name === 'extranet'" >
      <div class="col s12 l8">
        <div class="card" ref="my_builds">
          <div class="card-content">
            <span class="card-title">My extranet builds</span>
            <Builds :user="this.$auth.getUser().username" module="extranet"></Builds>
          </div>
        </div>
        <div class="card" ref="builds_by_branch">
          <div class="card-content">
            <span class="card-title">Active extranet builds by branch</span>
            <table>
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Builds</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(build, index) in activeBuildsGroupedByBranch" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <router-link
                    v-bind:to="'/extranet/branches/' + encodeURIComponent(build.branch)">
                    {{ build.branch }}
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
              <tr v-if="activeBuildsGroupedByBranch.length === 0">
                <td colspan="3">There are no builds</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col s12 l4">
        <div class="card" ref="stats_by_user">
          <div class="card-content">
            <span class="card-title">Extranet builds by user</span>
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
        <div class="card" ref="stats_by_branch">
          <div class="card-content">
            <span class="card-title">Extranet builds by branch</span>
            <div class="col s12 l6 right">
              <div class="input-field">
                <Select class="col s12"
                        icon="today"
                        displayed="name"
                        v-model="branchStatisticsDays"
                        :options="dateOptions"
                />
              </div>
            </div>
            <BarChart :data="branchesChartData" :height="200"></BarChart>
          </div>
        </div>
      </div>
    </div>
    <router-view v-else :key="$route.path"/>
  </div>
</template>

<script>
import Builds from '@/components/Builds';
import BarChart from '@/components/BarChart';
import EventBus from '@/event-bus';

export default {
  components: {
    Builds,
    BarChart,
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
      branchStatisticsDays: {
        name: 'Last 24 hours',
        value: 1,
      },
    };
  },
  computed: {
    activeBuildsGroupedByBranch() {
      return this.$store.getters['builds/getActiveGroupedByBranch']('extranet');
    },
    branchesChartData() {
      const builds = this.$store.getters['builds/getByBranch']('extranet-branch-builds', 'extranet');
      return {
        labels: Object.keys(builds),
        datasets: [{ data: Object.values(builds) }],
      };
    },
    usersChartData() {
      const builds = this.$store.getters['builds/getByUser']('extranet-users-builds', 'extranet');
      return {
        labels: Object.keys(builds),
        datasets: [{ data: Object.values(builds) }],
      };
    },
  },
  methods: {
    getBuilds() {
      const loader1 = this.$loading.show({ container: this.$refs.my_builds });
      const loader2 = this.$loading.show({ container: this.$refs.builds_by_branch });

      this.$store.dispatch('builds/getActive').finally(() => {
        loader1.hide();
        loader2.hide();
      });
    },
    getBranchStatistics() {
      const loader = this.$loading.show({ container: this.$refs.stats_by_branch });
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {
          startDate: this.getStartDate(this.branchStatisticsDays.value || this.startDate),
          stateName: 'extranet-branch-builds',
        },
      ).finally(() => loader.hide());
    },
    getUserStatistics() {
      const loader = this.$loading.show({ container: this.$refs.stats_by_user });
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {
          startDate: this.getStartDate(this.userStatisticsDays.value || this.startDate),
          stateName: 'extranet-users-builds',
        },
      ).finally(() => loader.hide());
    },
    getStartDate(value) {
      const newDate = new Date(
        new Date().getTime() - (value * 24 * 60 * 60 * 1000),
      );

      return Math.round(new Date(newDate).getTime() / 1000);
    },
  },
  watch: {
    userStatisticsDays() {
      this.getUserStatistics();
    },
    branchStatisticsDays() {
      this.getBranchStatistics();
    },
  },
  mounted() {
    this.getBuilds();
    this.getBranchStatistics();
    this.getUserStatistics();
  },

  created() {
    EventBus.$on('build.created', () => {
      this.getBuilds();
      this.getBranchStatistics();
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
