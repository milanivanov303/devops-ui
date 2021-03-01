<template>
  <div class="imx-tts-key">
    <div class="row" >
      <div class="col s12" >
        <h4>{{ tts_key }}</h4>
      </div>
    </div>
    <Builds ref="builds" :tts_key="tts_key" module="imx"/>
    <br>
    <Build @created="() => this.$refs.builds.getBuilds()"/>
  </div>
</template>

<script>
import Build from './components/Build';
import Builds from '../../components/Builds';

export default {
  components: {
    Build,
    Builds,
  },
  computed: {
    tts_key() {
      return decodeURIComponent(this.$route.params.key);
    },
  },
};
</script>
