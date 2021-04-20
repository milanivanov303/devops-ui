<template>
  <Modal @close="$emit('close')">
    <template v-slot:header>
      API Documentation for <b>{{ $route.params.branch }}</b>
      <div v-if="view === 'api-console'"><b>Console</b></div>
      <div v-if="view === 'raml'"><b>RAML file</b></div>
    </template>
    <template v-slot:content>
      <div class="center" v-if="view === 'loading'">
        <Preloader class="big"></Preloader>
      </div>
      <div class="row" v-if="view === 'table'">
        <div class="col s12">
          <div class="row right" v-if="Object.keys(docDetails).length !== 0">
            <div class="col s12 ">
              <a @click="showDetails = !showDetails">
                <i v-if="!showDetails" class="material-icons right">expand_more</i>
                <i v-else class="material-icons right">expand_less</i>
                Show Details
              </a>
            </div>
          </div>

          <div class="row" v-if="showDetails">
            <p class="col s12"><b>Commit: </b>{{ docDetails.commit }}</p>
            <p class="col s12"><b>Commited by: </b>{{ docDetails.username }}</p>
            <p class="col s12"><b>Commit message: </b>{{ docDetails.message }}</p>
            <p class="col s12"><b>Documentation date: </b>{{ $date(docDetails.time).toHuman() }}</p>
          </div>

          <div class="row" v-if="apiDocumentation.length !== 0">
            <Table
                class="col s12"
                :data="apiDocumentation"
                sort-by="title"
                sort-dir="asc"
                :export-btn="false"
                :view-btn="false"
                :add-btn="false"
                :edit-btn="false"
                :delete-btn="false"
                queryPrefix="doc"
            >
                <Column  label="API Title" :show="(row) => getTitle(row)"/>
                <Column
                  label="Screens - API documentation"
                  :show="(row) => getScreensTitle(row)"
                />
                <Column label="File" :show="(row) => getApiFile(row)"/>
                <template v-slot:actions-before="{ row }">
                    <a @click="getRamlDoc(row)">
                        <span class="new badge" data-badge-caption="">RAML</span>
                    </a>
                    <a @click="getApiConsole(row)">
                        <span class="new badge" data-badge-caption="">Api-Console</span>
                    </a>
                </template>
            </Table>
          </div>
          <Alert v-else msg='Documentation has not been generated!'/>
        </div>
      </div>
      <div class="row" v-if="view === 'api-console'">
          <api-console class="col s12"></api-console>
      </div>
      <div class="row" v-if="view === 'raml'">
        <codemirror
          ref="codemirror"
          :value="raml"
          :options="cmOptions">
        </codemirror>
      </div>
    </template>
    <template v-slot:footer>
      <button v-if="view == 'raml' || view == 'api-console'"
              class="waves-effect btn"
              @click="goBack()">
              Back
      </button>
    </template>
  </Modal>
</template>

<script>
import amf from 'amf-client-js';
import 'api-console/api-console';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

export default {
  props: {
    repo: String,
    branch: String,
  },
  components: {
    codemirror,
  },
  data() {
    return {
      view: '',
      type: 'RAML 1.0',
      apiDocumentation: [],
      docDetails: {},
      raml: '',
      showDetails: false,
      cmOptions: {
        // codemirror options
        tabSize: 4,
        theme: 'mbo',
        mode: 'text/x-yaml',
        lineWrapping: true,
        lineNumbers: true,
        readOnly: 'nocursor',
        viewportMargin: Infinity,
      },
    };
  },
  computed: {
    codemirror() {
      return this.$refs.codemirror.codemirror;
    },
  },
  methods: {
    getTitle(api) {
      if (!api.title) {
        return `<span class="new badge red" data-badge-caption="">${api.error}</span>`;
      }
      return api.title;
    },

    getScreensTitle(api) {
      if (api.documentation) {
        let screens = '';
        api.documentation.forEach((i) => {
          screens = `${screens.concat(i.title)}<br>`;
        });
        return screens;
      }
      return '<span class="new badge red" data-badge-caption="">ERROR</span>';
    },

    getApiFile(api) {
      if (api.documentation) {
        return api.file;
      }
      return `<span class="new badge red" data-badge-caption="">${api.file}</span>`;
    },

    getApiDocumentation() {
      this.view = 'loading';

      const payload = {
        branch: this.branch,
        repo: this.repo,
      };

      const promise1 = this.$store.dispatch('documentation/getApiDocumentation', payload);
      const promise2 = this.$store.dispatch('documentation/getDocDetails', payload);

      Promise.all([promise1, promise2])
        .then((response) => {
          this.apiDocumentation = response[0].data;
          this.docDetails = response[1].data;

          if (this.$route.query) {
            const doc = this.apiDocumentation.find((api) => {
              if (api.file === this.$route.query.file) {
                return true;
              }
              return false;
            });

            if (doc && this.$route.query.doc_type === 'raml') {
              this.getRamlDoc(doc);
            }

            if (doc && this.$route.query.doc_type === 'api-console') {
              this.getApiConsole(doc);
            }
          }
        }).finally(() => { this.view = 'table'; });
    },

    getRamlDoc(row) {
      this.view = 'loading';
      this.$store.dispatch(
        'documentation/getRamlFile',
        {
          repo: this.repo,
          branch: this.$route.params.branch,
          file: row.file,
        },
      )
        .then((response) => {
          this.view = 'raml';
          this.raml = response.data;
        });

      this.$router.push({
        query: {
          file: row.file,
          doc_type: 'raml',
        },
      });
    },

    async getApiConsole(row) {
      this.view = 'loading';

      try {
        amf.plugins.document.WebApi.register();
        amf.plugins.document.Vocabularies.register();
        amf.plugins.features.AMFValidation.register();

        await amf.Core.init();
        const parser = amf.Core.parser(this.type, 'application/raml');

        const ramlDoc = await parser.parseFileAsync(`https://ea-dev.codixfr.private/devops-api/v1/specs?repo=${this.repo}&branch=${this.$route.params.branch}&file=${row.file}`);
        const resolver = amf.Core.resolver(this.type);
        const resolvedDoc = resolver.resolve(ramlDoc, 'editing');
        const generator = amf.Core.generator('AMF Graph', 'application/json');
        this.view = 'api-console';

        const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
        const model = await generator.generateString(resolvedDoc, opts);

        const apic = document.querySelector('api-console');

        apic.amf = JSON.parse(model);
        apic.selectedShape = 'summary';
        apic.selectedShapeType = 'summary';
      } catch (e) {
        console.error(e);
      }
      this.$router.push({
        query: {
          file: row.file,
          doc_type: 'api-console',
        },
      });
    },

    close() {
      this.view = '';
      this.apiDocumentation = [];

      this.$router.history.replace({
        path: `/${this.repo}/branches/${this.$route.params.branch}`,
      });
    },
    goBack() {
      this.view = 'table';
      this.raml = '';

      this.$router.push({ query: { } });
    },
  },
  created() {
    this.getApiDocumentation();
  },
};
</script>

<style lang="css" scoped>
  .modal {
    top: 0 !important;
    max-height: 100%;
    height: 100%;
    width: 100%;
  }

.CodeMirror.cm-s-mbo.CodeMirror-wrap {
  max-height: 100%;
  height: 100%;
}

</style>
