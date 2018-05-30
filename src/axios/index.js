import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '../router'

Vue.use(VueAxios, axios)

axios.defaults.baseURL = 'http://test.yuanmoc.com'
axios.interceptors.request.use(
    config => {
        if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = localStorage.token
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(
    res => {
      return res
    }
);
