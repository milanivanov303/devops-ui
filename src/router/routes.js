const SeTransferModif = () => import(/* webpackChunkName: "expert-system" */ '../views/expert-system/Modification');
const MainDashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard');
const Builds = () => import(/* webpackChunkName: "dashboard" */ '../views/Builds');

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/components/Dashboard');
const Branches = () => import(/* webpackChunkName: "branches" */ '@/components/Branches');

const Configurations = () => import(/* webpackChunkName: "extranet" */ '../views/pas/configurations/Configurations');
const SoaModification = () => import(/* webpackChunkName: "extranet" */ '../views/pas/SOAdeployment');

const DemosDashboard = () => import(/* webpackChunkName: "demos" */ '../views/demos/Dashboard');
const DemosList = () => import(/* webpackChunkName: "demos" */ '../views/demos/Demos');

const ConfigDefaults = () => import(/* webpackChunkName: "cms" */ '../views/cms/ConfigDefaults');
const ResponseFile = () => import(/* webpackChunkName: "cms" */ '../views/cms/ResponseFile');
const Templates = () => import(/* webpackChunkName: "cms" */ '../views/cms/Templates');
const Inventory = () => import(/* webpackChunkName: "cms" */ '../views/cms/Inventory');
const Modification = () => import(/* webpackChunkName: "cms" */ '../views/cms/Modification');

const EsxiDashboard = () => import(/* webpackChunkName: "esxi" */ '../views/esxi/dashboard/Dashboard');
const Items = () => import(/* webpackChunkName: "esxi" */ '@/views/esxi/Items');
const VirtualMachines = () => import(/* webpackChunkName: "esxi" */ '@/views/esxi/virtualMachines/VirtualMachines');
const Instances = () => import(/* webpackChunkName: "esxi" */ '@/views/esxi/instances/Instances');
const ImxComponents = () => import('../views/esxi/imxComponents/ImxComponents');

const DevopsUsersAdministration = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/devops/Users');
const DevopsRolesAdministration = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/devops/Roles');
const DevopsActionsAdministration = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/devops/Actions');
const DevopsLogsAdministration = () => import(/* webpackChunkName: "administration-logs" */ '../views/administration/devops/Logs');

const CmsUsersAdministration = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/cms/Users');
const CmsRolesAdministration = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/cms/Roles');
const CmsActionsAdministration = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/cms/Actions');

