import auth from '@/plugins/auth';

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue');
const ExtranetDashboard = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Dashboard.vue');
const ExtranetBranches = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branches.vue');
const ExtranetBranch = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Branch.vue');
const ExtranetConfigurations = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Configurations.vue');
const DebiteurDashboard = () => import(/* webpackChunkName: "extranet" */ '../views/debiteur/Dashboard.vue');
const DebiteurBranches = () => import(/* webpackChunkName: "extranet" */ '../views/debiteur/Branches.vue');
const DebiteurBranch = () => import(/* webpackChunkName: "extranet" */ '../views/debiteur/Branch.vue');
const ImxFeDashboard = () => import(/* webpackChunkName: "imx-fe" */ '../views/imx-fe/Dashboard.vue');
const ImxFeBranches = () => import(/* webpackChunkName: "imx-fe" */ '../views/imx-fe/Branches.vue');
const ImxFeBranch = () => import(/* webpackChunkName: "imx-fe" */ '../views/imx-fe/Branch.vue');
const DemosDashboard = () => import(/* webpackChunkName: "demos" */ '../views/demos/Dashboard.vue');
const DemosList = () => import(/* webpackChunkName: "demos" */ '../views/demos/Demos.vue');
const AdministrationUsers = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/Users.vue');
const AdministrationRoles = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/Roles.vue');
const AdministrationActions = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/Actions.vue');

const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');
const LoggedInSSOUser = () => import(/* webpackChunkName: "login" */ '../views/LoggedInSSOUser.vue');

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
      if (auth.getUser()) {
        next('/dashbaord');
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    meta: {
      requiresAuth: true,
      alias: '/dashboard',
      name: 'dashboard',
      title: 'Dashboard',
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
    ],
  },
  {
    path: '/extranet/branches',
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
          title: params => params.branch,
          breadcrumb: params => params.branch,
        },
        component: ExtranetBranch,
      },
    ],
  },
  {
    path: '/extranet/configurations/:id?/:build?',
    meta: {
      requiresAuth: true,
      name: 'extranet-configurations',
      transitionName: 'slide',
      title: 'Extranet Configurations',
      breadcrumb: 'Configurations',
    },
    component: ExtranetConfigurations,
  },
  {
    path: '/debiteur',
    meta: {
      requiresAuth: true,
      name: 'debiteur',
      transitionName: 'slide',
      title: 'Debiteur Dashboard',
      breadcrumb: 'Debiteur',
    },
    component: DebiteurDashboard,
    children: [
      {
        path: 'dashboard',
        meta: {
          requiresAuth: true,
          name: 'debiteur',
          transitionName: 'slide',
          title: 'Debiteur Dashboard',
          breadcrumb: 'Dashboard',
        },
        component: DebiteurDashboard,
      },
    ],
  },
  {
    path: '/debiteur/branches',
    meta: {
      requiresAuth: true,
      name: 'debiteur-branches',
      transitionName: 'slide',
      title: 'Debiteur Branches',
      breadcrumb: 'Branches',
    },
    component: DebiteurBranches,
    children: [
      {
        path: ':branch',
        meta: {
          name: 'debiteur-branch',
          requiresAuth: true,
          transitionName: 'slide',
          title: params => params.branch,
          breadcrumb: params => params.branch,
        },
        component: DebiteurBranch,
      },
    ],
  },
  {
    path: '/imx-fe',
    meta: {
      requiresAuth: true,
      name: 'imx-fe',
      transitionName: 'slide',
      title: 'iMX-FE Dashboard',
    },
    component: ImxFeDashboard,
    children: [
      {
        path: 'dashboard',
        meta: {
          requiresAuth: true,
          name: 'imx-fe',
          transitionName: 'slide',
          title: 'iMX-FE Dashboard',
        },
        component: ImxFeDashboard,
      },
    ],
  },
  {
    path: '/imx-fe/branches',
    meta: {
      requiresAuth: true,
      name: 'imx-fe-branches',
      transitionName: 'slide',
      title: 'iMX-FE Branches',
    },
    component: ImxFeBranches,
    children: [
      {
        path: ':branch',
        meta: {
          name: 'imx-fe-branch',
          requiresAuth: true,
          transitionName: 'slide',
          title: params => params.branch,
        },
        component: ImxFeBranch,
      },
    ],
  },
  {
    path: '/demos',
    meta: {
      requiresAuth: true,
      name: 'demos',
      transitionName: 'slide',
      title: 'Demos Dashboard',
      breadcrumb: 'Demos',
    },
    component: DemosDashboard,
    children: [
      {
        path: 'dashboard',
        meta: {
          requiresAuth: true,
          name: 'demos',
          transitionName: 'slide',
          title: 'Demos Dashboard',
          breadcrumb: 'Dashboard',
        },
        component: DemosDashboard,
      },
    ],
  },
  {
    path: '/demos/list/:id?',
    meta: {
      requiresAuth: true,
      name: 'demo',
      transitionName: 'slide',
      title: 'Demo',
      breadcrumb: 'Demo',
    },
    component: DemosList,
  },
  {
    path: '/administration/users/:username?',
    meta: {
      requiresAuth: true,
      name: 'administration-users',
      transitionName: 'slide',
      title: 'Users',
      breadcrumb: 'Users',
    },
    component: AdministrationUsers,
  },
  {
    path: '/administration/roles/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-roles',
      transitionName: 'slide',
      title: 'Roles',
      breadcrumb: 'Roles',
    },
    component: AdministrationRoles,
  },
  {
    path: '/administration/actions/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-actions',
      transitionName: 'slide',
      title: 'Actions',
      breadcrumb: 'Actions',
    },
    component: AdministrationActions,
  },
  {
    path: '/logged-in-sso-user',
    meta: {
      requiresAuth: false,
    },
    component: LoggedInSSOUser,
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
