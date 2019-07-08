import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import DefaultLayout from "@/components/layouts/Default.vue";
import LoginLayout from "@/components/layouts/Login.vue";
import "@/config";
import "@/plugins/auth";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.use(Loading);

Vue.component("default-layout", DefaultLayout);
Vue.component("login-layout", LoginLayout);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
