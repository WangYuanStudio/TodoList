import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token:''
  },
  mutations: {
    updateToken(state,payload){
      state.token = payload.token
      localStorage.token = payload.token
    }
  }
})

export default store
