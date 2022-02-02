<template>
    <a @click="$emit('click')">
      <i v-if="icon" class="material-icons">{{icon}}</i>
    </a>
</template>

<script>

export default {
  props: {
    href: String,
    icon: String,
    tooltip: String,
  },

  mounted() {
    if (this.tooltip) {
      this.$M.Tooltip.init(this.$el);
      this.$el.setAttribute('data-tooltip', this.tooltip);
    }
    if (this.href) {
      this.$el.setAttribute('href', this.href);
    }
  },
};

</script>
