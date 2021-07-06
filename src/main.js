import Vue from 'vue';
import Loading from 'vue-loading-overlay';
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
import config from '../config';
import './plugins/backend';
import { date } from './plugins/helpers';
import 'vue-loading-overlay/dist/vue-loading.css';
import WebSocket from './plugins/ws';

Vue.use(VueComponents);
Vue.use(VueAdministration, { store, api: api('um') });

Vue.use(Loading);
Vue.use(Vuelidate);

Vue.prototype.$M = M;
Vue.prototype.$auth = auth;
Vue.prototype.$date = date;

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
