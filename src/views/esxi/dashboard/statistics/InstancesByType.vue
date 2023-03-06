<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Instances by type</span>
      <div class="row">
        <BarChart :data="chartData" :height="200"/>
      </div>
    </div>
  </div>
</template>

<script>
const BarChart = () => import('@/components/charts/BarChart');

export default {
  components: {
    BarChart,
  },
  computed: {
    chartData() {
      const chartData = {
        labels: [],
        datasets: [{ data: [] }],
      };

      const instances = this.$store.getters['esxi/getInstancesByType'];

      Object.entries(instances).forEach(([type, count]) => {
        chartData.labels.push(type);
        chartData.datasets[0].data.push(parseInt(count, 10));
      });

      return chartData;
    },
  },
};
</script>
