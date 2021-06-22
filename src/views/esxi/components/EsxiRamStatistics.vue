<template>
  <div class="card">
    <div class="card-content">

      <span class="card-title">ESXi hosts RAM</span>
      <div class="row">
        <div class="col s12">
          <BarChart :data="chartData" :height="200"/>
        </div>
      </div>

      <div class="row">
        <div v-if="esxiHosts">
          Total RAM {{ bytesToSize(getTotalMemory()) }},
          Free {{ bytesToSize(getTotalFreeMemory()) }}
        </div>

        <div v-if="esxiHosts" class="progress">
          <div class="determinate" :style="{width: freeMemoryPercent() + '%'}"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import shared from '@/js/esxi/shared';

const BarChart = () => import('@/components/BarChart');

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
      const labels = [];
      this.esxiHosts.forEach((esxiHost) => {
        labels.push(esxiHost.hostname);
      });

      const totalMemory = [];
      this.esxiHosts.forEach((esxiHost) => {
        if (esxiHost.details && esxiHost.details.memory.physical_memory) {
          totalMemory.push(Math.round(esxiHost.details.memory.physical_memory / 1024 ** 3));
        } else {
          totalMemory.push(0);
        }
      });

      const usedMemory = [];
      this.esxiHosts.forEach((esxiHost) => {
        usedMemory.push(Math.round(this.getVmsMemory(esxiHost) / 1024 ** 3));
      });

      return {
        labels,
        datasets: [
          {
            label: 'Total',
            data: totalMemory,
          },
          {
            label: 'Used',
            data: usedMemory,
            backgroundColor: '#ba2f46',
          },
        ],
      };
    },
  },

  methods: {
    getTotalMemory() {
      if (!this.esxiHosts || this.esxiHosts.length === 0) {
        return 0;
      }

      let total = 0;
      this.esxiHosts.forEach((esxiHost) => {
        if (esxiHost.details && esxiHost.details.memory) {
          total += esxiHost.details.memory.physical_memory;
        }
      });

      return total;
    },

    getTotalFreeMemory() {
      let total = 0;
      this.esxiHosts.forEach((esxiHost) => {
        total += this.freeMemory(esxiHost);
      });

      return total;
    },

    freeMemoryPercent() {
      return ((this.getTotalMemory() - this.getTotalFreeMemory()) * 100) / this.getTotalMemory();
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
    this.getVmsMemory = shared.getVmsMemory;
    this.getServerFreeMemory = shared.getServerFreeMemory;
    this.freeMemory = shared.freeMemory;
  },

};

</script>
