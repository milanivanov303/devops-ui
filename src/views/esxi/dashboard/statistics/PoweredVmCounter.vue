<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">Total powered VMS</span>
      <div class="row">
        <div class="col s12 center">
          <number ref="counter"
                  :to="countPoweredVms()"
                  :format="format"
                  :duration="2"
                  :delay="0.5"
                  easing="Power1.easeOut"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    countPoweredVms() {
      let vms = [];
      this.$store.state.esxi.esxiHosts.forEach((host) => {
        if (host.virtual_machines) {
          vms = vms.concat(host.virtual_machines);
        }
      });

      let count = 0;
      vms.forEach((vm) => {
        if (vm.powered === 'on') {
          count += 1;
        }
      });

      return count;
    },
    format(num) {
      return num.toFixed(0);
    },
    playAnimation() {
      this.$refs.counter.play();
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  font-size: 40px;
}
</style>
