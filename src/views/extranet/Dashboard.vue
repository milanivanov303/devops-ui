<template>
  <div class="extranet">
    <div v-if="$route.meta.name === 'extranet'" class="row">
      <div class="col s12 l6">
        <div class="card" ref="my_builds">
          <div class="card-content">
            <span class="card-title">My Extranet Builds</span>
            <Builds :containers="userContainers" ></Builds>
          </div>
        </div>
      </div>
      <div class="col s12 l6">
        <div class="card" ref="builds_by_branch">
          <div class="card-content">
            <span class="card-title">Extranet Builds By Branch</span>
            <table>
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Builds</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(container, index) in containersGroupedByBranch" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <router-link
                    v-bind:to="'/extranet/branches/' + encodeURIComponent(container.branch)">
                    {{ container.branch }}
                  </router-link>
                </td>
                <td>{{ container.builds }}</td>
              </tr>
              <tr v-if="containersGroupedByBranch.length === 0">
                <td colspan="3">There are no builds</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col s12 l6">
        <div class="card" ref="stats_by_branch">
            <div class="card-content">
              <span class="card-title">Extranet builds by branch</span>
              <div class="col s12 l4 right">
                <div class="input-field">
                  <Select class="col s12" :select="selectStartDate" @selectedVal="getBranchStatistics"/>
                </div>
              </div>
              <BarChart :data="branchesChartData" :options="chartOptions"></BarChart>
            </div>
        </div>
      </div>
      <div class="col s12 l6">
        <div class="card" ref="stats_by_user">
            <div class="card-content">
              <span class="card-title">Extranet builds by user</span>
              <div class="col s12 l4 right">
                <div class="input-field">
                  <Select class="col s12" :select="selectStartDate" @selectedVal="getUserStatistics"/>
                </div>
              </div>
              <BarChart :data="usersChartData" :options="chartOptions"></BarChart>
            </div>
        </div>
      </div>
    </div>
    <router-view v-else :key="$route.path"/>
  </div>
</template>

<script>
import Builds from '@/components/extranet/Builds';
import BarChart from '../../components/BarChart';

export default {
  components: {
    Builds,
    BarChart,
  },
  data() {
    return {
      startDate: 30,
      selectStartDate: {
        id: 'startDate_select',
        name: 'startDate',
        displayed: 'name',
        icon: 'today',
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
        selected: {
          name: 'Last 30 days',
          value: 30,
        },
      },
      chartOptions: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    };
  },
  computed: {
    userContainers() {
      return this.$store.getters['extranet/getContainersByUser'](
        this.$auth.getUser().username,
      );
    },
    containersGroupedByBranch() {
      return this.$store.getters['extranet/getContainersGroupedByBranch']();
    },
    branchesChartData() {
      let builds = {};
      this.$store.getters['builds/getBuildsGroupedByBranch']('extranet').forEach((build) => {
        builds[build.branch] = build.builds;
      });

      return {
        labels: Object.keys(builds),
        datasets: [
          {
            label: 'Builds',
            data: Object.values(builds),
          },
        ],
      };
    },
    usersChartData() {
      let builds = {};
      this.$store.getters['builds/getBuildsGroupedByUser']('extranet').forEach((build) => {
        builds[build.user] = build.builds;
      });

      return {
        labels: Object.keys(builds),
        datasets: [
          {
            label: 'Builds',
            data: Object.values(builds)
          },
        ],
      };
    },
  },
  methods: {
    getContainers() {
      const loader1 = this.$loading.show({ container: this.$refs.my_builds });
      const loader2 = this.$loading.show({ container: this.$refs.builds_by_branch });
      this.$store.dispatch('extranet/getContainers').then(() => {
        loader1.hide();
        loader2.hide();
      });
    },
    getBranchStatistics(days = {}) {
      const loader = this.$loading.show({container: this.$refs.stats_by_branch});
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {startDate: this.getStartDate(days.value || this.startDate), stateName: 'branchBuilds'},
      ).then(() => loader.hide());
    },
    getUserStatistics(days = {}) {
      const loader = this.$loading.show({ container: this.$refs.stats_by_user});
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        { startDate: this.getStartDate(days.value || this.startDate), stateName: 'usersBuilds' },
      ).then(() => loader.hide());
    },
    getStartDate(value) {
      const newDate = new Date(
        new Date().setTime(new Date().getTime() - (value * 24 * 60 * 60 * 1000)),
      );

      return Math.round(new Date(newDate).getTime() / 1000);
    },
  },
  mounted() {
    this.getContainers();
    this.getBranchStatistics();
    this.getUserStatistics();
  },
};
</script>
