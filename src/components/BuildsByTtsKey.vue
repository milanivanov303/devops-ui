<template>
  <div v-if="module === 'imx_combined'" class="card">
    <div class="card-content">
      <span class="card-title">
        Builds paired by TTS Key
        <router-link :to="`/${module}/connected-builds`" class="tbl-link right">
          View All Paired Builds
        </router-link>
      </span>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>BE Branch</th>
            <th>FE Branch</th>
            <th>TTS Key</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pair, index) in matchedBuildPairs" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pair.beBuild.details.branch }}</td>
            <td>{{ pair.feBuild.details.branch }}</td>
            <td>{{ pair.feBuild.details.tts_key }}</td>
          </tr>
          <tr v-if="matchedBuildPairs.length === 0">
            <td colspan="4">No matching build pairs found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    module: String,
  },

  computed: {
    matchedBuildPairs() {
      const beBuilds = this.$store.getters['builds/getActiveByModule']('imx_be');
      const feBuilds = this.$store.getters['builds/getActiveByModule']('imx_fe');
      const pairs = [];

      beBuilds.forEach((beBuild) => {
        const matchingFeBuild = feBuilds
          .find((feBuild) => feBuild.details.tts_key === beBuild.details.tts_key);
        if (matchingFeBuild) {
          pairs.push({ beBuild, feBuild: matchingFeBuild });
        }
      });

      return pairs;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  a {
    font-size: 13px;
  }
}
</style>
