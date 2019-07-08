import Vue from "vue";
import Router from "vue-router";
import auth from "@/plugins/auth";

Vue.use(Router);

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue");
const Branches = () => import(/* webpackChunkName: "extranet" */ "./views/extranet/Branches.vue");
const Branch = () => import(/* webpackChunkName: "extranet" */ "./views/extranet/Branch.vue");
const Demo = () => import(/* webpackChunkName: "demo" */ "./views/Demo.vue");
const Login = () => import(/* webpackChunkName: "login" */ "./views/Login.vue");

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "dashboard",
      alias: "/dashboard",
      meta: {
        breadcrumb: "Dashboard"
      },
      component: Dashboard
    },
    {
      path: "/extranet/branches",
      name: "extranet-branches",
      meta: {
        breadcrumb: "Extranet"
      },
      component: Branches
    },
    {
      path: "/extranet/branches/:branch",
      name: "extranet-branch",
      meta: {
        breadcrumb: "Branch"
      },
      component: Branch
    },
    {
      path: "/demo",
      name: "demo",
      meta: {
        breadcrumb: "Demo"
      },
      component: Demo
    },
    {
      path: "/login",
      name: "login",
      meta: {
        layout: "login"
      },
      component: Login
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
