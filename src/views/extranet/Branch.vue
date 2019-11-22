<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
      </div>
    </div>
    <Builds :containers="containers"></Builds>
    <br>
    <Build />
  </div>
</template>

<script>
import Build from '@/components/extranet/Build';
import Builds from '@/components/extranet/Builds';

function initialState() {
  return {
    build: {
      container: null,
      showModal: false,
      removing: false,
      removed: false,
      error: null,
    },
  };
}

export default {
  components: {
    Build,
    Builds,
  },
  data() {
    return initialState();
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
    containers() {
      return this.$store.getters['extranet/getContainersByBranch'](this.branch);
    },
    host() {
      return this.$store.state.extranet.host;
    },
  },
  methods: {
    getDeployedBuildUrl(container) {
      const port = container.Ports.find(value => value.PrivatePort === 8591).PublicPort;
      return `http://${this.host}:${port}/${container.Labels.build}/`;
    },
    openRemoveBuildModal(container) {
      this.build = initialState().build;
      this.build.container = container;
      this.build.showModal = true;
    },
    removeBuild(container) {
      this.build.removing = true;
      this.$store.dispatch('extranet/removeBuild', container.Id)
        .then(() => {
          this.build.removed = true;
          this.$store.dispatch('extranet/getContainers');
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.build.error = 'You do not have insufficient rights to remove this build';
          } else {
            this.build.error = error;
          }
        })
        .finally(() => { this.build.removing = false; });
    },
  },
};
</script>
