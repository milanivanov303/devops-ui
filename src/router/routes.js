import store from '../store';

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue');
const ExtranetDashboard = () => import(/* webpackChunkName: "extranet-dashboard" */ '../views/extranet/Dashboard.vue');
const ExtranetBranches = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branches.vue');
const ExtranetBranch = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branch.vue');
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
    path: '/extranet',
    meta: {
      requiresAuth: true,
      name: 'extranet',
      transitionName: 'slide',
      title: 'Extranet Dashboard',
      breadcrumb: 'Extranet',
    },
    component: ExtranetDashboard,
    children: [
      {
        path: 'dashboard',
        meta: {
          requiresAuth: true,
          name: 'extranet',
          transitionName: 'slide',
          title: 'Extranet Dashboard',
          breadcrumb: 'Dashboard',
        },
        component: ExtranetDashboard,
      },
      {
        path: 'branches',
        meta: {
          requiresAuth: true,
          name: 'extranet-branches',
          transitionName: 'slide',
          title: 'Extranet Branches',
          breadcrumb: 'Branches',
        },
        component: ExtranetBranches,
        children: [
          {
            path: ':branch',
            meta: {
              name: 'extranet-branch',
              requiresAuth: true,
              transitionName: 'slide',
              title: (params) => params.branch,
              breadcrumb: (params) => params.branch
            },
            component: ExtranetBranch,
          },
        ],
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
