<template>
  <div class="row" ref="inventory">
    <div class="col s12 l6">
      <div class="row">
        <div class="col s12">
          <RAMbyHostsStatistics :esxiHosts="esxiHosts"/>
        </div>
        <div class="col s12 l6">
          <PieChartRAMStatistics :esxiHosts="esxiHosts"/>
        </div>
        <div class="col s12 l6">
          <CPUcoresCounter :esxiHosts="esxiHosts"/>
        </div>
      </div>
    </div>
    <div class="col s12 l6">
      <CPUcoresStatistics :esxiHosts="esxiHosts"/>
    </div>
  </div>
</template>

<script>
import CPUcoresCounter from '@/views/esxi/dashboard/statistics/CPUcoresCounter';
import CPUcoresStatistics from '@/views/esxi/dashboard/statistics/CPUcoresStatistics';
import RAMbyHostsStatistics from '@/views/esxi/dashboard/statistics/RAMbyHostsStatistics';
import PieChartRAMStatistics from '@/views/esxi/dashboard/statistics/PieChartRAMStatistics';

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
      const loader = this.$loading.show({ container: this.$refs.inventory });

      this.$store.dispatch('esxi/getEsxiHosts')
        .finally(() => loader.hide());
    },
  },

  created() {
    this.getEsxiHosts();
  },
};
</script>
