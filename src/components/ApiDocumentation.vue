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
        <a v-if="Object.keys(docDetails).length !== 0"
            @click="showDetails = !showDetails"
            class="col right">
          <span class="new badge" data-badge-caption="">
            {{showDetails ? 'Hide' : 'Show'}} Details
          </span>
        </a>

        <div class="col s12 details-box" v-if="showDetails">
          <p class="row">
            <span data-badge-caption="" class="new badge left col">Commit:</span>
            {{ docDetails.commit }}
          </p>
          <p class="row">
            <span data-badge-caption="" class="new badge left col">Commited by:</span>
            {{ docDetails.username }}
          </p>
          <p class="row">
            <span data-badge-caption="" class="new badge left col">Commit message:</span>
            {{ docDetails.message }}
          </p>
          <p class="row">
            <span data-badge-caption="" class="new badge left col">Documentation date:</span>
            {{ $date(docDetails.time).toHuman() }}
          </p>
        </div>

        <Table
            v-if="apiDocumentation.length !== 0"
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
            <Column label="API Title" :show="(row) => getTitle(row)" width="50%"/>
            <Column
              label="Screens - API documentation"
              :show="(row) => getScreensTitle(row)"
            />
            <Column label="File" :show="(row) => getApiFile(row)"/>
            <template v-slot:actions-before="{ row }">
                <a @click="getRamlDoc(row)">
                    <span class="new badge raml-badge" data-badge-caption="">RAML</span>
                </a>
                <a @click="convertToOpenAPI3(row)">
                    <span class="new badge" data-badge-caption="">Convert to OpenApi 3.0</span>
                </a>
                <a @click="getApiConsole(row)">
                    <span class="new badge" data-badge-caption="">Api-Console</span>
                </a>
            </template>
        </Table>

        <Alert v-else msg='Documentation has not been generated!'/>
      </div>
      <api-console v-if="view === 'api-console'"></api-console>
      <textarea v-if="view === 'openApi3.0'" ref="openApi3"></textarea>
      <textarea v-if="view === 'raml'" ref="raml"></textarea>
    </template>
    <template v-slot:footer>
      <button v-if="view !== 'table'"
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

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mbo.css';

import 'codemirror/mode/yaml/yaml';
import _CodeMirror from 'codemirror';

const CodeMirror = window.CodeMirror || _CodeMirror;

export default {
  props: {
    repo: String,
    branch: String,
  },
  data() {
    return {
      view: '',
      type: 'RAML 1.0',
      apiDocumentation: [],
      docDetails: {},
      showDetails: false,
      codeMirror: null,
    };
  },
  methods: {
    initCodeMirror(ref) {
      this.codeMirror = CodeMirror.fromTextArea(ref, {
        tabSize: 4,
        theme: 'mbo',
        mode: 'text/x-yaml',
        lineWrapping: true,
        lineNumbers: true,
        readOnly: 'nocursor',
      });
      this.codeMirror.setSize('100%', '90%');
    },
    destroyCodeMirror() {
      if (this.codeMirror) {
        const element = this.codeMirror.doc.cm.getWrapperElement();
        element.remove();
      }
    },

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
        })
        .finally(() => {
          this.view = 'table';
        });
    },

    async getResolvedDoc(row) {
      amf.plugins.document.WebApi.register();
      amf.plugins.document.Vocabularies.register();
      amf.plugins.features.AMFValidation.register();

      await amf.Core.init();
      const parser = amf.Core.parser(this.type, 'application/raml');

      const ramlDoc = await parser.parseFileAsync(`https://ea-dev.codixfr.private/devops-api/v1/specs?repo=${this.repo}&branch=${this.$route.params.branch}&file=${row.file}`);
      const resolver = amf.Core.resolver(this.type);
      const resolvedDoc = resolver.resolve(ramlDoc, 'editing');

      return resolvedDoc;
    },

    async getRamlDoc(row) {
      this.view = 'loading';

      try {
        const resolvedDoc = await this.getResolvedDoc(row);
        const generator = amf.Core.generator('RAML 1.0', 'application/yaml');
        const model = await generator.generateString(resolvedDoc);

        this.codeMirrorTimeout = setTimeout(() => {
          if (this.$refs.raml) {
            this.initCodeMirror(this.$refs.raml);
          }
          this.codeMirror.setValue(model);
        }, 10);

        this.view = 'raml';
      } catch (e) {
        console.error(e);
      }

      this.$router.push({
        query: {
          file: row.file,
          doc_type: 'raml',
        },
      });
    },
    async convertToOpenAPI3(row) {
      this.view = 'loading';

      try {
        const resolvedDoc = await this.getResolvedDoc(row);
        const generator = amf.Core.generator('OAS 3.0', 'application/yaml');
        const model = await generator.generateString(resolvedDoc);

        this.codeMirrorTimeout = setTimeout(() => {
          if (this.$refs.openApi3) {
            this.initCodeMirror(this.$refs.openApi3);
          }
          this.codeMirror.setValue(model);
        }, 10);

        this.view = 'openApi3.0';
      } catch (e) {
        console.error(e);
      }
      this.$router.push({
        query: {
          file: row.file,
          doc_type: 'openApi3.0',
        },
      });
    },
    async getApiConsole(row) {
      this.view = 'loading';

      try {
        const resolvedDoc = await this.getResolvedDoc(row);
        const generator = amf.Core.generator('AMF Graph', 'application/json');
        const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
        const model = await generator.generateString(resolvedDoc, opts);

        this.view = 'api-console';

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
      this.destroyCodeMirror();
      this.view = 'table';
      this.$router.push({ query: { } });
    },
  },
  created() {
    this.getApiDocumentation();
  },
};
</script>

<style lang="css" scoped>
  .CodeMirror.cm-s-mbo.CodeMirror-wrap {
    max-height: 100%;
    height: 100%;
  }

  .modal {
    top: 0 !important;
    max-height: 100%;
    height: 100%;
    width: 100%;
  }

  .details-box {
    border: 2px solid #29a19c;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, .2);
    padding: 1rem !important;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .raml-badge{
    margin-bottom: 5px;
  }

</style>
