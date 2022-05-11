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
          <Select
            class="branches left"
            :options="branches"
            displayed="name"
            :default-option="false"
            v-model="branch"
          />
          <button class="btn btn-small right" @click="downloadAll(rows)" :disabled="downloading">
            <i class="material-icons left">download</i>
            <span v-if="downloading">Downloading ...</span>
            <span v-else>Download</span>
          </button>
        </template>

        <template v-slot:actions-before="{ row }">
          <a class="btn btn-tiny" @click="openRawModal(row)">View</a>
          <a class="btn btn-tiny" @click="openRedocModal(row)">Re Doc</a>
        </template>
      </Table>

      <Modal
        v-if="showRawModal"
        class="fullscreen codemirror-modal"
        @close="closeRawModal()"
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

      <Modal
        v-if="showRedocModal"
        class="fullscreen"
        @close="closeRedocModal()"
      >
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
      repo: 'specifications',
      branches: [],
      branch: this.$route.query.branch || 'main',
      files: [],
      file: {},
      showRawModal: false,
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
    getBranches() {
      const loader = this.$loading.show({ container: this.$refs.files });

      this.$store.dispatch('documentation/getBranches', {
        repo: this.repo,
      })
        .then((response) => {
          this.branches = response.data.map((branch) => branch.name);
        })
        .finally(() => { loader.hide(); });
    },

    getFiles() {
      const loader = this.$loading.show({ container: this.$refs.files });

      this.$store.dispatch('documentation/getSpecs', {
        repo: this.repo,
        branch: this.branch,
        apis_dir: this.module,
      })
        .then((response) => {
          this.files = response.data;

          if (!this.$route.query.file) {
            return;
          }

          const file = this.files.find((file) => file.path === this.$route.query.file);

          if (file) {
            if (this.$route.query.action === 'raw') {
              this.openRawModal(file);
              return;
            }
            this.openRedocModal(file);
          }
        })
        .finally(() => { loader.hide(); });
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

    openRawModal(file) {
      this.file = file;
      this.showRawModal = true;

      const query = {
        branch: this.branch,
        file: this.file.path,
        action: 'raw',
      };

      this.$router.push({
        path: `/documentation/${this.module}`,
        query: { ...this.$route.query, ...query },
      });
    },

    closeRawModal() {
      this.file = {};
      this.showRawModal = false;

      const query = { ...this.$route.query };

      delete query.file;
      delete query.action;

      this.$router.push({
        path: `/documentation/${this.module}`,
        query,
      });
    },

    openRedocModal(file) {
      this.file = file;
      this.showRedocModal = true;

      const query = {
        branch: this.branch,
        file: this.file.path,
        action: 'redoc',
      };

      this.$router.push({
        path: `/documentation/${this.module}`,
        query: { ...this.$route.query, ...query },
      });
    },

    closeRedocModal() {
      this.file = {};
      this.showRedocModal = false;

      const query = { ...this.$route.query };

      delete query.file;
      delete query.action;

      this.$router.push({
        path: `/documentation/${this.module}`,
        query,
      });
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
        repo: this.repo,
        branch: this.branch,
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
    branch() {
      this.$router.push({
        path: `/documentation/${this.module}`,
        query: { branch: this.branch },
      });

      this.getFiles();
    },
  },

  mounted() {
    this.getBranches();
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
