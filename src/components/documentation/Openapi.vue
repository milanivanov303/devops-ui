<template>
  <div class="row">
    <div class="col s12">
      <textarea v-if="!error" ref="codemirror" hidden></textarea>
    </div>
  </div>
</template>

<script>

import amfMixin from './amfMixin';
import codemirrorMixin from './codemirrorMixin';

export default {
  mixins: [
    amfMixin,
    codemirrorMixin,
  ],

  async mounted() {
    const loader = this.$loading.show({ container: this.$el });
    const openapi = await this.getOpenapi();
    loader.hide();

    this.initCodeMirror(openapi);
  },
};
</script>
