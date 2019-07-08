<template>
  <div class="row">
    <div class="col s10 offset-s1 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Devops Management - Login</span>
          <Alert v-if="hasError" v-bind:msg="getError" />
          <div class="row">
            <div class="col s12 m8">
              <div class="row">
                <div class="input-field col s12">
                  <input type="text" id="username-input" v-model="username" />
                  <label for="username-input">Username</label>
                </div>

                <div class="input-field col s12">
                  <input
                    type="password"
                    id="password-input"
                    v-model="password"
                  />
                  <label for="password-input">Password</label>
                </div>
              </div>
              <div class="row">
                <div class="col s12 center">
                  <button
                    v-if="!isLoggingIn"
                    @click="login()"
                    class="btn waves-effect waves-light w-100"
                  >
                    Login
                  </button>
                  <div
                    v-if="isLoggingIn"
                    class="preloader-wrapper small active"
                  >
                    <div class="spinner-layer spinner-blue-only">
                      <div class="circle-clipper left">
                        <div class="circle"></div>
                      </div>
                      <div class="gap-patch">
                        <div class="circle"></div>
                      </div>
                      <div class="circle-clipper right">
                        <div class="circle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col s12 m4 center">
              <div>
                <i class="large material-icons">supervisor_account</i>
              </div>
              <button
                v-if="!isLoggingInSSO"
                class="btn waves-effect waves-light w-100"
                @click="loginSSO()"
              >
                Login with SSO
              </button>
              <div v-if="isLoggingInSSO" class="preloader-wrapper small active">
                <div class="spinner-layer spinner-blue-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div>
                  <div class="gap-patch">
                    <div class="circle"></div>
                  </div>
                  <div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  components: {
    Alert
  },
  data() {
    return {
      username: "",
      password: "",
      returnUri: "/"
    };
  },
  computed: {
    isLoggingIn() {
      return this.$store.getters.isLoggingIn;
    },
    isLoggingInSSO() {
      return this.$store.getters.isLoggingInSSO;
    },
    hasError() {
      return this.$store.getters.hasError;
    },
    getError() {
      return this.$store.getters.getError;
    }
  },
  methods: {
    login() {
      const { username, password } = this;
      this.$auth.login(username, password);
    },
    loginSSO() {
      this.$auth.loginSSO();
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/login";
</style>
