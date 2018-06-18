<template>
  <div>
    <div class="userInfo" v-on:click="Clipboard(userInfo.usercode)">
      <img v-bind:src="userInfo.headimgurl">
      <span>ID:{{userInfo.usercode}}</span>
    </div>
    <div class="button">
      <div class="created" v-on:click="goto('created')">
        已创建团队
      </div>
      <div class="join" v-on:click="goto('join')">
        已加入团队
      </div>
      <div class="hearted" v-on:click="goto('hearted')">
        监督人设置
      </div>
    </div>
    <div class="complete">
      <p class="sum">{{complete}}</p>
      <p class="text">七天累计完成</p>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard';
import pubjs from '../assets/public.js'
export default {
  name: 'SideBar',
  data(){
    return {

    }
  },
  computed:{
    userInfo(){
      return this.$store.state.userInfo
    },
    initStart(){
      return this.$store.state.initStart
    },
    complete(){
      if(this.userInfo.completeCount<10){
        return '0'+this.userInfo.completeCount
      }
      else{
        return this.userInfo.completeCount
      }
    }
  },
  methods:{
    goto(path){
      this.$router.replace({path:'/'+path})
    },
    initUserInfo(){
      this.axios.get('/getInfo').then((res)=>{
        this.$store.commit({
          type:'updateUserInfo',
          userInfo:res.data.data,
        })
      })
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
    init(){
      this.initUserInfo()
    }
  },
  mounted(){

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
.userInfo{
  background-color: #1aa6f4;
  height: 166px;
  margin-top: 25px;
  position: relative;
}
.userInfo img{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 98px;
  height: 98px;
  left: 42px;
}
.userInfo span{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 190px;
}
.button{
  padding: 46px 0;
}
.button div{
  font-size: 28px;
  padding: 30px 52px;
}
.complete{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  height: 145px;
  width: 360px;
  border-top: 2px solid #022436;
  padding-top: 32px;
  text-align: center;
}
.complete .sum{
  color: #1aa6f4;
  font-size: 40px;
  margin-bottom: 15px;
}
.complete .text{
  font-size: 24px;
  color: #022436;
}
</style>