const OpenBuild = () => import(/* webpackChunkName: "open-build" */ '../views/OpenBuild');

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'login',
      requiresAuth: false,
    },
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
    name: 'dashboard',
    meta: {
      requiresAuth: true,
      alias: '/dashboard',
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
    },
    component: MainDashboard,
  },

  {
    path: '/builds',
    name: 'builds',
    meta: {
      requiresAuth: true,
      alias: '/builds',
      title: 'Builds',
      breadcrumb: 'Builds',
    },
    component: Builds,
  },

  // Extranet Tab
  {
    path: '/extranet',
    redirect: '/extranet/dashboard',
  },
  {
    path: '/extranet/dashboard',
    name: 'extranet',
    meta: {
      requiresAuth: true,
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
    path: '/extranet/branches/:branch?',
    name: 'extranet-branches',
    meta: {
      requiresAuth: true,
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
    path: '/pas/configurations/:id?/:build?',
    name: 'configurations',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Configurations',
      breadcrumb: 'Configurations',
    },
    component: Configurations,
  },
  {
    path: '/pas/soa-modification/:issue?',
    name: 'extranet',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'SOA Modification',
      breadcrumb: 'SOA Modification',
    },
    component: SoaModification,
    props: {
      module: 'pas',
    },
  },

  // Debiteur Tab
  {
    path: '/debiteur',
    redirect: '/debiteur/dashboard',
  },
  {
    path: '/debiteur/dashboard',
    name: 'debiteur',
    meta: {
      requiresAuth: true,
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
    name: 'debiteur-branches',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Debiteur Branches',
      breadcrumb: 'Branches',
    },
    component: Branches,
    props: {
      module: 'debiteur',
    },
  },

  // iMX BE Tab
  {
    path: '/imx_be',
    redirect: '/imx_be/dashboard',
  },
  {
    path: '/imx_be/dashboard',
    name: 'imx-be',
    meta: {
      requiresAuth: true,
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
    name: 'imx-be-branches',
    meta: {
      requiresAuth: true,
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

  // iMX FE Tab
  {
    path: '/imx_fe',
    redirect: '/imx_fe/dashboard',
  },
  {
    path: '/imx_fe/dashboard',
    name: 'imx-fe',
    meta: {
      requiresAuth: true,
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
    name: 'imx-fe-branches',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'iMX-FE Branches',
    },
    component: Branches,
    props: {
      module: 'imx_fe',
    },
  },

  // Demos Tab
  {
    path: '/demos',
    name: 'demos',
    meta: {
      requiresAuth: true,
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
    name: 'demo',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Demo',
      breadcrumb: 'Demo',
    },
    component: DemosList,
  },

  // CMS Tab
  {
    path: '/cms',
    redirect: '/cms/config-defaults',
  },
  {
    path: '/cms/config-defaults',
    name: 'configDefaults',
    meta: {
      alias: '/configDefaults',
      requiresAuth: true,
      breadcrumb: 'Config Defaults',
    },
    component: ConfigDefaults,
  },
  {
    path: '/cms/response-file',
    name: 'responseFile',
    meta: {
      alias: '/responseFile',
      requiresAuth: true,
      breadcrumb: 'Response File',
    },
    component: ResponseFile,
  },
  {
    path: '/cms/templates',
    name: 'templates',
    meta: {
      alias: '/templates',
      requiresAuth: true,
      breadcrumb: 'Templates',
    },
    component: Templates,
  },
  {
    path: '/cms/inventory',
    name: 'inventory',
    meta: {
      alias: '/inventory',
      requiresAuth: true,
      breadcrumb: 'Inventory',
    },
    component: Inventory,
  },
  {
    path: '/cms/modification/:issue?',
    name: 'modification',
    meta: {
      alias: '/modification',
      requiresAuth: true,
      breadcrumb: 'Modification',
    },
    component: Modification,
  },

  // Inventory Tab
  {
    path: '/inventory',
    redirect: '/inventory/dashboard',
  },
  {
    path: '/inventory/dashboard',
    name: 'inventory',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'ESXI Dashboard',
    },
    component: EsxiDashboard,
  },
  {
    path: '/inventory/esxiHosts/:name?',
    name: 'esxi-esxi-hosts',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: (route) => {
        let title = 'ESXi Hosts';

        if (route.query.esxiHost) {
          title = `${route.query.esxiHost} - ${title}`;
        }

        return title;
      },
    },
    component: Items,
    props: {
      module: 'esxiHosts',
    },
  },
  {
    path: '/inventory/virtualMachines/:name?',
    name: 'esxi-virtual-machines',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: (route) => {
        let title = 'Virtual Machines';

        if (route.query.virtualMachine) {
          title = `${route.query.virtualMachine} - ${title}`;
        }

        return title;
      },
    },
    component: VirtualMachines,
  },
  {
    path: '/inventory/instances/:id?',
    name: 'esxi-instances',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: (route) => {
        let title = 'Instances';

        if (route.query.instance) {
          title = `${route.query.instance} - ${title}`;
        }

        return title;
      },
    },
    component: Instances,
  },
  {
    path: '/inventory/imxComponents/:id?',
    name: 'esxi-components',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: (route) => {
        let title = 'Components';

        if (route.query.imxComponent) {
          title = `${route.query.imxComponent} - ${title}`;
        }

        return title;
      },
    },
    component: ImxComponents,
  },
  // Devops Administration Tab
  {
    path: '/expert-system/modification/:issue?',
    name: 'expert-system modification',
    meta: {
      alias: '/expert-system-modification',
      requiresAuth: true,
      title: 'SE Transfer Modification',
      breadcrumb: 'Expert system modification',
    },
    component: SeTransferModif,
  },
  {
    path: '/administration/devops/users/:id?',
    name: 'administration-users',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Users Administration',
      breadcrumb: 'Users',
    },
    component: DevopsUsersAdministration,
  },
  {
    path: '/administration/devops/roles/:id?',
    name: 'administration-roles',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Roles Administration',
      breadcrumb: 'Roles',
    },
    component: DevopsRolesAdministration,
  },
  {
    path: '/administration/devops/actions/:id?',
    name: 'administration-actions',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Actions Administration',
      breadcrumb: 'Actions',
    },
    component: DevopsActionsAdministration,
  },
  {
    path: '/administration/devops/logs',
    name: 'administration-logs',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Logs Administration',
      breadcrumb: 'Logs',
    },
    component: DevopsLogsAdministration,
  },

  // CMS Administration Tab
  {
    path: '/administration/cms/users/:id?',
    name: 'administration-users',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Users Administration',
      breadcrumb: 'Users',
    },
    component: CmsUsersAdministration,
  },
  {
    path: '/administration/cms/roles/:id?',
    name: 'administration-roles',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Roles Administration',
      breadcrumb: 'Roles',
    },
    component: CmsRolesAdministration,
  },
  {
    path: '/administration/cms/actions/:id?',
    name: 'administration-actions',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Actions Administration',
      breadcrumb: 'Actions',
    },
    component: CmsActionsAdministration,
  },

  // Builds
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
