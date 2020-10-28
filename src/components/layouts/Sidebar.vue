<template>
  <ul id="nav-mobile" class="sidenav sidenav-fixed">
    <li class="logo">
        <img src="../../assets/logo.png" alt="DevOps Management">
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
        <li
          v-if="$auth.can('can-manage-authorizations')"
          :class="{ active: isActive('administration') }"
        >
          <a class="collapsible-header">
            <i class="material-icons">settings</i> Administration
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <div class="collapsible-body">
            <ul>
              <li :class="{ active: isActive('administration/users') }">
                <router-link to="/administration/users"> Users</router-link>
              </li>
              <li :class="{ active: isActive('administration/roles') }">
                <router-link to="/administration/roles"> Roles</router-link>
              </li>
              <li :class="{ active: isActive('administration/actions') }">
                <router-link to="/administration/actions"> Actions</router-link>
              </li>
              <li><div class="divider"></div></li>
            </ul>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  methods: {
    isActive(path) {
      const regexp = RegExp(`^/${path}`);

      if (path === 'dashboard' && this.$route.path === '/') {
        return true;
      }

      return regexp.test(this.$route.path);
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
</style>
