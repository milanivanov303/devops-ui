<template>
  <div class="row" ref="expiringComponents">
    <div class="col s12">
      <div class="data-table">
        <Table
          :data="expiringComponents"
          sort-by="project"
          sort-dir="asc"
          query-prefix="exp_"
          :noDataText="getNoDataText()"
          @export="exportExpiringComponents"
          :view-btn="false"
          :add-btn="false"
          :edit-btn="false"
          :delete-btn="false"
          ref="expiringComponentsTable"
        >
          <Column show="project"/>
          <Column show="instance"/>
          <Column show="component"/>
          <Column show="version"/>
          <Column label="Regular EOS date" :sortable="false" class="red-text"
                  show="regular_eos_date"/>
          <Column label="Extended EOS date" :sortable="false" class="red-text"
                  show="extended_eos_date"/>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    expiringComponents() {
      return this.$store.state.esxi.expiringComponents.map((component) => {
        component.regular_eos_date = component.regular_eos_date
          ? this.$date(component.regular_eos_date).toHuman('dd LLL yyyy') : '';
        component.extended_eos_date = component.extended_eos_date
          ? this.$date(component.extended_eos_date).toHuman('dd LLL yyyy') : '';
        return component;
      });
    },
  },

  methods: {
    getNoDataText() {
      if (this.$store.state.esxi.expiringComponents.length === 0) {
        return 'There are no expiring components.';
      }
      return null;
    },

    getExpiringComponents() {
      const loader = this.$loading.show({ container: this.$refs.expiringComponents });

      this.$store.dispatch('esxi/getExpiringComponents')
        .then(() => {
          loader.hide();
        });
    },

    exportExpiringComponents() {
      const payload = this.$refs.expiringComponentsTable.getFilteredRows(
        this.$refs.expiringComponentsTable.data,
      );
      this.$store.dispatch('esxi/getExpiringComponentsExport', payload);
    },
  },

  mounted() {
    this.getExpiringComponents();
  },
};
</script>
