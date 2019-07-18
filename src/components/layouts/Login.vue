<template>
  <div class="page login">
    <header>
      <div class="row">
        <div class="col s12">
          <a href="\" class="brand-logo">
            <img src="/assets/images/logo.png" alt="Devops Management" />
          </a>
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import * as M from 'materialize-css/dist/js/materialize';
import Footer from '@/components/layouts/Footer';

export default {
  components: {
    Footer,
  },
  mounted() {
    M.AutoInit();
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/styles";
</style>
