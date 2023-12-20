<template>
  <div class="row">
    <div class="col s12">
      <Table
          :data="instances"
          sort-by="name"
          sort-dir="asc"
          :view-btn="false"
          :export-btn="false"
          :add-btn="false"
          :edit-btn="false"
          :delete-btn="false"
      >
        <Column show="name"/>
        <Column label="Compartment" :show="(instance) => instance.compartment.name"/>
        <Column show="region"/>
        <Column show="shape"/>
        <Column show="ocpu"/>
        <Column show="memory_gb"/>
        <Column show="processor"/>
        <Column label="State" :show="(instance) => getStateLabel(instance.state)"/>
        <Column label="Created on" :show="(instance) => $date(instance.oci_created).toHuman()"/>
      </Table>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    instances() {
      return this.$store.state.esxi.ociInstances || [];
    },
  },
  methods: {
    getInstances() {
      const loader = this.$loading.show({ container: this.$el });
      const promise = this.$store.dispatch('esxi/getOciInstances');

      promise
        .finally(() => loader.hide());
    },
    getStateLabel(state) {
      if (state === 'RUNNING') {
        return `<span class="new badge green" data-badge-caption="">${state}</span>`;
      }
      if (state === 'STOPPED') {
        return `<span class="new badge red" data-badge-caption="">${state}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${state}</span>`;
    },
  },
  mounted() {
    this.getInstances();
  },
};
</script>
