const MainDashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard');
const ExtranetConfigurations = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/Configurations');
const SoaModification = () => import(/* webpackChunkName: "extranet" */ '../views/extranet/components/SOAdeployment');
const DemosDashboard = () => import(/* webpackChunkName: "demos" */ '../views/demos/Dashboard');
const DemosList = () => import(/* webpackChunkName: "demos" */ '../views/demos/Demos');
const ConfigDefaults = () => import(/* webpackChunkName: "cms" */ '../views/cms/ConfigDefaults');
const ResponseFile = () => import(/* webpackChunkName: "cms" */ '../views/cms/ResponseFile');
const Templates = () => import(/* webpackChunkName: "cms" */ '../views/cms/Templates');
const Inventory = () => import(/* webpackChunkName: "cms" */ '../views/cms/Inventory');
const Modification = () => import(/* webpackChunkName: "cms" */ '../views/cms/Modification');
const EsxiDashboard = () => import(/* webpackChunkName: "cms" */ '../views/esxi/Dashboard');

const DevopsUsersAdministration = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/devops/Users');
const DevopsRolesAdministration = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/devops/Roles');
const DevopsActionsAdministration = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/devops/Actions');

const CmsUsersAdministration = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/cms/Users');
const CmsRolesAdministration = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/cms/Roles');
const CmsActionsAdministration = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/cms/Actions');

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/components/Dashboard');
const Branches = () => import(/* webpackChunkName: "branches" */ '@/components/Branches');
const Hosts = () => import(/* webpackChunkName: "hosts" */ '@/views/esxi/Hosts');

const Login = () => import(/* webpackChunkName: "login" */ '../views/Login');
const OpenBuild = () => import(/* webpackChunkName: "open-build" */ '../views/OpenBuild');

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
        return;
      }

      next();
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
    component: MainDashboard,
  },

  {
    path: '/extranet',
    redirect: '/extranet/dashboard',
  },
  {
    path: '/extranet/dashboard',
    meta: {
      requiresAuth: true,
      name: 'extranet',
      transitionName: 'slide',
      title: 'Extranet Dashboard',
      breadcrumb: 'Dashboard',
    },
    component: Dashboard,
    props: {
      module: 'extranet',
    },
  },
  {
    path: '/extranet/soa-modification/:issue?',
    meta: {
      requiresAuth: true,
      name: 'extranet',
      transitionName: 'slide',
      title: 'SOA Modification',
      breadcrumb: 'SOA Modification',
    },
    component: SoaModification,
    props: {
      module: 'extranet',
    },
  },
  {
    path: '/extranet/branches/:branch?',
    meta: {
      requiresAuth: true,
      name: 'extranet-branches',
      transitionName: 'slide',
      title: (route) => {
        let title = 'Extranet Branches';

        if (route.query.branch) {
          title = `${route.query.branch} - ${title}`;
        }

        if (route.query.action === 'docs') {
          title = `Documentation - ${title}`;
        }

        return title;
      },
    },
    component: Branches,
    props: {
      module: 'extranet',
    },
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
    redirect: '/debiteur/dashboard',
  },
  {
    path: '/debiteur/dashboard',
    meta: {
      requiresAuth: true,
      name: 'debiteur',
      transitionName: 'slide',
      title: 'Debiteur Dashboard',
      breadcrumb: 'Dashboard',
    },
    component: Dashboard,
    props: {
      module: 'debiteur',
    },
  },
  {
    path: '/debiteur/branches/:branch?',
    meta: {
      requiresAuth: true,
      name: 'debiteur-branches',
      transitionName: 'slide',
      title: 'Debiteur Branches',
      breadcrumb: 'Branches',
    },
    component: Branches,
    props: {
      module: 'debiteur',
    },
  },

  {
    path: '/imx_be',
    redirect: '/imx_be/dashboard',
  },
  {
    path: '/imx_be/dashboard',
    meta: {
      requiresAuth: true,
      name: 'imx-be',
      transitionName: 'slide',
      title: 'iMX BE Dashboard',
    },
    component: Dashboard,
    props: {
      module: 'imx_be',
    },
  },
  {
    path: '/imx_be/branches',
    meta: {
      requiresAuth: true,
      name: 'imx-be-branches',
      transitionName: 'slide',
      title: (route) => {
        let title = 'iMX BE Branches';

        if (route.query.branch) {
          title = `${route.query.branch} - ${title}`;
        }

        if (route.query.action === 'docs') {
          title = `Documentation - ${title}`;
        }

        return title;
      },
    },
    component: Branches,
    props: {
      module: 'imx_be',
    },
  },
  {
    path: '/imx_fe',
    redirect: '/imx_fe/dashboard',
  },
  {
    path: '/imx_fe/dashboard',
    meta: {
      requiresAuth: true,
      name: 'imx-fe',
      transitionName: 'slide',
      title: 'iMX FE Dashboard',
    },
    component: Dashboard,
    props: {
      module: 'imx_fe',
    },
  },
  {
    path: '/imx_fe/branches',
    meta: {
      requiresAuth: true,
      name: 'imx-fe-branches',
      transitionName: 'slide',
      title: 'iMX-FE Branches',
    },
    component: Branches,
    props: {
      module: 'imx_fe',
    },
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
    path: '/administration/devops/users/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-users',
      transitionName: 'slide',
      title: 'Users Administration',
      breadcrumb: 'Users',
    },
    component: DevopsUsersAdministration,
  },
  {
    path: '/administration/devops/roles/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-roles',
      transitionName: 'slide',
      title: 'Roles Administration',
      breadcrumb: 'Roles',
    },
    component: DevopsRolesAdministration,
  },
  {
    path: '/administration/devops/actions/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-actions',
      transitionName: 'slide',
      title: 'Actions Administration',
      breadcrumb: 'Actions',
    },
    component: DevopsActionsAdministration,
  },
  {
    path: '/administration/cms/users/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-users',
      transitionName: 'slide',
      title: 'Users Administration',
      breadcrumb: 'Users',
    },
    component: CmsUsersAdministration,
  },
  {
    path: '/administration/cms/roles/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-roles',
      transitionName: 'slide',
      title: 'Roles Administration',
      breadcrumb: 'Roles',
    },
    component: CmsRolesAdministration,
  },
  {
    path: '/administration/cms/actions/:id?',
    meta: {
      requiresAuth: true,
      name: 'administration-actions',
      transitionName: 'slide',
      title: 'Actions Administration',
      breadcrumb: 'Actions',
    },
    component: CmsActionsAdministration,
  },

  {
    path: '/esxi',
    redirect: '/esxi/dashboard',
  },
  {
    path: '/esxi/dashboard',
    meta: {
      requiresAuth: true,
      name: 'esxi',
      transitionName: 'slide',
      title: 'ESXI Dashboard',
    },
    component: EsxiDashboard,
  },
  {
    path: '/esxi/esxiHosts/:esxiHost?',
    meta: {
      requiresAuth: true,
      name: 'esxi-esxiHosts',
      transitionName: 'slide',
      title: (route) => {
        let title = 'ESXi Hosts';

        if (route.query.esxiHost) {
          title = `${route.query.esxiHost} - ${title}`;
        }

        return title;
      },
    },
    component: Hosts,
    props: {
      module: 'esxi',
    },
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
    redirect: (to) => `/builds${to.path}`,
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
