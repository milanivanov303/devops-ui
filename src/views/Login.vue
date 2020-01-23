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
                      <div v-if="loggingIn" class="preloader-wrapper small active">
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
                </form>
              </div>
              <div class="col s12 m4 center">
                <a class="sso-btn" href="#" v-if="!loggingInSSO"
                  @click="loginSSO()">
                  <i class="large material-icons">person_pin</i>
                  </a>
                  <p>Quick login with SSO</p>
                <div v-if="loggingInSSO" class="preloader-wrapper small active">
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
  </main>
</template>

<script>
import Alert from '@/components/partials/Alert';
import Loading from '@/components/layouts/Loading';
import config from '@/config';

export default {
  components: {
    Alert,
    Loading,
  },
  data() {
    return {
      username: '',
      password: '',
      returnUri: '/',
      loggingIn: false,
      loggingInSSO: false,
      error: '',
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
  },
  mounted() {
    if (this.$auth.loginWithSSO()) {
      this.loginSSO();
    }
  },
};
</script>

<style lang="scss">
@import "../assets/scss/login";
</style>
