<template>
  <div class="extranet">
    <div v-if="$route.meta.name === 'extranet'" class="row">
      <div class="col s12 20">
      <div class="card">
        <div class="card-content">
          <span class="card-title">My Extranet Builds</span>
          <Builds :containers="userContainers" ></Builds>
        </div>
      </div>
    </div>
    <div class="col s12 l6" v-if="loadedBranchBuilds">
        <div class="card">
            <div class="card-content">
                <div class="row">
                    <div class="col s12 l4 right">
                        <div class="input-field">
                            <Select class="col s12"
                                :select="selectStartDate"
                                @selectedVal="selectedStartDateBranch"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="charts col s12 l11">
                      <span class="card-title">Extranet builds by branch</span>
                      <BarChart :chart-data="dataCollectionBranches" :options="options"></BarChart>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col s12 l6" v-if="loadedUsersBuilds">
        <div class="card">
            <div class="card-content">
                <div class="row">
                    <div class="col s12 l4 right">
                        <div class="input-field">
                            <Select class="col s12"
                                :select="selectStartDate"
                                @selectedVal="selectedStartDateUsers"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="charts col s12 l11">
                        <span class="card-title">Extranet builds by user</span>
                        <BarChart :chart-data="dataCollectionUsers" :options="options"></BarChart>
                    </div>
                </div>
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
      loadedBranchBuilds: false,
      loadedUsersBuilds: false,
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
    dataCollectionBranches() {
      const builds = this.buildsGroupedByBranch();

      const dataCollection = {
        labels: Object.keys(builds),
        datasets: [
          {
            label: 'BUILDS',
            data: Object.values(builds),
            backgroundColor: [],
          },
        ],
      };

      try {
        dataCollection.datasets[0].data.forEach(() => {
          dataCollection.datasets[0].backgroundColor.push('#4da6ff');
        });
      } catch (error) { console.log('Could not get colour for table'); }

      return dataCollection;
    },
    dataCollectionUsers() {
      const builds = this.buildsGroupedByUser();

      const dataCollection = {
        labels: Object.keys(builds),
        datasets: [
          {
            label: 'BUILDS',
            data: Object.values(builds),
            backgroundColor: ['#dd99ff'],
          },
        ],
      };

      try {
        dataCollection.datasets[0].data.forEach(() => {
          dataCollection.datasets[0].backgroundColor.push(this.getRandomColour());
        });
      } catch (error) { console.log('Could not get random colours for table'); }

      return dataCollection;
    },
    options() {
      const optionsCollection = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      };

      return optionsCollection;
    },
    userContainers() {
      return this.$store.getters['extranet/getContainersByUser'](
        this.$auth.getUser().username,
      );
    },
  },
  methods: {
    getContainers() {
      this.$store.dispatch('extranet/getContainers');
    },
    buildsGroupedByBranch() {
      const builds = {};

      this.$store.getters['builds/getBuildsGroupedByBranch']('extranet').forEach((groupedBuild) => {
        builds[groupedBuild.branch] = groupedBuild.builds;
      });

      return builds;
    },
    buildsGroupedByUser() {
      const builds = {};

      this.$store.getters['builds/getBuildsGroupedByUser']('extranet').forEach((groupedBuild) => {
        builds[groupedBuild.user] = groupedBuild.builds;
      });

      return builds;
    },
    getRandomColour() {
      const letters = '0123456789ABCDEF'.split('');
      let colour = '#';
      for (let i = 0; i < 6; i += 1) {
        colour += letters[Math.floor(Math.random() * 16)];
      }
      return colour;
    },
    getStartDate(value) {
      const newDate = new Date(
        new Date().setTime(new Date().getTime() - (value * 24 * 60 * 60 * 1000)),
      );

      return Math.round(new Date(newDate).getTime() / 1000);
    },
    selectedStartDateBranch(value) {
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        { startDate: this.getStartDate(value.value), stateName: 'branchBuilds' },
      );
    },
    selectedStartDateUsers(value) {
      this.$store.dispatch(
        'builds/getBuildsForPeriod',
        { startDate: this.getStartDate(value.value), stateName: 'usersBuilds' },
      );
    },
    async prepareData() {
      await this.getContainers();

      await this.$store.dispatch(
        'builds/getBuildsForPeriod',
        { startDate: this.getStartDate(this.startDate), stateName: 'branchBuilds' },
      ).then(() => {
        this.loadedBranchBuilds = true;
      });

      await this.$store.dispatch(
        'builds/getBuildsForPeriod',
        { startDate: this.getStartDate(this.startDate), stateName: 'usersBuilds' },
      ).then(() => {
        this.loadedUsersBuilds = true;
      });
    },
  },
  mounted() {
    this.prepareData();
  },
};
</script>
