<template>
  <div>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>Created By</th>
        <th>Url</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(container, index) in containers" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ container.Labels.build }}</td>
        <td>{{ container.Status }}</td>
        <td>{{ container.Labels.username }}</td>
        <td>
          <a
            v-if="container.State === 'running'"
            :href="getDeployedBuildUrl(container)"
            target="_blank"
          >
            <i class="material-icons">cast_connected</i>
          </a>
        </td>
        <td>
          <a @click="openBuildInfoModal(container)"          >
            <i class="material-icons">description</i>
          </a>
        </td>
        <td>
          <button
            v-if="
              $auth.can('extranet.remove-builds') ||
              ($auth.getUser().username === container.Labels.username)
            "
            class="btn-small red"
            title="Remove build"
            @click="openRemoveBuildModal(container)"
          >
            <i class="material-icons left">delete</i> Remove
          </button>
        </td>
      </tr>
      <tr v-if="containers.length === 0">
        <td colspan="6">There are no builds yet</td>
      </tr>
      </tbody>
    </table>

    <Modal v-if="showInfoModal" @close="showInfoModal = false" class="right-sheet">
      <template v-slot:header>{{ container.Labels.build }}</template>
        <template v-slot:content>
          <div  class="col s12 l11">
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">business</i>
                <input
                  class="readonly"
                  type="text"
                  id="branch"
                  v-model="selectedBuild.branch">
                <label :class="{active: selectedBuild.branch}" for="branch">Branch</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">dynamic_feed</i>
                <input
                  class="readonly"
                  type="text"
                  id="instance"
                  v-model="selectedBuild.instance">
                <label :class="{active: selectedBuild.instance}" for="instance">Instance</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">history</i>
                <input
                  class="readonly"
                  type="text"
                  id="java_version"
                  v-model="selectedBuild.java_version">
                <label :class="{active: selectedBuild.java_version}"
                        for="java_version">Java Version</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">event</i>
                <input
                  class="readonly"
                  type="text"
                  id="created_on"
                  v-model="selectedBuild.created_on">
                <label :class="{active: selectedBuild.created_on}"
                       for="created_on">Created on
                </label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">person</i>
                <input
                  class="readonly"
                  type="text"
                  id="created_by"
                  v-model="selectedBuild.created_by">
                <label :class="{active: selectedBuild.created_by}"
                       for="created_by">Created by
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col s12" >
                 <table ref="builds">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>IP</th>
                    <th>Private Port</th>
                    <th>Public Port</th>
                    <th>Type</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(port, index) in selectedBuild.ports" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ port.IP }}</td>
                      <td>{{ port.PrivatePort }}</td>
                      <td>{{ port.PublicPort }}</td>
                      <td>{{ port.Type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer></template>
    </Modal>

    <Modal v-if="showModal" @close="showModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="removing" class="center" >
          <Preloader class="big"></Preloader>
          <p>Removing build <b>{{ container.Labels.build }}</b> ... </p>
        </div>
        <div v-else-if="removed" class="center" >
          <i class="material-icons large green-text">check_circle_outline</i>
          <p>Build was removed successfully</p>
        </div>
        <div v-else-if="error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ error }}</p>
        </div>
        <div v-else>
          Are you sure you what to remove <b>{{ container.Labels.build }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="removeBuild(container)"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selectedBuild: {},
      showInfoModal: false,
      showModal: false,
      container: null,
      removing: false,
      removed: false,
      error: null,
    };
  },
  computed: {
    host() {
      return this.$store.state.extranet.host;
    },
    containers() {
      return this.$store.getters['extranet/getContainersByBranch'](this.$route.params.branch);
    },
    builds() {
      return this.$store.getters['builds/getForBranch']('branch-builds', this.$route.params.branch);
    },
  },
  methods: {
    getContainers() {
      const loader = this.$loading.show({ container: this.$refs.builds });
      this.$store.dispatch('extranet/getContainers').then(() => {
        loader.hide();
      });
    },
    getBuilds() {
      this.$store.dispatch('builds/getBuilds', { stateName: 'branch-builds' });
    },

    getDeployedBuildUrl(container) {
      const port = container.Ports.find(value => value.PrivatePort === 8591).PublicPort;
      return `http://${this.host}:${port}/${container.Labels.build}/`;
    },

    openBuildInfoModal(container) {
      this.showInfoModal = true;
      this.container = container;
      this.builds.find((build) => {
        if (container.Labels.build === ''.concat(
          build.details.branch, '.',
          build.details.client.name, '.',
          build.details.instance.name, '.',
          build.details.java_version,
        )) {
          this.selectedBuild.created_by = container.Labels.username;
          this.selectedBuild.created_on = new Date(container.Created * 1000).toLocaleString('en-GB', { timeZone: 'UTC' });
          this.selectedBuild.branch = build.details.branch;
          this.selectedBuild.instance = build.details.instance.name;
          this.selectedBuild.java_version = build.details.java_version;
          this.selectedBuild.ports = container.Ports;
        }
        return false;
      });
    },

    openRemoveBuildModal(container) {
      this.showModal = true;
      this.container = container;
      this.removing = false;
      this.removed = false;
      this.error = null;
    },
    removeBuild(container) {
      this.removing = true;
      this.$store.dispatch('extranet/removeBuild', container.Id)
        .then(() => {
          this.removed = true;
          this.$store.dispatch('extranet/getContainers');
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.error = 'You do not have insufficient rights to remove this build';
          } else {
            this.error = error;
          }
        })
        .finally(() => { this.removing = false; });
    },
  },
  mounted() {
    this.getContainers();
    this.getBuilds();
  },
};
</script>
<style scoped>
  .readonly {
    pointer-events: none;
  }
</style>
