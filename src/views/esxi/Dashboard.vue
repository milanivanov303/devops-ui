<template>
  <div class="row inventory">
    <div class="col s12 l6">
      <div class="row">
        <div class="col s12">
          <RAMbyHostsStatistics :esxiHosts="esxiHosts"/>
        </div>
        <div class="col s12 l6">
          <PieChartRAMStatistics :esxiHosts="esxiHosts"/>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <div class="row">
        <div class="col s12 l8">
          <CPUcoresStatistics :esxiHosts="esxiHosts"/>
        </div>
        <div class="col s12 l4">
          <CPUcoresCounter :esxiHosts="esxiHosts"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CPUcoresCounter from '@/views/esxi/components/statistics/CPUcoresCounter';
import CPUcoresStatistics from '@/views/esxi/components/statistics/CPUcoresStatistics';
import RAMbyHostsStatistics from '@/views/esxi/components/statistics/RAMbyHostsStatistics';
import PieChartRAMStatistics from '@/views/esxi/components/statistics/PieChartRAMStatistics';

export default {
  components: {
    CPUcoresCounter,
    CPUcoresStatistics,
    RAMbyHostsStatistics,
    PieChartRAMStatistics,
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
