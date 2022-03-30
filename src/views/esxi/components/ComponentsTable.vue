<template>
  <div ref="components">
    <div class="data-table">
      <Table
        :data="components"
        sort-by="name"
        sort-dir="asc"
        query-prefix="components_"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
      >
        <Column show="name"/>
        <Column show="version"/>
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    components: {
      type: Array,
    },
  },
};
</script>
