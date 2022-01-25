<template>
    <div class="card">
        <div class="card-content">
            <span class="card-title">CPU cores by ESXi Hosts</span>
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
    chartData() {
      const chartData = {
        labels: [],
        datasets: [{ data: [] }],
      };

      this.esxiHosts.forEach((host) => {
        chartData.labels.push(host.hostname);
        chartData.datasets[0].data.push(this.getCPUcoresByHost(host));
      });

      return chartData;
    },
  },
  methods: {
    getCPUcoresByHost(host) {
      if (!host.details) {
        return 0;
      }
      return parseInt(host.details.cpu.num_cpu_cores, 10);
    },
  },
};
</script>
