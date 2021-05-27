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
            <th>Quick Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(build, index) in builds" :key="index">
            <td>{{ (page - 1) * perPage + index + 1 }}</td>
            <td>{{ build.name }}</td>
            <td v-if="!module">{{ build.module }}</td>
            <td v-if="!createdBy">{{ build.created_by }}</td>
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
                  :href="getBuildUrl(build)"
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
                  v-if="
                    (build.module === 'extranet' || build.module === 'debiteur')
                    &&
                    build.status === 'running'
                  "
                >
                  <i class="material-icons">wysiwyg</i>
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
          <tr v-if="builds.length === 0">
            <td colspan="7">There are no builds</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="builds.length" class="col s12 m6 l9">
      <Paginate v-if="lastPage > 1" v-model="page" :page-count="lastPage"/>
    </div>
    <div v-if="builds.length" class="col s12 m6 l3 per-page">
      <Select v-model="perPage" :options="perPageOptions" :defaultOption="false" class="right"/>
      <p class="right right-align">Items per page:</p>
    </div>

    <component
      v-if="showInfoModal"
      :is="infoComponent"
      :build="build"
      @close="closeInfoModal()"
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
        </div>
        <div v-else>
          Are you sure you what to remove <b>{{ build.name }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="remove(build)"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>

    <Modal v-if="showProgressModal" @close="showProgressModal = false" class="right-sheet">
      <template v-slot:header>{{ build.name }}</template>
      <template v-slot:content>
        <BuildProgress :broadcast="this.build.details.broadcast"></BuildProgress>
      </template>
    </Modal>

  </div>
</template>

<script>
import EventBus from '@/event-bus';

const Paginate = () => import('@/components/partials/Paginate');
const BuildProgress = () => import('@/components/BuildProgress');

export default {
  components: {
    Paginate,
    BuildProgress,
  },

  props: {
    module: String,
    branch: String,
    ttsKey: String,
    createdBy: String,
    fetchOnCreate: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    infoComponent() {
      // eslint-disable-next-line
      return () => import('@/views/' + this.build.module + '/components/BuildInfo');
    },
  },

  data() {
    return {
      builds: [],
      build: {},

      search: '',
      searchTimeout: null,

      status: ['active'],

      showInfoModal: false,
      showRemoveModal: false,
      showProgressModal: false,

      updating: false,
      removing: false,
      removed: false,
      error: null,

      page: 1,
      perPage: 10,
      lastPage: 0,
      perPageOptions: [10, 20, 30, 50],
    };
  },

  methods: {
    getBuilds() {
      const loader = this.$loading.show({ container: this.$refs.builds });

      this.$store.dispatch('builds/getBuildsByStatus', {
        branch: this.branch,
        ttsKey: this.ttsKey,
        module: this.module,
        status: this.getStatus(),
        createdBy: this.createdBy,
        perPage: this.perPage,
        page: this.page,
        search: this.search.trim(),
      })
        .then((response) => {
          this.builds = response.data.data;
          this.lastPage = response.data.meta.last_page;
        })
        .finally(() => loader.hide());
    },

    getStatus() {
      if (this.status.indexOf('active') !== -1) {
        return this.status.concat(['running', 'building', 'stopped']);
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
      return this.$router.resolve(`/builds/${build.name}/`).href;
    },

    getWebssh2Url(build) {
      const { host } = this.$store.state[build.module];
      const port = this.getPublishedPort(build, 22);

      return this.$router.resolve(`/ssh/host/${host}?port=${port}`).href;
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
      this.build = { ...build };

      this.build.created_on = this.$date(build.created_on).toHuman();

      if (this.build.removed_on) {
        this.build.removed_on = this.$date(this.build.removed_on).toHuman();
      }

      if (this.build.removed_on && !this.build.removed_by) {
        this.build.removed_by = 'auto-removed';
      }

      this.showInfoModal = true;
    },

    closeInfoModal() {
      this.build = {};

      this.showInfoModal = false;
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

    remove(build) {
      this.removing = true;

      this.$store.dispatch(`${build.module}/removeBuild`, build.id)
        .then((response) => {
          this.removed = true;
          build.status = response.data.data.status;
          build.removed_on = response.data.data.removed_on;
          build.removed_by = response.data.data.removed_by;
          build.details = response.data.data.details;
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
    if (this.fetchOnCreate) {
      this.getBuilds();
    }

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
