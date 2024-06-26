<template>
  <div class="row">
    <div class="col s12 m6">
      <TextInput
        v-model="search"
        icon="search"
        placeholder="Search..."
      />
    </div>

    <div class="col s12 m3 offset-m3">
      <Select
        v-model="status"
        :options="['active', 'removed', 'failed']"
        :defaultOption="false"
        :multiple="true"
        displayed="name"
        icon="timelapse"
      />
    </div>

    <div class="col s12">
      <table ref="builds">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th v-if="!module">Module</th>
            <th v-if="!createdBy">Created By</th>
            <th>Created On</th>
            <th>Status</th>
            <th>TTS Key</th>
            <th>Quick Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(build, index) in currentBuilds" :key="index">
            <td>{{ (page - 1) * perPage + index + 1 }}</td>
            <td>{{ build.name }}</td>
            <td v-if="!module">{{ build.module }}</td>
            <td v-if="!createdBy">{{ build.created_by }}</td>
            <td>{{ $date(build.created_on).toHuman() }}</td>
            <td v-html="getStatusText(build)"></td>
            <td>{{ build.details && build.details.tts_key ? build.details.tts_key : ''}}</td>
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
                  :href="getBuildUrl(build)"
                  target="_blank"
                  data-tooltip="Open"
                  class="green-text tooltipped"
                  v-if="build.status === 'running'"
                >
                  <i class="material-icons">launch</i>
                </a>
                <a
                  @click="openBuildDetailsModal(build)"
                  data-tooltip="Details"
                  class="blue-text tooltipped"
                >
                  <i class="material-icons">error_outline</i>
                </a>
                <a
                    v-if="
                      (build.status === 'running' || build.status === 'stopped')
                      &&
                      build.details.artifactory_url
                    "
                    :href="build.details.artifactory_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip="Download"
                    class="teal-text text-darken-1 tooltipped"
                >
                  <i class="material-icons">file_download</i>
                </a>
                <a
                  @click="openProgressModal(build)"
                  target="_blank"
                  data-tooltip="Progress"
                  class="tooltipped"
                  v-if="build.status === 'building'"
                >
                  <i class="material-icons">update</i>
                </a>
                <a
                  :href="getWebssh2Url(build)"
                  target="_blank"
                  data-tooltip="Open terminal"
                  class="tooltipped"
                  v-if="build.module !== 'imx_be' && build.status === 'running'">
                  <i class="material-icons">wysiwyg</i>
                </a>
                <a
                  v-if="
                  build.status !== 'building' &&
                  build.module === 'imx_be'"
                  @click="openRebuildModal(build)"
                  data-tooltip="Rebuild"
                  class="deep-orange-text tooltipped"
                >
                  <i class="material-icons">settings_backup_restore</i>
                </a>
                <a
                  v-if="
                  build.status !== 'building' &&
                  build.module === 'imx_fe' &&
                  build.details && build.details.tts_key"
                  @click="openRebuildModal(build)"
                  data-tooltip="Rebuild"
                  class="deep-orange-text tooltipped"
                >
                  <i class="material-icons">settings_backup_restore</i>
                </a>
                <a
                  v-if="canRemove(build)"
                  @click="openRemoveModal(build)"
                  data-tooltip="Remove"
                  class="red-text tooltipped"
                >
                  <i class="material-icons">delete</i>
                </a>
              </div>
            </td>
          </tr>
          <tr v-if="currentBuilds.length === 0">
            <td colspan="7">There are no builds</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="currentBuilds.length" class="col s12 m6 l9">
      <Paginate v-if="lastPage > 1" v-model="page" :page-count="lastPage"/>
    </div>
    <div v-if="currentBuilds.length" class="col s12 m6 l3 per-page">
      <Select v-model="perPage" :options="perPageOptions" :defaultOption="false" class="right"/>
      <p class="right right-align">Items per page:</p>
    </div>

    <BuildDetails
      v-if="showBuildDetailsModal"
      :build="build"
      @close="closeBuildDetailsModal()"
    />

    <Modal v-if="showRemoveModal" @close="showRemoveModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="removing" class="center" >
          <Preloader class="big"></Preloader>
          <p>Removing build <b>{{ build.name }}</b> ... </p>
        </div>
        <div v-else-if="removed" class="center" >
          <i class="material-icons large green-text">check_circle_outline</i>
          <p>Build was removed successfully</p>
        </div>
        <div v-else-if="error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ error }}</p>
          <ul v-if="connectedBuilds">
            <li v-for="connectedBuild in connectedBuilds" :key="connectedBuild">
              {{ connectedBuild }}
            </li>
          </ul>
        </div>
        <div v-else>
          Are you sure you what to remove <b>{{ build.name }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="remove()"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>

    <Modal v-if="showRebuildModal" @close="showRebuildModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ error }}</p>
        </div>
        <div v-else>
          Are you sure you what to rebuild <b>{{ build.name }}</b>?
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="waves-effect btn deep-orange"
          @click="rebuild(build)"
        >
          <i class="material-icons left">settings_backup_restore</i> Rebuild
        </button>
      </template>
    </Modal>

    <Modal v-if="showProgressModal" class="right-sheet"
           @close="showProgressModal = false, rebuildStarted = false" >
      <template v-slot:header>{{ build.name }}</template>
      <template v-slot:content>
        <BuildProgress
            v-if="rebuildStarted"
            :broadcast="build.broadcast"
            :status="build.status"
            :summary="build.summary"
            :error="build.error"
        ></BuildProgress>
        <BuildProgress v-else :broadcast="build.details.broadcast"></BuildProgress>
      </template>
    </Modal>
  </div>
</template>

<script>
import EventBus from '@/event-bus';
import config from '@/config';
import Modal from '@/components/Modal';

const Paginate = () => import('@/components/partials/Paginate');
const BuildProgress = () => import('@/components/BuildProgress');
const BuildDetails = () => import('@/components/BuildDetails');

export default {
  components: {
    Modal,
    Paginate,
    BuildProgress,
    BuildDetails,
  },

  props: {
    module: String,
    branch: String,
    ttsKey: {
      type: String,
      default: '',
    },
    createdBy: String,
  },

  data() {
    return {
      builds: [],
      build: {},

      search: '',
      searchTimeout: null,

      status: ['active'],

      currentModule: this.module,

      showRemoveModal: false,
      showRebuildModal: false,
      showProgressModal: false,
      showBuildDetailsModal: false,
      rebuildStarted: false,

      updating: false,
      removing: false,
      removed: false,
      error: null,
      connectedBuilds: [],

      page: 1,
      perPage: 10,
      lastPage: 0,
      perPageOptions: [10, 20, 30, 50],
    };
  },
  computed: {
    currentBuilds() {
      if (this.module === 'imx_combined') {
        return this.builds
          .filter((build) => build.details && build.details.tts_key === this.ttsKey);
      }
      return this.builds;
    },
  },

  methods: {
    getBuilds() {
      const loader = this.$loading.show({ container: this.$refs.builds });

      if (this.module === 'imx_combined') {
        // Dispatch the action for 'imx_be' module
        this.$store.dispatch('builds/getBuildsByStatus', {
          branch: this.branch,
          module: 'imx_be',
          status: this.getStatus(),
          createdBy: this.createdBy,
          perPage: this.perPage,
          page: this.page,
          search: this.search.trim(),
          ttsKey: this.selectedTtsKey,
        })
          .then((response) => {
            const imxBeBuilds = response.data.data;

            // Dispatch the action for 'imx_fe' module
            this.$store.dispatch('builds/getBuildsByStatus', {
              branch: this.branch,
              module: 'imx_fe',
              status: this.getStatus(),
              createdBy: this.createdBy,
              perPage: this.perPage,
              page: this.page,
              search: this.search.trim(),
              ttsKey: this.selectedTtsKey,
            })
              .then((response) => {
                const imxFeBuilds = response.data.data;

                // Combine data for 'imx_be' and 'imx_fe' builds
                this.builds = [...imxBeBuilds, ...imxFeBuilds];

                // Set the last page based on the combined builds
                this.lastPage = Math.max(
                  response.data.meta?.last_page || 0,
                  imxBeBuilds.meta?.last_page || 0,
                  imxFeBuilds.meta?.last_page || 0,
                );
              })
              .finally(() => loader.hide());
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            loader.hide();
          });
      } else {
        // Dispatch the default action
        this.$store.dispatch('builds/getBuildsByStatus', {
          branch: this.branch,
          module: this.module,
          status: this.getStatus(),
          createdBy: this.createdBy,
          perPage: this.perPage,
          page: this.page,
          search: this.search.trim(),
        })
          .then((response) => {
            this.builds = response.data.data;
            this.lastPage = response.data.meta?.last_page || 0;
          })
          .finally(() => loader.hide());
      }
    },

    getStatus() {
      if (this.status.indexOf('active') !== -1) {
        return this.status.concat(['running', 'building', 'stopped', 'deployed', 'staged']);
      }

      return this.status;
    },

    getPublishedPort(build, port) {
      try {
        return build.details.service.Endpoint.Ports
          .find((value) => value.TargetPort === port).PublishedPort;
      } catch (e) {
        return null;
      }
    },

    getBuildUrl(build) {
      return build && build.module === 'imx_be'
        ? `${build.details.url}healthcheck`
        : this.$router.resolve(`/builds/${build.name}/`).href;
    },

    getWebssh2Url(build) {
      if (build.details.service) {
        const serviceID = build.details.service.ID;
        const port = config.ssh_port;

        return `${config.um.url}/ssh/host/${serviceID}?port=${port}&source=devops`;
      }
      return null;
    },

    getStatusText(build) {
      if (build.status === 'running') {
        return `<span class="new badge green" data-badge-caption="">${build.status}</span>`;
      }

      if (build.status === 'stopped' || build.status === 'failed') {
        return `<span class="new badge red" data-badge-caption="">${build.status}</span>`;
      }
      if (build.status === 'deployed' || build.status === 'staged') {
        return `<span class="new badge blue-grey" data-badge-caption="">${build.status}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${build.status}</span>`;
    },

    openProgressModal(build) {
      this.build = { ...build };
      this.showProgressModal = true;
    },

    canRemove(build) {
      if (build.status !== 'running' && build.status !== 'stopped') {
        return false;
      }

      if (build.module === 'extranet' || build.module === 'debiteur') {
        if (this.$auth.can('extranet.remove-builds')) {
          return true;
        }
      }

      if (this.$auth.can(`${build.module}.remove-builds`)) {
        return true;
      }

      return this.$auth.getUser().username === build.created_by;
    },

    openRemoveModal(build) {
      this.build = build;
      this.removing = false;
      this.removed = false;
      this.error = null;

      this.showRemoveModal = true;
    },

    openRebuildModal(build) {
      this.build = build;
      this.error = null;

      this.showRebuildModal = true;
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
        .then((response) => {
          build.status = response.data.data.status;
          build.details = response.data.data.details;
        })
        .finally(() => { this.updating = false; });
    },

    stop(build) {
      this.updating = build.id;

      this.initTooltips();

      this.$store.dispatch('builds/stop', build.id)
        .then((response) => {
          build.status = response.data.data.status;
          build.details = response.data.data.details;
        })
        .finally(() => { this.updating = false; });
    },

    remove() {
      this.removing = true;

      this.$store.dispatch('builds/remove', this.build.id)
        .then(() => {
          this.removed = true;
          this.currentBuilds = this.currentBuilds.filter((build) => build.id !== this.build.id);
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.error = 'You do not have sufficient rights to remove this build';
            return;
          }

          if (error.response.status === 409) {
            this.connectedBuilds = error.response.data.builds.reduce(
              (accumulator, build) => [...accumulator, build.name],
              [],
            );
            this.error = 'There are connected builds you need to remove first:';
            return;
          }

          this.error = error;
        })
        .finally(() => { this.removing = false; });
    },

    rebuild(build) {
      this.showRebuildModal = false;
      this.rebuildStarted = true;
      const payload = {
        branch: build.details.branch,
        ttsKey: build.details.tts_key,
        rebuild: true,
      };

      if (this.currentModule === 'imx_be'
         || (this.currentModule === 'imx_combined' && build.name.includes('imx-be'))) {
        payload.instance = build.details.instance;
        this.currentModule = 'imx_be';
      }

      if (this.currentModule === 'imx_fe'
          || (this.currentModule === 'imx_combined' && build.name.includes('imx-fe'))) {
        payload.instance = build.details.instance;
        payload.build = build.details.build || null;
        payload.client = build.details.client;
        payload.endpoint = build.details.endpoint;
        this.currentModule = 'imx_fe';
      }

      this.$store.dispatch(`${this.currentModule}/startBuild`, payload)
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
            this.build.error = 'You do not have sufficient rights to create build';
          } else if (error.response.status === 400 && error.response.data) {
            this.build.error = error.response.data.summary;
          } else {
            this.build.error = error;
          }
        })
        .finally(() => {
          this.showProgressModal = true;
          this.rebuildStarted = true;
          this.getBuilds();
        });
      this.getBuilds();
    },

    openBuildDetailsModal(build) {
      this.build = { ...build };

      this.build.created_on = this.$date(build.created_on).toHuman();

      if (this.build.removed_on) {
        this.build.removed_on = this.$date(this.build.removed_on).toHuman();
      }

      if (this.build.removed_on && !this.build.removed_by) {
        this.build.removed_by = 'auto-removed';
      }

      if (this.build.details.java_version) {
        this.build.details.java_version = this.build.details.java_version.toString();
      }

      this.showBuildDetailsModal = true;
    },

    closeBuildDetailsModal() {
      this.build = {};
      this.getBuilds();
      this.showBuildDetailsModal = false;
    },

  },

  watch: {
    search() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(this.getBuilds, 500);
    },

    status() {
      this.page = 1;
      this.getBuilds();
    },

    page() {
      this.getBuilds();
    },

    perPage() {
      this.page = 1;
      this.getBuilds();
    },
  },

  updated() {
    this.initTooltips();
  },

  mounted() {
    this.getBuilds();

    if (this.module) {
      this.$store.dispatch(`${this.module}/getHost`);
    }
  },

  created() {
    EventBus.$on('build.created', () => this.getBuilds());
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

  .per-page {
    .input-field {
      width: 60px;
    }

    p {
      margin: 13px 0;
    }
  }
</style>
