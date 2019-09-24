import store from '../store';

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue');
const Branches = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branches.vue');
const Branch = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branch.vue');
const Demo = () => import(/* webpackChunkName: "demo" */ '../views/Demo.vue');
const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');

export default [
  {
    path: '/login',
    meta: {
      name: 'login',
      layout: 'login',
      requiresAuth: false,
    },
    component: Login,
    // redirect if already signed in
    beforeEnter: (to, from, next) => {
      if (store.getters.user) {
        next('/dashbaord');
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    meta: {
      alias: '/dashboard',
      name: 'dashboard',
      requiresAuth: true,
      breadcrumb: 'Dashboard',
    },
    component: Dashboard,
  },
  {
    path: '/extranet/branches',
    meta: {
      breadcrumb: 'Extranet',
      requiresAuth: true,
      name: 'extranet-branches',
      transitionName: 'slide',
    },
    component: Branches,
    children: [
      {
        path: ':branch',
        meta: {
          name: 'extranet-branch',
          requiresAuth: true,
          breadcrumb: 'Branch',
          transitionName: 'slide',
        },
        component: Branch,
      },
    ],
  },
  {
    path: '/demo/:id?',
    meta: {
      name: 'demo',
      requiresAuth: true,
      breadcrumb: 'Demo',
    },
    component: Demo,
  },
  {
    path: '*',
    meta: {
      name: 'dashboard',
      requiresAuth: true,
    },
    redirect: {
      path: '/dashboard',
    },
  },
];
