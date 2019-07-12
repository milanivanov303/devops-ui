
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue');
const Branches = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branches.vue');
const Branch = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branch.vue');
const Demo = () => import(/* webpackChunkName: "demo" */ '../views/Demo.vue');
const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');

export default [
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
  // This  allows you to have pages apart of the app but no rendered inside the dash
  {
    path: '/',
    meta: {
      name: 'login',
      layout: 'login',
      requiresAuth: false,
    },
    component: Login,
    // redirect if already signed in

  },
  // add any extra routes that you want rendered in the dashboard as a child below.
  {
    path: '/dashboard',
    meta: {
      alias: '/dashboard',
      name: 'dashboard',
      requiresAuth: true,
      breadcrumb: 'Dashboard',
    },
    component: Dashboard,
    children: [
      {
        path: 'extranet/branches',
        meta: {
          breadcrumb: 'Extranet',
          requiresAuth: true,
          name: 'extranet-branches',
        },
        component: Branches,
      },
      {
        path: 'extranet/branches/:branch',
        name: 'extranet-branch',
        meta: {
          requiresAuth: true,
          breadcrumb: 'Branch',
        },
        component: Branch,
      },
      {
        path: 'demo',
        meta: {
          name: 'demo',
          requiresAuth: true,
          breadcrumb: 'Demo',
        },
        component: Demo,
      },
    ],
  },
];
