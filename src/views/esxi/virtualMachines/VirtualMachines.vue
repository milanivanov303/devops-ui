<template>
  <div class="row">
    <div class="col s12">
      <div class="row">
        <div class="col s11">
          <button v-if="true"
                  class="btn waves-effect waves-light right"
                  @click.prevent="updateEsxiInfo()">
            Update </button>
        </div>
      </div>
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
              <Column label="Virtual machine" name="name"
                      :show="(virtualMachine) => virtualMachine.name"/>
              <Column label="CPU cores" name="cpu_cores"
                      :show="(virtualMachine) => virtualMachine.hardware.num_c_p_u"/>
              <Column
                label="RAM" name="ram"
                :show="(virtualMachine) => $esxi(virtualMachine.hardware.memory).bytesToSizeLabel()"
              />
              <Column label="OS" name="os" :sortable="false" filter-type="dropdown"
                      :show="(virtualMachine) => checkOs(virtualMachine.os)"/>
              <Column label="Status" name="status" :sortable="false" filter-type="dropdown"
                      :show="(virtualMachine) => virtualMachine.powered"/>
            </Table>
          </div>

          <Modal v-if="vm" @close="closeVmDetails()" class="right-sheet">
            <template v-slot:header>{{ vm.name }}</template>
            <template v-slot:content>
              <VmDetails :vm="vm"/>
            </template>
          </Modal>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
const VmDetails = () => import('./VmDetails');

export default {
  components: { VmDetails },
  data() {
    return {
      showUpdateBtn: false,
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

      return this.virtualMachines.find((i) => name === i.name || name === i.hostname);
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
    checkOs(os) {
      if (!os || Object.keys(os).length === 0) {
        return '';
      }

      if (os.error) {
        return 'Could not login';
      }

      return `${os.name} ${os.version}`;
    },
    getEsxiHosts() {
      const loader = this.$loading.show({ container: this.$refs.virtualMachines });

      this.$store.dispatch('esxi/getEsxiHosts')
        .finally(() => loader.hide());
    },
    openVmDetails(vm) {
      this.$router.push({
        path: `/inventory/virtualMachines/${encodeURIComponent(vm.name)}`,
      });
    },
    closeVmDetails() {
      this.$router.push({
        path: '/inventory/virtualMachines',
      });
    },
    updateEsxiInfo() {
      const loader = this.$loading.show({ container: this.$refs.virtualMachines });

      this.$store.dispatch('esxi/updateHostInfo')
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }
          this.$M.toast({
            html: 'Updating ESXi hosts details in background. Please check in a few minutes.',
            classes: 'toast-seccess',
          });
        })
        .catch((error) => {
          this.$M.toast({ html: error });
        }).finally(() => loader.hide());
    },
  },

  created() {
    this.getEsxiHosts();
  },
};
</script>
