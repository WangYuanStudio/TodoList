import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '../router'
import store from '../store'
import config from '../assets/config.js'
Vue.use(VueAxios, axios)

axios.defaults.baseURL = config.APIBASE
axios.interceptors.request.use(
    config => {
        if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.token = store.state.token
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(
    res => {
      if(res.data.code === 401){
        localStorage.token=''
        location.href=`${axios.defaults.baseURL}/auth`
      }
      else{
        return res
      }
    }
);
