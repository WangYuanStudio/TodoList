import Vue from 'vue'
import Vuex from 'vuex'
import ebus from '../assets/ebus.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token:'',
    //token:localStorage.token,
    //token:"b6e285da6cd401e2227e27120b04f245",
    //token:'54ee2e1d9f04f8b50e6d889f82c4d4ea',
    createTeams:[],//我创建的团队
    joinTeams:[],//已加入的团队,
    canShowCreateButton:false,//true即表示已获取createTeams
    userInfo:{},
    initStart:false
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
        if(!playload.createTeams[team].user_group_count){
          playload.createTeams[team].user_group_count=0
        }
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
    quitTeam(state,playload){//退出团队
      let index = state.joinTeams.indexOf(playload.obj)
      state.joinTeams.splice(index,1);
    },
    delTeam(state,playload){//退出团队
      for(let i=0;i<state.createTeams.length;i++){
        if(state.createTeams[i].id == playload.id){
          state.createTeams.splice(i,1);
          break
        }
      }
      ebus.$emit('delCreateTeam',{group_id:playload.id})
    },
    finshing(state){
      state.userInfo.completeCount++
    },
    cancelTodo(state){
      state.userInfo.completeCount--
    },
    setQr(state,playload){//保存获取的二维码
      let index = state[playload.array].indexOf (playload.obj)
      state[playload.array][index].qr = playload.qr
    },
    initStart(state){
      state.initStart = true
    }
  }
})

export default store
