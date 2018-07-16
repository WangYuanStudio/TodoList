<template>
  <div>
    <header>
      <i class="iconfont icon-zhixiang-zuo" v-on:click="goBack"></i>
      <span>{{name}}</span>
      <img v-on:click="meau=!meau" v-if="!setting" class="setting" src="../assets/icon/setting.png">
      <div class="complete" v-on:click="setting=false" v-else>
        完成
      </div>
      <div class="TeamdDtailMeau" v-if="meau">
        <div v-on:click="meau=false;setting=true">
          管理成员
        </div>
        <div v-on:click="delTeam">
          删除团体
        </div>
      </div>
    </header>
    <div class="team">
      <div class="info">
        <p><span>团队名：</span>{{name}}</p>
        <p v-on:click="Clipboard(groupcode)"><span>团队ID：</span>{{groupcode}}</p>
        <p><span>人数：</span>{{members.length}}</p>
      </div>
      <div class="qr">
        <i v-if="!qr" class="weui-loading weui-icon_toast"></i>
        <img v-else v-bind:src="qr">
      </div>
    </div>
    <div class="memberList" v-if="members.length&&qr">
      <div class="member" v-for="(member,index) in members" v-bind:key="index">
        <img class="head" v-bind:src="member.user.headimgurl">
        <p>{{member.user.nickname}}</p>
        <div class="del" v-if="setting" v-on:click="delMember(member)">
          <img src="../assets/icon/ok.png">
        </div>
      </div>
    </div>
    <div class="noMember" v-if="(!members.length)&&qr">
      <img src="../assets/icon/logo2.png">
      <p style="color:#ccc">No one has joined</p>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import QRCode from 'qrcode'
import pubjs from '../assets/public.js'
import config from '../assets/config.js'

export default {
  name:'teamdetail',
  data(){
    return {
      members:[],
      qr:'',
      meau:false,
      setting:false,

    }
  },
  computed:{
    name(){
      return this.$route.query.name
    },
    groupcode(){
      return this.$route.query.groupcode
    },
    id(){
      return this.$route.query.id
    },
    initStart(){
      return this.$store.state.initStart
    }
  },
  methods:{
    delMember(member){
      this.axios.delete(`/group/${this.id}/user/${member.user_id}`).then((res)=>{
        if(res.data.code === 200){
          pubjs.toast('删除成功')
          this.members.splice(this.members.indexOf(member),1)
        }
      })
    },
    delTeam(){
      pubjs.confirm('你确定要删除团队么!!!',()=>{
        this.axios.delete(`/group/${this.id}`).then((res)=>{
          if(res.data.code === 200){
            this.$router.go(-1)
            pubjs.toast('删除成功')
            this.$store.commit({
              type:'delTeam',
              id:this.id
            })
          }
        })
      })
    },
    goBack(){
      this.$router.go(-1)
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
    initMembers(){
      this.axios.get(`/group/${this.id}/number`).then((res)=>{
        if(res.data.code === 200){
          this.members = res.data.data
          this.$store.commit({
            type:'updateTeamInfo',
            id:this.id,
            name:'createTeams',
            data:{
              user_group_count:res.data.data.length
            }
          })
        }
      })
    },
    initQr(){
      // this.axios.get(`/qr?content=${config.URLBASE}?joinTeamsCode=${this.groupcode}`).then((res)=>{
      //     this.qr = res.data.data.img
      // })
      QRCode.toDataURL(`${config.URLBASE}?joinTeamsCode=${this.groupcode}`).then(url=>{
        this.qr=url
      })
    },
    init(){
      this.initMembers()
      this.initQr()
    }
  },
  mounted(){
    if(this.initStart){
      this.init()
    }
  },
  watch:{
    initStart(newv){
      if(newv){
        this.init()
      }
    }
  }
}
</script>
<style scoped>
header i{
  position: absolute;
  left: 23px;
  font-size: 60px;
}
header .complete{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 32px;
}
header .setting{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 32px;
  width: 37px;
  height: 37px;
}
header .TeamdDtailMeau{
  position: absolute;
  width: 200px;
  height: 120px;
  background-color: #fff;
  top: 80px;
  right: 23px;
  box-shadow: 0 0px 10px #aaa;
}
header .TeamdDtailMeau div{
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  line-height: 60px;
}
.team{
  position: relative;
  margin: 0 auto 32px auto;
  width: 494px;
  height: 120px;
  border-radius: 20px;
  box-shadow: 0 0 10px #999;
  font-size: 24px;
  padding: 28px 33px;
  margin-top: 32px;
}
.team .info{
  float: left;
  width: 370px;
}
.team .info p{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  line-height: 40px;
}
.team .info p span{
  width: 100px;
  display: block;
  float: left;
  text-align: right;
}
.team .qr{
  float: right;
  position: relative;
  width: 118px;
  height: 118px;
  text-align: center;
  line-height: 20px;
}
.team .qr i{
  position: relative;
  top: -30px;
}
.team .qr img{
  width: 118px;
  height: 118px;
}
.memberList{

}
.memberList .member{
  position: relative;
  height: 75px;
  border-bottom: 1px #cac7c7 solid;
  width: 484px;
  margin: 0 auto;
}
.memberList .member .head{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.memberList .member p{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 92px;
  line-height: 60px;
  font-size: 24px;
  color: #0d1a26;
}
.memberList .member .del{
  position: absolute;
  top: 15px;
  right:0;
  width: 33px;
  height: 30px;
}
.memberList .member .del img{
  width: 33px;
  height: 30px;
  display: block;
}
.noMember{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}
.noMember img{
  width: 173px;
  height: 173px;
}
.noMember p{
  font-size: 24px;
}
</style>
