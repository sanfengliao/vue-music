import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from "fastclick"
import VueJsonp from "vue-jsonp"
import lazyload from "vue-lazyload"

import store from "./store/index.js"

import "./common/stylus/index.styl"


Vue.use(VueJsonp);
Vue.use(lazyload, {
  loading: require("common/image/default.png")
})

Vue.config.productionTip = false;
fastClick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
