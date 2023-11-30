<template>
  <div class="row">
    <div class="col s12">
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>State</th>
          <th>OCi created on</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="compartment in compartments" :key="compartment.id">
          <td>{{ compartment.name }}</td>
          <td>{{ compartment.description }}</td>
          <td v-html="getStateLabel(compartment.state)"/>
          <td>{{ $date(compartment.oci_created).toHuman() }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    compartments() {
      return this.$store.state.esxi.ociCompartments || [];
    },
  },
  methods: {
    getCompartments() {
      const loader = this.$loading.show({ container: this.$el });
      const promise = this.$store.dispatch('esxi/getOciCompartments');

      promise
        .finally(() => loader.hide());
    },
    getStateLabel(state) {
      if (state === 'ACTIVE') {
        return `<span class="new badge green" data-badge-caption="">${state}</span>`;
      }
      if (state === 'DELETED') {
        return `<span class="new badge red" data-badge-caption="">${state}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${state}</span>`;
    },
  },
  mounted() {
    this.getCompartments();
  },
};
</script>
