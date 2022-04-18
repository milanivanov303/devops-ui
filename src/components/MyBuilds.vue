<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">My builds</span>
      <Builds :created-by="this.$auth.getUser().username" :module="module"></Builds>

      <template v-if="module">
        <component :is="buildComponent"></component>
      </template>
    </div>
  </div>
</template>

<script>
import Builds from '@/components/Builds';

export default {
  components: {
    Builds,
  },

  props: {
    module: String,
  },

  computed: {
    buildComponent() {
      // eslint-disable-next-line
      return () => import('@/views/' + this.module + '/components/Build');
    },
  },
};
</script>
