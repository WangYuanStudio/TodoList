<template>
<div class="personal">
  <div class="selector">
    <div class="slideAcutely">
      <span v-on:click="complete=false">未完成</span>
      <span v-on:click="complete=true">已完成</span>
      <div class="slide" v-bind:style="{left:complete?'50%':'0%'}">
        {{slideText}}
      </div>
    </div>
  </div>
  <div class="todos">
    <div class="todo" v-bind:style="{backgroundColor:todo.team?'#5d707b':'#fff'}" v-for='(todo,index) in filter' v-bind:index='index'>
      <div class="view" v-on:click="showOperation(todo)">
        <div class="status">
          <img v-if="todo.finshed" src="../assets/icon/ok.png" alt="">
          <img v-else src="../assets/icon/no.png" alt="">
        </div>
        <div class="text" v-bind:class="{showlimit:!todo.showmore}" v-bind:style="{color:todo.team?'#fff':'#000'}">{{todo.text}}</div>
        <div style="clear:both"></div>
      </div>
      <div class="operation" v-if="todo.showmore">
        <div class="personalTodo" v-if="!todo.team">
          <div class="nofinshed" v-if="!todo.finshed">
            <span v-on:click="openAlert(todo,'xiugai')"><i class="iconfont icon-xiugai"></i>修改</span>
            <span v-on:click="finshing(todo)"><i class="iconfont icon-wancheng1"></i>完成</span>
            <span v-on:click="deleteTodo(todo)"><i class="iconfont icon-icon"></i>删除</span>
          </div>
          <div class="finshed" v-else>
            <span v-on:click="deleteTodo(todo)"><i class="iconfont icon-icon"></i>删除</span>
            <span v-on:click="cancelTodo(todo)"><i class="iconfont icon-wuuiconsuoxiao"></i>取消</span>
          </div>
        </div>
        <div class="teamTodo" v-else>
          <div class="nofinshed" v-if="!todo.finshed">
            <span v-on:click="finshing(todo)"><i class="iconfont icon-wancheng1"></i>完成</span>
            <span v-on:click="openAlert(todo,'danmu')"><i class="iconfont icon-danmu"></i>弹幕</span>
            <span v-on:click="openAlert(todo,'detail')"><i class="iconfont icon-detail"></i>详细</span>
            <span class="teamName">{{todo.teamInfo.teamName}}</span>
          </div>
          <div class="finshed" v-else>
            <span v-on:click="deleteTodo(todo)"><i class="iconfont icon-icon"></i>删除</span>
            <span v-on:click="cancelTodo(todo)"><i class="iconfont icon-wuuiconsuoxiao"></i>取消</span>
            <span class="teamName">{{todo.teamInfo.teamName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="noTodo" v-if="!filter.length">
    <img src="../assets/icon/logo.png" v-if="complete">
    <img src="../assets/icon/logo2.png" v-else>
    <p style="color:#000" v-if="complete">Nothing finished!</p>
    <p style="color:#ccc" v-else>Nothing to do!</p>
  </div>
  <div class="alertBG" v-if="alert.show" v-on:click.self="alert.show=false">
    <div class="alert">
      <div class="changeSomeThing" v-if="alert.type === 'danmu'||alert.type === 'xiugai'">
        <div class="icon">
          <i class="iconfont icon-danmu" v-if="alert.type === 'danmu'"></i>
          <i class="iconfont icon-xiugai" v-else></i>
        </div>
        <div class="input">
          <input type="text" v-bind:style="{borderColor:alert.alertInput.length?'#000':'#e5e5e5'}" v-focus v-bind:placeholder="alert.type === 'danmu'?'请输入弹幕':'请输入内容'" v-model="alert.alertInput">
        </div>
        <div class="button">
          <div class="cancel" v-on:click="alert.alertInput='';alert.show=false">
            取消
          </div>
          <div class="confirm" v-on:click="alertConfirm(alert)">
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
          <p>发送时间：{{alert.teamInfo.sendTime}}</p>
          <p>截止时间：{{alert.teamInfo.byTheTime}}</p>
          <p>团队代号：{{alert.teamInfo.teamNum}}</p>
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
export default {
  name: 'personal',
  data () {
    return {
      todos:[
        {
          text:'2233真可爱',
          finshed:false,
          team:false,
          showmore:false
        },
        {
          text:'真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱',
          finshed:false,
          team:false,
          showmore:false
        },
        {
          text:'2233真可爱',
          finshed:false,
          team:true,
          showmore:false,
          danmu:[
            666,6666,66666
          ],
          teamInfo:{
            teamName:'bilibili',
            sendTime:'2018-03-05 25:16',
            byTheTime:'2018-06-16',
            teamNum:'23333333'
          }

        }
      ],
      complete:false,//用于切换完成和未完成
      lastFocus:null,
      alert:{
        show:false,
        alertInput:'',//弹窗的输入内容
        type:'xiugai',
        index:null,
        teamInfo:{
          teamName:'',
          sendTime:'',
          byTheTime:'',
          teamNum:''
        }
      }
    }
  },
  computed:{
    filter(){
      return this.todos.filter((todo) => {
        return todo.finshed === this.complete
      })
    },
    slideText(){
      return this.complete?'已完成':'未完成'
    }
  },
  methods: {
    showOperation(todo){
      let index = this.todos.indexOf(todo)
      if(this.todos[index].showmore){
        this.todos[index].showmore = false
      }
      else{
        if(this.lastFocus !== null){
          this.todos[this.lastFocus].showmore = false
        }
        this.lastFocus = index;
        this.todos[index].showmore = true
      }
    },
    openAlert(todo,type){
      this.alert.type=type;
      switch(type){
        case 'danmu':
          this.alert.alertInput=''
          break
        case 'xiugai':
          this.alert.alertInput=todo.text
          break
        case 'detail':
          this.alert.teamInfo = todo.teamInfo
          break
      }
      this.alert.show=true;
      this.alert.index=this.todos.indexOf(todo)
    },
    finshing(todo){//完成某个事件
      let index = this.todos.indexOf(todo)
      this.todos[index].showmore = false
      this.todos[index].finshed = true
    },
    deleteTodo(todo){//删除某件已完成事件
      let index = this.todos.indexOf(todo)
      this.todos.splice(index,1);
    },
    cancelTodo(todo){
      let index = this.todos.indexOf(todo)
      this.todos[index].showmore = false
      this.todos[index].finshed = false
    },
    alertConfirm(alertInfo){//提交弹幕或提交修改
      switch(alertInfo.type){
        case 'danmu':
          this.todos[alertInfo.index].danmu.push(alertInfo.alertInput);
          break
        case 'xiugai':
          if(alertInfo.alertInput){
            this.todos[alertInfo.index].text = alertInfo.alertInput;
          }
          break
      }
      this.alert.alertInput='';
      this.alert.show=false
    }
  },
  mounted() {

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
<style scoped>
.personal{
  position: relative;
  min-height: calc(100vh - 80px - 86px);
}
.personal .selector{
  position: relative;
  padding: 32px 0;
  font-size: 24px;
}
.personal .selector .slideAcutely{
  position: relative;
  width: 430px;
  height: 48px;
  border-radius: 50px;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  background-color: #e5e5e5;
}
.personal .selector .slideAcutely span{
  width: 50%;
  display: block;
  float: left;
  text-align: center;
  line-height: 48px;
  color: #aea0a0;
}
.personal .selector .slideAcutely .slide{
  position: absolute;
  background-color: #fff;
  width: 50%;
  height: 100%;
  border-radius: 50px;
  box-shadow: 0 0 10px #999;
  text-align: center;
  line-height: 48px;
  transition: left 0.2s;
}
.personal .todos{
  position: relative;
}
.personal .todos .todo{
  position: relative;
  box-shadow: 0 0 6px #ccc;
  width: 597px;
  margin: 24px auto;
  min-height: 106px;
  border-radius: 10px;
}
.personal .todos .todo .view .status{
  position: absolute;
  left: 0;
  top: 0;
  padding: 38px 24px;
}
.personal .todos .todo .view .status img{
  width: 33px;
  height: 30px;
  display: block;
}
.personal .todos .todo .view .text{
  float: left;
  margin: 24px 20px 24px 81px;
  line-height: 36px;
  font-size: 24px;
  min-height: 58px;
  transition: height 0.2s;
}
.personal .todos .todo .view .showlimit{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.personal .todos .todo .operation{
  position: relative;
}
.personal .todos .todo .operation .personalTodo,.teamTodo{
  position: relative;
  color: #84caf1;
  height: 40px;
  padding: 0 20px 0 81px;
  line-height: 40px;
}
.personal .todos .todo .operation span{
  float: left;
  font-size: 18px;
}
.personal .todos .todo .operation span i{
  padding: 0 11px;
  font-size: 18px;
}
.personal .todos .todo .operation .nofinshed span{
  margin-right: 32px;
}
.personal .todos .todo .operation .finshed span{
  margin-right: 66px;
}
.personal .todos .todo .operation .teamName{
  float: right;
  padding: 0 8px;
  color:#9db6c4;
  font-size: 18px;
  margin-right: 0!important;
}
.personal .noTodo{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}
.personal .noTodo img{
  width: 173px;
  height: 173px;
}
.personal .noTodo p{
  font-size: 24px;
}
.personal .alertBG{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.0.56);
  z-index: 100;
}
.personal .alertBG .alert{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 440px;
  background-color: #fff;
  border-radius: 10px;
}
.personal .alertBG .alert .changeSomeThing .icon{
  position: relative;
  text-align: center;
  padding: 20px 0;
}
.personal .alertBG .alert .changeSomeThing .icon i{
  font-size: 32px;
  color: #84caf1;
}
.personal .alertBG .alert .changeSomeThing .input{
  position: relative;
  text-align: center;
}
.personal .alertBG .alert .changeSomeThing .input input{
  margin: 0 auto;
  width: 339px;
  height: 52px;
  border: 2px solid;
  border-radius: 10px;
  padding: 0 14px;
  outline: none;
}
.personal .alertBG .alert .changeSomeThing .button{
  position: relative;
  width: 370px;
  margin: 0 auto;
  height: 110px;
}
.personal .alertBG .alert .changeSomeThing .button div{
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
.personal .alertBG .alert .changeSomeThing .button .cancel{
  background-color: #9faeb6;
  left: 0;
}
.personal .alertBG .alert .changeSomeThing .button .confirm{
  background-color: #1aa6f4;
  right: 0;
}
.personal .alertBG .alert .detail{
  position: relative;
}
.personal .alertBG .alert .detail .icon{
  position: relative;
  text-align: center;
  padding: 20px 0;
}
.personal .alertBG .alert .detail .icon i{
  font-size: 48px;
  color: #84caf1;
}
.personal .alertBG .alert .detail .info p{
  margin:0 0 22px 40px;
}
.personal .alertBG .alert .detail .cancel{
  color: #84caf1;
  text-align: right;
  padding: 8px 19px;
}
.personal .alertBG .alert .detail .cancel span{
  padding: 8px 19px;
}
</style>
