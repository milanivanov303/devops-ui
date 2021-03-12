<template>
  <Loading v-if="loggingIn"/>
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
      <img class="col  logo" src="/applications/yTjvXuxGM5i/logo" alt="DevOps Management"/>
    </div>
    <div class="col s12 l5">
      <div class="title">
        <h4 class="center">Welcome to DevOps Management</h4>
      </div>
      <Alert v-if="error" v-bind:msg="error" />
      <div class="description">
        <span>
          The DevOps Management system aims to shorten and facilitate the system development
          lifecycle, automate various processes and workflows related to continuous integration and
          continuos delivery practices, and store various configurations related to it.
        </span>
      </div>
      <div class="login-btn">
        <div class="center">
          <div v-if="user">
            <p>Continue as</p>
            <div class="chip" @click="login()">
              <img :src="userImg()" alt="User"/>
              {{ user.name }}
            </div>
            <p><a :href="getLoginWithAnotherUserUrl()">or log with another user</a></p>
          </div>
          <div v-else>
            <Preloader v-if="gettingUser" class="small" />
            <div v-else class="chip sso-btn">
              <a :href="getLoginUrl()">Login with <b>User Management (SSO)</b></a>
            </div>
          </div>
          <Preloader v-if="loggingIn" class="preloader-wrapper small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueParticles from 'vue-particles';
import Loading from '@/components/layouts/Loading';
import config from '@/config';

Vue.use(VueParticles);

export default {
  components: {
    Loading,
  },
  data() {
    return {
      user: null,
      loggingIn: false,
      gettingUser: false,
      error: '',
    };
  },
  methods: {
    login() {
      this.loggingIn = true;
      this.error = '';

      auth.getIdentity()
        .then((response) => {
          auth.setUser(response.data);
          this.$router.push(this.$route.query.return_uri || '/');
        })
        .catch(() => {
          this.error = 'Could not login. Please contact phpid';
        })
        .finally(() => {
          setTimeout(() => { this.loggingIn = false; }, 1000);
        });
    },

    getLoginUrl() {
      let redirectUrl = '/devops/login?sso_login=true';

      if (this.$route.query.return_uri) {
        redirectUrl += `&return_uri=${this.$route.query.return_uri}`;
      }

      return `/login?redirect_url=${encodeURIComponent(redirectUrl)}&code=${config.auth.code}`;
    },

    getLoginWithAnotherUserUrl() {
      return `/logout?redirect_url=${encodeURIComponent(this.getLoginUrl())}`;
    },

    getLoggedInUser() {
      this.gettingUser = true;

      auth.getIdentity().then((response) => {
        this.user = response.data;
      })
        .finally(() => { this.gettingUser = false; });
    },

    userImg() {
      return `/users/${this.user.username}/photo`;
    },
  },
  created() {

  },
  mounted() {
    if (this.$route.query.sso_login) {
      this.login();
      return;
    }
    this.getLoggedInUser();
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
