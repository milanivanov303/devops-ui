<template>
  <div class="row">
    <div class="input-field col s12 m6 l3 right">
      <i class="material-icons prefix">timelapse</i>
      <select class="select" multiple v-model="status">
        <option value="running">Running</option>
        <option value="stopped">Stopped</option>
        <option value="removed">Removed</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <table ref="builds">
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th v-if="!module">Module</th>
        <th>Created By</th>
        <th>Created On</th>
        <th>Status</th>
        <th>Quick Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(build, index) in builds" :key="index">
        <td>{{ (page - 1) * perPage.value + index + 1 }}</td>
        <td>{{ getName(build) }}</td>
        <td v-if="!module">{{ build.module }}</td>
        <td>{{ build.details.created_by }}</td>
        <td>{{ $date(build.created_on).toHuman() }}</td>
        <td v-html="getStatusText(build)"></td>
        <td class="quick-actions">
          <Progress v-if="updating === build.id"/>
          <div v-else>
            <a
              @click="start(build)"
              target="_blank"
              data-tooltip="Start"
              class="green-text tooltipped"
              v-if="build.status === 'stopped'"
            >
              <i class="material-icons">play_arrow</i>
            </a>
            <a
              @click="stop(build)"
              target="_blank"
              data-tooltip="Stop"
              class="red-text tooltipped"
              v-if="build.status === 'running'"
            >
              <i class="material-icons">stop</i>
            </a>
            <a
              :href="getUrl(build)"
              target="_blank"
              data-tooltip="Open"
              class="green-text tooltipped"
              v-if="build.status === 'running'"
            >
              <i class="material-icons">launch</i>
            </a>
            <a
              @click="openInfoModal(build)"
              data-tooltip="Details"
              class="blue-text tooltipped"
            >
              <i class="material-icons">error_outline</i>
            </a>
            <a
              :href="getWebssh2Url(build)"
              target="_blank"
              data-tooltip="Open terminal"
              class="tooltipped"
              v-if="build.status === 'running'"
            >
              <i class="material-icons">wysiwyg</i>
            </a>
            <a
              v-if="canRemove(build) && (build.status === 'running' || build.status === 'stopped')"
              @click="openRemoveModal(build)"
              data-tooltip="Remove"
              class="red-text tooltipped"
            >
              <i class="material-icons">delete</i>
            </a>
          </div>
        </td>
      </tr>
      <tr v-if="builds.length === 0">
        <td colspan="6">There are no builds yet</td>
      </tr>
      </tbody>
    </table>
    <div class="col s12 m6 right" id="perPage">
      <div class="input-field col s12 l4 right">
        <Select class="col s12"
                v-if="builds.length"
                displayed="value"
                v-model="perPage"
                :options="perPageOptions"
        />
      </div>
      <p v-if="builds.length" class="col s12 l8 right right-align">Items per page:</p>
    </div>
    <div class="col s12 m6">
      <paginate
        v-if="builds.length && lastPage > 1"
        v-model="page"
        :page-count="lastPage"
        :click-handler="selectedPage"
        :prev-class="'material-icons'"
        :prev-text="'chevron_left'"
        :next-class="'material-icons'"
        :next-text="'chevron_right'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
        :disabled-class="'disabled'"
        :active-class="'active'">
      </paginate>
    </div>
    <Modal v-if="showInfoModal" @close="closeInfoModal()" class="right-sheet">
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
          <div class="row" v-if="selectedBuild.removed_on">
            <div class="input-field col s12">
              <i class="material-icons prefix">event</i>
              <input
                class="readonly"
                type="text"
                id="removed_on"
                v-model="selectedBuild.removed_on">
              <label :class="{active: selectedBuild.removed_on}"
                     for="created_on">Removed on
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

    <Modal v-if="showRemoveModal" @close="showRemoveModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="removing" class="center" >
          <Preloader class="big"></Preloader>
          <p>Removing build <b>{{ getName(selectedBuild) }}</b> ... </p>
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
          Are you sure you what to remove <b>{{ getName(selectedBuild) }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="remove(selectedBuild)"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';
import config from '../config';

export default {
  props: {
    module: {
      type: String,
    },
    branch: {
      type: String,
    },
    user: {
      type: String,
    },
  },
  components: {
    Paginate,
  },
  data() {
    return {
      builds: [],
      paginationData: {},
      status: ['running', 'stopped'],
      selectedBuild: {},
      showInfoModal: false,
      showRemoveModal: false,
      updating: false,
      removing: false,
      removed: false,
      error: null,
      page: 1,
      perPage: {
        value: 10,
      },
      lastPage: 0,
      perPageOptions: [
        {
          value: 10,
        },
        {
          value: 20,
        },
        {
          value: 30,
        },
        {
          value: 50,
        },
      ],
    };
  },
  methods: {
    getBuilds() {
      const loader = this.$loading.show({ container: this.$refs.builds });

      this.$store.dispatch('builds/getBuildsByStatus', {
        branch: this.branch,
        module: this.module,
        status: this.status,
        user: this.user,
        perPage: this.perPage.value,
        page: this.page,
      })
        .then((response) => {
          this.builds = response.data.data;
          this.paginationData = response.data.meta;
          this.setLastPage();
        })
        .finally(() => loader.hide());
    },

    getPublishedPort(build, port) {
      try {
        return build.details.service.Endpoint.Ports
          .find(value => value.TargetPort === port).PublishedPort;
      } catch (e) {
        return null;
      }
    },

    getUrl(build) {
      const { host } = this.$store.state[build.module];
      try {
        let port;
        try {
          port = build.details.container.NetworkSettings.Ports['8080/tcp'][0].HostPort;
          return `http://${host}:${port}/${this.getName(build)}/`;
        } catch (e) {
          port = build.details.container.NetworkSettings.Ports['8591/tcp'][0].HostPort;
          return `http://${host}:${port}/${this.getName(build)}/`;
        }
      } catch (e) {
        const port = this.getPublishedPort(build, 8080);
        if (port) {
          return `http://${host}:${port}/${this.getName(build)}/`;
        }
        return null;
      }
    },

    getWebssh2Url(build) {
      const { host } = this.$store.state[build.module];
      const port = this.getPublishedPort(build, 22);

      if (host && port) {
        return `http://${window.location.hostname}:${config.webssh2_port}/ssh/host/${host}?port=${port}`;
      }
      return null;
    },

    getName(build) {
      try {
        return build.details.container.Config.Labels.build;
      } catch (e) {
        if (build.details.service) {
          return build.details.service.Spec.TaskTemplate.ContainerSpec.Env.reduce((env) => {
            if (env.match(/^EXTRANET_BUILD_DIR=/)) {
              return env.split('=').slice(-1).toString().split('/')
                .slice(-1)
                .toString();
            }
            return 'could-not-get-build-name';
          });
        }
        return 'could-not-get-build-name';
      }
    },

    getStatusText(build) {
      if (build.status === 'running') {
        return `<span class="new badge green" data-badge-caption="">${build.status}</span>`;
      }

      if (build.status === 'stopped' || build.status === 'failed') {
        return `<span class="new badge red" data-badge-caption="">${build.status}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${build.status}</span>`;
    },

    openInfoModal(build) {
      this.showInfoModal = true;

      this.selectedBuild.name = this.getName(build);
      this.selectedBuild.created_by = build.details.created_by;
      this.selectedBuild.created_on = this.$date(build.created_on).toHuman();
      this.selectedBuild.branch = build.details.branch;
      if (build.details.fe_branch) {
        this.selectedBuild.fe_branch = build.details.fe_branch.name;
      }
      if (build.removed_on) {
        this.selectedBuild.removed_on = this.$date(build.removed_on).toHuman();
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

    closeInfoModal() {
      this.showInfoModal = false;
      this.selectedBuild = {};
    },

    canRemove(build) {
      if (this.$auth.can('extranet.remove-builds')) {
        return true;
      }

      return this.$auth.getUser().username === build.details.created_by;
    },

    openRemoveModal(build) {
      this.showRemoveModal = true;
      this.selectedBuild = build;
      this.removing = false;
      this.removed = false;
      this.error = null;
    },

    initTooltips() {
      this.$M.Tooltip.init(
        this.$el.querySelectorAll('.tooltipped'),
      );
    },

    start(build) {
      this.updating = build.id;
      this.initTooltips();
      this.$store.dispatch('builds/start', build.id)
        .then(() => { build.status = 'running'; })
        .finally(() => { this.updating = false; });
    },

    stop(build) {
      this.updating = build.id;
      this.initTooltips();
      this.$store.dispatch('builds/stop', build.id)
        .then(() => { build.status = 'stopped'; })
        .finally(() => { this.updating = false; });
    },

    remove(build) {
      this.removing = true;
      this.$store.dispatch(`${build.module}/removeBuild`, build.id)
        .then(() => {
          this.removed = true;
          this.builds = this.builds.filter(_build => _build.id !== build.id);
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

    selectedPage(page) {
      this.page = page;
      this.getBuilds();
    },

    setLastPage() {
      this.lastPage = Math.ceil(this.paginationData.total / this.perPage.value);
    },
  },
  watch: {
    status() {
      this.page = 1;
      this.getBuilds();
    },
    perPage() {
      this.getBuilds();
    },
  },

  updated() {
    this.initTooltips();
  },

  mounted() {
    this.initTooltips();
    this.getBuilds();
    this.$M.FormSelect.init(document.querySelector('select'));
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
  #perPage {
    > div {
      padding: 0;
    }
    p {
      padding: 13px 0 0 0;
    }
  }
</style>
