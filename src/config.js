import Vue from 'vue';

const config = require('../config');

const ConfigPlugin = {
  install(Vue) {
    Vue.$config = config;
    Object.defineProperties(Vue.prototype, {
      $config: {
        get() {
          return config;
        },
      },
    });
  },
};

Vue.use(ConfigPlugin);

export default config;
