<template>
  <div class="dashboard row">
    <div class="col s12 l8">
      <div class="card" ref="my_builds">
        <div class="card-content">
          <span class="card-title">My active builds</span>
          <Builds :builds="userBuilds" :show-module="true"></Builds>
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
              <tr>
                <td>1</td>
                <td>
                  <router-link to="/extranet/dashboard">Extranet</router-link>
                </td>
                <td>{{ extranetBuildsCount }}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <router-link to="/debiteur/dashboard">Debiteur</router-link>
                </td>
                <td>{{ debiteurBuildsCount }}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <router-link to="/imx-fe/dashboard">iMX FE</router-link>
                </td>
                <td>{{ imxFeBuildsCount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col s12 l4">
      <div class="card" ref="stats_by_user">
        <div class="card-content">
          <span class="card-title">Number of builds by user</span>
          <div class="col s12 l6 right">
            <div class="input-field">
              <Select :select="selectStartDate" @selectedVal="getUserStatistics"/>
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
              <Select :select="selectStartDate" @selectedVal="getModuleStatistics"/>
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


export default {
  components: {
    BarChart,
    Builds,
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
    };
  },
  computed: {
    userBuilds() {
      return this.$store.getters['builds/getActiveByUser'](this.$auth.getUser().username);
    },
    extranetBuildsCount() {
      return this.$store.state.builds.active.filter(build => build.module === 'extranet').length;
    },
    debiteurBuildsCount() {
      return this.$store.state.builds.active.filter(build => build.module === 'debiteur').length;
    },
    imxFeBuildsCount() {
      return this.$store.state.builds.active.filter(build => build.module === 'imx_fe').length;
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
      const promise2 = this.$store.dispatch('extranet/getServices');
      const promise3 = this.$store.dispatch('debiteur/getServices');
      const promise4 = this.$store.dispatch('imx_fe/getContainers');

      Promise.all([promise1, promise2, promise3, promise4]).finally(() => {
        loader1.hide();
        loader2.hide();
      });
    },
    getModuleStatistics(days = {}) {
      const loader = this.$loading.show({ container: this.$refs.stats_by_module });
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {
          startDate: this.getStartDate(days.value || this.startDate),
          stateName: 'module-builds',
        },
      ).finally(() => loader.hide());
    },
    getUserStatistics(days = {}) {
      const loader = this.$loading.show({ container: this.$refs.stats_by_user });
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        {
          startDate: this.getStartDate(days.value || this.startDate),
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
  },
  mounted() {
    this.getBuilds();
    this.getModuleStatistics();
    this.getUserStatistics();
  },
};
</script>
<style scoped>
  .card {
    margin-bottom: 1.5rem;
  }
</style>
