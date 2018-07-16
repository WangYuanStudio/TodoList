<template>
<div>
  <div class="addTodoButton">
    <div class="addIcon" v-on:click="button = !button">
      <img src="../assets/icon/add.png">
    </div>
    <div class="personalIcon" v-on:click="open('personal')" v-bind:style="{top:button?'-90%':'0',pointerEvents:button?'':'none',opacity:button?'1':'0'}">
      <i class="iconfont icon-personal"></i>
    </div>
    <div class="teamIcon" v-on:click="open('team')" v-bind:style="{top:button?'-180%':'0',pointerEvents:button?'':'none',opacity:button?'1':'0'}">
      <i class="iconfont icon-tuandui"></i>
    </div>
  </div>
  <div class="addTodoBG" v-if="main">
    <div class="addTodoFrom">
      <div class="selectType">
        <div class="personalType" v-on:click="type = 'personal'">
          <img src="../assets/icon/selected.png" v-if="type === 'personal'">
          <img src="../assets/icon/select.png" v-else>
          <span>个人</span>
        </div>
        <div class="teamType" v-on:click="type = 'team'">
          <img src="../assets/icon/selected.png" v-if="type === 'team'">
          <img src="../assets/icon/select.png" v-else>
          <span>团队</span>
        </div>
      </div>
      <div class="personalInput" v-if="type === 'personal'">
        <input type="text" v-bind:style="{borderColor:personal.personalInput.length?'#1aa6f4':'#e5e5e5'}" v-focus placeholder="请输入代办事项" v-model="personal.personalInput">
      </div>
      <div class="teamInput" v-else>
        <select v-model="team.teamIndex">
          <option v-for="(item,index) in teams" v-bind:index='index' v-bind:value="index">{{item.name}}</option>
        </select>
        <div class="weui-cell">
          <div class="weui-cell__bd">
              <input class="weui-input" type="datetime-local" v-model="team.time" />
              <p class="placeholder" v-if="!team.time">截止时间</p>
          </div>
        </div>
        <input type="text" v-bind:style="{borderColor:team.teamInput.length?'#1aa6f4':'#e5e5e5'}" v-focus placeholder="请输入代办事项" v-model="team.teamInput">
      </div>
      <div class="button">
        <div class="cancel" v-on:click.self="close">
          取消
        </div>
        <div class="confirm" v-on:click="pushNewTodo">
          确认
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ebus from '../assets/ebus.js'
import pubjs from '../assets/public.js'

export default {
  name:'addtodo',
  data(){
    return {
      button:false,
      main:false,
      type:'personal',
      personal:{
        personalInput:''
      },
      team:{
        teamInput:'',
        teamIndex:'',
        time:''
      }
    }
  },
  computed:{
    teams(){
      return this.$store.state.createTeams
    },
    hash(){
      return this.$route.hash
    }
  },
  methods:{
    open(type){
      this.button =false;
      this.main = true;
      this.type = type
      this.$router.push({path:this.$route.path+'#add'})
    },
    close(){
      this.$router.go(-1)
    },
    pushNewTodo(){
      let msg = {}
      if(this.type === 'personal'){
        msg = {
          team:false,
          content:this.personal.personalInput
        }
        ebus.$emit('pushNewPersonalTodo',msg)
        this.close()
      }
      else{
        if(this.teams[this.team.teamIndex]){
          if(!this.team.time){
            alert('必须填写结束时间')
            return
          }
          msg = {
            team:true,
            content:this.team.teamInput,
            teamInfo:{
              teamName:this.teams[this.team.teamIndex].name,
              end_time:pubjs.format(this.team.time,'yyyy-MM-dd HH:mm'),
              group_id:this.teams[this.team.teamIndex].id,
            }
          }
          ebus.$emit('pushNewTeamTodo',msg)
          this.close()
        }
      }
    }
  },
  watch:{
    main:function(newValue,oldValue){
      if(newValue){
        this.personal.personalInput = '';
        this.team.teamInput = '';
        if(this.teams.length>0){
          this.team.teamIndex = 0
        }
      }
    },
    hash:function(newValue,oldValue){
      if(oldValue === '#add'&&!newValue){
        this.main = false
      }
    }
  },
  mounted(){

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

<style lang="css">
.addTodoButton{
  position: fixed;
  bottom: 150px;
  right: 25px;
  border-radius: 50%;
  width: 88px;
  height: 88px;
  box-shadow: 0 0 10px #999;
  background-color: #1aa6f4;
}
.addTodoButton .addIcon{
  position: relative;
  width: 100%;
  height: 100%;
}
.addTodoButton .addIcon img{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  display: block;
  width: 24px;
  height: 24px;
}
.addTodoButton .personalIcon,.teamIcon{
  position: absolute;
  width: 66px;
  height: 66px;
  background-color: #1aa6f4;
  border-radius: 50%;
  text-align: center;
  line-height: 66px;
  font-size: 15px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  transition: top 0.2s;
}
.addTodoBG{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.0.56);
  z-index: 100;
}
.addTodoBG .addTodoFrom{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 440px;
  background-color: #fff;
  border-radius: 10px;
}
.addTodoBG .addTodoFrom .selectType{
  position: relative;
  height: 86px;
  line-height: 86px;
  padding: 0 30px;
}
.addTodoBG .addTodoFrom .selectType .personalType,.teamType{
  float: left;
  height: 100%;
  padding: 0 18px;
}
.addTodoBG .addTodoFrom .selectType img{
  width: 18px;
  height: 18px;
}
.addTodoBG .addTodoFrom .selectType span{
  font-size: 28px;
  color: #000;
}
.addTodoBG .addTodoFrom .personalInput,.teamInput{
  position: relative;
  text-align: center;
}
.addTodoBG .addTodoFrom .teamInput .weui-cell .weui-cell__bd{
  position: relative;
}
.addTodoBG .addTodoFrom .teamInput .weui-cell .weui-cell__bd .placeholder{
  position: absolute;
  color:#888;
  top: 50%;
  transform: translateY(-50%);
  left: 23px;
  font-size: 22px;
}
.addTodoBG .addTodoFrom input{
  margin: 0 auto;
  width: 339px;
  height: 52px;
  border: 2px solid;
  border-radius: 10px;
  padding: 0 14px;
  outline: none;
  border-color: #e5e5e5;
}
.addTodoBG .addTodoFrom input:focus{
  border-color:#1aa6f4;
}
.addTodoBG .addTodoFrom .teamInput select{
  margin: 0 auto;
  width: 370px;
  height: 52px;
  background-color: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  outline: none;
  padding: 0 14px;
  margin-bottom: 16px;
  appearance:none;
  background: url(../assets/icon/selecticon.png) no-repeat scroll 96.5% center transparent
}
.addTodoBG .addTodoFrom .teamInput select:focus{
  border-color: #1aa6f4;
  color: #1aa6f4;
}
.addTodoBG .addTodoFrom .button{
  position: relative;
  width: 370px;
  margin: 0 auto;
  height: 110px;
}
.addTodoBG .addTodoFrom .button div{
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
.addTodoBG .addTodoFrom .button .cancel{
  background-color: #9faeb6;
  left: 0;
}
.addTodoBG .addTodoFrom .button .confirm{
  background-color: #1aa6f4;
  right: 0;
}
</style>
