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
      <div class="row">
        <div class="col s12">
          <CPUcoresStatistics :esxiHosts="esxiHosts"/>
        </div>
        <div class="col s12 l6">
          <div class="card">
            <div class="card-content">
              <span class="card-title">Average age of ESXi servers</span>
              <div class="row">
                <div class="col s12">
                  {{ getAverageServersAge() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    getAverageServersAge() {
      let count = 0;
      let seconds = 0;

      this.esxiHosts.forEach((e) => {
        if (e.usage_type === 'worker') {
          if (e.purchase_date) {
            count += 1;
            seconds += Math.floor(Date.now() / 1000) - e.purchase_date;
          }
        }       
      });
      const average = Math.floor(seconds / count);

      const years = Math.floor(average / 31536000);
      const months = Math.floor((average % 31536000) / 2628000);
      const days = Math.floor(((average % 31536000) % 2628000) / 86400);

      return `${years ? `${years} years` : ''} ${months ? `${months} months` : ''} ${days ? `${days} days` : ''}`;
    },
  },

  created() {
    this.getEsxiHosts();
  },
};
</script>
