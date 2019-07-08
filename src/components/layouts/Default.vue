<template>
  <div class="page">
    <Header />
    <main>
      <Breadcrumbs />
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/layouts/Header.vue";
import Footer from "@/components/layouts/Footer.vue";
import Breadcrumbs from "@/components/layouts/Breadcrumbs.vue";

export default {
  components: {
    Header,
    Breadcrumbs,
    Footer
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/styles";
</style>
