<template>
  <div class="row" ref="inventory">
    <div class="col s12 l6">
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <span class="card-title">
                Average age of ESXi servers {{ getAverageServersAge() }}
              </span>
            </div>
          </div>
        </div>
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
        <div class="col s12 m6">
          <PoweredVmCounter />
          <div class="card">
            <div class="card-content">
              <div class="center-align">
              <span class="card-title">Last created VMs</span>
                <a class="waves-effect waves-light btn-small" @click="showAll = !showAll">
                  {{ showAll ? "Show Less" : "Show More" }}
                </a>
              </div>
              <div class="row">
                <table>
                  <tbody>
                    <tr v-for="vm in virtualMachines" :key="vm.id">
                      <td>{{ vm.name }}</td>
                      <td v-if="vm.os && vm.os.install_date">{{ vm.os.install_date }}</td>
                      <td v-else>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col s12 m6">
          <InstancesByType />
          <div class="card">
            <div class="card-content">
              <span class="card-title">Last created instances</span>
              <div class="row">
                <table>
                  <tbody>
                  <tr v-for="instance in instances" :key="instance.id">
                    <td> {{ instance.name }} </td>
                    <td> {{ $date(instance.created_on).toHuman() }} </td>
                  </tr>
                  </tbody>
                </table>
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
import PoweredVmCounter from '@/views/esxi/dashboard/statistics/PoweredVmCounter';
import InstancesByType from '@/views/esxi/dashboard/statistics/InstancesByType';

export default {
  components: {
    CPUcoresCounter,
    CPUcoresStatistics,
    RAMbyHostsStatistics,
    PieChartRAMStatistics,
    InstancesByType,
    PoweredVmCounter,
  },
  data() {
  return {
      showAll: false,
    };
  },
  computed: {
    esxiHosts() {
      return this.$store.state.esxi.esxiHosts;
    },
    virtualMachines() {
      const uniqueVMs = new Set();
      const sortedVMs = this.$store.state.esxi.virtualMachines
        .filter(
          (vm) =>
            vm.os &&
            vm.os.install_date &&
            !vm.os.install_date.includes("is not installed")
        )
        .sort(
          (vm1, vm2) =>
            new Date(vm2.os.install_date) - new Date(vm1.os.install_date)
        );
      const latestVMs = [];
      for (const vm of sortedVMs) {
        if (uniqueVMs.size >= (this.showAll ? sortedVMs.length : 10)) {
          break;
        }
        if (!uniqueVMs.has(vm.name)) {
          uniqueVMs.add(vm.name);
          latestVMs.push(vm);
        }
      }
      return latestVMs;
    },
    instances() {
      return this.$store.getters['esxi/getLastCreated']('instances');
    },
  },
  methods: {
    getEsxiHosts() {
      const loader = this.$loading.show({ container: this.$refs.inventory });

      const promise1 = this.$store.dispatch('esxi/getEsxiHosts');
      const promise2 = this.$store.dispatch('esxi/getVirtualMachines');
      const promise3 = this.$store.dispatch('esxi/getInstances');

      Promise.all([promise1, promise2, promise3])
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

      return ` - ${years ? `${years} years` : ''} ${months ? `${months} months` : ''} ${days ? `${days} days` : ''}`;
    },
  },
  created() {
    this.getEsxiHosts();
  },
};
</script>
