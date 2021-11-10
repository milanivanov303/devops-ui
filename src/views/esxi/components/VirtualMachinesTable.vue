<template>
  <div class="data-table">
    <Table
      v-if="VMs"
      :data="virtualMachines"
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
      <template v-slot:top-actions-after>
        <Select class="col s12 m4" v-model="status" :options="statusOptions" displayed="name"/>
      </template>
      <Column label="Name" name="name" :show="(vm) => vm.main_info.name"/>
      <Column label="Powered" name="powered" :show="(vm) => getVMPoweredLabel(vm.powered)"/>
      <Column label="RAM" name="ram" :show="(vm) => $esxi(vm.hardware.memory).bytesToSizeLabel()"/>
      <Column label="CPUs" name="cpu" :show="(vm) => vm.hardware.num_c_p_u"/>
    </Table>
    <span v-else>Sorry! There is no data. Please update and try again.</span>
    <VmDetailsModal v-if="showModal" :vm="selectedVM" @close="showModal = false"/>
  </div>
</template>

<script>

const VmDetailsModal = () => import('./VmDetailsModal');

export default {
  components: {
    VmDetailsModal,
  },

  props: {
    VMs: Array,
  },

  computed: {
    virtualMachines() {
      return this.filterItemsByStatus(this.VMs);
    },
  },

  data() {
    return {
      selectedVM: {},
      showModal: false,
      status: {
        name: 'On',
        value: 'on',
      },
      statusOptions: [
        {
          name: 'On',
          value: 'on',
        },
        {
          name: 'Off',
          value: 'off',
        },
        {
          name: 'All',
          value: 'all',
        },
      ],
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
    filterItemsByStatus(items) {
      if (this.status.value === 'all') {
        return items;
      }

      return items.filter((item) => item.powered === this.status.value);
    },
  },
};
</script>
