<template>
  <ul id="nav-mobile" class="sidenav sidenav-fixed">
    <li class="logo">
        <img src="/applications/yTjvXuxGM5i/big_logo" alt="DevOps Management">
    </li>
    <li>
      <ul class="collapsible collapsible-accordion">
        <li :class="{ active: isActive('dashboard') }">
          <router-link to="/dashboard">
            <i class="material-icons">web</i> Dashboard
          </router-link>
        </li>
        <li :class="{ active: isActive('extranet') }">
          <a class="collapsible-header">
            <i class="material-icons">laptop_chromebook</i> Extranet
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('extranet/dashboard') }">
                <router-link to="/extranet/dashboard"> Dashboard</router-link>
              </li>
              <li v-bind:class="{ active: isActive('extranet/branches') }">
                <router-link to="/extranet/branches"> Branches</router-link>
              </li>
              <li :class="{ active: isActive('extranet/configurations') }">
                <router-link to="/extranet/configurations"> DevOps Matrix</router-link>
              </li>
              <li :class="{ active: isActive('extranet/soa-modification') }">
                <router-link to="/extranet/soa-modification"> SOA Modification</router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('debiteur') }">
          <a class="collapsible-header">
            <i class="material-icons">laptop_chromebook</i> Debiteur
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('debiteur/dashboard') }">
                <router-link to="/debiteur/dashboard"> Dashboard</router-link>
              </li>
              <li v-bind:class="{ active: isActive('debiteur/branches') }">
                <router-link to="/debiteur/branches"> Branches</router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('imx_be') }">
          <a class="collapsible-header">
            <i class="material-icons">aspect_ratio</i> iMX BE
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('imx_be/dashboard') }">
                <router-link to="/imx_be/dashboard"> Dashboard</router-link>
              </li>
              <li :class="{ active: isActive('imx_be/branches') }">
                <router-link to="/imx_be/branches"> Branches</router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
        <li :class="{ active: isActive('imx_fe') }">
          <a class="collapsible-header">
            <i class="material-icons">devices</i> iMX FE
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('imx_fe/dashboard') }">
                <router-link to="/imx_fe/dashboard"> Dashboard</router-link>
              </li>
              <li :class="{ active: isActive('imx_fe/branches') }">
                <router-link to="/imx_fe/branches"> Branches</router-link>
              </li>
              <li><div class="divider"></div></li>
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
              <li :class="{ active: isActive('inventory/esxiHosts') }">
                <router-link to="/inventory/esxiHosts"> ESXi Hosts</router-link>
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
  }
</style>
