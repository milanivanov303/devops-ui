"use strict";

import Vue from "vue";

let config = require("../../config");

let ConfigPlugin = {
  install(Vue, options) {
    Vue.$config = config;
    window.config = config;
    Object.defineProperties(Vue.prototype, {
      $config: {
        get() {
          return config;
        }
      }
    });
  }
};

Vue.use(ConfigPlugin);

export default ConfigPlugin;
