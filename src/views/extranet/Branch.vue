<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ branch }}</h4>
      </div>
    </div>

    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>Url</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(container, index) in containers" :key="index">
        <td>{{ index+1 }}</td>
        <td>{{ container.Labels.build }}</td>
        <td>{{ container.Status }}</td>
        <td>
          <a :href="getDeployedBuildUrl(container)" target="_blank">
            <i class="material-icons">cast_connected</i>
          </a>
        </td>
        <td>
          <button class="btn-small red" title="Remove build" @click="openRemoveBuildModal(container)">
            <i class="material-icons left">delete</i> Remove
          </button>
        </td>
      </tr>
      <tr v-if="containers.length === 0">
        <td colspan="4">There are no running builds for this branch</td>
      </tr>
      </tbody>
    </table>

    <Modal v-if="build.showModal" @close="build.showModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="build.removing" class="center" >
          <Preloader class="big"></Preloader>
          <p>Removing build <b>{{ build.container.Labels.build }}</b> ... </p>
        </div>
        <div v-else-if="build.removed" class="center" >
          <i class="material-icons large green-text">check_circle_outline</i>
          <p>Build was removed successfully</p>
        </div>
        <div v-else-if="build.error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ build.error }}</p>
        </div>
        <div v-else>
          Are you sure you what to remove <b>{{ build.container.Labels.build }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button v-if="!build.removing && !build.removed" class="waves-effect btn" @click="removeBuild(build.container)">Remove</button>
      </template>
    </Modal>

    <br>
    <Build />
  </div>
</template>

<script>
  import Build from '@/components/extranet/Build';
  import Modal from '@/components/partials/Modal';
  import Preloader from "@/components/partials/Preloader";

  function initialState() {
    return {
      build: {
        container: null,
        showModal: false,
        removing: false,
        removed: false,
        error: null,
      }
    };
  }

  export default {
    components: {
      Build,
      Modal,
      Preloader,
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
        this.build = initialState()['build'];
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
          .finally(() => this.build.removing = false);
      },
    },
  };
</script>
