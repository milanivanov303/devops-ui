<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">RAM by ESXi hosts</span>
      <div class="row">
        <BarChart :data="chartData" :height="200"/>
      </div>
    </div>
  </div>
</template>

<script>
const BarChart = () => import('@/components/charts/BarChart');

export default {
  props: {
    esxiHosts: {
      type: Array,
      required: true,
    },
  },
  components: {
    BarChart,
  },
  computed: {
    totalMemory() {
      return this.$store.getters['esxi/getTotalMemory'];
    },
    chartData() {
      const labels = [];
      this.esxiHosts.forEach((esxiHost) => {
        labels.push(esxiHost.name);
      });

      const usedMemory = [];
      this.esxiHosts.forEach((esxiHost) => {
        usedMemory
          .push(this.$esxi(this.$store.getters['esxi/getVmsMemory'](esxiHost)).bytesToSize());
      });

      return {
        labels,
        datasets: [
          {
            label: 'Total',
            data: this.$store.getters['esxi/getTotalMemoryByHosts'],
            backgroundColor: '#4fc3f7',
          },
          {
            label: 'Used',
            data: usedMemory,
            backgroundColor: '#d32f2f',
          },
        ],
      };
    },
  },
};
</script>
