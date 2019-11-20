<template>
  <div class="progress">
    <div v-if="progress" class="determinate" :style="{width: progress + '%'}"></div>
    <div v-else class="indeterminate"></div>
  </div>
</template>

<script>
export default {
  props: {
    progress: Number,
  },
};
</script>
