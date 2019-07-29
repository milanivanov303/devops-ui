<template>
  <nav class="top-nav">
    <div class="nav-wrapper">
      <a href="#" data-target="nav-mobile" class="sidenav-trigger">
        <i class="material-icons">menu</i>
      </a>
      <ul class="right hide-on-med-and-down" v-if="user">
        <li class="logged-user">
          <i class="material-icons left">account_circle</i>
          {{ user.name }}
        </li>
        <li>
          <a class="dropdown-trigger" data-target="profile-dropdown" ref="profile-dropdown">
            <i class="material-icons">expand_more</i>
          </a>
          <ul id="profile-dropdown" class="dropdown-content">
            <li>
              <a @click="logout">
                <i class="material-icons">exit_to_app</i>logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login');
        });
    },
  },
  mounted() {
    this.$M.Dropdown.init(this.$refs['profile-dropdown']);
  },
};
</script>
