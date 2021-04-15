<template>
  <div>
    <Modal @close="close()">
      <template v-slot:header>
        API Documentation for <b>{{ $route.params.branch }}</b>
        <div v-if="view === 'api-console'"><b>Console</b></div>
        <div v-if="view === 'raml'"><b>RAML file</b></div>
      </template>
      <template v-slot:content>
        <div class="row" v-if="view === 'table'">
          <div class="col s12">
            <div class="row right">
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
              <p class="col s12"><b>Commited on: </b>{{ $date(docDetails.time).toHuman() }}</p>
            </div>
            <div class="row">
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
                  <Column label="API Title" :show="(row) => getTitle(row)"/>

                  <Column label="Screens - API documentation"
                      :show="(row) => getScreensTittle(row)"/>
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
          </div>
        </div>
        <div class="row" v-if="view === 'api-console'">
           <api-console class="col s12"></api-console>
        </div>
        <div class="row" v-if="view === 'raml'">
          <pre class="col s12">{{raml}}</pre>
        </div>
      </template>
      <template v-slot:footer>
        <button v-if="view !== 'table'"
                class="waves-effect btn"
                @click="goBack()">
                Back
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import amf from 'amf-client-js';
import 'api-console/api-console';

export default {
  props: {
    repo: String,
    branch: String,
  },
  data() {
    return {
      view: 'table',
      type: 'RAML 1.0',
      apiDocumentation: [],
      docDetails: {},
      raml: '',
      showDetails: false,
    };
  },
  methods: {
    getTitle(api) {
      if (!api.title) {
        return `<span class="new badge red" data-badge-caption="">${api.error}</span>`;
      }
      return api.title;
    },
    getScreensTittle(api) {
      if (api.documentation) {
        let screens = '';
        api.documentation.forEach((i) => {
          screens = `${screens.concat(i.title)}<br>`;
        });
        return screens;
      }
      return '<span class="new badge red" data-badge-caption="">ERROR</span>';
    },

    getApiDocumentation() {
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

          const queryParam = { ...this.$route.query };
          if (queryParam) {
            const doc = this.apiDocumentation.find((api) => {
              if (api.title === queryParam.title) {
                return true;
              }
              return false;
            });

            if (doc && queryParam.doc_type === 'raml') {
              this.getRamlDoc(doc);
              return;
            }

            this.getApiConsole(doc);
          }
        });
    },

    getRamlDoc(row) {
      this.view = 'raml';
      const loader = this.$loading.show({ container: this.$refs.modal });
      this.$store.dispatch(
        'documentation/getRamlFile',
        {
          repo: this.repo,
          branch: this.$route.params.branch,
          file: row.file,
        },
      )
        .then((response) => {
          loader.hide();
          this.raml = response.data;
        });

      this.$router.push({
        query: {
          title: row.title,
          doc_type: 'raml',
        },
      });
    },
    async getApiConsole(row) {
      this.view = 'api-console';

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
          title: row.title,
          doc_type: 'api-console',
        },
      });
    },

    close() {
      this.view = 'table';
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

    getFilterFromQueryParam(param) {
      const queryParam = this.$route.query[param];

      if (typeof queryParam !== 'undefined' && queryParam.includes('=')) {
        const obj = {};

        queryParam.split('&').forEach((query) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: false}}] */
          obj[query.split('=')[0]] = query.split('=')[1];
        });

        if (obj.project) {
          this.filter.project = this.projects.find((p) => {
            if (p.id === parseInt(obj.project, 10) || p.name === 'all') {
              return true;
            }
            return false;
          });
        }

        if (obj.type) {
          this.filter.type = this.tariffTypes.find(t => t.id === parseInt(obj.type, 10));
        }

        if (obj.category) {
          this.filter.category = this.tariffTypes.find(c => c.id === parseInt(obj.category, 10));
        }
      }

      this.$store.commit('kronos/filter', this.filter);
      if (this.filter.project) {
        this.getTariffs();
      }
    },
  },
  created() {
    if (this.$route.fullPath.includes('documentation')) {
      this.getApiDocumentation();
    }
  },
};
</script>
