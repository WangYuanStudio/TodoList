<template>
  <div>
    <header>
      <i class="iconfont icon-zhixiang-zuo" v-on:click="goBack"></i>
      <span>已创建团队</span>
    </header>
    <div class="teamList" v-if="!showDetail">
      <div class="team" v-for="(team,index) in teams">
        <div class="info">
          <p><span>团队名：</span>{{team.name}}</p>
          <p v-on:click="Clipboard(team.groupcode)"><span>团队ID：</span>{{team.groupcode}}</p>
          <p><span>人数：</span>{{team.user_group_count}}</p>
        </div>
        <div class="qr">
          <i v-if="!team.qr" v-bind:getqr="getQr(team)" class="weui-loading weui-icon_toast"></i>
          <img v-else v-bind:src="team.qr">
        </div>
        <div class="management" v-on:click="gotoManagement(team)">
          <span>管理</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import pubjs from '../assets/public.js'
export default {
  name: 'created',
  data(){
    return {

    }
  },
  computed:{
    teams(){
      return this.$store.state.createTeams
    },
    showDetail(){
      return this.$route.path === '/created/teamdetail'
    }
  },
  methods:{
    gotoManagement(team){
      this.$router.push({
        path:'created/teamdetail',
        query:{
          name:team.name,
          groupcode:team.groupcode,
          id:team.id,
          index:this.teams.indexOf(team)
        }
      })
    },
    goBack(){
      this.$router.go(-1)
    },
    getQr(team){
      this.axios.get(`/qr?content=joinTeamsCode:${team.groupcode}`).then((res)=>{
        this.$store.commit({
          type:'setQr',
          obj:team,
          array:'createTeams',
          qr:res.data.data.img
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
    }
  },
  mounted(){

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
.teamList .team .qr i{
  position: relative;
  top: -30px;
}
.teamList .team .qr img{
  width: 118px;
  height: 118px;
}
.teamList .team .management{
  position: absolute;
  top: 142px;
  right: 33px;
}
.teamList .team .management span{
  display: block;
  font-size: 20px;
  color: #1aa6f4;
  padding: 10px;
}
</style>
