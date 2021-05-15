import amf from 'amf-client-js';

export default {
  data() {
    return {
      type: 'RAML 1.0',
      error: null,
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
        `${window.location.origin}/devops-api/v1/specs?repo=${this.repo}&branch=${this.branch}&file=${this.file}`
      );

      return amf.Core.resolver(this.type).resolve(ramlDoc, 'editing');
    },

    async getRaml() {
      try {
        const resolvedDoc = await this.getResolvedDoc();
        const generator = amf.Core.generator('RAML 1.0', 'application/yaml');

        return await generator.generateString(resolvedDoc);
      } catch (e) {
        this.error = "Could not get raml file";
        console.error(e);
      }
    },

    async getOpenapi() {
      try {
        const resolvedDoc = await this.getResolvedDoc();
        const generator = amf.Core.generator('OAS 3.0', 'application/yaml');

        return await generator.generateString(resolvedDoc);
      } catch (e) {
        console.error(e);
      }
    },

    async getAmfGraph() {
      try {
        const resolvedDoc = await this.getResolvedDoc();
        const generator = amf.Core.generator('AMF Graph', 'application/json');
        const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
        const model = await generator.generateString(resolvedDoc, opts);

        return JSON.parse(model);
      } catch (e) {
        console.error(e);
      }
    },
  },
}

