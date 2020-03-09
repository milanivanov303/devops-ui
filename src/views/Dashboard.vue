<template>
<div>
  <div class="row">
    <div class="col s12 l6" v-if="loadedBuilds">
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
import Builds from '@/components/extranet/Builds';
import BarChart from '../components/BarChart.js';

export default {
  components: {
    Builds,
    BarChart,
  },
  data() {
    return {
      loadedBuilds: false,
      numberOfDaysModule: 30,
      numberOfDaysUsers: 30,
      selectStartDate: {
        id: 'startDate_select',
        name: 'startDate',
        displayed: 'name',
        icon: "today",
        options: [
            {
              name: 'Last 24 hours',
              value: 1
            },
            {
              name: 'Last 7 days',
              value: 7
            },
            {
              name: 'Last 30 days',
              value: 30
            },
          ],
          selected: {
            name: 'Last 30 days',
            value: 30
          },
        },
    };
  },
  computed: {
    dataCollectionModules() {
        let builds = this.buildsGroupedByModule();
        let imxfeBuilds = builds["imx-fe"];
        let imxbeBuilds = builds["imx-be"];

        let dataCollection = {         
          labels: ["Extranet", "iMX BE", "iMX FE"],
          datasets: [
            {
              label: "BUILDS",
              data: [(builds.extranet == undefined ? 0 : builds.extranet), (imxbeBuilds == undefined ? 0 : imxbeBuilds), (imxfeBuilds == undefined ? 0 : imxfeBuilds)],
              backgroundColor: [],
            }
          ],
 
        };

        try{
          dataCollection.datasets[0].data.forEach((data) => {
            dataCollection.datasets[0].backgroundColor.push("#4da6ff");
          });       
        } catch(error) { console.log("Could not get colour for table") }

        return dataCollection;
    },
    dataCollectionUsers() {
        let builds = this.buildsGroupedByUser();

        let dataCollection = {
          labels: Object.keys(builds),
          datasets: [
            {
              label: "BUILDS",
              data: Object.values(builds),
              backgroundColor: [],
            }
          ],
 
        };
        
        try{
          dataCollection.datasets[0].data.forEach((data) => {
            dataCollection.datasets[0].backgroundColor.push(this.getRandomColour());
          });       
        } catch(error) { console.log("Could not get random colours for table") }
        
        return dataCollection;
    },
    options() {
        let optionsCollection = {         
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };

        return optionsCollection;
    },
  },
  methods: {
    buildsGroupedByModule() {
      let builds = {};

      this.$store.getters['builds/getBuildsDateFilteredGroupedByModule'](this.numberOfDaysModule).forEach((groupedBuild) => {
        builds[groupedBuild.module] = groupedBuild.builds;             
      });

      return builds;
    },
    buildsGroupedByUser() {
      let builds = {};

      this.$store.getters['builds/getBuildsDateFilteredGroupedByUser'](this.numberOfDaysUsers).forEach((groupedBuild) => {
        builds[groupedBuild.user] = groupedBuild.builds;             
      });
       
      return builds;
    },
    getRandomColour() {
        var letters = '0123456789ABCDEF'.split('');
        var colour = '#';
        for (var i = 0; i < 6; i++ ) {
            colour += letters[Math.floor(Math.random() * 16)];
        }
        return colour;
    },
    selectedStartDateModule(value) {
        this.numberOfDaysModule = value.value;
        this.buildsGroupedByModule();
    },
    selectedStartDateUsers(value) {
        this.numberOfDaysUsers = value.value;
        this.buildsGroupedByUser();
    },
    async prepareData() {
        const loader = this.$loading.show({ container: this.$el });
        await this.$store.dispatch('builds/getBuilds').then(() => {
            loader.hide();
            this.loadedBuilds = true;
        });
    },
  },  
  mounted() {    
      this.prepareData();
  },
};
</script>
