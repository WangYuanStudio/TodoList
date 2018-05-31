<template>
<div class="team">
  <div class="createBG" v-if="!createTeams.length">
    <div class="create" v-on:click="alert.type='create';alert.show = 'show'">
      <img src="../assets/icon/createTeam.png">
      创建一个团队
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
          <span v-on:click="openAlert(todo,'xiugai')"><i class="iconfont icon-xiugai"></i>修改</span>
          <span v-on:click="finshing(todo)"><i class="iconfont icon-wancheng1"></i>完成</span>
          <span v-on:click="openAlert(todo,'detail')"><i class="iconfont icon-detail"></i>详细</span>
          <span class="teamName">{{todo.teamInfo.teamName}}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="alertBG" v-if="alert.show" v-on:click.self="alert.show=false">
    <div class="alert">
      <div class="changeSomeThing" v-bind:style="{paddingTop:alert.type === 'create'?'30px':''}" v-if="alert.type === 'create'||alert.type === 'xiugai'">
        <div class="icon" v-if="alert.type === 'xiugai'">
          <i class="iconfont icon-xiugai"></i>
        </div>
        <div class="input">
          <input type="text" v-bind:style="{borderColor:alert.alertInput.length?'#000':'#e5e5e5'}" v-focus v-bind:placeholder="alert.type === 'create'?'请输入团队名':'请输入内容'" v-model="alert.alertInput">
        </div>
        <div class="button">
          <div class="cancel" v-on:click="alert.alertInput='';alert.show=false">
            取消
          </div>
          <div class="confirm" v-on:click="alertConfirm()">
            确认
          </div>
        </div>
      </div>
      <div class="detail" v-else>
        <div class="icon">
          <i class="iconfont icon-detail"></i>
        </div>
        <div class="info">
          <p>团队名字：{{alert.teamInfo.teamName}}</p>
          <p>发送时间：{{alert.teamInfo.created_at}}</p>
          <p>截止时间：{{alert.teamInfo.end_time}}</p>
          <p>团队代号：{{alert.teamInfo.groupcode}}</p>
        </div>
        <div class="cancel">
          <span v-on:click="alert.show=false">返回</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import ebus from '../assets/ebus.js'
export default {
  name: 'team',
  data () {
    return {
      teamTodo:[],
      lastFocus:null,
      alert:{
        show:false,
        alertInput:'',//弹窗的输入内容
        type:'xiugai',
        todoObj:null,
        teamInfo:{
          teamName:'',
          created_at:'',
          end_time:'',
          groupcode:''
        }
      }
    }
  },
  computed:{
    createTeams(){
      return this.$store.state.createTeams
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
    openAlert(todo,type){
      this.alert.type=type;
      switch(type){
        case 'xiugai':
          this.alert.alertInput=todo.content
          break
        case 'detail':
          this.alert.teamInfo = todo.teamInfo
          break
      }
      this.alert.show=true;
      this.alert.todoObj=todo
    },
    finshing(todo){
      let index = this.teamTodo.indexOf(todo)
      this.teamTodo.splice(index,1);
      this.axios.delete(`/task/${todo.id}`)
    },
    alertConfirm(){
      switch(this.alert.type){
        case 'create'://创建团队
          if(this.alert.alertInput){
            this.axios.post('/group',{
              name:this.alert.alertInput
            }).then((rep)=>{
              this.$store.commit({
                type:'pushCreateTeams',
                createTeams:[rep.data.data]
              })
            })
          }
          break
        case 'xiugai'://修改发布的团队todo
          if(this.alert.alertInput){
            this.alert.todoObj.content = this.alert.alertInput;
            this.axios.patch(`/task/${this.alert.todoObj.id}`,{
              content:this.alert.alertInput
            })
          }
          break
      }
      this.alert.alertInput='';
      this.alert.show=false
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
  },
  directives: {
    focus:{
      inserted: function (el) {
        el.focus();
      }
    }
  }
}
</script>
<style>
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
.team .todos{
  position: relative;
  padding-bottom: 150px;
}
.team .todos .todo{
  position: relative;
  box-shadow: 0 0 6px #ccc;
  width: 597px;
  margin: 24px auto;
  min-height: 106px;
  border-radius: 10px;
}
.team .todos .todo .view{
  position: relative;
}
.team .todos .todo .view .status{
  position: absolute;
  left: 0;
  top: 0;
  padding: 38px 24px;
}
.team .todos .todo .view .status img{
  width: 33px;
  height: 30px;
  display: block;
}
.team .todos .todo .view .text{
  float: left;
  margin: 33px 20px 33px 81px;
  line-height: 45px;
  font-size: 28px;
  transition: height 0.2s;
  word-break:break-all;
}
.team .todos .todo .view .showlimit{
  height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 115px);
  overflow: hidden;
}
.team .todos .todo .operation{
  position: relative;
}
.team .todos .todo .operation .personalTodo,.teamTodo{
  position: relative;
  color: #84caf1;
  height: 40px;
  padding: 0 20px 0 81px;
  line-height: 40px;
}
.team .todos .todo .operation span{
  float: left;
  font-size: 18px;
}
.team .todos .todo .operation span i{
  padding: 0 11px 0 0;
  font-size: 18px;
}
.team .todos .todo .operation .teamTodo span{
  margin-right: 32px;
}
.team .todos .todo .operation .teamTodo span{
  margin-right: 66px;
}
.team .todos .todo .operation .teamName{
  float: right;
  padding: 0 8px;
  color:#9db6c4;
  font-size: 18px;
  margin-right: 0!important;
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
