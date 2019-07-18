import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import App from './App';
import router from './router';
import store from './store';

import DefaultLayout from './components/layouts/Default';
import LoginLayout from './components/layouts/Login';

import './config';
import './plugins/auth';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(Loading);

Vue.component('default-layout', DefaultLayout);
Vue.component('login-layout', LoginLayout);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
