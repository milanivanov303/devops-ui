<template>
  <div class="row">
    <div class="col s12 l6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">My Builds</span>
          <Builds :containers="userContainers" ></Builds>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <div class="card">
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
            <tbody v-if="loaded">
              <tr>
                <td>1</td>
                <td>
                  <router-link to="/extranet">Extranet</router-link>
                </td>
                <td>{{ extranetContainersCount }}</td>
              </tr>
              <tr>
                <td>2</td>
                <td>iMX BE</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>3</td>
                <td>iMX FE</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col s12 l6" v-if="loadedBuilds">
        <div class="card">
            <div class="card-content">
                <span class="card-title">Number of builds by module</span>
                <BarChart :chart-data="dataCollectionModules" :options="options"></BarChart>
                <span class="card-title"><br><br>Number of builds by user</span>
                <BarChart :chart-data="dataCollectionUsers" :options="options"></BarChart>
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
      loaded: false,
      loadedBuilds: false,
    };
  },
  computed: {
    dataCollectionModules() {
        let builds = this.buildsGroupedByModule();
        let imxfeBuilds = builds["imx-fe"];
        let imxbeBuilds = builds["imx-be"];
        
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();

        let dataCollection = {         
          labels: ["Extranet", "iMX BE", "iMX FE"],
          datasets: [
            {
              label: monthNames[currentDate.getMonth()],
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
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();

        let dataCollection = {
          labels: Object.keys(builds),
          datasets: [
            {
              label: monthNames[currentDate.getMonth()],
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
  },
  methods: {
    buildsGroupedByModule() {
      let builds = {};

      this.$store.getters['builds/getCurrentMonthBuildsGroupedByModule']().forEach((groupedBuild) => {
        builds[groupedBuild.module] = groupedBuild.builds;             
      });

      return builds;
    },
    buildsGroupedByUser() {
      let builds = {};

      this.$store.getters['builds/getCurrentMonthBuildsGroupedByUser']().forEach((groupedBuild) => {
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
    async prepareData() {
        const loader = this.$loading.show({ container: this.$el });
        await this.$store.dispatch('extranet/getContainers')
            .then(() => {
                loader.hide();
                this.loaded = true;
            });
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
