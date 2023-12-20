<template>
  <div class="row">
    <div class="col s12">
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Key</th>
          <th>Home region</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="region in regions" :key="region.id">
          <td>{{ region.name }}</td>
          <td>{{ region.key }}</td>
          <td>{{ region.home_region }}</td>
          <td><span class="new badge" data-badge-caption="">{{ region.status }}</span></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    regions() {
      return this.$store.state.esxi.ociRegions || [];
    },
  },
  methods: {
    getRegions() {
      const loader = this.$loading.show({ container: this.$el });
      const promise = this.$store.dispatch('esxi/getOciRegions');

      promise
        .finally(() => loader.hide());
    },
    getStateLabel(state) {
      if (state === 'ACTIVE' || state === 'RUNNING') {
        return `<span class="new badge green" data-badge-caption="">${state}</span>`;
      }
      if (state === 'DELETED' || state === 'STOPPED') {
        return `<span class="new badge red" data-badge-caption="">${state}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${state}</span>`;
    },
  },
  mounted() {
    this.getRegions();
  },
};
</script>
