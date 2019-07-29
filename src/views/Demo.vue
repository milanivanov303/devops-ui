<template>
  <div>
    <router-link to="/demo/register"
                 class="waves-effect waves-light btn"
                 v-if="$route.fullPath === '/demo'">
      <i class="material-icons left">assignment_ind</i>Schedule a demo
    </router-link>
    <router-link to="/demo"
                 class="btn-floating btn waves-effect waves-light"
                 v-else>
      <i class="material-icons">chevron_left</i>
    </router-link>

    <transition
                :name="transitionName"
                mode="out-in">
               <router-view />
              </transition>
  </div>
</template>
<script>
const DEFAULT_TRANSITION = 'fade';

export default {
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
