<template>
  <Modal
    class="fullscreen"
    @close="$emit('close')"
  >
    <template slot="header">{{ file.path }}</template>
    <template slot="content">
      <redoc-wrapper :spec-or-spec-url="file.content" :options="redocOptions"></redoc-wrapper>
    </template>
    <template slot="footer">
      <button class="btn" @click="download()" :disabled="downloading">
        <i class="material-icons left">download</i>
        <span v-if="downloading">Downloading ...</span>
        <span v-else>Download</span>
      </button>
    </template>
  </Modal>
</template>
<script>

import Modal from '@/components/Modal';
import RedocWrapper from '@hnluu8/vue-redoc-wrapper';

export default {
  components: {
    Modal,
    RedocWrapper,
  },

  props: {
    file: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  data() {
    return {
      downloading: false,
      redocOptions: {
        showExtensions: true,
      },
    };
  },

  methods: {
    download() {
      const files = [this.file.path];

      this.downloading = true;
      this.$store.dispatch('documentation/download', {
        repo: this.repo,
        branch: this.branch,
        apis_dir: this.module,
        files,
      })
        .finally(() => { this.downloading = false; });
    },
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
