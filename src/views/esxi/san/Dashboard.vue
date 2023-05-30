<template>
  <div class="row" ref="san">
    <div class="col s12">
      <div class="card">
        <div class="card-content" >
          <span class="card-title center">
            {{ san.system ? san.system.name.toUpperCase() : 'IBMSAN' }}
          </span>
          <p class="center">IBM Storage Area Network</p>
          <Alert v-if="san.error" :msg="san.error"/>
        </div>
      </div>
    </div>
    <div class="col s12 l3">
      <div class="card" v-if="san.mdisk && san.mdisk.length > 0">
        <div class="card-content">
                <span class="card-title">
                  Mdisk Data
                </span>
          <table>
            <thead>
            <tr>
              <th class="center-align">Name</th>
              <th class="center-align">Mdisk Group Name</th>
              <th class="center-align">Capacity</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(mdisk, id) in san.mdisk" v-bind:key="id">
              <td class="center-align bold-text" v-text="mdisk.name"></td>
              <td class="center-align bold-text" v-text="mdisk.mdisk_grp_name"></td>
              <td class="center-align bold-text" v-text="mdisk.capacity"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col s12 l3">
      <div class="card" v-if="san.mdiskgrp">
        <div class="card-content">
          <span class="card-title">Capacity by pools (in TB)</span>
          <pool-information :poolData="san.mdiskgrp"/>
        </div>
      </div>
    </div>
    <div class="col s12 l3">
      <div class="card" v-if="san.system">
        <div class="card-content">
          <span class="card-title">System Data</span>
          <div>
            <p><b>Total Mdisk Capacity: </b><span>{{ san.system.total_mdisk_capacity }}</span></p>
            <p><b>Total Free Space: </b><span>{{ san.system.total_free_space }}</span></p>
            <p><b>Console IP: </b><span>{{ san.system.console_IP }}</span></p>
            <p><b>Code Level: </b><span>{{ san.system.code_level }}</span></p>
            <p><b>Cluster NTP IP Address: </b>
              <span>{{ san.system.cluster_ntp_IP_address }}</span>
            </p>
            <p><b>Total Drive Raw Capacity: </b>
              <span>{{ san.system.total_drive_raw_capacity }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PoolInformation from './statistics/PoolInformation';

export default {
  components: {
    PoolInformation,
  },

  computed: {
    san() {
      return this.$store.state.esxi.san || null;
    },
  },
  methods: {
    loadSanData() {
      const loader = this.$loading.show({ container: this.$refs.san });

      const promise = this.$store.dispatch('esxi/getSanData');
      promise
        .catch((error) => this.$M.toast({ html: error, classes: 'toast-fail' }))
        .finally(() => loader.hide());
    },
  },

  mounted() {
    this.loadSanData();
  },
};
</script>
