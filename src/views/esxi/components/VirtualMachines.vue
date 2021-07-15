<template>
  <div>
    <div class="data-table">
      <Table
        :data="virtualMachines"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="true"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="false"
        @view="showVirtualMachineDetails"
      >
        <Column
          label="Virtual machine"
          :show="(virtualMachine) => virtualMachine.main_info.name"
        />
        <Column
          label="Powered"
          :show="(virtualMachine) => virtualMachine.powered || 'N/A'"
        />
        <Column
          label="RAM"
          :show="(virtualMachine) => bytesToSize(virtualMachine.hardware.memory)"
        />
        <Column
          label="CPUs"
          :show="(virtualMachine) => virtualMachine.hardware.num_c_p_u"
        />
      </Table>

      <VmDetails v-if="showVmDetails" :vm="vm" @close="updateShowVm()"/>
    </div>
  </div>
</template>

<script>

import shared from '@/js/esxi/shared';

const VmDetails = () => import('./VmDetails');

export default {
  components: {
    VmDetails,
  },

  props: {
    virtualMachines: Array,
  },

  data() {
    return {
      showVmDetails: false,
    };
  },

  methods: {
    showVirtualMachineDetails(vm) {
      this.vm = vm;
      this.showVmDetails = true;
    },

    updateShowVm() {
      this.showVmDetails = false;
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
  },
};
</script>
