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
  </div>
</template>

<script>
import Builds from '@/components/extranet/Builds';


export default {
  components: {
    Builds,
  },
  data() {
    return {
      loaded: false,
    };
  },
  computed: {
    userContainers() {
      this.loaded = true;
      return this.$store.getters['extranet/getContainersByUser'](
        this.$auth.getUser().username,
      );
    },
    containersGroupedByBranch() {
      this.loaded = true;
      return this.$store.getters['extranet/getContainersGroupedByBranch']();
    },
    extranetContainersCount() {
      return this.$store.state.extranet.containers.length;
    }
  },
  mounted() {
    const loader = this.$loading.show({ container: this.$el });
    const payload = {
      orders: JSON.stringify({ id: 'desc' }),
    };
    this.$store.dispatch('extranet/getContainers')
    .then(() => {
      loader.hide();
    });
  },
};
</script>
