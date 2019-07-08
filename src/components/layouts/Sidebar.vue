<template>
  <ul id="nav-mobile" class="sidenav sidenav-fixed">
    <li class="logo">
      <a id="logo-container" class="brand-logo">
        <img src="../../assets/images/logo.png" alt="DevOps Management" />
      </a>
    </li>
    <li>
      <ul>
        <li v-bind:class="{ active: isActive('dashboard') }">
          <router-link to="/dashboard">
            <i class="material-icons">laptop_chromebook</i> Dashboard
          </router-link>
        </li>
        <li v-bind:class="{ active: isActive('extranet/branches') }">
          <router-link to="/extranet/branches">
            <i class="material-icons">apps</i> Extranet
          </router-link>
          <ul>
            <li v-bind:class="{ active: isActive('extranet/branches') }">
              <router-link to="/extranet/branches">Branches</router-link>
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
      let regexp = RegExp('^/' + path);

      if (path === "dashboard" && this.$route.path === "/") {
        return true;
      }

      return regexp.test(this.$route.path);
    }
  }
};
</script>
