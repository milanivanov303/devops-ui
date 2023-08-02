<template>
  <div class="row">
    <div class="col s12">
      <button
        v-if="$auth.can('imx_fe.create-builds')"
        class="btn"
        @click="open()">
        <i class="material-icons left">add</i> New build
      </button>

      <CreateImxFeBuild
        v-if="showModal"
        @close="close()"
        :branch="form.branch"
        :client="form.client"
        :form="form"
        :build="build"
        :branches="branches"
        :builds="builds"
        :isButtonDisabled="isButtonDisabled"
        class="right-sheet"
        @start="start()"
      ></CreateImxFeBuild>

    </div>
  </div>
</template>

<script>
import CreateImxFeBuild from '@/components/CreateImxFeBuild';
import EventBus from '@/event-bus';

function initialState() {
  return {
    showModal: false,
    form: {
      branch: null,
      client: null,
      build: null,
      endpoint: null,
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
    isButtonDisabled: false,
  };
}

export default {
  components: {
    CreateImxFeBuild,
  },

  props: {
    branch: String,
    client: String,
  },

  data() {
    return initialState();
  },

  computed: {
    branches() {
      return this.$store.state.imx_fe.branches;
    },
    builds() {
      return this.$store.getters['builds/getActiveByModule']('imx_be').filter((build) => build.status !== 'building');
    },
    endpoint() {
      if (!this.form.build || !this.form.build.details) {
        return null;
      }

      return this.form.build.details.url.replace(/\/+$/, '');
    },
    clients() {
      return this.$store.state.mmpi.projects.filter((pr) => pr.clnt_cvs_dir !== null);
    },
    clientKeyColumn() {
      return 'clnt_cvs_dir';
    },
  },

  watch: {
    endpoint(value) {
      this.form.endpoint = value.replace(/\/+$/, '');
    },
  },

  methods: {
    getData() {
      this.$store.dispatch('imx_fe/getBranches');
      this.$store.dispatch('builds/getActive');
      this.$store.dispatch('mmpi/getProjects');
    },

    open() {
      this.form = initialState().form;
      this.build = initialState().build;

      this.getData();

      this.showModal = true;
    },

    close() {
      this.showModal = false;
      this.isButtonDisabled = false;
    },

    start() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isButtonDisabled = true;
      this.$store
        .dispatch('imx_fe/startBuild', {
          branch: this.form.branch ? this.form.branch.name : this.branch,
          client: this.form.client[this.clientKeyColumn]
            ? this.form.client[this.clientKeyColumn]
            : this.form.client,
          build: this.form.build,
          endpoint: this.form.endpoint,
        })
        .then((response) => {
          this.build.status = 'running';
          this.build.summary = 'Build will start shortly ...';
          this.build.broadcast = response.data.broadcast;
          EventBus.$emit('build.created');
        })
        .catch((error) => {
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.build.error = 'You do not have insufficient rights to create build';
          } else {
            this.build.error = error;
          }
        })
        .finally(() => {
          this.build.started = true;
        });
    },
  },
};
</script>
