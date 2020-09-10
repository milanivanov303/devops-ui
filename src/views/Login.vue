<template>
 <main>
    <Loading v-if="loggingInSSO"/>
    <div v-else class="row">
      <div class="col s10 offset-s1 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
        <div class="card">
          <div class="card-content">
            <span class="card-title center">DevOps Management</span>
            <Alert v-if="error !== ''" v-bind:msg="error" />
            <div class="row">
              <div class="col s12 m8">
                <form>
                  <div class="row">
                    <div class="input-field col s12">
                      <i class="material-icons prefix">account_circle</i>
                      <input type="text" id="username-input" v-model="username" />
                      <label for="username-input">Username</label>
                    </div>
                    <div class="input-field col s12">
                      <i class="material-icons prefix">lock</i>
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
                      id="login-btn"
                        v-if="!loggingIn"
                        @click="login()"
                        class="btn waves-effect waves-light w-100"
                      >
                        Login
                      </button>
                      <Preloader v-else class="small" />
                    </div>
                  </div>
                </form>
              </div>
              <div class="col s12 m4 center">
                <div v-if="ssoUser">
                  <a class="sso-btn" href="#" @click="loginSSO()">
                    <i class="large material-icons col s12">person_pin</i>
                  </a>
                  <p>Continue as <b>{{ ssoUser.name }}</b></p>
                </div>
                <div v-else>
                  <a class="sso-btn" href="#" @click="loginSSO()">
                    <i class="large material-icons col s12">person_pin</i>
                  </a>
                  <Preloader v-if="gettingSSOUser" class="small" />
                  <p v-else>Quick login with <b>User Management (SSO)</b></p>
                </div>
                <Preloader v-if="loggingInSSO" class="preloader-wrapper small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Loading from '../components/layouts/Loading';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      username: '',
      password: '',
      returnUri: '/',
      loggingIn: false,
      loggingInSSO: false,
      gettingSSOUser: false,
      error: '',
      ssoUser: null,
    };
  },
  methods: {
    login() {
      this.loggingIn = true;
      this.error = '';

      this.$auth.login(this.username, this.password)
        .then(() => this.$router.push(this.$route.query.return_uri || this.returnUri))
        .catch((error) => {
          if (error.response.status === 401) {
            this.error = 'Incorrect username or password';
          } else {
            this.error = 'Could not login. Please contact phpid';
          }
        })
        .finally(() => {
          this.loggingIn = false;
        });
    },
    loginSSO() {
      this.loggingInSSO = true;
      this.error = '';

      this.$auth.loginSSO()
        .then(() => this.$router.push(this.$route.query.return_uri || this.returnUri))
        .catch(() => {
          this.loggingInSSO = false;
          this.error = 'Could not login with SSO, Please contact phpid';
        });
    },
    getLoggedInSSOUser() {
      this.gettingSSOUser = true;

      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', '/logged-in-sso-user');
      iframe.setAttribute('hidden', true);

      iframe.onload = (e) => {
        this.gettingSSOUser = false;

        const name = e.target.contentDocument.getElementById('name').innerText;
        const username = e.target.contentDocument.getElementById('username').innerText;

        if (name && username) {
          this.ssoUser = { name, username };
        }
      };

      this.$el.appendChild(iframe);
    },
  },
  created() {
    if (this.$route.query.sso_login) {
      this.loginSSO();
    }
  },
  mounted() {
    this.getLoggedInSSOUser();
  },
};
</script>

<style lang="scss">
  @import "../assets/scss/login";
</style>
