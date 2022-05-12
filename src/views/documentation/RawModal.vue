<template>
    <Modal
      class="fullscreen codemirror-modal"
      @close="$emit('close')"
      @opened="initCodeMirror()"
    >
      <template slot="header">{{ file.path }}</template>
      <template slot="content">
        <textarea ref="codemirror" hidden v-model="content"></textarea>
      </template>
      <template slot="footer">
        <button class="waves-effect btn" type="button" @click="download()">
          <i class="material-icons left">download</i>
          Download
        </button>
      </template>
    </Modal>
</template>
<script>

import Modal from '@/components/Modal';
import codemirrorMixin from '@/components/documentation/codemirrorMixin';
import yaml from 'js-yaml';

export default {
  components: {
    Modal,
  },

  mixins: [
    codemirrorMixin,
  ],

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
    };
  },

  computed: {
    content() {
      return yaml.dump(this.file.content);
    },
  },

  methods: {
    download() {
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(this.content)}`);
      element.setAttribute('download', this.file.path);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
  },
};
</script>
