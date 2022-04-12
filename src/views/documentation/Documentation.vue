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
        <Column show="paths" class="hidden"/>

        <template v-slot:actions-before="{ row }">
          <a class="btn btn-tiny" @click="showRawFile(row)">View</a>
          <a class="btn btn-tiny" @click="showReDocFile(row)">Re Doc</a>
        </template>
      </Table>

      <Modal v-if="showRawFileModal" class="fullscreen" @close="showRawFileModal=false">
        <template slot="header">{{ file.path }}</template>
        <template slot="content"><pre>{{ file.content }}</pre></template>
      </Modal>

      <Modal v-if="showRedocModal" class="fullscreen" @close="showRedocModal=false">
        <template slot="header">{{ file.path }}</template>
        <template slot="content">
          <redoc-wrapper :spec-or-spec-url="file.content" :options="redocOptions"></redoc-wrapper>
        </template>
      </Modal>
    </div>
</template>
<script>

import yaml from 'js-yaml';
import RedocWrapper from '@hnluu8/vue-redoc-wrapper';
import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
    RedocWrapper,
  },

  data() {
    return {
      files: [],
      file: {},
      showRawFileModal: false,
      showRedocModal: false,
      redocOptions: {
        showExtensions: true,
      },
    };
  },

  methods: {
    getFiles() {
      const loader = this.$loading.show({ container: this.$refs.demos });

      this.$store.dispatch('documentation/getSpecs', { repo: 'specifications', branch: 'main' })
        .then((response) => {
          this.files = response.data;
          loader.hide();
        });
      return;

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

<style lang="scss">
#redoc-container {
  h3 {
    font-size: 1rem !important;
  }
  .search-icon {
    display: none;
  }
  .collapsible{
    border: 0px;
  }
}
</style>

<style lang="scss" scoped>
table {
  td {
    .btn:first-child {
      margin-right: 10px;
    }
  }
}
</style>
