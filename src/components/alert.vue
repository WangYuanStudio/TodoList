<template>
  <div class="alertBG">
    <div class="alert">
      <div class="changeSomeThing" v-if="type === 'danmu'||type === 'xiugai'||type === 'create'">
        <div class="icon">
          <i class="iconfont icon-danmu" v-if="type === 'danmu'"></i>
          <i class="iconfont icon-xiugai" v-else></i>
        </div>
        <div class="input">
          <input type="text" v-bind:style="{borderColor:alertInput.length?'#000':'#e5e5e5'}" v-focus v-bind:placeholder="placeholder" v-model="alertInput">
        </div>
        <div class="button">
          <div class="cancel" v-on:click="cancel">
            取消
          </div>
          <div class="confirm" v-on:click="confirm">
            确认
          </div>
        </div>
      </div>
      <div class="detail" v-if="type === 'detail'">
        <div class="icon">
          <i class="iconfont icon-detail"></i>
        </div>
        <div class="info">
          <p>团队名字：{{teamInfo.teamName}}</p>
          <p>发送时间：{{teamInfo.created_at}}</p>
          <p>截止时间：{{teamInfo.end_time}}</p>
          <p>团队代号：{{teamInfo.groupcode}}</p>
        </div>
        <div class="cancel">
          <span v-on:click="cancel">返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ebus from '../assets/ebus.js'

export default {
  name:'alert',
  data(){
    return {
      alertInput:'',//弹窗的输入内容
      teamInfo:{
        teamName:'',
        created_at:'',
        end_time:'',
        groupcode:''
      }
    }
  },
  computed:{
    type(){
      return this.$route.query.type
    },
    content(){
      return this.$route.query.content
    },
    TodoteamInfo(){
      return this.$route.query.teamInfo
    },
    id(){
      return this.$route.query.id
    },
    redirect(){
      return this.$route.query.redirect.replace(/\//,'')
    },
    placeholder(){
      switch(this.type){
        case 'danmu' :
          return '请输入弹幕'
        case 'xiugai' :
          return '请输入内容'
        case 'create' :
          return '请输入团队名字'
      }
    }
  },
  methods:{
    cancel(){
      this.$router.go(-1)
    },
    confirm(){
      let reData = {type:this.type,id:this.id}
      switch(this.type){
        case 'danmu':
          reData.content = this.alertInput
          break
        case 'xiugai':
          reData.content = this.alertInput
        case 'create':
          reData.content = this.alertInput
      }
      ebus.$emit(`${this.redirect}AlertEvent`,reData)
      this.cancel()
    }
  },
  mounted(){
    switch(this.type){
      case 'danmu':
        this.alertInput=''
        break
      case 'xiugai':
        this.alertInput=this.content
        break
      case 'detail':
        this.teamInfo = this.TodoteamInfo
        break
      case 'create':
        break
    }
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
.alertBG{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.0.56);
  z-index: 100;
}
.alertBG .alert{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 440px;
  background-color: #fff;
  border-radius: 10px;
}
.alertBG .alert .changeSomeThing .icon{
  position: relative;
  text-align: center;
  padding: 20px 0;
}
.alertBG .alert .changeSomeThing .icon i{
  font-size: 32px;
  color: #84caf1;
}
.alertBG .alert .changeSomeThing .icon .icon-danmu{
  font-size: 40px;
}
.alertBG .alert .changeSomeThing .input{
  position: relative;
  text-align: center;
}
.alertBG .alert .changeSomeThing .input input{
  margin: 0 auto;
  width: 339px;
  height: 52px;
  border: 2px solid;
  border-radius: 10px;
  padding: 0 14px;
  outline: none;
}
.alertBG .alert .changeSomeThing .button{
  position: relative;
  width: 370px;
  margin: 0 auto;
  height: 110px;
}
.alertBG .alert .changeSomeThing .button div{
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
.alertBG .alert .changeSomeThing .button .cancel{
  background-color: #9faeb6;
  left: 0;
}
.alertBG .alert .changeSomeThing .button .confirm{
  background-color: #1aa6f4;
  right: 0;
}
.alertBG .alert .detail{
  position: relative;
}
.alertBG .alert .detail .icon{
  position: relative;
  text-align: center;
  padding: 20px 0;
}
.alertBG .alert .detail .icon i{
  font-size: 48px;
  color: #84caf1;
}
.alertBG .alert .detail .info p{
  margin:0 0 22px 40px;
  font-size: 24px;
}
.alertBG .alert .detail .cancel{
  color: #84caf1;
  text-align: right;
  padding: 8px 19px;
}
.alertBG .alert .detail .cancel span{
  padding: 8px 19px;
}
</style>
