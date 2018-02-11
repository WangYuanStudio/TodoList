// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import qs from 'qs'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import md5 from './assets/md5.js';
require('./assets/iconfont/iconfont.css')
require('./assets/iconfont/iconfont.eot')
require('./assets/iconfont/iconfont.js')
require('./assets/iconfont/iconfont.svg')
require('./assets/iconfont/iconfont.ttf')
require('./assets/iconfont/iconfont.woff')
Vue.config.productionTip = false

/* eslint-disable no-new */

// 将请求转为简单请求方便跨域，已不需要
// axios.interceptors.request.use(function (config) {
//   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   if (config.method === 'post') {
//     config.data = qs.stringify({
//       ...config.data
//     })
//   }
//   return config
// }, function (error) {
//   axios.loadinginstace.close()
//   return Promise.reject(error)
// })

// 加载axios插件
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

// 将md5()添加到vue实例
Vue.prototype.md5 = md5;