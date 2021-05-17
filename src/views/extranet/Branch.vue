<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
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
    <Builds :branch="branch" module="extranet"/>
    <br>
    <Build/>

    <Documentation
      v-if="showDocs"
      repo="extranet"
      :branch="branch"
      @close="closeDocs()"
    ></Documentation>

  </div>
</template>

<script>
import Documentation from '@/components/documentation';
import Build from './components/Build';
import Builds from '../../components/Builds';

export default {
  components: {
    Documentation,
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
        path: `/extranet/branches/${this.branch}/docs`,
        query: this.$route.query,
      });
    },
    closeDocs() {
      this.showDocs = false;

      this.$router.history.replace({
        path: `/extranet/branches/${this.branch}`,
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
