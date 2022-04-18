<template>
  <div class="page">
    <Header />
    <main>
      <div class="row">
        <div class="col s12">
          <transition
            :name="transitionName"
            mode="out-in">
            <slot />
          </transition>
        </div>
      </div>
    </main>
    <Footer />
    <AutoLogout/>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const DEFAULT_TRANSITION = 'fade';

export default {
  components: {
    Header,
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
  main {
      padding-top: 1rem;
  }
</style>
