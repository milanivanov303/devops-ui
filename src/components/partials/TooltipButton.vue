<template>
    <button class="btn waves-effect btn-medium"
       type="button"
       :data-tooltip=tooltip
       @click="$emit('click')">
      <i v-if="icon" class="material-icons">{{icon}}</i>
    </button>
</template>

<script>

export default {
  props: {
    icon: String,
    tooltip: String,
  },

  mounted() {
    this.$M.Tooltip.init(this.$el);
  },
};

</script>
