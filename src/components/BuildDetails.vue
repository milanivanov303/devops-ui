<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>{{ build.name }}</template>
    <template v-slot:content>
      <div class="row">
        <div id="tabs" class="col s12">
          <ul ref="tabs" class="tabs">
            <li
              class="tab col s4"
              v-on:click="currentTab = BuildInfo">
              <a class="active">Details</a>
            </li>
            <li
              class="tab col s4"
              v-on:click="currentTab = 'BuildLogs'">
              <a>Build logs</a>
            </li>
            <li
              class="tab col s4"
              v-on:click="currentTab = 'BuildServiceLogs'"
              v-if="build.status==='running'">
              <a >Docker logs</a>
            </li>
            <li
              v-else class="tab col s4 disabled">
              <a v-if="build.status!=='running'">Docker logs</a>
            </li>
          </ul>
        </div>
        <div id="component" class="col s12 tab-content">
          <keep-alive>
            <component :is="currentTabComponent" :build="build"></component>
          </keep-alive>
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

  data() {
    return {
      currentTab: '',
    };
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
    currentTabComponent() {
      return this.currentTab;
    },
  },

  mounted() {
    this.$M.Tabs.init(this.$refs.tabs);
    this.currentTab = this.BuildInfo;
  },

};
</script>

<style lang="scss" scoped>
#component {
  margin-top: 40px;
}
</style>
