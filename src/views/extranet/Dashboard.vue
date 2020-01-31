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
                  <router-link v-bind:to="'/extranet/branches/' + encodeURIComponent(container.branch)">
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
    <router-view v-else :key="$route.path"/>
  </div>
</template>

<script>
import Builds from '@/components/extranet/Builds';
import Preloader from '@/components/partials/Preloader';


export default {
  components: {
    Builds,
    Preloader,
  },
  computed: {
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
  },
  mounted() {
    this.getContainers();
  },
};
</script>
