<template>
<div>
    <div class="col s12 m3">
      <div v-if="mdiskData">
        <div class="card grey lighten-5">
          <div class="card-content center-align">
            <span class="card-title">Mdisk Data</span>
            <table>
              <thead>
                <tr>
                  <th class="center-align">Name</th>
                  <th class="center-align">Mdisk Group Name</th>
                  <th class="center-align">Capacity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(mdisk, index) in mdiskData">
                  <td class="center-align bold-text" v-text="mdisk.name"></td>
                  <td class="center-align bold-text" v-text="mdisk.mdisk_grp_name"></td>
                  <td class="center-align bold-text" v-text="mdisk.capacity"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="col s12 m6">
      <div class="col s12" v-if="poolData.length > 0">
        <div class="card grey lighten-5">
          <div class="card-content center-align">
            <span class="card-title">Capacity by pools (in TB)</span>
            <pool-information :poolData="poolData"/>
          </div>
        </div>
      </div>
    </div>
        <div class="col s12 m3">
      <div class="card grey lighten-5 system-data-card">
        <div class="card-content center-align">
          <span class="card-title">System Data</span>
          <div v-if="systemData">
            <p class="center-align"><b>Name:</b> <span v-text="systemData.name"></span></p>
            <p class="center-align"><b>Total Mdisk Capacity: </b><span v-text="systemData.total_mdisk_capacity"></span></p>
            <p class="center-align"><b>Total Free Space: </b><span v-text="systemData.total_free_space"></span></p>
            <p class="center-align"><b>Console IP: </b><span v-text="systemData.console_IP"></span></p>
            <p class="center-align"><b>Code Level: </b><span v-text="systemData.code_level"></span></p>
            <p class="center-align"><b>Cluster NTP IP Address: </b><span v-text="systemData.cluster_ntp_IP_address"></span></p>
            <p class="center-align"><b>Total Drive Raw Capacity: </b><span v-text="systemData.total_drive_raw_capacity"></span></p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div ref="san" class="loader"></div>
    </div>
</div>
</template>



<style>
body {
  overflow-x: hidden;
}

b {
font-weight: bold;
}

.bold-text {
font-weight: bold;
}
</style>

<script>
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import PoolInformation from './statistics/PoolInformation.vue';

export default {
  components: {
    PoolInformation,
    Bar,
  },

  data() {
    return {
      systemData: [],
      poolData: [],
      mdiskData: []
    }
  },

  computed: {
    computedSystemData() {
      return this.systemData;
    },
    computedPoolData() {
      return this.poolData;
    },
    computedMdiskData() {
      return this.mdiskData;
    }
  },

  mounted() {
    const loader = this.$loading.show({ 
      container: this.$refs['san'],
      color: '#a3f7bf',
      canCancel: false
    });
    this.$store.dispatch(`esxi/makeRequest`)
      .then((response) => {
        if(response){
            this.systemData = response.data;
            return this.$store.dispatch(`esxi/makePoolRequest`)
        }
      })
      .then((response) => {
        if(response){
          this.poolData = response.data;
          return this.$store.dispatch(`esxi/makeMdiskRequest`)
        }
      })
      .then((response) => {
        if(response){
          this.mdiskData = response.data;
        }
      })
      .catch((error) => {
        console.log(error);
        const message = error.response ? error.response.data.message : error.message;
        const options = {
          title: 'Error',
          message: message,
        };
        chrome.notifications.create('', options);
      })
      .finally(() => {
      loader.hide();
      });
  },
}
</script>