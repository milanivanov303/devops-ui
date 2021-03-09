<template>
  <div class="row">
    <div class="input-field col s12 m6">
      <i class="material-icons prefix">search</i>
      <input id="search"
             type="text"
             v-model="search"
             placeholder="Search..."
             v-on:keyup="onStopTyping"
      />
    </div>
    <div class="input-field col s12 m3 right">
      <i class="material-icons prefix">timelapse</i>
      <select class="select" multiple v-model="status">
        <option value="active">Active</option>
        <option value="removed">Removed</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <table ref="builds" v-if="currentShowBuilds">
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
        <td>{{ build.name }}</td>
        <td v-if="!module">{{ build.module }}</td>
        <td>{{ build.created_by }}</td>
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
        <td colspan="7">There are no builds</td>
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

    <component v-bind:is="infoComponent"
       v-if="showInfoModal"
      :build="selectedBuild"
      @close="closeInfoModal()"
    />

    <Modal v-if="showRemoveModal" @close="showRemoveModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="removing" class="center" >
          <Preloader class="big"></Preloader>
          <p>Removing build <b>{{ selectedBuild.name }}</b> ... </p>
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
          Are you sure you what to remove <b>{{ selectedBuild.name }}</b> build?
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

    <Modal v-if="showProgressModal" @close="showProgressModal = false" class="right-sheet">
      <template v-slot:header>{{ selectedBuild.name }}</template>
      <template v-slot:content>
        <BuildProgress :broadcast="broadcast"></BuildProgress>
      </template>
    </Modal>

  </div>
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';
import { camelCase } from 'lodash';
import EventBus from '@/event-bus';

const BuildProgress = () => import('@/components/BuildProgress');
const extranetInfoModal = () => import('@/views/extranet/components/BuildInfo');
const debiteurInfoModal = () => import('@/views/debiteur/components/BuildInfo');
const imxBeInfoModal = () => import('@/views/imx-be/components/BuildInfo');
const imxFeInfoModal = () => import('@/views/imx-fe/components/BuildInfo');
const imxInfoModal = () => import('@/views/imx/components/BuildInfo');

export default {
  props: {
    module: {
      type: String,
    },
    branch: {
      type: String,
    },
    tts_key: {
      type: String,
    },
    user: {
      type: String,
    },
    showBuilds: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Paginate,
    BuildProgress,
    extranetInfoModal,
    debiteurInfoModal,
    imxBeInfoModal,
    imxFeInfoModal,
    imxInfoModal,
  },
  computed: {
    searchLoaded() {
      if (this.showBuilds) {
        return this.search;
      }
      return null;
    },
    searchAll() {
      if (!this.showBuilds) {
        return this.search;
      }
      return null;
    },
  },
  data() {
    return {
      infoComponent: '',
      search: '',
      searchTimeout: null,
      broadcast: '',
      currentShowBuilds: this.showBuilds,
      showModal: false,
      builds: [],
      paginationData: {},
      status: ['active'],
      selectedBuild: {
        log: null,
      },
      showInfoModal: false,
      showRemoveModal: false,
      showProgressModal: false,
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
        ttsKey: this.tts_key,
        module: this.module,
        status: this.getStatus(),
        user: this.user,
        perPage: this.perPage.value,
        page: this.page,
        search: this.showBuilds ? this.searchLoaded.trim() : this.searchAll.trim(),
      })
        .then((response) => {
          this.builds = response.data.data;
          this.paginationData = response.data.meta;
          this.setLastPage();
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
          .find(value => value.TargetPort === port).PublishedPort;
      } catch (e) {
        return null;
      }
    },

    getUrl(build) {
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
      this.selectedBuild = { ...build };
      this.infoComponent = camelCase(build.module).concat('InfoModal');
      if (build.details.java_version) {
        this.selectedBuild.details.java_version = build.details.java_version.toString();
      }
      this.selectedBuild.created_on = this.$date(build.created_on).toHuman();
      if (build.removed_on) {
        this.selectedBuild.removed_on = this.$date(build.removed_on).toHuman();
      }
      if (build.removed_on && !build.removed_by) {
        this.selectedBuild.removed_by = 'auto-removed';
      }
      this.showInfoModal = true;
    },

    openProgressModal(build) {
      this.selectedBuild = build;
      this.broadcast = build.details.broadcast;
      this.showProgressModal = true;
    },

    closeInfoModal() {
      this.showInfoModal = false;
      this.selectedBuild = {
        log: null,
      };
    },

    canRemove(build) {
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
      this.showRemoveModal = true;
      this.selectedBuild = build;
      this.removing = false;
      this.removed = false;
      this.error = null;
    },

    init() {
      this.$M.Tooltip.init(
        this.$el.querySelectorAll('.tooltipped'),
      );
      this.$M.FormSelect.init(
        this.$el.querySelectorAll('select'),
      );
    },

    start(build) {
      this.updating = build.id;
      this.init();
      this.$store.dispatch('builds/start', build.id)
        .then(() => { build.status = 'running'; })
        .finally(() => { this.updating = false; });
    },

    stop(build) {
      this.updating = build.id;
      this.init();
      this.$store.dispatch('builds/stop', build.id)
        .then(() => { build.status = 'stopped'; })
        .finally(() => { this.updating = false; });
    },

    remove(build) {
      this.removing = true;
      this.$store.dispatch(`${build.module}/removeBuild`, build.id)
        .then(() => {
          this.removed = true;
          this.$store.commit('builds/remove', build.id);
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

    onStopTyping() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        if (this.currentShowBuilds) {
          this.getBuilds();
        }
      }, 500);
    },

  },

  watch: {
    status() {
      this.page = 1;
      if (this.currentShowBuilds) {
        this.getBuilds();
      }
    },
    searchAll(value) {
      if (value) {
        this.currentShowBuilds = true;
        return;
      }
      this.builds = [];
      this.currentShowBuilds = false;
    },
    perPage() {
      this.page = 1;
      this.getBuilds();
    },
  },

  updated() {
    this.init();
  },

  mounted() {
    this.init();
    if (this.currentShowBuilds) {
      this.getBuilds();
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
  #perPage {
    > div {
      padding: 0;
    }
    p {
      padding: 13px 0 0 0;
    }
  }
</style>
