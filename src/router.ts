import Vue from "vue";
import Router from "vue-router";
import auth from "@/plugins/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "dashboard",
      meta: {
        breadcrumb: "Dashboard"
      },
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue")
    },
    {
      path: "/extranet",
      name: "extranet",
      meta: {
        breadcrumb: "Extranet"
      },
      component: () =>
        import(/* webpackChunkName: "extranet" */ "./views/Extranet.vue")
    },
    {
      path: "/demo",
      name: "demo",
      meta: {
        breadcrumb: "Demo"
      },
      component: () =>
        import(/* webpackChunkName: "demo" */ "./views/Demo.vue")
    },
    {
      path: "/login",
      name: "login",
      meta: {
        layout: "login"
      },
      component: () =>
        import(/* webpackChunkName: "demo" */ "./views/Login.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !auth.user()) {
    return next(`/login?return_uri=${to.fullPath}`);
  }

  next();
});

export default router;
