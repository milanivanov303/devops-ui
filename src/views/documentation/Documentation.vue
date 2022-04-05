<template>
    <div class="data-table" ref="files">
      <Table
        :data="files"
        :add-btn="false"
        :export-btn="false"
        :view-btn="false"
        :edit-btn="false"
        :delete-btn="false"
      >
        <Column label="Title" :show="getTitle" width="20%"/>
        <Column label="Description" :show="getDescription" width="40%"/>
        <Column show="path" width="25%"/>

        <template v-slot:actions-before="{ row }">
          <a class="btn btn-tiny" @click="showRawFile(row)">View</a>
          <a class="btn btn-tiny" @click="showReDocFile(row)">Re Doc</a>
        </template>
      </Table>

      <Modal v-if="showRawFileModal" class="fullscreen" @close="showRawFileModal=false">
        <template slot="header">File {{ file.name }}</template>
        <template slot="content"><pre>{{ file.raw_content }}</pre></template>
      </Modal>

      <Modal v-if="showRedocModal" class="fullscreen" @close="showRedocModal=false">
        <template slot="header">File {{ file.name }}</template>
        <template slot="content">
          <redoc-wrapper :spec-or-spec-url="file.content"></redoc-wrapper>
        </template>
      </Modal>
    </div>
</template>
<script>

import yaml from 'js-yaml';
import RedocWrapper from '@hnluu8/vue-redoc-wrapper';

export default {
  components: {
    RedocWrapper,
  },

  data() {
    return {
      files: [],
      file: {},
      showRawFileModal: false,
      showRedocModal: false,
    };
  },

  methods: {
    getFiles() {
      const loader = this.$loading.show({ container: this.$refs.demos });

      this.$store.dispatch('documentation/getFiles')
        .then((response) => {
          const files = response.data.filter((spec) => spec.type === 'blob');

          const promises = [];
          files.forEach((file) => {
            promises.push(
              this.$store.dispatch('documentation/getRawFile', file)
                .then((response) => {
                  file.raw_content = response.data;
                  file.content = yaml.load(response.data);
                }),
            );
          });

          Promise.all(promises).then(() => {
            this.files = files;
            loader.hide();
          });
        });
    },

    getTitle(file) {
      if (!file.content) {
        return '';
      }
      return file.content.info.title;
    },

    getDescription(file) {
      if (!file.content) {
        return '';
      }
      return file.content.info.description;
    },

    showRawFile(file) {
      this.file = file;
      this.showRawFileModal = true;
    },

    showReDocFile(file) {
      this.file = file;
      this.showRedocModal = true;
    },
  },
  mounted() {
    this.getFiles();
  },
};
</script>

<style lang="scss" scoped>
table {
  td {
    .btn:first-child {
      margin-right: 10px;
    }
  }
}
</style>
