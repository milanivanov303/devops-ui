<template>
  <div class="row">
    <div class="col s12">
      <Table
        :data="specs"
        sort-by="title"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
        queryPrefix="docs_"
      >
        <Column label="API Title" name="title" :show="spec => getTitle(spec)" width="20%"/>
        <Column label="Screens" name="screens" :show="spec => getScreens(spec)" width="20%"/>
        <Column show="path" width="40%"/>
        <Column label="Paths" :show="spec => getPaths(spec)" class="hidden"/>
        <template v-slot:actions-before="{ row }">
          <a class="btn btn-tiny" @click="$emit('show', row.path, 'raml')">
            RAML
          </a>
          <a class="btn btn-tiny" @click="$emit('show', row.path, 'openapi')">
            OpenAPI
          </a>
          <a class="btn btn-tiny" @click="$emit('show', row.path, 'api-console')">
            APIConsole
          </a>
        </template>
      </Table>

    </div>
  </div>
</template>

<script>

export default {
  props: {
    specs: Array,
  },

  methods: {
    getTitle(spec) {
      if (!spec.title) {
        return `<span class="red-text">${spec.error}</span>`;
      }
      return spec.title;
    },

    getScreens(spec) {
      if (!spec.documentation) {
        return '';
      }

      let screens = '';
      spec.documentation.forEach((i) => {
        screens += `${i.title}<br>`;
      });
      return screens;
    },

    getPaths(spec) {
      if (!spec.paths) {
        return '';
      }

      let paths = '';
      spec.paths.forEach((path) => {
        paths += `${path}<br>`;
      });

      return paths;
    },
  },
};
</script>

<style lang="scss" scoped>
  table {
    .btn {
      margin: 0 5px;
    }
  }
</style>
