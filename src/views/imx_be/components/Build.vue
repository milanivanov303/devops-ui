<template>
  <div class="row">
    <div class="col s12">
      <button
        v-if="$auth.can('imx_be.create-builds')"
        class="btn"
        @click="open()">
        <i class="material-icons left">add</i> New build
      </button>

      <CreateImxBeBuild
        v-if="showModal"
        @close="close()"
        :branch="form.branch"
        :form="form"
        :build="build"
        :branches="branches"
        :instances="instances"
        :isButtonDisabled="isButtonDisabled"
        class="right-sheet"
        @start="start()"
      ></CreateImxBeBuild>

    </div>
  </div>
</template>

<script>

import CreateImxBeBuild from '@/components/CreateImxBeBuild';

function initialState() {
  return {
    isButtonDisabled: false,
    showModal: false,
    form: {
      branch: null,
      instance: null,
      ttsKey: '',
    },
    build: {
      started: false,
      status: '',
      summary: '',
      progress: null,
      log: '',
      error: null,
    },
  };
}

export default {
  components: {
    CreateImxBeBuild,
  },

  data() {
    return initialState();
  },

  computed: {
    branches() {
      return this.$store.state.imx_be.branches;
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
  },

  methods: {
    getData() {
      this.$store.dispatch('imx_be/getBranches');
      this.$store.dispatch('mmpi/getInstances');
    },

    open() {
      this.build = initialState().build;
      this.getData();
      this.showModal = true;
    },

    close() {
      this.showModal = false;
      this.isButtonDisabled = false;
    },
  },
};
</script>
