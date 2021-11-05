<template>
  <router-link :to="getTo()">
    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col s8 card-title truncate">
            {{ vm.name }}
          </div>
          <div class="col s4" v-html="getOnOffLabel(vm.powered)"></div>
        </div>

        <div>
          <div v-if="vm.hardware && vm.hardware.num_c_p_u">
            <b>CPU: </b><span>{{ vm.hardware.num_c_p_u }} cores</span>
          </div>
          <div v-if="vm.hardware && vm.hardware.memory">
            <b>RAM: </b><span>{{ $esxi(vm.hardware.memory).bytesToSizeLabel()}}</span>
          </div>
          <div v-if="vm.details && vm.details['guest_full_name']">
            <b>OS: </b><span>{{ vm.details['guest_full_name'] }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    vm: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getTo() {
      const query = { ...this.$route.query };
      query.virtualMachine = this.vm.name;

      return { query };
    },
    getOnOffLabel(status) {
      if (status === 'on') {
        return `<span class="new badge green" data-badge-caption="">${status}</span>`;
      }
      if (status === 'off') {
        return `<span class="new badge red" data-badge-caption="">${status}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${status}</span>`;
    },
    getCpuCoreSpeed(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }
      return this.$esxi(cpuDetails[0].core_speed).hertzToGigahertz();
    },
    getHostFreeMemory(host) {
      return this.$store.getters['esxi/getHostFreeMemory'](host);
    },
  },
};

</script>

<style lang="scss" scoped>
.card-title {
  span {
    font-size: 12px;
  }
}

</style>
