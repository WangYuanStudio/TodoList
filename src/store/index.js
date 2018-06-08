import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //token:'',
    //token:localStorage.token,
    token:"0fb8db4d26cbc225249b7e92c4273a39",
    //token:'54ee2e1d9f04f8b50e6d889f82c4d4ea',
    createTeams:[],//我创建的团队
    joinTeams:[],//已加入的团队,
    canShowCreateButton:false,//true即表示已获取createTeams
    userInfo:{}
  },
  mutations: {
    updateToken(state,payload){
      state.token = payload.token
      localStorage.token = payload.token
    },
    updateUserInfo(state,payload){
      state.userInfo = payload.userInfo
    },
    pushCreateTeams(state,playload){
      for(let team in playload.createTeams){
        playload.createTeams[team].qr=''
        state.createTeams.push(playload.createTeams[team])
      }
      state.canShowCreateButton=true
    },
    pushJoinTeams(state,playload){
      for(let team in playload.joinTeams){
        playload.joinTeams[team].group.qr=''
        state.joinTeams.push(playload.joinTeams[team].group)
      }
    },
    setQr(state,playload){//保存获取的二维码
      let index = state[playload.array].indexOf (playload.obj)
      state[playload.array][index].qr = playload.qr
    }
  }
})

export default store
