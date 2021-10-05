import amf from 'amf-client-js';
import config from '@/config';

export default {
  data() {
    return {
      type: 'RAML 1.0',
      error: null,
      validationError: null,
    };
  },

  props: {
    repo: String,
    branch: String,
    file: String,
  },

  methods: {
    async getResolvedDoc() {
      amf.plugins.document.WebApi.register();
      amf.plugins.document.Vocabularies.register();
      amf.plugins.features.AMFValidation.register();

      await amf.Core.init();
      const parser = amf.Core.parser(this.type, 'application/raml');

      const ramlDoc = await parser.parseFileAsync(
        `${window.location.origin}/${config.devops.url}/specs?repo=${this.repo}&branch=${this.branch}&file=${this.file}`,
      );

      const doc = amf.Core.resolver(this.type).resolve(ramlDoc, 'editing');

      const result = await amf.AMF.validate(doc, amf.ProfileNames.RAML);
      if (result.results.length) {
        this.validationError = result.toString();
      }

      return doc;
    },

    async getRaml() {
      try {
        const resolvedDoc = await this.getResolvedDoc();
        const generator = amf.Core.generator('RAML 1.0', 'application/yaml');
        const raml = await generator.generateString(resolvedDoc);

        this.$emit('loaded');

        return raml;
      } catch (e) {
        this.error = e.toString();
        return null;
      }
    },

    async getOpenapi() {
      try {
        const resolvedDoc = await this.getResolvedDoc();
        const generator = amf.Core.generator('OAS 3.0', 'application/yaml');
        const openapi = await generator.generateString(resolvedDoc);

        this.$emit('loaded');

        return openapi;
      } catch (e) {
        this.error = 'Could not generate openapi file';
        this.error = e.toString();
        return null;
      }
    },

    async getAmfGraph() {
      try {
        const resolvedDoc = await this.getResolvedDoc();
        const generator = amf.Core.generator('AMF Graph', 'application/json');
        const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
        const model = await generator.generateString(resolvedDoc, opts);

        this.$emit('loaded');

        return JSON.parse(model);
      } catch (e) {
        this.error = 'Could not generate amf graph';
        this.error = e.toString();
        return null;
      }
    },
  },
};
