<template>
  <div class="row">
    <div class="col s12">
      <button
        v-if="$auth.can('imx_fe.create-builds')"
        class="btn"
        @click="openBeBuild()">
        <i class="material-icons left">add</i> New BE build
      </button>
      <button
        v-if="$auth.can('imx_be.create-builds')"
        class="btn"
        @click="openFeBuild()"
        style="margin-left: 10px;">
        <i class="material-icons left">add</i> New FE build
      </button>

      <CreateImxFeBuild
        v-if="showFeModal"
        @close="closeFeBuild()"
        :branch="feForm.branch"
        :client="feForm.client"
        :form="feForm"
        :build="feBuild"
        :branches="branches"
        :builds="feBuilds"
        :isButtonDisabled="isFeButtonDisabled"
        class="right-sheet"
        @start="startFeBuild()"
      ></CreateImxFeBuild>

      <CreateImxBeBuild
        v-if="showBeModal"
        @close="closeBeBuild()"
        :branch="beForm.branch"
        :form="beForm"
        :build="beBuild"
        :branches="branches"
        :instances="instances"
        :isButtonDisabled="isBeButtonDisabled"
        class="right-sheet"
        @start="startBeBuild()"
      ></CreateImxBeBuild>
    </div>
  </div>
</template>

<script>
import CreateImxFeBuild from '@/components/CreateImxFeBuild';
import CreateImxBeBuild from '@/components/CreateImxBeBuild';
import EventBus from '@/event-bus';

export default {
  components: {
    CreateImxFeBuild,
    CreateImxBeBuild,
  },

  data() {
    return {
      showFeModal: false,
      showBeModal: false,
      feForm: {
        branch: null,
        client: null,
        build: null,
        endpoint: null,
      },
      beForm: {
        branch: null,
        instance: null,
        ttsKey: '',
      },
      feBuild: {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      },
      beBuild: {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      },
      isFeButtonDisabled: false,
      isBeButtonDisabled: false,
    };
  },

  computed: {
    branches() {
      return this.$store.state.imx_fe.branches;
    },
    feBuilds() {
      return this.$store.getters['builds/getActiveByModule']('imx_be').filter((build) => build.status !== 'building');
    },
    instances() {
      return this.$store.state.mmpi.instances;
    },
  },

  methods: {
    getData() {
      this.$store.dispatch('imx_fe/getBranches');
      this.$store.dispatch('imx_be/getBranches');
      this.$store.dispatch('builds/getActive');
      this.$store.dispatch('mmpi/getProjects');
      this.$store.dispatch('mmpi/getInstances');
    },

    openFeBuild() {
      this.feForm = {
        branch: null,
        client: null,
        build: null,
        endpoint: null,
      };
      this.feBuild = {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      };

      this.getData();

      this.showFeModal = true;
    },

    closeFeBuild() {
      this.showFeModal = false;
      this.isFeButtonDisabled = false;
    },

    startFeBuild() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isFeButtonDisabled = true;
      this.$store
        .dispatch('imx_fe/startBuild', {
          branch: this.feForm.branch ? this.feForm.branch.name : this.branch,
          client: this.feForm.client[this.clientKeyColumn]
            ? this.feForm.client[this.clientKeyColumn]
            : this.feForm.client,
          build: this.feForm.build,
          endpoint: this.feForm.endpoint,
        })
        .then((response) => {
          this.feBuild.status = 'running';
          this.feBuild.summary = 'Build will start shortly ...';
          this.feBuild.broadcast = response.data.broadcast;
          EventBus.$emit('build.created');
        })
        .catch((error) => {
          this.feBuild.status = 'failed';
          this.feBuild.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.feBuild.error = 'You do not have insufficient rights to create build';
          } else {
            this.feBuild.error = error;
          }
        })
        .finally(() => {
          this.feBuild.started = true;
        });
    },

    openBeBuild() {
      this.beForm = {
        branch: null,
        instance: null,
        ttsKey: '',
      };
      this.beBuild = {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      };

      this.getData();

      this.showBeModal = true;
    },

    closeBeBuild() {
      this.showBeModal = false;
      this.isBeButtonDisabled = false;
    },

    startBeBuild() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.isBeButtonDisabled = true;
      this.$store
        .dispatch('imx_be/startBuild', {
          branch: this.beForm.branch ? this.beForm.branch.name : this.branch,
          instance: this.beForm.instance,
          ttsKey: this.beForm.ttsKey,
        })
        .then((response) => {
          this.beBuild.status = 'running';
          this.beBuild.summary = 'Build will start shortly ...';
          this.beBuild.broadcast = response.data.broadcast;
          EventBus.$emit('build.created');
        })
        .catch((error) => {
          this.beBuild.status = 'failed';
          this.beBuild.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.beBuild.error = 'You do not have insufficient rights to create build';
          } else {
            this.beBuild.error = error;
          }
        })
        .finally(() => {
          this.beBuild.started = true;
        });
    },
  },
};
</script>
