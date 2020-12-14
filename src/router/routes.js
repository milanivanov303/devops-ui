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
const ConfigDefaults = () => import(/* webpackChunkName: "cms" */ '../views/cms/ConfigDefaults.vue');
const ResponseFile = () => import(/* webpackChunkName: "cms" */ '../views/cms/ResponseFile.vue');
const Templates = () => import(/* webpackChunkName: "cms" */ '../views/cms/Templates.vue');
const Inventory = () => import(/* webpackChunkName: "cms" */ '../views/cms/Inventory.vue');
const Modification = () => import(/* webpackChunkName: "cms" */ '../views/cms/Modification.vue');
const AdministrationUsers = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/Users.vue');
const AdministrationRoles = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/Roles.vue');
const AdministrationActions = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/Actions.vue');

const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');
const LoggedInSSOUser = () => import(/* webpackChunkName: "login" */ '../views/LoggedInSSOUser.vue');
const OpenBuild = () => import(/* webpackChunkName: "open-build" */ '../views/OpenBuild.vue');

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
    path: '/imx_fe',
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
    path: '/imx_fe/branches',
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
    path: '/cms/config-defaults',
    meta: {
      alias: '/configDefaults',
      name: 'configDefaults',
      requiresAuth: true,
      breadcrumb: 'Config Defaults',
    },
    component: ConfigDefaults,
  },
  {
    path: '/cms/response-file',
    meta: {
      alias: '/responseFile',
      name: 'responseFile',
      requiresAuth: true,
      breadcrumb: 'Response File',
    },
    component: ResponseFile,
  },
  {
    path: '/cms/inventory',
    meta: {
      alias: '/inventory',
      name: 'inventory',
      requiresAuth: true,
      breadcrumb: 'Inventory',
    },
    component: Inventory,
  },
  {
    path: '/cms/templates',
    meta: {
      alias: '/templates',
      name: 'templates',
      requiresAuth: true,
      breadcrumb: 'Templates',
    },
    component: Templates,
  },
  {
    path: '/cms/modification/:issue?',
    meta: {
      alias: '/modification',
      name: 'modification',
      requiresAuth: true,
      breadcrumb: 'Modification',
    },
    component: Modification,
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
    path: '/builds/:name(.*_\\d+)/:uri(.*)?',
    meta: {
      layout: 'basic',
      requiresAuth: false,
    },
    component: OpenBuild,
  },
  {
    path: '/:name(.*_\\d+)/:uri(.*)?',
    meta: {
      layout: 'basic',
      requiresAuth: false,
    },
    redirect: (to) => `/builds/${to.path}`,
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
