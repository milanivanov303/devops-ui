<template>
    <div class="card">
        <div class="card-content">
            <span class="card-title">Total CPU cores</span>
            <div class="row">
                <div class="col s12 center">
                    <number ref="counter"
                        :to="getCoresCount()"
                        :format="format"
                        :duration="2"
                        :delay="0.5"
                        easing="Power1.easeOut"
                    />
                </div>
            </div>
            <span class="card-title">Total Assigned CPU cores</span>
            <div class="row">
                <div class="col s12 center">
                    <number ref="counter"
                        :to="getAssignedCoresCount()"
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
  props: {
    esxiHosts: {
      type: Array,
      required: true,
    },
  },
  methods: {
    format(num) {
      return num.toFixed(0);
    },
    playAnimation() {
      this.$refs.counter.play();
    },
    getCoresCount() {
      let count = 0;
      this.esxiHosts.forEach((host) => {
        if (host.usage_type === 'worker' && host.cpu) {
          count += host.cpu.cpu_cores;
        }
      });
      return count;
    },
    getAssignedCoresCount() {
      let count = 0;
      this.esxiHosts.forEach((host) => {
        if (host.usage_type === 'worker') {
          count += this.$store.getters['esxi/getAssignedCpusByHost'](host);
        }
      });
      return count;
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  font-size: 40px;
}
</style>
