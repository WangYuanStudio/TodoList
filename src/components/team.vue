<template>
<div class="team">
  <div class="todos" v-if="teamTodo.length">
    <div class="todo" style="background-color:#5d707b" v-for='(todo,index) in teamTodo' v-bind:index='index'>
      <div class="view" v-on:click="showOperation(todo)">
        <div class="status">
          <img src="../assets/icon/no.png" alt="">
        </div>
        <div class="text" v-bind:class="{showlimit:!todo.showmore}" style="color:#fff">{{todo.content}}</div>
        <div style="clear:both"></div>
      </div>
      <div class="operation" v-if="todo.showmore">
        <div class="teamTodo">
          <span v-on:click="openAlert('xiugai',todo)"><i class="iconfont icon-xiugai"></i>修改</span>
          <span v-on:click="finshing(todo)"><i class="iconfont icon-wancheng1"></i>完成</span>
          <span v-on:click="openAlert('detail',todo)"><i class="iconfont icon-detail"></i>详细</span>
          <span class="teamName">{{todo.teamInfo.teamName}}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="createBG" v-if="!createTeams.length&&canShowCreateButton">
    <div class="create" v-on:click="openAlert('create')">
      <img src="../assets/icon/createTeam.png">
      创建一个团队
    </div>
  </div>
  <router-view></router-view>
</div>
</template>
<script>
import ebus from '../assets/ebus.js'
export default {
  name: 'team',
  data () {
    return {
      teamTodo:[],
      lastFocus:null
    }
  },
  computed:{
    createTeams(){
      return this.$store.state.createTeams
    },
    canShowCreateButton(){
      return this.$store.state.canShowCreateButton
    },
    joinTeams(){
      return this.$store.state.joinTeams
    }
  },
  methods: {
    showOperation(todo){
      if(todo.showmore){
        todo.showmore = false
      }
      else{
        if(this.lastFocus !== null){
          this.lastFocus.showmore = false
        }
        this.lastFocus = todo;
        todo.showmore = true
      }
    },
    openAlert(type,todo={}){
      this.$router.push({path:'/team/alert',query:{redirect:this.$route.path,type,content:todo.content,teamInfo:todo.teamInfo,id:todo.id}})
    },
    finshing(todo){
      let index = this.teamTodo.indexOf(todo)
      this.teamTodo.splice(index,1);
      this.axios.delete(`/task/${todo.id}`)
    },
    searchTodoObj(id){
      let arry = this.teamTodo
      let s = 0
      let t = arry.length-1
      let mid = parseInt(t/2)
      while(s<=t){
        if(arry[mid].id === parseInt(id)){
          return arry[mid]
        }
        else{
          if(arry[mid].id<parseInt(id)){
            s=mid+1;
            mid = parseInt((s+t)/2)
          }
          else{
            t=mid-1;
            mid = parseInt((s+t)/2)
          }
        }
      }
    },
    initEvent(){
      ebus.$on('pushNewTeamTodo',(data)=>{
        data.showmore = false
        this.teamTodo.push(data)
        this.axios.post('/task',{
          content:data.content,
          group_id:data.teamInfo.group_id,
          end_time:data.teamInfo.end_time,
        }).then((rep)=>{
          Object.assign(data,rep.data.data)
        })
      })
      ebus.$on('teamAlertEvent',(data)=>{//alert组件回传数据
        //先查找需要操作的todoObj
        switch(data.type){
          case 'xiugai':
            if(data.content){
              let obj = this.searchTodoObj(data.id)
              obj.content = data.content;
              this.axios.patch(`/task/${data.id}`,{
                content:data.content
              })
            }
            break
          case 'create'://创建团队
            if(data.content){
              this.axios.post('/group',{
                name:data.content
              }).then((rep)=>{
                this.$store.commit({
                  type:'pushCreateTeams',
                  createTeams:[rep.data.data]
                })
              })
            }
            break
        }
      })
    },
    initTaskList(){//获取该用户发布的团队todo
      this.axios.get('/task/created').then((rep)=>{
        for(let team of rep.data.data){
          for(let task of team.task){
            task.showmore = false
            task.teamInfo = {
              teamName:team.name,
              created_at:task.created_at,
              end_time:task.end_time,
              groupcode:team.groupcode
            }
            this.teamTodo.push(task)
          }
        }
      })
    }
  },
  mounted() {
    this.initEvent()
    this.initTaskList()
  }
}
</script>
<style scoped>
.team{
  position: relative;
  min-height: calc(100vh - 80px - 86px);
}
.team .createBG{
  width: 100%;
  height: calc(100vh - 80px - 86px);
  position: relative;
}
.team .createBG .create{
  width: 400px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #1aa6f4;
  color: #fff;
  border-radius: 10px;
  line-height: 80px;
  padding-left: 106px;
}
.team .createBG .create img{
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 24px;
}
.team .alertBG{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.0.56);
  z-index: 100;
}
.team .alertBG .alert{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 440px;
  background-color: #fff;
  border-radius: 10px;
}
.team .alertBG .alert .changeSomeThing .icon{
  position: relative;
  text-align: center;
  padding: 20px 0;
}
.team .alertBG .alert .changeSomeThing .icon i{
  font-size: 32px;
  color: #84caf1;
}
.team .alertBG .alert .changeSomeThing .icon .icon-danmu{
  font-size: 40px;
}
.team .alertBG .alert .changeSomeThing .input{
  position: relative;
  text-align: center;
}
.team .alertBG .alert .changeSomeThing .input input{
  margin: 0 auto;
  width: 339px;
  height: 52px;
  border: 2px solid;
  border-radius: 10px;
  padding: 0 14px;
  outline: none;
}
.team .alertBG .alert .changeSomeThing .button{
  position: relative;
  width: 370px;
  margin: 0 auto;
  height: 110px;
}
.team .alertBG .alert .changeSomeThing .button div{
  width: 160px;
  height: 52px;
  text-align: center;
  line-height:52px;
  color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.team .alertBG .alert .changeSomeThing .button .cancel{
  background-color: #9faeb6;
  left: 0;
}
.team .alertBG .alert .changeSomeThing .button .confirm{
  background-color: #1aa6f4;
  right: 0;
}
.team .alertBG .alert .detail{
  position: relative;
}
.team .alertBG .alert .detail .icon{
  position: relative;
  text-align: center;
  padding: 20px 0;
}
.team .alertBG .alert .detail .icon i{
  font-size: 48px;
  color: #84caf1;
}
.team .alertBG .alert .detail .info p{
  font-size: 24px;
  margin:0 0 22px 40px;
}
.team .alertBG .alert .detail .cancel{
  color: #84caf1;
  text-align: right;
  padding: 8px 19px;
}
.team .alertBG .alert .detail .cancel span{
  padding: 8px 19px;
}
</style>
