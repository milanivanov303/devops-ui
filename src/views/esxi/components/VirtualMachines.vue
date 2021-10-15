<template>
  <div class="data-table">
    <Table
      :data="VMs"
      sort-by="powered"
      sort-dir="asc"
      query-prefix="vm_"
      :export-btn="false"
      :view-btn="true"
      :add-btn="false"
      :edit-btn="false"
      :delete-btn="false"
      @view="(vm) => showDetails(vm)"
    >
      <Column label="Name" name="name" :show="(vm) => vm.main_info.name"/>
      <Column label="Powered" name="powered" :show="(vm) => getVMPoweredLabel(vm.powered)"/>
      <Column label="RAM" name="ram" :show="(vm) => $esxi(vm.hardware.memory).bytesToSizeLabel()"/>
      <Column label="CPUs" name="cpu" :show="(vm) => vm.hardware.num_c_p_u"/>
    </Table>
    <VmDetails v-if="showModal" :vm="selectedVM" @close="showModal = false"/>
  </div>
</template>

<script>

const VmDetails = () => import('./VmDetails');

export default {
  components: {
    VmDetails,
  },

  props: {
    VMs: Array,
  },

  data() {
    return {
      selectedVM: {},
      showModal: false,
    };
  },

  methods: {
    showDetails(vm) {
      this.selectedVM = vm;
      this.showModal = true;
    },
    getVMPoweredLabel(powered) {
      if (powered === 'on') {
        return `<span class="new badge green" data-badge-caption="">${powered}</span>`;
      }
      if (powered === 'off') {
        return `<span class="new badge red" data-badge-caption="">${powered}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${powered}</span>`;
    },
  },
};
</script>
