<template>
<div>
  <div class="row">
    <div class="col s12 l6" v-if="loadedBuildsModule">
        <div class="card">
            <div class="card-content">
                <div class="row">
                    <div class="col s12 l4 right">
                        <div class="input-field">
                            <Select class="col s12"
                                :select="selectStartDate"
                                @selectedVal="selectedStartDateModule"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="charts col s12 l11">
                        <span class="card-title">Number of builds by module</span>
                        <BarChart :chart-data="dataCollectionModules" :options="options"></BarChart>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col s12 l6" v-if="loadedBuildsUsers">
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
                        <span class="card-title">Number of builds by user</span>
                        <BarChart :chart-data="dataCollectionUsers" :options="options"></BarChart>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import BarChart from '../components/BarChart';

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      startDateModule: new Date(
        new Date().setTime(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)),
      ),
      startDateUsers: new Date(
        new Date().setTime(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)),
      ),
      loadedBuildsModule: false,
      loadedBuildsUsers: false,
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
    dataCollectionModules() {
      const builds = this.buildsGroupedByModule();
      const imxfeBuilds = builds['imx-fe'];
      const imxbeBuilds = builds['imx-be'];

      const dataCollection = {
        labels: ['Extranet', 'iMX BE', 'iMX FE'],
        datasets: [
          {
            label: 'BUILDS',
            data: [
              (builds.extranet === undefined ? 0 : builds.extranet),
              (imxbeBuilds === undefined ? 0 : imxbeBuilds),
              (imxfeBuilds === undefined ? 0 : imxfeBuilds),
            ],
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
            backgroundColor: [],
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
    buildsGroupedByModule() {
      const builds = {};

      this.$store.getters['builds/getBuildsGroupedByModule']().forEach((groupedBuild) => {
        builds[groupedBuild.module] = groupedBuild.builds;
      });

      return builds;
    },
    buildsGroupedByUser() {
      const builds = {};

      this.$store.getters['builds/getBuildsGroupedByUser']().forEach((groupedBuild) => {
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
    selectedStartDateModule(value) {
      const newDate = new Date(
        new Date().setTime(new Date().getTime() - (value.value * 24 * 60 * 60 * 1000)),
      );
      const startDateModule = Math.round(new Date(newDate).getTime() / 1000);
      this.$store.dispatch('builds/getModuleBuildsForPeriod', { startDateModule }).then(() => {});
    },
    selectedStartDateUsers(value) {
      const newDate = new Date(
        new Date().setTime(new Date().getTime() - (value.value * 24 * 60 * 60 * 1000)),
      );
      const startDateUsers = Math.round(new Date(newDate).getTime() / 1000);
      this.$store.dispatch('builds/getUsersBuildsForPeriod', { startDateUsers }).then(() => {});
    },
    async prepareData() {
      const loader = this.$loading.show({ container: this.$el });

      const startDateModule = Math.round(new Date(this.startDateModule).getTime() / 1000);
      await this.$store.dispatch('builds/getModuleBuildsForPeriod', { startDateModule }).then(() => {
        loader.hide();
        this.loadedBuildsModule = true;
      });

      const startDateUsers = Math.round(new Date(this.startDateUsers).getTime() / 1000);
      await this.$store.dispatch('builds/getUsersBuildsForPeriod', { startDateUsers }).then(() => {
        this.loadedBuildsUsers = true;
      });
    },
  },
  mounted() {
    this.prepareData();
  },
};
</script>
