<template>
  <div class="imx-ttsKeys">
    <div class="col s12 m6 l5">
      <div class="card" ref="builds_by_TTSkey">
        <div class="card-content">
          <span class="card-title">Active iMX builds by TTS key</span>
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Builds</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(build, index) in activeBuildsGroupedByTTSkey" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <router-link :to="'/imx/' + encodeURIComponent(build.ttsKey)">
                {{ build.ttsKey }}
                </router-link>
              </td>
              <td>
                <span v-if="build.builds.building"
                      class="new badge blue"
                      data-badge-caption="building">{{ build.builds.building }}
                </span>
                <span v-if="build.builds.running"
                      class="new badge green"
                      data-badge-caption="running">{{ build.builds.running }}
                </span>
                <span v-if="build.builds.stopped"
                      class="new badge red"
                      data-badge-caption="stopped">{{ build.builds.stopped }}
                </span>
              </td>
            </tr>
            <tr v-if="activeBuildsGroupedByTTSkey.length === 0">
              <td colspan="3">There are no builds</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="col s12 m6 l7">
      <div class="card" ref="my_builds">
        <div class="card-content">
          <span class="card-title">{{ $route.params.key }}</span>
          <Builds module="imx" :tts_key="$route.params.key"></Builds>
          <br>
          <Build @created="() => this.$refs.builds.getBuilds()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Build from './components/Build';
import Builds from '@/components/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  data() {
    return {};
  },
  computed: {
    activeBuildsGroupedByTTSkey() {
      return this.$store.getters['builds/getActiveGroupedByTTSkey']('imx');
    },
  },
};
</script>
<style scoped>

</style>
