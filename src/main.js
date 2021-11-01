import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import VueNumber from 'vue-number-animation';
import Vuelidate from 'vuelidate';
import * as M from 'materialize-css/dist/js/materialize';
import * as VueComponents from '@enterpriseapps/vue-components';
import * as VueAdministration from '@enterpriseapps/vue-administration';
import App from './App';
import router from './router';
import store from './store';

import DefaultLayout from './components/layouts/Default';
import LoginLayout from './components/layouts/Login';
import BasicLayout from './components/layouts/Basic';

import '@/config';
import './plugins/backend';
import config from '../config';
import WebSocket from './plugins/ws';
import 'vue-loading-overlay/dist/vue-loading.css';

import { date } from './helpers/DateHelper';
import { esxi } from './helpers/EsxiHelper';

Vue.use(Loading);
Vue.use(Vuelidate);
Vue.use(VueNumber);
Vue.use(VueComponents);
Vue.use(VueAdministration, { store, api: api('um') });

Vue.prototype.$M = M;
Vue.prototype.$auth = auth;
Vue.prototype.$date = date;
Vue.prototype.$esxi = esxi;

const ws = new WebSocket(config.ws.url, config.ws.username, config.ws.password, config.ws.vhost);
Vue.prototype.$ws = ws;

Vue.component('default-layout', DefaultLayout);
Vue.component('basic-layout', BasicLayout);
Vue.component('login-layout', LoginLayout);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
