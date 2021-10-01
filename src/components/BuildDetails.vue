<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>{{ build.name }}</template>
    <template v-slot:content>
      <div class="row">
        <div class="col s12">
          <ul ref="tabs" class="tabs">
            <li class="tab col s4"><a class="active" href="#details">Details</a></li>
            <li class="tab col s4"><a href="#buildLogs">Build logs</a></li>
            <li class="tab col s4" v-if="build.status==='running'">
              <a href="#buildServiceLogs" >Docker logs
            </a></li>
            <li v-else class="tab col s4 disabled">
              <a v-if="build.status!=='running'" href="#buildServiceLogs">Docker logs
            </a></li>
          </ul>
        </div>
        <div id="details" class="col s12 tab-content">
          <div class="row">
            <div class="col s12">
              <component :is="BuildInfo" :build="build"></component>
            </div>
          </div>
        </div>
        <div id="buildLogs" class="col s12 tab-content">
          <div class="row">
            <div class="col s12">
              <build-logs :build="build"></build-logs>
            </div>
          </div>
        </div>
        <div id="buildServiceLogs" class="col s12 tab-content">
          <div class="row">
            <div class="col s12">
          <build-service-logs :build="build" ref="serviceLogs"></build-service-logs>
          </div>
        </div>
      </div>
      </div>
    </template>
    <template v-slot:footer></template>
  </Modal>
</template>

<script>

const BuildServiceLogs = () => import('@/components/BuildServiceLogs');
const BuildLogs = () => import('@/components/BuildLogs');

export default {
  components: {
    BuildServiceLogs,
    BuildLogs,
  },

  props: {
    build: {
      type: Object,
      required: true,
    },
  },

  computed: {
    BuildInfo() {
      // eslint-disable-next-line
      return () => import('@/views/' + this.build.module + '/components/BuildInfo');
    },
  },

  mounted() {
    this.$M.Tabs.init(this.$refs.tabs);
  },

};
</script>

<style lang="scss" scoped>
.tab-content {
  margin-top: 30px;
}
.buildServiceLogs {
  margin-bottom: 35px;
}
</style>
