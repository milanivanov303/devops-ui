<template>
  <div class="row">
    <div class="col s12 l6">
      <div class="card" ref="my_builds">
        <div class="card-content">
          <span class="card-title">My Builds</span>
          <Builds :containers="userContainers" ></Builds>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <div class="card" ref="builds_by_module">
        <div class="card-content">
          <span class="card-title">Builds By Module</span>
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Builds</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <router-link to="/extranet/dashboard">Extranet</router-link>
                </td>
                <td>{{ extranetContainersCount }}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <router-link to="/imx-fe/dashboard">iMX FE</router-link>
                </td>
                <td>{{ imxFeContainersCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <div class="card" ref="stats_by_module">
        <div class="card-content">
          <span class="card-title">Number of builds by module</span>
          <div class="col s12 l5 right">
            <div class="input-field">
              <Select class="col s12" :select="selectStartDate" @selectedVal="getModuleStatistics"/>
            </div>
          </div>
          <BarChart :data="modulesChartData" :options="chartOptions"></BarChart>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <div class="card" ref="stats_by_user">
        <div class="card-content">
          <span class="card-title">Number of builds by user</span>
          <div class="col s12 l5 right">
            <div class="input-field">
              <Select class="col s12" :select="selectStartDate" @selectedVal="getUserStatistics"/>
            </div>
          </div>
          <BarChart :data="usersChartData" :options="chartOptions"></BarChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Builds from '@/components/extranet/Builds';
import BarChart from '@/components/BarChart';

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
    extranetContainersCount() {
      return this.$store.state.extranet.containers.length;
    },
    imxFeContainersCount() {
      return this.$store.state.imx_fe.containers.length;
    },
    modulesChartData() {
      let builds = {};
      this.$store.getters['builds/getBuildsGroupedByModule']().forEach((build) => {
        builds[build.module] = build.builds;
      });

      return {
        labels: ['Extranet', 'iMX FE'],
        datasets: [
          {
            label: '',
            data: [
              builds.extranet || 0,
              builds['imx-fe'] || 0 ,
            ],
          },
        ],
      };
    },
    usersChartData() {
      let builds = {};
      this.$store.getters['builds/getBuildsGroupedByUser']().forEach((build) => {
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
      const loader2 = this.$loading.show({ container: this.$refs.builds_by_module });
      this.$store.dispatch('extranet/getContainers')
        .then(() => {
          loader1.hide();
          loader2.hide();
        });
    },
    getModuleStatistics(days = {}) {
      const loader = this.$loading.show({container: this.$refs.stats_by_module});
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {startDate: this.getStartDate(days.value || this.startDate), stateName: 'moduleBuilds'},
      ).then(() => loader.hide());
    },
    getUserStatistics(days = {}) {
      const loader = this.$loading.show({ container: this.$refs.stats_by_user });
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
    this.getModuleStatistics();
    this.getUserStatistics();
  },
};
</script>
