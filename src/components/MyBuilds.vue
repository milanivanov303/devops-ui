<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">My builds</span>
      <Builds :created-by="this.$auth.getUser().username" :module="module"></Builds>
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
};
</script>
