<template>
  <div>
    <header>
      <i class="iconfont icon-zhixiang-zuo" v-on:click="goBack"></i>
      <span>已加入团队</span>
    </header>
    <div class="teamList" v-if="teams.length">
      <div class="team" v-for="(team,index) in teams">
        <div class="info">
          <p><span>创建者：</span>{{team.user.nickname}}</p>
          <p><span>团队名：</span>{{team.name}}</p>
          <p v-on:click="Clipboard(team.groupcode)"><span>团队ID：</span>{{team.groupcode}}</p>
        </div>
        <div class="qr">
          <i v-if="!team.qr" v-bind:getqr="getQr(team)" class="weui-loading weui-icon_toast"></i>
          <img v-else v-bind:src="team.qr">
        </div>
        <div class="quit" v-on:click="quit(team)">
          <span>退出</span>
        </div>
      </div>
    </div>
    <div class="createBG" v-else>
      <div class="create" v-on:click="openAlert('join')">
        <img src="../assets/icon/createTeam.png">
        加入一个团队
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import QRCode from 'qrcode'
import pubjs from '../assets/public.js'
import ebus from '../assets/ebus.js'
import config from '../assets/config.js'
export default {
  name: 'join',
  data(){
    return {

    }
  },
  computed:{
    teams(){
      return this.$store.state.joinTeams
    },
    hash(){
      return this.$route.hash
    }
  },
  methods:{
    openAlert(type){
      this.$router.push({path:'/join/alert',query:{redirect:this.$route.path,type}})
    },
    goBack(){
      this.$router.go(-1)
    },
    getQr(team){
      // this.axios.get(`/qr?content=${config.URLBASE}?joinTeamsCode=${team.groupcode}`).then((res)=>{
      //   this.$store.commit({
      //     type:'setQr',
      //     obj:team,
      //     array:'joinTeams',
      //     qr:res.data.data.img
      //   })
      // })
      QRCode.toDataURL(`${config.URLBASE}?joinTeamsCode=${team.groupcode}`).then(url=>{
        this.$store.commit({
          type:'setQr',
          obj:team,
          array:'joinTeams',
          qr:url
        })
      })
      return ''
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
    quit(team){
      this.$router.push({path:this.$route.path+'#quit'})
      pubjs.confirm(`你确定要退出"${team.name}"团队么!!!`,()=>{
        this.axios.delete(`/group/${team.id}/quit`).then((res)=>{
          if(res.data.code === 200){
            ebus.$emit('updateTask')
            this.$store.commit({
              type:'quitTeam',
              obj:team
            })
            pubjs.toast('退出成功')
            this.$router.go(-1)
          }
          else{
            pubjs.alert('出错了',res.data.msg)
          }
        })
      },()=>{
        this.$router.go(-1)
      })
    },
    initEvent(){
      ebus.$on('joinAlertEvent',(data)=>{//alert组件回传数据
        if(data.content){
          this.axios.post('/group/add',{
            groupcode:data.content
          }).then((res)=>{
            if(res.data.code === 200){
              pubjs.toast('加入团队成功')
              this.$store.commit({//开始初始化各组件
                type:'pushJoinTeams',
                joinTeams:[res.data.data]
              })
              ebus.$emit('updateTask')
            }
            else{
              pubjs.alert(res.data.msg,'')
            }
          })
        }
      })
    },
  },
  watch:{
    hash:function(newValue,oldValue){
      if(oldValue === '#quit'&&!newValue){
        if(document.getElementById('connfirmBG')){
          document.body.removeChild(document.getElementById('connfirmBG'))
        }
      }
    }
  },
  mounted(){
    this.initEvent()
  }
}
</script>
<style scoped>
header i{
  position: absolute;
  left: 23px;
  font-size: 60px;
}
.teamList{
  padding: 32px 0 0 0;
}
.teamList .team{
  position: relative;
  margin: 0 auto 32px auto;
  width: 494px;
  height: 144px;
  border-radius: 20px;
  box-shadow: 0 0 10px #999;
  font-size: 24px;
  padding: 28px 33px;
}
.teamList .team .info{
  float: left;
  width: 370px;
}
.teamList .team .info p{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  line-height: 40px;
}
.teamList .team .info p span{
  width: 100px;
  display: block;
  float: left;
  text-align: right;
}
.teamList .team .qr{
  float: right;
  position: relative;
  width: 118px;
  height: 118px;
  text-align: center;
  line-height: 20px;
}
.teamList .team .qr img{
  width: 118px;
  height: 118px;
}
.teamList .team .quit{
  position: absolute;
  top: 142px;
  right: 33px;
}
.teamList .team .quit span{
  display: block;
  font-size: 20px;
  color: #1aa6f4;
  padding: 10px;
}
.createBG{
  width: 100%;
  height: calc(100vh - 80px - 86px);
  position: relative;
}
.createBG .create{
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
.createBG .create img{
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 24px;
}
</style>
