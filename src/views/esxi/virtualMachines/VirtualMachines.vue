<template>
  <div class="row">
    <div class="col s12">
      <div ref="virtualMachines" class="row">
        <div class="col s12">
          <div class="data-table">
            <Table
              :data="virtualMachines"
              sort-by="name"
              sort-dir="asc"
              query-prefix="vms_"
              :noDataText="getNoDataText()"
              :export-btn="false"
              :view-btn="false"
              :add-btn="false"
              :edit-btn="false"
              :delete-btn="false"
            >
              <template v-slot:top-actions-before>
                <div class="table-btns right">
                  <a @click="updateInfo()"
                     class="btn-floating waves-effect waves-light right"
                     data-tooltip="Refresh details for all hosts"
                  >
                    <i class="material-icons">refresh</i>
                  </a>
                </div>
              </template>
              <Column label="Virtual machine" name="name"
                :show="(vm) => vm.name"/>
              <Column label="CPU cores" name="cpu_cores"
                :show="(vm) => vm.hardware.num_c_p_u"/>
              <Column label="RAM" name="ram" sortBy="hardware.memory"
                :show="(vm) => $esxi(vm.hardware.memory).bytesToSizeLabel()"
              />
              <Column label="OS" name="os" :sortable="false" filter-type="dropdown"
                :show="(vm) => (vm.os && vm.os.name) ? vm.os.name : 'n/a'"/>
              <Column label="OS Version" name="os_version" :sortable="false" filter-type="dropdown"
                :show="(vm) => vm.os && vm.os.version ? vm.os.version : 'n/a'"/>
              <Column label="Status" name="status" :sortable="false" filter-type="dropdown"
                :show="(vm) => getVmStatus(vm.powered)"/>
              <template v-slot:actions-before="{ row }">
                <a @click="openVmDetails(row)"
                   target="_blank"
                   data-tooltip="View details"
                   class="tooltipped">
                  <i class="material-icons">view_list</i>
                </a>
                <a v-if="row.hardware && row.hardware.memoryReservation"
                       target="_blank"
                       :data-tooltip="row.hardware.memoryReservation"
                       class="tooltipped">
                <i class="material-icons red-text">error</i>
              </a>
              </template>
            </Table>
          </div>

          <VmDetailsModal v-if="showVmDetails" :vm="selected" @close="closeVmDetails()"/>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
const VmDetailsModal = () => import('../components/VmDetailsModal');

export default {
  components: { VmDetailsModal },
  data() {
    return {
      showUpdateBtn: false,
      showVmDetails: false,
      selected: {},
    };
  },
  computed: {
    virtualMachines() {
      return this.$store.state.esxi.virtualMachines;
    },

    vm() {
      const { name } = this.$route.params;

      if (!name || !this.virtualMachines.length) {
        return null;
      }

      const vms = this.virtualMachines.filter((vm) => vm.name === name);
      return vms.find((vm) => vm.powered === 'on') || vms[0];
    },
  },
  methods: {
    getNoDataText() {
      if (this.$store.state.esxi.esxiHosts.length === 0) {
        return 'There are no ESXi Host created.';
      }
      if (this.$store.state.esxi.virtualMachines.length === 0) {
        this.showUpdateBtn = true;
        return 'There are no Virtual Machines. Please update and try again in a few minutes.';
      }
      return null;
    },
    getVmStatus(status) {
      if (status === 'on') {
        return `<span class="new badge green" data-badge-caption="">${status}</span>`;
      }
      if (status === 'off') {
        return `<span class="new badge red" data-badge-caption="">${status}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${status}</span>`;
    },
    getVirtualMachines() {
      const loader = this.$loading.show({ container: this.$refs.virtualMachines });

      this.$store.dispatch('esxi/getVirtualMachines')
        .then(() => {
          if (this.vm) {
            this.showVmDetails = true;
            this.selected = this.vm;
          }
        })
        .finally(() => loader.hide());
    },
    openVmDetails(vm) {
      this.selected = vm;
      this.showVmDetails = true;

      this.$router.push({
        path: `/inventory/virtualMachines/${encodeURIComponent(vm.name)}`,
      });
    },
    closeVmDetails() {
      this.showVmDetails = false;

      this.$router.push({
        path: '/inventory/virtualMachines',
      });
    },
    updateInfo() {
      const loader = this.$loading.show({ container: this.$refs.virtualMachines });

      this.$store.dispatch('esxi/updateInfo')
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }
          this.$M.toast({
            html: 'Updating all hosts and virtual machines in background. Please check in a few minutes.',
            classes: 'toast-seccess',
          });
        })
        .catch((error) => {
          this.$M.toast({ html: error });
        }).finally(() => loader.hide());
    },
  },

  created() {
    this.getVirtualMachines();
  },
};
</script>
