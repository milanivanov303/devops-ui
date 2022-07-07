const SeTransferModif = () => import(/* webpackChunkName: "expert-system" */ '../views/expert-system/Modification');
const MainDashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard');
const Builds = () => import(/* webpackChunkName: "dashboard" */ '../views/Builds');

const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/components/Dashboard');
const Branches = () => import(/* webpackChunkName: "branches" */ '@/components/Branches');

const Configurations = () => import(/* webpackChunkName: "pas" */ '../views/pas/configurations/Configurations');
const X4Params = () => import(/* webpackChunkName: "pas" */ '../views/pas/x4-params/X4Params');
const SoaModification = () => import(/* webpackChunkName: "pas" */ '../views/pas/SOAdeployment');

const Documentation = () => import(/* webpackChunkName: "demos" */ '../views/documentation/Documentation');

const DemosDashboard = () => import(/* webpackChunkName: "demos" */ '../views/demos/Dashboard');
const DemosList = () => import(/* webpackChunkName: "demos" */ '../views/demos/Demos');

const ConfigDefaults = () => import(/* webpackChunkName: "cms" */ '../views/cms/ConfigDefaults');
const ResponseFile = () => import(/* webpackChunkName: "cms" */ '../views/cms/ResponseFile');
const Templates = () => import(/* webpackChunkName: "cms" */ '../views/cms/Templates');
const Inventory = () => import(/* webpackChunkName: "cms" */ '../views/cms/Inventory');
const Modification = () => import(/* webpackChunkName: "cms" */ '../views/cms/Modification');
const CmsConfigurations = () => import(/* webpackChunkName: "cms" */ '../views/cms/Conf');

const EsxiDashboard = () => import(/* webpackChunkName: "esxi" */ '../views/esxi/dashboard/Dashboard');
const Items = () => import(/* webpackChunkName: "esxi" */ '@/views/esxi/Items');
const VirtualMachines = () => import(/* webpackChunkName: "esxi" */ '@/views/esxi/virtualMachines/VirtualMachines');
const Instances = () => import(/* webpackChunkName: "esxi" */ '@/views/esxi/instances/Instances');
const ImxComponents = () => import(/* webpackChunkName: "esxi" */ '../views/esxi/imxComponents/ImxComponents');
const InstanceRequest = () => import(/* webpackChunkName: "esxi" */ '../views/esxi/request/InstanceRequest');

const DevopsUsersAdministration = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/devops/Users');
const DevopsRolesAdministration = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/devops/Roles');
const DevopsActionsAdministration = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/devops/Actions');
const DevopsLogsAdministration = () => import(/* webpackChunkName: "administration-logs" */ '../views/administration/devops/Logs');

const CmsUsersAdministration = () => import(/* webpackChunkName: "administration-users" */ '../views/administration/cms/Users');
const CmsRolesAdministration = () => import(/* webpackChunkName: "administration-roles" */ '../views/administration/cms/Roles');
const CmsActionsAdministration = () => import(/* webpackChunkName: "administration-actions" */ '../views/administration/cms/Actions');
const ModulesSubmodules = () => import(/* webpackChunkName: "modules-submodules" */ '../views/administration/cms/ModulesSubmodules');

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

  // Extranet X4 Tab
  {
    path: '/extranet-x4',
    redirect: '/extranet-x4/dashboard',
  },
  {
    path: '/extranet-x4/dashboard',
    name: 'extranet-x4',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Extranet X4 Dashboard',
      breadcrumb: 'Dashboard',
    },
    component: Dashboard,
    props: {
      module: 'extranet-x4',
    },
  },
  {
    path: '/extranet-x4/branches/:branch?',
    name: 'extranet-x4-branches',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: (route) => {
        let title = 'Extranet X4 Branches';

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
      module: 'extranet-x4',
    },
  },

  {
    path: '/pas/configurations/:id?/:action?',
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
    name: 'soa-modification',
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
  {
    path: '/pas/x4-params',
    redirect: '/pas/x4-params/config',
  },
  {
    path: '/pas/x4-params/:type?/:id?',
    name: 'x4-parameters',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'X4 Parameters',
      breadcrumb: 'X4 Parameters',
    },
    component: X4Params,
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

  // Documentation
  {
    path: '/documentation/:module?',
    name: 'documentation',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: (route) => {
        let title = 'Documentation';

        if (route.query.module) {
          title = `${route.query.module} - ${title}`;
        }
        return title;
      },
    },
    component: Documentation,
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
  {
    path: '/cms/configurations',
    meta: {
      alias: '/configurations',
      name: 'configurations',
      requiresAuth: true,
      breadcrumb: 'Configurations',
    },
    component: CmsConfigurations,
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
  {
    path: '/inventory/request/:id?',
    meta: {
      requiresAuth: true,
      name: 'instance-request',
      transitionName: 'slide',
      title: 'Instance request',
    },
    component: InstanceRequest,
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
  {
    path: '/administration/cms/modules-submodules',
    name: 'modules-submodules',
    meta: {
      requiresAuth: true,
      transitionName: 'slide',
      title: 'Modules Submodules',
      breadcrumb: 'Modules Submodules',
    },
    component: ModulesSubmodules,
  },

  // Builds
  {
    path: '/builds/:name(.*[-_]{1}\\d{10})/:uri(.*)?',
    meta: {
      layout: 'basic',
      requiresAuth: false,
    },
    component: OpenBuild,
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
