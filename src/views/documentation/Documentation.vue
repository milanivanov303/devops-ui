<template>
  <div class="documentation" ref="files">
    <div class="row">
      <TextInput class="col s12 m8" label="Search" v-model="search"/>
      <div class="col s12 m4">
        <Select
            class="branches"
            :options="branches"
            displayed="name"
            :default-option="false"
            v-model="branch"
        />
      </div>
    </div>
    <Table
      :data="filteredFiles"
      :add-btn="false"
      :export-btn="false"
      :view-btn="false"
      :edit-btn="false"
      :delete-btn="false"
      :searchField="false"
    >
      <Column label="Title" :show="getTitle"/>
      <Column label="Description" :show="getDescription"/>
      <Column show="path"/>
      <Column show="paths" class="hidden"/>
      <template v-slot:top-actions-after="{ rows }">
        <div class="row">
          <div class="col s12 m6">
            <button class="btn btn-small right" @click="download(rows)" :disabled="downloading">
              <i class="material-icons left">download</i>
              <span v-if="downloading">Downloading ...</span>
              <span v-else>Download</span>
            </button>
            <button class="btn btn-small right" @click="excelExport()" :disabled="exporting">
              <i class="material-icons left">assignment</i>
              <span v-if="exporting">Exporting ...</span>
              <span v-else>Excel Export</span>
            </button>
          </div>
        </div>
      </template>
      <template v-slot:actions-before="{ row }">
        <a class="btn btn-tiny" @click="openRawModal(row)">View</a>
        <a class="btn btn-tiny" @click="openRedocModal(row)">Re Doc</a>
      </template>
    </Table>
    <RawModal v-if="showRawModal" :file="file" @close="closeRawModal"/>
    <RedocModal
      v-if="showRedocModal"
      :file="file"
      :downloading="downloading"
      @close="closeRedocModal"
      @download="download"
    />
  </div>
</template>
<script>

import RawModal from '@/views/documentation/RawModal';
import RedocModal from '@/views/documentation/RedocModal';

export default {
  components: {
    RawModal,
    RedocModal,
  },

  data() {
    return {
      repo: 'specifications',
      branches: [],
      branch: this.$route.query.branch || 'main',
      search: '',
      filteredFiles: [],
      files: [],
      file: {},
      showRawModal: false,
      showRedocModal: false,
      downloading: false,
      exporting: false,
    };
  },

  computed: {
    module() {
      return this.$route.params.module;
    },
  },

  methods: {
    getBranches() {
      this.$store.dispatch('documentation/getBranches', {
        repo: this.repo,
      })
        .then((response) => {
          this.branches = response.data.map((branch) => branch.name);
        });
    },

    getFiles() {
      const loader = this.$loading.show({ container: this.$refs.files });

      this.$store.dispatch('documentation/getSpecs', {
        repo: this.repo,
        branch: this.branch,
        apis_dir: this.module,
      })
        .then((response) => {
          this.files = response.data.filter((file) => {
            if (file.path.endsWith('.yaml') || file.path.endsWith('.yml')) {
              return true;
            }
            return false;
          });

          if (!this.$route.query.file) {
            this.filteredFiles = this.files;
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
          this.filteredFiles = this.files;
        })
        .catch((error) => {
          this.$M.toast({ html: `Error: ${error.response.status} ${error.response.statusText}`, classes: 'toast-fail' });
        })
        .finally(() => { loader.hide(); });
    },

    getTitle(file) {
      if (!file.content || !file.content.info) {
        return '';
      }
      return file.content.info.title;
    },

    getDescription(file) {
      if (!file.content || !file.content.info) {
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

    download(rows) {
      const files = rows.map((file) => file.path);

      this.downloading = true;
      this.$store.dispatch('documentation/download', {
        repo: this.repo,
        branch: this.branch,
        apis_dir: this.module,
        files,
      })
        .finally(() => { this.downloading = false; });
    },
    excelExport() {
      this.exporting = true;
      this.$store.dispatch('documentation/export', {
        repo: this.repo,
        branch: this.branch,
        apis_dir: this.module,
      })
        .finally(() => { this.exporting = false; });
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
    search(value) {
      this.filteredFiles = this.files.filter((file) => {
        if (JSON.stringify(file.content).toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
        return false;
      });
    },
  },

  mounted() {
    this.getBranches();
    this.getFiles();
  },
};
</script>

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
