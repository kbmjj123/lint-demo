import Vue from 'vue'
import App from './app.vue'
import { router } from './router/index';
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import 'normalize.css/normalize.css';
import 'babel-polyfill';

import cookies from '@/utils/cookie';
import api from '@/api';
import util from './utils/util';
import * as filters from './filters';
import logger from './utils/log';

Vue.config.productionTip = false;
Vue.use(ViewUI);

Vue.prototype.$cookies = cookies;
Vue.prototype.$util = util;
Vue.prototype.$api = api;
Vue.prototype.$log = logger;

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
});
