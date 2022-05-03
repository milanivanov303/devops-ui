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
        <Column label="Title" :show="getTitle"/>
        <Column label="Description" :show="getDescription"/>
        <Column show="path"/>
        <Column show="paths" class="hidden"/>

        <template v-slot:top-actions-after="{ rows }">
          <button class="btn right" @click="downloadAll(rows)" :disabled="downloading">
            <i class="material-icons left">download</i>
            <span v-if="downloading">Downloading ...</span>
            <span v-else>Download</span>
          </button>
        </template>

        <template v-slot:actions-before="{ row }">
          <a class="btn btn-tiny" @click="showRawFile(row)">View</a>
          <a class="btn btn-tiny" @click="showReDocFile(row)">Re Doc</a>
        </template>
      </Table>

      <Modal
        v-if="showRawFileModal"
        class="fullscreen codemirror-modal"
        @close="showRawFileModal=false"
        @opened="initCodeMirror()"
      >
        <template slot="header">{{ file.path }}</template>
        <template slot="content">
          <textarea ref="codemirror" hidden v-model="content"></textarea>
        </template>
        <template slot="footer">
          <button class="waves-effect btn" type="button" @click="downloadRaw()">
            <i class="material-icons left">download</i>
            Download
          </button>
        </template>
      </Modal>

      <Modal v-if="showRedocModal" class="fullscreen" @close="showRedocModal=false">
        <template slot="header">{{ file.path }}</template>
        <template slot="content">
          <redoc-wrapper :spec-or-spec-url="file.content" :options="redocOptions"></redoc-wrapper>
        </template>
        <template slot="footer">
          <button class="btn" @click="downloadHtml([file.path])" :disabled="downloading">
            <i class="material-icons left">download</i>
            <span v-if="downloading">Downloading ...</span>
            <span v-else>Download</span>
          </button>
        </template>
      </Modal>
    </div>
</template>
<script>

import RedocWrapper from '@hnluu8/vue-redoc-wrapper';
import Modal from '@/components/Modal';
import codemirrorMixin from '@/components/documentation/codemirrorMixin';

export default {
  components: {
    Modal,
    RedocWrapper,
  },

  mixins: [
    codemirrorMixin,
  ],

  data() {
    return {
      files: [],
      file: {},
      showRawFileModal: false,
      showRedocModal: false,
      redocOptions: {
        showExtensions: true,
      },
      downloading: false,
    };
  },

  computed: {
    module() {
      return this.$route.params.module;
    },
    content() {
      return JSON.stringify(this.file.content, null, 2);
    },
  },

  methods: {
    getFiles() {
      const loader = this.$loading.show({ container: this.$refs.demos });

      this.$store.dispatch('documentation/getSpecs', {
        repo: 'specifications',
        branch: 'main',
        apis_dir: this.module,
      })
        .then((response) => {
          this.files = response.data;
          loader.hide();
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

    downloadRaw() {
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(this.content)}`);
      element.setAttribute('download', this.file.path);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    downloadHtml(files) {
      this.downloading = true;
      this.$store.dispatch('documentation/download', {
        repo: 'specifications',
        branch: 'main',
        apis_dir: this.module,
        files,
      })
        .finally(() => { this.downloading = false; });
    },

    downloadAll(files) {
      this.downloadHtml(files.map((file) => file.path));
    },
  },

  watch: {
    module() {
      this.getFiles();
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
  .search-input {
    padding-left: 20px;
    font-size: 14px;
  }
  .search-icon {
    top: 15px;
    left: 0;
  }
  .collapsible{
    border: 0;
  }
}
.codemirror-modal {
  .modal-content {
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
.actions {
  width: 200px;
}
table {
  tr {
    td {
      .btn {
        margin: 5px;
      }
    }
  }
}
</style>
