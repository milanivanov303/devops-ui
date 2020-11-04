<template>
  <Loading v-if="loggingInSSO"/>
  <div v-else class="row">
    <div class="col s12 l7">
      <div class="col l7 animation">
        <vue-particles
          color="#cfd2da"
          :particleOpacity="0.7"
          :particlesNumber="90"
          shapeType="circle"
          :particleSize="3"
          linesColor="#cfd2da"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.3"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push">
        </vue-particles>
      </div>
      <img class="col  logo" src="../assets/images/do-icon-100px.png" alt="DevOps Management"/>
    </div>
    <div class="col s12 l5">
      <div class="title">
        <h4 class="center">Welcome to DevOps Management</h4>
      </div>
      <Alert v-if="error !== ''" v-bind:msg="error" />
      <div class="description">
        <span>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        </span>
      </div>
      <div class="login-btn">
        <div class="center">
          <div v-if="ssoUser">
            <p>Continue as</p>
            <div class="chip" @click="loginSSO()">
              <img :src="userImg()" alt="User"/>
              {{ ssoUser.name }}
            </div>
            <p><a @click="loginAnotherUser()">or log with another user</a></p>
          </div>
          <div v-else>
            <Preloader v-if="gettingSSOUser" class="small" />
            <a v-else class="waves-effect waves-light pwbtn sso-btn"
               @click="loginSSO()"
               href="#">
              <div class="chip">Quick login with <b>User Management (SSO)</b></div>
            </a>
          </div>
          <Preloader v-if="loggingInSSO" class="preloader-wrapper small" />
        </div>
      </div>
    </div>
  </div>
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
      returnUri: '/',
      loggingIn: false,
      loggingInSSO: false,
      gettingSSOUser: false,
      error: '',
      ssoUser: null,
    };
  },
  methods: {
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
    loginAnotherUser() {
      window.location.href = `${auth.url}/../logout?redirect_url=${encodeURIComponent(`${auth.getSsoUrl()}`)}`;
    },
    getLoggedInSSOUser() {
      this.gettingSSOUser = true;

      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', '/logged-in-sso-user');
      iframe.setAttribute('hidden', true);

      iframe.onload = (e) => {
        this.gettingSSOUser = false;

        if (!e.target.contentDocument) {
          return;
        }

        const name = e.target.contentDocument.getElementById('name').innerText;
        const username = e.target.contentDocument.getElementById('username').innerText;

        if (name && username) {
          this.ssoUser = { name, username };
        }
      };

      this.$el.appendChild(iframe);
    },
    userImg() {
      return `http://kubrat.codixfr.private/phones/images/${this.ssoUser.username}.jpg`;
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
  .animation {
    canvas{
        height: calc(95vh - 100px) !important;
    }
    position: absolute;
  }
</style>
