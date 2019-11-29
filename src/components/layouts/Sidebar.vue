<template>
  <ul id="nav-mobile" class="sidenav sidenav-fixed">
    <li class="logo">
      <a id="logo-container" class="brand-logo">
        "DevOps Management"
      </a>
    </li>
    <li>
      <ul>
        <li v-bind:class="{ active: isActive('dashboard') }">
          <router-link to="/dashboard">
            <i class="material-icons">web</i> Dashboard
          </router-link>
        </li>
        <li v-bind:class="{ active: isActive('extranet/branches') }">
          <ul class="collapsible collapsible-accordion">
            <li>
              <a class="collapsible-header">
                <i class="material-icons">laptop_chromebook</i> Extranet
                <i class="material-icons right">arrow_drop_down</i>
              </a>
              <div class="collapsible-body">
                <ul>
                  <li class="white-text" v-bind:class="{ active: isActive('extranet/dashboard') }">
                    <router-link to="/extranet/dashboard"> Dashboard</router-link>
                  </li>
                  <li class="white-text" v-bind:class="{ active: isActive('extranet/branches') }">
                    <router-link to="/extranet/branches"> Branches</router-link>
                  </li>
                  <li><div class="divider"></div></li>
                </ul>
              </div>
            </li>
          </ul>
        </li>
        <li v-bind:class="{ active: isActive('demo') }">
          <router-link to="/demo">
            <i class="material-icons">event</i> Demo
          </router-link>
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
    this.$M.Dropdown.init(document.querySelector('.dorpdown-extranet'), {
      coverTrigger: false,
    });
  },
};
</script>
