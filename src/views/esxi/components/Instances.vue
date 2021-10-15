<template>
  <div>
    <div class="data-table">
      <Table
        :data="instances"
        sort-by="id"
        sort-dir="asc"
        query-prefix="instances_"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
      >
        <Column label="Id" name="id" :show="(instance) => instance.id"/>
        <Column label="Name" name="name" :show="(instance) => instance.name"/>
        <Column label="Home path" name="home-path" :show="(instance) => instance.home_path"/>
        <Column label="Patch config path" name="patch-conf"
          :show="(instance) => instance.patch_conf"/>
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    instances: Array,
  },
};
</script>
