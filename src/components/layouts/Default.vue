<template>
  <div class="page">
    <Header />
    <main>
      <Breadcrumbs />
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <transition
                :name="transitionName"
                mode="out-in">
                <slot />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Breadcrumbs from '@/components/layouts/Breadcrumbs';

const DEFAULT_TRANSITION = 'fade';

export default {
  components: {
    Header,
    Breadcrumbs,
    Footer,
  },
  data() {
    return {
      transitionName: DEFAULT_TRANSITION,
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName = to.meta.transitionName || from.meta.transitionName;

      if (transitionName === 'slide') {
        const toDepth = to.path.split('/').length;
        const fromDepth = from.path.split('/').length;
        transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      }

      this.transitionName = transitionName || DEFAULT_TRANSITION;

      next();
    });
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/styles";
</style>
