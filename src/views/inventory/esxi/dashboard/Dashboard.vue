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
            <span class="card-title">Last installed VMs</span>
              <div>
                <button
                  class="btn waves-effect waves-light"
                  @click="showModal = true">
                  <span>Show all VMs</span>
                </button>
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

    <Modal v-if="showModal" @close="showModal=false">
      <template v-slot:header></template>
      <template v-slot:content>
        <h2>All Virtual Machines</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Installation Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vm in allVirtualMachines" :key="vm.id">
              <td>{{ vm.name }}</td>
              <td>{{ vm.os.install_date }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </Modal>
  </div>
</template>

<script>
import CPUcoresCounter from './statistics/CPUcoresCounter';
import CPUcoresStatistics from './statistics/CPUcoresStatistics';
import RAMbyHostsStatistics from './statistics/RAMbyHostsStatistics';
import PieChartRAMStatistics from './statistics/PieChartRAMStatistics';
import PoweredVmCounter from './statistics/PoweredVmCounter';
import InstancesByType from './statistics/InstancesByType';

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
      showModal: false,
    };
  },
  computed: {
    esxiHosts() {
      return this.$store.state.esxi.esxiHosts;
    },
    virtualMachines() {
      return this.$store.getters['esxi/getLatestvirtualMachines'];
    },
    instances() {
      return this.$store.getters['esxi/getLastCreated']('instances');
    },
    allVirtualMachines() {
      return this.$store.getters['esxi/getAllVirtualMachines'];
    },
  },
  methods: {
    getData() {
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
    this.getData();
  },
};
</script>
