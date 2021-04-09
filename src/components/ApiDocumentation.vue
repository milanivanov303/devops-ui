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
                  <Column label="API Title" :show="(row) => row.title"/>
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
    getScreensTittle(api) {
      let screens = '';
      api.documentation.forEach((i) => {
        screens = `${screens.concat(i.title)}<br>`;
      });
      return screens;
    },

    getApiDocumentation() {
      // $refs is empty
      // const loader = this.$loading.show({ container: this.$refs.modal });

      this.$store.dispatch('documentation/getApiDocumentation', {
        branch: this.$route.params.branch,
        repo: this.repo,
      })
        .then((response) => {
          // loader.hide();
          this.apiDocumentation = response.data;
          if (this.$route.params.title && this.$route.params.type) {
            const doc = this.apiDocumentation.find((d) => {
              if (d.title === this.$route.params.title) {
                return true;
              }
              return false;
            });
            this.getRamlDoc(doc, this.$route.params.type);
          }
        });
      this.$store.dispatch('documentation/getDocDetails', {
        branch: this.$route.params.branch,
        repo: this.repo,
      })
        .then((response) => {
          this.docDetails = response.data;
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

          // this.$router.push({ name: `${this.repo}-branch-doc`, params: {
          //     branch: this.$route.params.branch,
          //     title: row.title,
          //     type: 'raml',
          //   }
          // });

        // this.$router.push({
        //   path: `doc/${row.title}/raml`,
        // });
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
    },

    close() {
      this.view = 'table';
      this.apiDocumentation = [];
      this.$router.push({
        path: `/${this.repo}/branches/${this.$route.params.branch}`,
      });
    },
    goBack() {
      this.view = 'table';
      this.raml = '';

      // also removes doc
      this.$router.history.replace({
        path: `/${this.repo}/branches/${this.$route.params.branch}/doc`,
      });
    },
  },
  created() {
    if (this.$route.fullPath.includes('doc')) {
      this.getApiDocumentation();
    }
  },
};
</script>
