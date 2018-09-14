// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import museUI from 'muse-ui'

import elementUI from 'element-ui'
import axios from 'axios'
Vue.config.productionTip = false;
import $ from 'jquery';
import path from './path.js'
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-light.css'
import 'element-ui/lib/theme-chalk/index.css';


Vue.prototype.$axios = axios;
// Vue.prototype.path='http://172.30.128.37:8080/swdAPP/common/activity/';
Vue.prototype.pathpar=path;

Vue.prototype.token='2caccb2b990526821881f5e3073a8c5b';
/* eslint-disable no-new */
Vue.use(museUI);
Vue.use(elementUI);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

