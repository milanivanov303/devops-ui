<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Builds by branch</span>
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Builds</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(build, index) in builds" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link :to="`/${module}/branches?branch=${encodeURIComponent(build.branch)}`">
              {{ build.branch }}
            </router-link>
          </td>
          <td>
            <span
              v-if="build.builds.building"
              class="new badge blue"
              data-badge-caption="building">{{ build.builds.building }}
            </span>
            <span
              v-if="build.builds.running"
              class="new badge green"
              data-badge-caption="running">{{ build.builds.running }}
            </span>
            <span
              v-if="build.builds.stopped"
              class="new badge red"
              data-badge-caption="stopped">{{ build.builds.stopped }}
            </span>
          </td>
        </tr>
        <tr v-if="builds.length === 0">
          <td colspan="3">There are no builds</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    module: String,
    loading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    builds() {
      return this.$store.getters['builds/getActiveGroupedByBranch'](this.module);
    },
  },

  watch: {
    loading(value) {
      if (value) {
        this.loader = this.$loading.show({ container: this.$el });
      }

      if (!value) {
        this.loader.hide();
      }
    },
  },
};
</script>
