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
        <Column label="API Title" :show="spec => getTitle(spec)" width="40%"/>
        <Column
          label="Screens - API documentation"
          :show="spec => getScreensTitle(spec)"
        />
        <Column label="File" :show="spec => getApiFile(spec)"/>
        <template v-slot:actions-before="{ row }">
          <a class="btn btn-tiny" @click="$emit('show', row.file, 'raml')">
            RAML
          </a>
          <a class="btn btn-tiny" @click="$emit('show', row.file, 'openapi')">
            OpenAPI
          </a>
          <a class="btn btn-tiny" @click="$emit('show', row.file, 'api-console')">
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
    getTitle(api) {
      if (!api.title) {
        return `<span class="red-text">${api.error}</span>`;
      }
      return api.title;
    },

    getScreensTitle(api) {
      if (api.documentation) {
        let screens = '';
        api.documentation.forEach((i) => {
          screens = `${screens.concat(i.title)}<br>`;
        });
        return screens;
      }
      return '<span class="new badge red" data-badge-caption="">ERROR</span>';
    },

    getApiFile(api) {
      if (api.documentation) {
        return api.file;
      }
      return `<span class="red-text">${api.file}</span>`;
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
