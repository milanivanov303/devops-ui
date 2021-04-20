<template>
  <div class="imx-fe-branch">
    <div class="row" >
      <div class="col s12">
        <h4>
          {{ branch }}
          <a
            @click="openDocs()"
            target="_blank"
            data-tooltip="View Documentation"
            data-position="left"
            class="tooltipped right"
            ref="tooltip"
          >
            <i class="material-icons">library_books</i>
          </a>
        </h4>
      </div>
    </div>
    <Builds ref="builds" :branch="branch" module="imx_be"/>
    <br>
    <Build @created="() => this.$refs.builds.getBuilds()"/>

    <ApiDocumentation
      v-if="showDocs"
      repo="imx_be"
      :branch="branch"
      @close="closeDocs()"
    ></ApiDocumentation>

  </div>
</template>

<script>
import Build from './components/Build';
import Builds from '../../components/Builds';
import ApiDocumentation from '@/components/ApiDocumentation';

export default {
  components: {
    ApiDocumentation,
    Build,
    Builds,
  },
  data() {
    return {
      showDocs: false,
    };
  },
  methods: {
    openDocs() {
      this.showDocs = true;

      this.$router.history.replace({
        path: `/imx_be/branches/${this.branch}/docs`,
        query: this.$route.query,
      });
    },
    closeDocs() {
      this.showDocs = false;

      this.$router.history.replace({
        path: `/imx_be/branches/${this.branch}`,
      });
    },
  },
  computed: {
    action() {
      return this.$route.params.action;
    },
    branch() {
      return decodeURIComponent(this.$route.params.branch);
    },
  },
  mounted() {
    this.$M.Tooltip.init(this.$refs.tooltip);
  },
  created() {
    if (this.action === 'docs') {
      this.openDocs();
    }
  },
};
</script>
