<template>
  <div>
    <table ref="builds">
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Created By</th>
        <th>Created On</th>
        <th>Url</th>
        <th>Details</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(build, index) in builds" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ getBuildName(build) }}</td>
        <td>{{ build.details.created_by }}</td>
        <td>{{ getBuildCreatedOn(build) }}</td>
        <td>
          <a
            :href="getBuildUrl(build)"
            target="_blank"
          >
            <i class="material-icons">cast_connected</i>
          </a>
        </td>
        <td>
          <a @click="openBuildInfoModal(build)" >
            <i class="material-icons">description</i>
          </a>
        </td>
        <td>
          <button
            v-if="
              $auth.can('extranet.remove-builds') ||
              ($auth.getUser().username === build.details.created_by)
            "
            class="btn-small red"
            title="Remove build"
            @click="openRemoveBuildModal(build)"
          >
            <i class="material-icons left">delete</i> Remove
          </button>
        </td>
      </tr>
      <tr v-if="builds.length === 0">
        <td colspan="6">There are no builds yet</td>
      </tr>
      </tbody>
    </table>

    <Modal v-if="showInfoModal" @close="closeBuildInfoModal()" class="right-sheet">
      <template v-slot:header>{{ selectedBuild.name }}</template>
      <template v-slot:content>
        <div class="col s12 l11">
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">business</i>
              <input
                readonly
                type="text"
                id="branch"
                v-model="selectedBuild.branch">
              <label :class="{active: selectedBuild.branch}" for="branch">Branch</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">business</i>
              <input
                readonly
                type="text"
                id="fe_branch"
                v-model="selectedBuild.fe_branch">
              <label :class="{active: selectedBuild.fe_branch}" for="fe_branch">FE Branch</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">dynamic_feed</i>
              <input
                readonly
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
                readonly
                type="text"
                id="java_version"
                v-model="selectedBuild.java_version">
              <label :class="{active: selectedBuild.java_version}"
                     for="java_version">Java Version
              </label>
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
            <div class="col s12">
              <ul class="tabs col s12 center">
                <li class="tab col s12"><a>Container's Details</a></li>
              </ul>
              <div class="row">
                <div class="input-field col s6">
                  <i class="material-icons prefix">account_circle</i>
                  <input
                    readonly
                    type="text"
                    id="user"
                    v-model="selectedBuild.user">
                  <label :class="{active: selectedBuild.user}" for="user">User</label>
                </div>
                <div class="input-field col s6">
                  <i class="material-icons prefix">lock</i>
                  <input
                    readonly
                    type="text"
                    id="pass"
                    v-model="selectedBuild.pass">
                  <label :class="{active: selectedBuild.pass}" for="pass">Pass</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <i class="material-icons prefix">storage</i>
                  <input
                    readonly
                    type="text"
                    id="host"
                    v-model="selectedBuild.host">
                  <label :class="{active: selectedBuild.host}" for="host">Host</label>
                </div>
              </div>
              <div class="row">
                <div class="col s12" >
                  <table ref="builds">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>Private Port</th>
                      <th>Public Port</th>
                      <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(port, index) in selectedBuild.ports" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ port.TargetPort || port.PrivatePort }}</td>
                        <td>{{ port.PublishedPort || port.PublicPort }}</td>
                        <td>{{ port.Protocol || port.Type }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
          <p>Removing build <b>{{ getBuildName(selectedBuild) }}</b> ... </p>
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
          Are you sure you what to remove <b>{{ getBuildName(selectedBuild) }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="removeBuild(selectedBuild)"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>

export default {
  props: {
    builds: Array,
  },
  data() {
    return {
      selectedBuild: {},
      showInfoModal: false,
      showModal: false,
      removing: false,
      removed: false,
      error: null,
    };
  },
  methods: {
    getBuildUrl(build) {
      const { host } = this.$store.state[build.module];
      const port = build.details.service.Endpoint.Ports.find(value => value.TargetPort === 8080);
      return `http://${host}:${port.PublishedPort}/${this.getBuildName(build)}/`;
    },

    getBuildCreatedOn(build) {
      return (new Date(build.created_on * 1000))
        .toLocaleString('en-GB', { timeZone: 'Europe/Sofia' });
    },

    getBuildName(build) {
      return build.details.service.Spec.Name;
    },

    openBuildInfoModal(build) {
      this.showInfoModal = true;

      this.selectedBuild.name = this.getBuildName(build);
      this.selectedBuild.created_by = build.details.created_by;
      this.selectedBuild.created_on = this.getBuildCreatedOn(build);
      this.selectedBuild.branch = build.details.branch;
      if (build.details.fe_branch) {
        this.selectedBuild.fe_branch = build.details.fe_branch.name;
      }
      this.selectedBuild.instance = build.details.instance.name;
      this.selectedBuild.java_version = build.details.java_version;
      this.selectedBuild.ports = build.details.service.Endpoint.Ports.filter(
        port => port.TargetPort === 22 || port.TargetPort === 8080
      );
      this.selectedBuild.host = this.$store.state[build.module].host;

      this.selectedBuild.user = 'ex1';
      this.selectedBuild.pass = 'Sofphia';
    },

    closeBuildInfoModal() {
      this.showInfoModal = false;
      this.selectedBuild = {};
    },

    openRemoveBuildModal(build) {
      this.showModal = true;
      this.selectedBuild = build;
      this.removing = false;
      this.removed = false;
      this.error = null;
    },
    removeBuild(build) {
      this.removing = true;
      this.$store.dispatch(`${build.module}/removeBuild`, build.id)
        .then(() => {
          this.removed = true;
          this.$store.dispatch(`builds/getActive`);
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
};
</script>
<style scoped>
  input:read-only {
    color: black !important;
    border-bottom: 1px solid #9e9e9e !important;
  }
  .tabs {
    margin-bottom: 25px;
  }
</style>
