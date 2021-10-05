<template>
  <div>
    <a
      @click="open()"
      data-tooltip="Documentation"
      data-position="left"
      class="tooltipped right"
      ref="tooltip"
    >
      <i class="material-icons">library_books</i>
    </a>

    <Modal v-if="showModal" @close="close()" class="fullscreen">
      <template v-slot:header>
        Documentation for <b>{{ repo }}</b> branch <b>{{ branch }}</b>
      </template>
      <template v-slot:content>
        <div class="list" ref="list">
          <div v-if="error" class="row error">
            <div class="s12 center">
              <i class="material-icons">error</i>
              <h5>{{ error }}</h5>
            </div>
          </div>

          <Details v-if="view === 'list' && !error" :repo="repo" :branch="branch"/>
          <List v-if="view === 'list' && !error" :specs="specs" @show="show"/>

          <Raml
            v-if="view === 'raml'"
            ref="codemirror"
            :repo="repo"
            :branch="branch"
            :file="file"
            @loaded="showCopyBtn = true"
          />

          <Openapi
            v-if="view === 'openapi'"
            ref="codemirror"
            :repo="repo"
            :branch="branch"
            :file="file"
            @loaded="showCopyBtn = true"
          />

          <ApiConsole v-if="view === 'api-console'" :repo="repo" :branch="branch" :file="file"/>
        </div>
      </template>
      <template v-slot:footer>
        <button v-if="showCopyBtn" class="btn btn-small left waves-effect" @click="copy()">
          Copy content
        </button>
        <button
          v-if="view !== 'list'"
          class="btn btn-small waves-effect"
          @click="back()"
        >
          Back to API list
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>

const Details = () => import('./Details');
const List = () => import('./List');
const Raml = () => import('./Raml');
const Openapi = () => import('./Openapi');
const ApiConsole = () => import('./ApiConsole');

export default {
  components: {
    Details,
    List,
    Raml,
    Openapi,
    ApiConsole,
  },

  props: {
    repo: String,
    branch: String,
  },

  data() {
    return {
      showModal: false,
      view: null,
      file: null,
      specs: [],
      error: null,
      showCopyBtn: false,
    };
  },

  computed: {
    codemirror() {
      return this.$refs.codemirror;
    },
  },

  methods: {
    getSpecs() {
      const loader = this.$loading.show({ container: this.$refs.list });

      this.$store.dispatch('documentation/getSpecs', {
        branch: this.branch,
        repo: this.repo,
      })
        .then((response) => {
          this.specs = response.data;
        })
        .catch(() => {
          this.error = 'Documentation has not been generated!';
        })
        .finally(
          () => loader.hide(),
        );
    },

    open() {
      const action = 'docs';

      this.view = this.$route.query.view || 'list';
      this.file = this.$route.query.file || null;

      this.getSpecs();

      if (action !== this.$route.query.action) {
        const query = { ...this.$route.query };
        query.action = action;

        this.$router.push({ query });
      }

      this.showModal = true;
    },

    close() {
      this.showModal = false;

      this.$emit('close');

      const query = { ...this.$route.query };
      delete query.action;
      delete query.file;
      delete query.view;

      Object.keys(query).forEach((key) => {
        if (key.startsWith('docs_')) delete query[key];
      });

      this.$router.push({ query });
    },

    show(file, view) {
      this.file = file;
      this.view = view;

      if (this.$route.query.file === file && this.$route.query.view === view) {
        return;
      }

      if (view !== this.$route.query.view || file !== this.$route.query.file) {
        const query = { ...this.$route.query };
        query.file = file;
        query.view = view;

        this.$router.push({ query });
      }
    },

    back() {
      this.view = 'list';

      const query = { ...this.$route.query };
      delete query.file;
      delete query.view;

      this.$router.push({ query });
    },

    copy() {
      navigator.clipboard.writeText(
        this.$refs.codemirror.getValue(),
      )
        .then(() => {
          this.$M.toast({ html: 'Content was copied', classes: 'light-green' });
        })
        .catch(() => {
          this.$M.toast({ html: 'Could not copy content', classes: 'red' });
        });
    },
  },

  watch: {
    view() {
      this.showCopyBtn = false;
    },
  },

  mounted() {
    this.$M.Tooltip.init(this.$refs.tooltip);
  },

  created() {
    if (this.$route.query.action === 'docs') {
      this.open();
    }
  },
};
</script>

<style lang="scss" scoped>
.list {
  position: relative;
  min-height: 400px;
}

.error {
  margin-top: 200px;

  i {
    font-size: 17rem;
    color: #C40147;
  }
}
</style>
