<template>
  <div class="row">
    <div class="col s12">
      <Error v-if="error || validationError" :error="error" :validation-error="validationError"/>
      <textarea ref="codemirror" hidden></textarea>
    </div>
  </div>
</template>

<script>
import amfMixin from './amfMixin';
import codemirrorMixin from './codemirrorMixin';
import Error from './Error';

export default {
  components: {
    Error,
  },

  mixins: [
    amfMixin,
    codemirrorMixin,
  ],

  async mounted() {
    const loader = this.$loading.show({ container: this.$el });
    const raml = await this.getRaml();
    loader.hide();

    if (raml) {
      this.initCodeMirror(raml);
    }
  },
};
</script>
