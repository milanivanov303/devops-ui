<template>
  <div class="extranet">
    <div class="row">
      <div class="col s12 l6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">My iMX FE Builds</span>
          <Builds :containers="userContainers" ></Builds>
        </div>
      </div>
    </div>
      <div class="col s12 l6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">iMX FE Builds By Branch</span>
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
                <router-link v-bind:to="'/imx-fe/branches/' + container.branch">
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
    </div>
  </div>
</template>

<script>
import Builds from './components/Builds';

export default {
  components: {
    Builds,
  },
  computed: {
    userContainers() {
      return this.$store.getters['imx_fe/getContainersByUser'](
        this.$auth.getUser().username,
      );
    },
    containersGroupedByBranch() {
      return this.$store.getters['imx_fe/getContainersGroupedByBranch']();
    },
  },
  methods: {
    getContainers() {
      this.$store.dispatch('imx_fe/getContainers');
    },
  },
  mounted() {
    this.getContainers();
  },
};
</script>
