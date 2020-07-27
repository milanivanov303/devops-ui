<template>
  <div>
    <div class="input-field col s12 m6 l3 right">
      <select class="select" multiple v-model="status">
        <option selected value="running">Active</option>
        <option value="removed">Removed</option>
        <option value="failed">Failed</option>
      </select>
      <label>View builds with status:</label>
    </div>

    <table ref="builds">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th v-if="showModule">Module</th>
          <th>Created By</th>
          <th>Created On</th>
          <th>Removed On</th>
          <th>Status</th>
          <th>Quick Actions</th>
        </tr>
      </thead>
      <tbody v-for="status in status" :key="status.id">
        <tr v-for="(build, index) in builds[status]" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ getBuildName(build) }}</td>
          <td v-if="showModule">{{ build.module }}</td>
          <td>{{ build.details.created_by }}</td>
          <td>{{ $date(build.created_on).toHuman() }}</td>
          <td>{{ build.removed_on ? $date(build.removed_on).toHuman() : ''}}</td>
          <td><div class="chip"
                  :class="{ 'active': build.status === 'running',
                            'failed': build.status === 'failed',
                            'removed': build.status === 'removed'}">
            <b>{{ build.status }}</b>
          </div></td>
          <td class="quick-actions">
            <a v-if="status ==='running'"
              :href="getBuildUrl(build)"
              target="_blank"
              data-tooltip="Open build"
              class="green-text tooltipped"
            >
              <i class="material-icons">launch</i>
            </a>
            <a
              @click="openBuildInfoModal(build)"
              data-tooltip="Build details"
              class="blue-text tooltipped"
            >
              <i class="material-icons">error_outline</i>
            </a>
            <a v-if="getWebssh2Url(build) && status ==='running'"
              :href="getWebssh2Url(build)"
              target="_blank"
              data-tooltip="Open terminal"
              class="tooltipped"
            >
              <i class="material-icons">wysiwyg</i>
            </a>
            <a
              v-if="canRemoveBuild(build) && status ==='running'"
              @click="openRemoveBuildModal(build)"
              data-tooltip="Remove build"
              class="red-text tooltipped"
            >
              <i class="material-icons">delete</i>
            </a>
          </td>
        </tr>
        <!-- TODO: show only once -->
        <tr v-if="builds[status] === 'undefined'">
          <td colspan="6">There are no such builds</td>
        </tr>
      </tbody>
    </table>
    <!-- Add pagination -->

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
                        <td>{{ port.TargetPort }}</td>
                        <td>{{ port.PublishedPort }}</td>
                        <td>{{ port.Protocol }}</td>
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
import config from '../config';

