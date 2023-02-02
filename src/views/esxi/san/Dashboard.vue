<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="card grey lighten-5">
        <div class="card-content center-align">
          <span class="card-title">System Data</span>
          <div v-if="systemData">
            <p class="center-align">Name: <span v-text="systemData.name"></span></p>
            <p class="center-align">Total Mdisk Capacity: <span v-text="systemData.total_mdisk_capacity"></span></p>
            <p class="center-align">Total Free Space: <span v-text="systemData.total_free_space"></span></p>
            <p class="center-align">Console IP: <span v-text="systemData.console_IP"></span></p>
            <p class="center-align">Code Level: <span v-text="systemData.code_level"></span></p>
            <p class="center-align">Cluster NTP IP Address: <span v-text="systemData.cluster_ntp_IP_address"></span></p>
            <p class="center-align">Total Drive Raw Capacity: <span v-text="systemData.total_drive_raw_capacity"></span></p>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col s12 m4" v-for="(pool, index) in poolData">
      <div class="card grey lighten-5">
        <div class="card-content center-align">
          <span class="card-title">{{ pool.name }}</span>
          <p class="center-align">Capacity: {{ pool.capacity }}</p>
          <p class="center-align">Used Capacity: {{ pool.used_capacity }}</p>
          <p class="center-align">Free Capacity: {{ pool.free_capacity }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="mdiskData" class="row">
    <div class="col s12 m12">
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
                <td class="center-align" v-text="mdisk.name"></td>
                <td class="center-align" v-text="mdisk.mdisk_grp_name"></td>
                <td class="center-align" v-text="mdisk.capacity"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  </div>
</div>
</template>

<style>
body {
  overflow-x: hidden;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      systemData: null,
      poolData: null,
      mdiskData: null
    }
  },
  mounted() {
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
      });
  },
}
</script>