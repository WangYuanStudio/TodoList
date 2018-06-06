<template>
  <div>
    <div class="userInfo">
      <img v-bind:src="userInfo.headimgurl">
      <span>ID:{{userInfo.nickname}}</span>
    </div>
    <div class="">
      <div class="created">

      </div>
      <div class="join">

      </div>
      <div class="heart">

      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SideBar',
  data(){
    return {

    }
  },
  computed:{
    userInfo(){
      return this.$store.state.userInfo
    }
  },
  methods:{
    initUserInfo(){
      this.axios.get('/getInfo').then((rep)=>{
        this.$store.commit({
          type:'updateUserInfo',
          userInfo:rep.data.data,
        })
      })
    },
  },
  mounted(){
    this.initUserInfo()
  }
}
</script>
<style scoped>
.sideBarBG .sideBar .userInfo{
  background-color: #1aa6f4;
  height: 166px;
  margin-top: 25px;
  position: relative;
}
.sideBarBG .sideBar .userInfo img{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 98px;
  height: 98px;
  left: 42px;
}
.sideBarBG .sideBar .userInfo span{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 190px;
}
</style>
