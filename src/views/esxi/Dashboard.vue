<template>
  <div>
    <div>
      <EsxiRamStatistics :esxiHosts="esxiHosts"/>
    </div>
  </div>
</template>

<script>
import EsxiRamStatistics from '@/views/esxi/components/EsxiRamStatistics';

export default {

  components: {
    EsxiRamStatistics,
  },

  computed: {
    esxiHosts() {
      return this.$store.state.esxi.esxiHosts;
    },
  },

  methods: {
    getEsxiHosts() {
      const loader = this.$loading.show({ container: this.$el });

      this.$store.dispatch('esxi/getEsxiHosts')
        .finally(() => loader.hide());
    },
  },

  created() {
    this.getEsxiHosts();
  },

};
</script>
