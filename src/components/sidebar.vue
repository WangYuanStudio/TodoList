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
</style>
