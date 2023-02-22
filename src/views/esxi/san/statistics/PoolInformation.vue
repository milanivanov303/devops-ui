<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: {
    poolData: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      const labels = this.poolData.map(pool => pool.name);
      const capacities = this.poolData.map(pool => parseFloat(pool.capacity.replace(/[^\d\.]/g, '')));
      const usedCapacities = this.poolData.map(pool => parseFloat(pool.used_capacity.replace(/[^\d\.]/g, '')));

      return {
        labels,
        datasets: [
          {
            label: 'Capacity',
            backgroundColor: '#4fc3f7',
            borderWidth: 1,
            data: capacities,
          },
          {
            label: 'Used Capacity',
            backgroundColor: '#d32f2f',
            borderWidth: 1,
            data: usedCapacities,
          },
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
};
</script>
