<template>
  <ul id="nav-mobile" class="sidenav sidenav-fixed">
    <li class="logo">
      <img
        :src="`${config.um.url}/applications/${config.devops.code}/big_logo`"
        alt="DevOps Management"
      >
    </li>
    <li :class="{ active: isActive('dashboard') }">
      <router-link to="/dashboard">
        <i class="material-icons">web</i> Dashboard
      </router-link>
    </li>
    <li>
      <ul class="collapsible collapsible-accordion">
        <li v-bind:class="{
      active:
        isActive('pas') || isActive('extranet') || isActive('debiteur')}"
        >
          <a class="collapsible-header">
            <i class="material-icons">business_center</i> PAS
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul class="collapsible">
              <li :class="{ active: isActive('pas/configurations') }">
                <router-link to="/pas/configurations"> DevOps Matrix</router-link>
              </li>
              <li :class="{ active: isActive('extranet/') }">
                <router-link to="/extranet/dashboard"> Extranet</router-link>
              </li>
              <li :class="{ active: isActive('extranet-x4') }">
                <router-link to="/extranet-x4/dashboard"> Extranet X4</router-link>
              </li>
              <li :class="{ active: isActive('extranet-x5') }">
                <router-link to="/extranet-x5/dashboard"> Extranet X5</router-link>
              </li>
              <li :class="{ active: isActive('debiteur') }">
                <router-link to="/debiteur/dashboard"> Debiteur</router-link>
              </li>
              <li :class="{ active: isActive('pas/soa-modification') }">
                <router-link to="/pas/soa-modification"> SOA</router-link>
              </li>
              <li v-if="$auth.can('can-manage-authorizations', getApplicationCode('devops'))"
                  :class="{ active: isActive('pas/params') }">
                <router-link to="/pas/params">Parameters</router-link>
              </li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('imx_be') }">
          <router-link to="/imx_be/dashboard">
            <i class="material-icons">aspect_ratio</i> iMX BE
          </router-link>
        </li>
        <li :class="{ active: isActive('imx_fe') }">
          <router-link to="/imx_fe/dashboard">
            <i class="material-icons">devices</i> iMX FE
          </router-link>
        </li>
        <li :class="{ active: isActive('imx_combined') }">
          <router-link to="/imx_combined/dashboard">
            <i class="material-icons">link</i> iMX FE + iMX BE
          </router-link>
        </li>
        <li :class="{ active: isActive('documentation') }">
          <a class="collapsible-header">
            <i class="material-icons">library_books</i> Documentation
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('documentation/Extranet') }">
                <router-link to="/documentation/Extranet">Extranet</router-link>
              </li>
              <li :class="{ active: isActive('documentation/B2B') }">
                <router-link to="/documentation/B2B">B2B</router-link>
              </li>
              <li :class="{ active: isActive('documentation/API_Platform') }">
                <router-link to="/documentation/API_Platform">API Platform</router-link>
              </li>
              <li :class="{ active: isActive('documentation/modules') }">
                <router-link to="/documentation/modules">Modules</router-link>
              </li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('demos') }">
          <a class="collapsible-header">
            <i class="material-icons">event</i> Demos
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('demos/dashboard') }">
                <router-link to="/demos/dashboard"> Dashboard</router-link>
              </li>
              <li :class="{ active: isActive('demos/list') }">
                <router-link to="/demos/list"> Demos</router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('cms') }">
          <a class="collapsible-header">
            <i class="material-icons">apps</i> CMS
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li>
                <a :href="config.cms.cms_user_guide">User Guide</a>
              </li>
              <li :class="{ active: isActive('cms/config-defaults') }">
                <router-link to="/cms/config-defaults">
                  Config Defaults
                </router-link>
              </li>
              <li :class="{ active: isActive('cms/response-file') }">
                <router-link to="/cms/response-file">
                  Response Files
                </router-link>
              </li>
              <li :class="{ active: isActive('cms/templates') }">
                <router-link to="/cms/templates">
                  Templates
                </router-link>
              <li :class="{ active: isActive('cms/inventory') }">
                <router-link to="/cms/inventory">
                  Inventory
                </router-link>
              </li>
              <li :class="{ active: isActive('cms/modification') }">
                <router-link to="/cms/modification">
                  Modification
                </router-link>
              </li>
               <li :class="{ active: isActive('cms/configurations') }">
                <router-link to="/cms/configurations">
                  Configurations
                </router-link>
              </li>
              <li v-if="$auth.can('can-manage-modules', getApplicationCode('cms'))"
                  :class="{ active: isActive('cms/modules-submodules') }">
                <router-link to="/cms/modules-submodules">
                  Modules / Submodules
                </router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('expert-system/modification') }">
          <a class="collapsible-header">
            <i class="material-icons">assessment</i> Expert System
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('expert-system') }">
                <router-link to="/expert-system/modification">
                  Modification
                </router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('inventory') }">
          <a class="collapsible-header">
            <i class="material-icons">view_list</i> Inventory
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('inventory/dashboard') }">
                <router-link to="/inventory/dashboard"> Dashboard</router-link>
              </li>
              <li :class="{ active: isActive('inventory/sanDashboard') }">
                <router-link to="/inventory/sanDashboard"> SAN</router-link>
              </li>
              <li :class="{ active: isActive('inventory/esxiHosts') }">
                <router-link to="/inventory/esxiHosts"> ESXi Hosts</router-link>
              </li>
              <li :class="{ active: isActive('inventory/virtualMachines') }">
                <router-link to="/inventory/virtualMachines"> Virtual Machines</router-link>
              </li>
              <li :class="{ active: isActive('inventory/instances') }">
                <router-link to="/inventory/instances"> Instances</router-link>
              </li>
              <li :class="{ active: isActive('inventory/imxComponents') }">
                <router-link to="/inventory/imxComponents"> iMX Components</router-link>
              </li>
              <li
                  :class="{ active: isActive('inventory/request') }">
                <router-link to="/inventory/request"> Instance Request</router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li
          v-if="$auth.can('can-manage-authorizations', getApplicationCode('cms'))
           || $auth.can('can-manage-authorizations', getApplicationCode('devops'))"
          :class="{ active: isActive('administration') }"
        >
          <a class="collapsible-header">
            <i class="material-icons">settings</i> Administration
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <div v-if="$auth.can('can-manage-authorizations', getApplicationCode('devops'))">
              <div class="subheader">Devops</div>
              <ul>
                <li :class="{ active: isActive('administration/devops/users') }">
                  <router-link to="/administration/devops/users"> Users</router-link>
                </li>
                <li :class="{ active: isActive('administration/devops/roles') }">
                  <router-link to="/administration/devops/roles"> Roles</router-link>
                </li>
                <li
                  v-if="$auth.can('isAdmin', getApplicationCode('devops'))"
                  :class="{ active: isActive('administration/devops/actions') }"
                >
                  <router-link to="/administration/devops/actions"> Actions</router-link>
                </li>
                <li :class="{ active: isActive('administration/devops/logs') }">
                  <router-link to="/administration/devops/logs"> Logs</router-link>
                </li>
                <li><div class="divider"></div></li>
              </ul>
            </div>
            <div v-if="$auth.can('can-manage-authorizations', getApplicationCode('cms'))">
              <div class="subheader">CMS</div>
              <ul>
                <li :class="{ active: isActive('administration/cms/users') }">
                  <router-link to="/administration/cms/users"> Users</router-link>
                </li>
                <li :class="{ active: isActive('administration/cms/roles') }">
                  <router-link to="/administration/cms/roles"> Roles</router-link>
                </li>
                <li
                  v-if="$auth.can('isAdmin', getApplicationCode('cms'))"
                  :class="{ active: isActive('administration/cms/actions') }"
                >
                  <router-link to="/administration/cms/actions"> Actions</router-link>
                </li>
                <li><div class="divider"></div></li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import config from '@/config';

export default {
  data() {
    return {
      config,
    };
  },

  methods: {
    isActive(path) {
      const regexp = RegExp(`^/${path}`);

      if (path === 'dashboard' && this.$route.path === '/') {
        return true;
      }

      return regexp.test(this.$route.path);
    },

    getApplicationCode(application) {
      return config[application].code;
    },
  },

  mounted() {
    this.$M.Sidenav.init(document.querySelector('.sidenav'));
    this.$M.Collapsible.init(document.querySelector('.collapsible'));
  },
};
</script>

<style lang="scss" scoped>
li.active {
  .collapsible-body {
    display: block;
  }
}

.sidenav {
  .subheader {
    color: white;
    padding: 0 15px;
  }

  li > a > i.material-icons {
    margin: 0 14px 0 0 ;
  }
}
</style>
