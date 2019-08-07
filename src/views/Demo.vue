<template>
  <div>
    <div v-if="$route.fullPath === '/demo'">
    <router-link to="/demo/register"
                 class="waves-effect waves-light btn-small">
      <i class="material-icons left">assignment_ind</i>Schedule a demo
    </router-link>
      <table class="responsive-table">
        <thead>
          <tr>
              <th>Name</th>
              <th>Business</th>
              <th>Company</th>
              <th>Country</th>
              <th>Email</th>
              <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="demo in demos"
              v-bind:key="demo.id">
            <td>{{demo.name}}</td>
            <td>{{demo.business}}</td>
            <td>{{demo.company}}</td>
            <td>{{demo.country}}</td>
            <td>{{demo.email}}</td>
            <td>{{demo.status}}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
  computed: {
    demos() {
      return this.$store.getters['demo/getDemos'];
    },
  },
  mounted() {
    this.$store.dispatch('demo/getDemos');
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
