
/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';

// Routes
import paths from './routes';

Vue.use(Router);

// Create a new router
const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: paths,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});
// Route guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.user) {
      return next(`/login?return_uri=${to.fullPath}`);
    }
  }

  return next();
});

export default router;
