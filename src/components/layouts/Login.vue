<template>
  <div class="page login">
    <header></header>
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/layouts/Footer';

export default {
  components: {
    Footer,
  },
  mounted() {
    this.$M.AutoInit();
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/styles";
</style>
