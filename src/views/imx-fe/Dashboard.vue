<template>
  <div class="imx-fe">
    <div v-if="$route.meta.name === 'imx-fe'" class="row">
      <div class="col s12 20">
      <div class="card">
        <div class="card-content">
          <span class="card-title">My iMX FE Builds</span>
          <Builds :containers="userContainers" ></Builds>
        </div>
      </div>
    </div>
    <div class="col s12 l6" v-if="loadedBuilds">
        <div class="card">
            <div class="card-content">
                <div class="row">
                    <div class="col s12 l4 right">
                        <div class="input-field">
                            <Select class="col s12"
                                :select="selectStartDate"
                                @selectedVal="selectedStartDateBranches"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="charts col s12 l11">
                      <span class="card-title">iMX FE builds by branch</span>
                      <BarChart :chart-data="dataCollectionBranches" :options="options"></BarChart>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col s12 l6" v-if="loadedBuilds">
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
                        <span class="card-title">iMX FE builds by user</span>
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
import Builds from './components/Builds';
import BarChart from '../../components/BarChart';

export default {
  components: {
    Builds,
    BarChart,
  },
  data() {
    return {
      loadedBuilds: false,
      numberOfDaysBranches: 30,
      numberOfDaysUsers: 30,
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
    userContainers() {
      return this.$store.getters['imx_fe/getContainersByUser'](
        this.$auth.getUser().username,
      );
    },
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
  },
  methods: {
    getContainers() {
      this.$store.dispatch('imx_fe/getContainers');
    },
    buildsGroupedByBranch() {
      const builds = {};

      this.$store.getters['builds/getBuildsDateFilteredGroupedByBranch'](this.numberOfDaysBranches, 'imx-fe').forEach((groupedBuild) => {
        builds[groupedBuild.branch] = groupedBuild.builds;
      });

      return builds;
    },
    buildsGroupedByUser() {
      const builds = {};

      this.$store.getters['builds/getBuildsDateFilteredGroupedByUser'](this.numberOfDaysUsers, 'imx-fe').forEach((groupedBuild) => {
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
    selectedStartDateBranches(value) {
      this.numberOfDaysBranches = value.value;
      this.buildsGroupedByBranch();
    },
    selectedStartDateUsers(value) {
      this.numberOfDaysUsers = value.value;
      this.buildsGroupedByUser();
    },
    async prepareData() {
      await this.getContainers();
      await this.$store.dispatch('builds/getBuilds').then(() => {
        this.loadedBuilds = true;
      });
    },
  },
  mounted() {
    this.prepareData();
  },
};
</script>
