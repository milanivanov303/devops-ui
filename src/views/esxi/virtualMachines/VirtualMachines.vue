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
              :view-btn="true"
              :add-btn="false"
              :edit-btn="false"
              :delete-btn="false"
              @view="(row) => openVmDetails(row)"
            >
              <template v-slot:top-actions-before>
                <div class="table-btns right">
                  <a @click="updateVmsInfo()"
                     class="btn-floating waves-effect waves-light right"
                     data-tooltip="Update"
                  >
                    <i class="material-icons">refresh</i>
                  </a>
                </div>
              </template>
              <Column label="Virtual machine" name="name"
                :show="(vm) => vm.name"/>
              <Column label="CPU cores" name="cpu_cores"
                :show="(vm) => vm.hardware.num_c_p_u"/>
              <Column label="RAM" name="ram"
                :show="(vm) => $esxi(vm.hardware.memory).bytesToSizeLabel()"
              />
              <Column label="OS" name="os" :sortable="false" filter-type="dropdown"
                :show="(vm) => (vm.os && vm.os.name) ? vm.os.name : ''"/>
              <Column label="OS Version" name="os_version" :sortable="false" filter-type="dropdown"
                :show="(vm) => vm.os && vm.os.version ? vm.os.version : ''"/>
              <Column label="Status" name="status" :sortable="false" filter-type="dropdown"
                :show="(vm) => getVmStatus(vm.powered)"/>
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

      return this.virtualMachines.find((i) => name === i.name);
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
    updateVmsInfo() {
      const loader = this.$loading.show({ container: this.$refs.virtualMachines });

      this.$store.dispatch('esxi/updateHostInfo')
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }
          this.$M.toast({
            html: 'Updating virtual machines in background. Please check in a few minutes.',
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
