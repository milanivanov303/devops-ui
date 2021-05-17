<template>
  <div class="row">
    <div class="col s4 l3">
      <api-navigation endpointsopened rearrangeendpoints></api-navigation>
    </div>
    <div class="col s8 l9">
      <api-documentation notryit></api-documentation>
    </div>
  </div>
</template>

<script>
import amfMixin from './amfMixin';

import 'api-console/api-console';
import '@api-components/api-navigation';
import '@api-components/api-documentation';

export default {
  mixins: [
    amfMixin,
  ],

  methods: {
    initApiConsole(model) {
      const doc = document.querySelector('api-documentation');
      doc.amf = model;
      doc.selected = 'summary';
      doc.selectedType = 'summary';

      const nav = document.querySelector('api-navigation');
      nav.amf = model;
      nav.selected = 'summary';
      nav.selectedType = 'summary';

      nav.addEventListener('api-navigation-selection-changed', (e) => {
        const { selected, type } = e.detail;
        doc.selected = selected;
        doc.selectedType = type;
      });
    },
  },

  async mounted() {
    const loader = this.$loading.show({ container: this.$el });
    const amfGraph = await this.getAmfGraph();
    loader.hide();

    this.initApiConsole(amfGraph);
  },
};
</script>
