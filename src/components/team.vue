<template>
<div class="team">
  <div class="createBG" v-if="!createTeams.length&&canShowCreateButton">
    <div class="create" v-on:click="openAlert('create')">
      <img src="../assets/icon/createTeam.png">
      创建一个团队
    </div>
  </div>
  <div class="newTeamdetailBG" v-if="newTeamDetail.show">
    <div class="newTeamdetail">
      <div class="close"><i v-on:click="newTeamDetail.show=false" class="iconfont icon-cha"></i></div>
      <div class="text">
        (请扫描二维码或输入团队代码加入团队)
      </div>
      <div class="qr">
        <!-- <img src="" alt=""> -->
        <i class="weui-loading weui-icon_toast"></i>
      </div>
      <div class="teamName">{{newTeamDetail.name}}</div>
      <div class="teamCode" v-on:click="Clipboard(newTeamDetail.code)">
        团队代码:{{newTeamDetail.code}}
      </div>
    </div>
  </div>
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
  <router-view></router-view>
</div>
</template>
<script>
import Clipboard from 'clipboard';
import ebus from '../assets/ebus.js'
import pubjs from '../assets/public.js'
export default {
  name: 'team',
  data () {
    return {
      teamTodo:[],
      lastFocus:null,
      newTeamDetail:{
        show:false,
        name:'',
        code:''
      }
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
    Clipboard(content){
      let div = document.createElement('div')
      new Clipboard(div ,{
        text:function(trigger){
          return content
        }
      })
      div.click()
      pubjs.toast('复制成功')
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
                this.newTeamDetail.name = data.content;
                this.newTeamDetail.code = rep.data.data.groupcode
                this.newTeamDetail.show = true
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
    },
    init(){
      if(this.$store.state.token){
        this.initEvent()
        this.initTaskList()
      }
      else{
        setTimeout(()=>{
          this.init()
        },1000)
      }
    }
  },
  mounted() {
    this.init()
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
.team .newTeamdetailBG{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.0.56);
  z-index: 100;
}
.team .newTeamdetailBG .newTeamdetail{
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%,-50%);
  width: 440px;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
}
.team .newTeamdetailBG .newTeamdetail .close{
  padding: 21px 0;
  text-align: right;
}
.team .newTeamdetailBG .newTeamdetail .close i{
  padding: 21px 28px;
}
.team .newTeamdetailBG .newTeamdetail .text{
  color: #a9a6a6;
  font-size: 16px;
  padding: 17px 0 20px 0;
}
.team .newTeamdetailBG .newTeamdetail .qr img{
  width: 178px;
  height: 178px;
  display: block;
  margin: 0 auto;
}
.team .newTeamdetailBG .newTeamdetail .teamName{
  font-size: 18px;
  padding: 30px 0 13px 0;
}
.team .newTeamdetailBG .newTeamdetail .teamCode{
  font-size: 18px;
  color: #72c7f5;
  padding: 13px 0 35px 0;
}
</style>