export default {
  props: {
    module: {
      type: String,
    },
    user: {
      type: String,
    },
    showModule: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      status: ['running'],
      selectedBuild: {},
      showInfoModal: false,
      showModal: false,
      removing: false,
      removed: false,
      error: null,
      branch: this.$route.params.branch,
    };
  },
  computed: {
    builds() {
      return this.$store.state.builds.builds;
    },
  },
  methods: {
    getBuilds() {
      if (this.status.length !== 0) {
        this.status.forEach((status) => {
          const loader = this.$loading.show({ container: this.$refs.builds });

          this.$store.dispatch('builds/getBuildsByStatus', {
            branch: this.branch,
            module: this.module,
            status,
            user: this.user,
          }).then(() => loader.hide());
        });
      } else {
        this.$M.toast({ html: 'Choose build status', classes: 'toast-fail' });
      }
    },
    getBuildPublishedPort(build, port) {
      try {
        return build.details.service.Endpoint.Ports
          .find(value => value.TargetPort === port).PublishedPort;
      } catch (e) {
        return null;
      }
    },

    getBuildUrl(build) {
      const { host } = this.$store.state[build.module];
      try {
        let port;
        try {
          port = build.details.container.NetworkSettings.Ports['8080/tcp'][0].HostPort;
          return `http://${host}:${port}/${this.getBuildName(build)}/`;
        } catch (e) {
          port = build.details.container.NetworkSettings.Ports['8591/tcp'][0].HostPort;
          return `http://${host}:${port}/${this.getBuildName(build)}/`;
        }
      } catch (e) {
        const port = this.getBuildPublishedPort(build, 8080);
        if (port) {
          return `http://${host}:${port}/${this.getBuildName(build)}/`;
        }
        return null;
      }
    },

    getWebssh2Url(build) {
      const { host } = this.$store.state[build.module];
      const port = this.getBuildPublishedPort(build, 22);

      if (host && port) {
        return `http://${window.location.hostname}:${config.webssh2_port}/ssh/host/${host}?port=${port}`;
      }
      return null;
    },

    getBuildName(build) {
      try {
        return build.details.container.Config.Labels.build;
      } catch (e) {
        return build.details.service.Spec.TaskTemplate.ContainerSpec.Env.reduce((env) => {
          if (env.match(/^EXTRANET_BUILD_DIR=/)) {
            return env.split('=').slice(-1).toString().split('/')
              .slice(-1)
              .toString();
          }
          return 'could-not-get-build-name';
        });
      }
      finally {
        if (build.status === 'failed') {
          return build.details.branch.concat(
            '_', build.details.client.name,
            '_', build.details.instance.name,
            '_', build.details.java_version,
            '_', build.created_on,
          );
        }
      }
    },

    openBuildInfoModal(build) {
      this.showInfoModal = true;

      this.selectedBuild.name = this.getBuildName(build);
      this.selectedBuild.created_by = build.details.created_by;
      this.selectedBuild.created_on = this.$date(build.created_on).toHuman();
      this.selectedBuild.branch = build.details.branch;
      if (build.details.fe_branch) {
        this.selectedBuild.fe_branch = build.details.fe_branch.name;
      }
      this.selectedBuild.instance = build.details.instance.name;
      this.selectedBuild.java_version = build.details.java_version;

      try {
        this.selectedBuild.ports = [];
        Object.keys(build.details.container.NetworkSettings.Ports).forEach((port) => {
          this.selectedBuild.ports.push(
            {
              TargetPort: port.split('/')[0],
              PublishedPort: build.details.container.NetworkSettings.Ports[port][0].HostPort,
              Protocol: port.split('/')[1],
            },
          );
        });
      } catch (e) {
        this.selectedBuild.ports = build.details.service.Endpoint.Ports;
      }

      this.selectedBuild.host = this.$store.state[build.module].host;

      this.selectedBuild.user = 'enterprise';
      this.selectedBuild.pass = 'Sofphia';
    },

    closeBuildInfoModal() {
      this.showInfoModal = false;
      this.selectedBuild = {};
    },

    canRemoveBuild(build) {
      if (this.$auth.can('extranet.remove-builds')) {
        return true;
      }

      return this.$auth.getUser().username === build.details.created_by;
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
          this.$store.dispatch('builds/getActive');
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
  watch: {
    status() {
      this.getBuilds();
    },
  },
  mounted() {
    this.getBuilds();

    // Init select
    this.$M.FormSelect.init(document.querySelector('select'));

    // Init tooltops
    this.$M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  },

};
</script>
<style scoped lang='scss'>
  input:read-only {
    color: black !important;
    border-bottom: 1px solid #9e9e9e !important;
  }
  .tabs {
    margin-bottom: 25px;
  }
  .quick-actions a {
      margin: 0px 2.5px;
  }
  .chip{
    background-color: white;
    border-radius: 7px;
    &.failed {
      border: solid red 2px;
      color: red;
    }
    &.active {
      border: solid #4CAF50 2px;
      color: #4CAF50;
    }
    &.removed {
      border: solid darkslategray 2px;
      color: darkslategray;
    }
  }
</style>
