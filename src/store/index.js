import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token:'54ee2e1d9f04f8b50e6d889f82c4d4ea',
    createTeams:[],//我创建的团队
    joinTeams:[],//已加入的团队,
    canShowCreateButton:false,//true即表示已获取createTeams
  },
  mutations: {
    updateToken(state,payload){
      state.token = payload.token
    },
    pushCreateTeams(state,playload){
      for(let team in playload.createTeams){
        state.createTeams.push(playload.createTeams[team])
      }
      state.canShowCreateButton=true
    },
    pushJoinTeams(state,playload){
      for(let team in playload.joinTeams){
        state.joinTeams.push(playload.joinTeams[team])
      }
    }
  }
})

export default store
