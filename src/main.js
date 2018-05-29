// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
require('./assets/iconfont/iconfont.css')
require('./assets/iconfont/iconfont.eot')
require('./assets/iconfont/iconfont.js')
require('./assets/iconfont/iconfont.svg')
require('./assets/iconfont/iconfont.ttf')
require('./assets/iconfont/iconfont.woff')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
