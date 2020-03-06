import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import Vuelidate from 'vuelidate';
import * as M from 'materialize-css/dist/js/materialize';
import * as vuEaCore from 'vue-ea-core';
import App from './App';
import router from './router';
import store from './store';

import DefaultLayout from './components/layouts/Default';
import LoginLayout from './components/layouts/Login';

import '@/config';
import auth from '@/plugins/auth';
import Api from './plugins/api';
import config from '../config';

import 'vue-loading-overlay/dist/vue-loading.css';

const api = new Api(config.um.url, config.um.code);

Vue.use(vuEaCore, { store, config, api });
Vue.use(Loading);
Vue.use(Vuelidate);
Vue.prototype.$M = M;
Vue.prototype.$auth = auth;

Vue.component('default-layout', DefaultLayout);
Vue.component('login-layout', LoginLayout);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
