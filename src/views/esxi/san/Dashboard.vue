<template>
<div ref="san">
    <div class="col s12 m3" v-if="mdiskData.length > 0">
      <div >
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
    <div class="col s12 m6" v-if="poolData.length > 0">
      <div class="col s12">
        <div class="card grey lighten-5">
          <div class="card-content center-align">
            <span class="card-title">Capacity by pools (in TB)</span>
            <pool-information :poolData="poolData"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col s12 m3" v-if="systemData !== null">
      <div class="card grey lighten-5 system-data-card" v-if="systemData">
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

  computed: {
    systemData() {
      return this.$store.state.esxi.systemData || null;
    },
    poolData() {
      return this.$store.state.esxi.poolData || [];
    },
    mdiskData() {
      return this.$store.state.esxi.mdiskData || [];
    },
},

  mounted() {
  const loader = this.$loading.show({ 
    container: this.$refs['san'],
    canCancel: false
  });
  this.$store.dispatch(`esxi/makeSystemDataRequest`)
    .catch((error) => {
      this.$M.toast({ html: 'Error fetching system data', classes: 'toast-fail' });
    })
    .then(() => {
      return this.$store.dispatch(`esxi/makePoolRequest`)
    })
    .catch((error) => {
      this.$M.toast({ html: 'Error fetching pool data', classes: 'toast-fail' });
    })
    .then(() => {
      return this.$store.dispatch(`esxi/makeMdiskRequest`)
    })
    .catch((error) => {
      this.$M.toast({ html: 'Error fetching system data', classes: 'toast-fail' });
    })
    .finally(() => {
      loader.hide();
    });
},

}
</script>