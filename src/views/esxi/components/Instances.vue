<template>
  <div>
    <div class="data-table">
      <Table
        :data="instances"
        :export-btn="false"
        :view-btn="true"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
      >
        <Column
          label="ID"
          :show="(instance) => instance.id"
        />
        <Column
          label="Name"
          :show="(instance) => instance.name"
        />
        <Column
          label="Home path"
          :show="(instance) => instance.home_path"
        />
        <Column
          label="Patch config path"
          :show="(instance) => instance.patch_conf"
        />
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
