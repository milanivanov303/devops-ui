<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Total RAM</span>
      <div class="row">
          <div class="col s12">
            <span><b>Total RAM - {{ $esxi(totalMemory).bytesToSizeLabel() }}</b>
                      /Free - {{  $esxi(getTotalFreeMemory()).bytesToSizeLabel() }},
                      Used - {{ $esxi(getTotalUsedMemory()).bytesToSizeLabel() }}/
            </span>
          </div>
          <DoughnutChart :data="chartData"></DoughnutChart>
      </div>
    </div>
  </div>
</template>

<script>
const DoughnutChart = () => import('@/components/charts/DoughnutChart');

export default {
  props: {
    esxiHosts: {
      type: Array,
      required: true,
    },
  },
  components: {
    DoughnutChart,
  },
  computed: {
    totalMemory() {
      return this.$store.getters['esxi/getTotalMemory'];
    },
    chartData() {
      const chartData = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };

      chartData.labels.push('Free RAM', 'Used RAM');
      chartData.datasets[0].data.push(this.$esxi(this.getTotalFreeMemory()).bytesToSize(),
        this.$esxi(this.getTotalUsedMemory()).bytesToSize());
      chartData.datasets[0].backgroundColor.push('#4caf50', '#c40147');

      return chartData;
    },
  },
  methods: {
    getTotalFreeMemory() {
      let freeMemory = 0;
      this.esxiHosts.forEach((host) => {
        freeMemory += this.getHostFreeMemory(host);
      });
      return freeMemory;
    },

    getHostFreeMemory(host) {
      return this.$store.getters['esxi/getHostFreeMemory'](host);
    },

    getTotalUsedMemory() {
      let usedMemory = 0;
      this.esxiHosts.forEach((host) => {
        usedMemory += this.$store.getters['esxi/getVmsMemory'](host);
      });

      return usedMemory;
    },
  },
};
</script>
