<template>
  <div class="extranet">
    <div v-if="$route.meta.name === 'extranet'" class="row">
      <div class="col s12 l6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">My Extranet Builds</span>
          <Builds :containers="userContainers" ></Builds>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <div class="card">
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
    <div class="col s12 l6" v-if="loadedBuilds">
        <div class="card">
            <div class="card-content">
                <span class="card-title">Extranet builds by branch</span>
                <BarChart :chart-data="dataCollectionBranches" :options="options"></BarChart>
                <span class="card-title"><br><br>Extranet builds by user</span>
                <BarChart :chart-data="dataCollectionUsers" :options="options"></BarChart>
            </div>
        </div>
    </div>
    </div>
    <router-view v-else :key="$route.path"/>
  </div>
</template>

<script>
import Builds from '@/components/extranet/Builds';
import BarChart from '../../components/BarChart.js';

export default {
  components: {
    Builds,
    BarChart,
  },
  data() {
    return {
      loadedBuilds: false,
    };
  },  
  computed: {
    dataCollectionBranches() {
        const builds = this.buildsGroupedByBranch();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentDate = new Date();

        const dataCollection = {         
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
            dataCollection.datasets[0].backgroundColor.push("#4da6ff");
          });       
        } catch(error) { console.log("Could not get colour for table") }

        return dataCollection;
    },
    dataCollectionUsers() {
        const builds = this.buildsGroupedByUser();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentDate = new Date();

        const dataCollection = {
          labels: Object.keys(builds),
          datasets: [
            {
              label: monthNames[currentDate.getMonth()],
              data: Object.values(builds),
              backgroundColor: ["#dd99ff"],
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
  },
  methods: {
    getContainers() {
      this.$store.dispatch('extranet/getContainers');
    },
    buildsGroupedByBranch() {
      let builds = {};

      this.$store.getters['builds/getCurrentMonthBuildsGroupedByBranch']('extranet').forEach((groupedBuild) => {
        builds[groupedBuild.branch] = groupedBuild.builds;             
      });
      
      return builds;
    },
    buildsGroupedByUser() {
      let builds = {};

      this.$store.getters['builds/getCurrentMonthBuildsGroupedByUser']('extranet').forEach((groupedBuild) => {
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
