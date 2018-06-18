<template>
  <div>
    <header>
      <i class="iconfont icon-zhixiang-zuo" v-on:click="goBack"></i>
      <span>监护人设置</span>
    </header>
    <div class="superviseInfo" v-if="superviseInfo.user.nickname">
      <div class="img_name">
        <img v-bind:src="superviseInfo.user.headimgurl">
        <span>{{superviseInfo.user.nickname}}</span>
      </div>
      <div class="sum">
        今日完成事项数 <span>{{superviseSum}}</span>
      </div>
      <div class="del" v-on:click="del">
        互删
      </div>
    </div>
    <div class="applyList" v-if="!superviseInfo.user.nickname&&applyList.length">
      <div class="apply" v-for="(apply,index) in applyList"  v-bind:key="index">
        <img v-bind:src="apply.user.headimgurl">
        <p>"{{apply.user.nickname}}"希望和你互相监督</p>
        <div class="accept" v-on:click="accept(apply.id)">
          确认
        </div>
      </div>
    </div>
    <div class="noApply" v-if="!superviseInfo.user.nickname&&!applyList.length">
      <img src="../assets/icon/logo2.png">
      <p style="color:#ccc">You need one guy！</p>
    </div>
  </div>
</template>
<script>
import pubjs from '../assets/public.js'
export default {
  name: 'created',
  data(){
    return {
      applyList:[],
      superviseInfo:{
        todaycompleteCount:0,
        user:{}
      },

    }
  },
  computed:{
    superviseSum(){//格式化今日完成事项数
      if(this.superviseInfo.todaycompleteCount<10){
        return '0'+this.superviseInfo.todaycompleteCount
      }
      else{
        return this.superviseInfo.todaycompleteCount
      }
    },
    hash(){
      return this.$route.hash
    },
    initStart(){
      return this.$store.state.initStart
    }
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
    accept(id){
      this.axios.patch(`/supervise/${id}`).then((res)=>{
        if(res.data.code === 200){
          pubjs.toast('添加成功')
          this.initSupervise()
        }
        else{
          pubjs.alert('出错了',res.data.msg)
        }
      })
    },
    del(){
      this.$router.push({path:this.$route.path+'#del'})
      pubjs.confirm('你确认要互删对方么!!!',()=>{
        this.axios.delete('/supervise').then((res)=>{
          if(res.data.code === 200){
            pubjs.toast('删除成功')
            this.superviseInfo = {
              todaycompleteCount:0,
              user:{}
            }
          }
        })
        this.$router.go(-1)
      },()=>{
        this.$router.go(-1)
      })
    },
    initSupervise(){
      this.axios.get('/supervise').then((res)=>{
        this.applyList = res.data.data.apply
        if(res.data.data.success.user){
          this.superviseInfo.user = res.data.data.success.user
          this.superviseInfo.todaycompleteCount = res.data.data.success.todaycompleteCount
        }
      })
    },
    init(){
      this.initSupervise()
    }
  },
  mounted(){
    if(this.initStart){
      this.init()
    }
  },
  watch:{
    hash:function(newValue,oldValue){
      if(oldValue === '#del'&&!newValue){
        if(document.getElementById('connfirmBG')){
          document.body.removeChild(document.getElementById('connfirmBG'))
        }
      }
    },
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
.superviseInfo{
  position: relative;
  margin:0 auto;
  width: 570px;
  height: 163px;
  box-shadow: 0 0 6px #ccc;
  border-radius: 10px;
  margin-top: 32px;
}
.superviseInfo .img_name{
  position: relative;
  line-height: 100px;
  height: 100px;
  font-size: 24px;
  line-height: 100px;
}
.superviseInfo .img_name img{
  position: absolute;
  top: 50%;
  left: 32px;
  transform: translateY(-50%);
  height: 48px;
  width: 48px;
  border-radius: 50%;
  display: inline-block;
}
.superviseInfo .img_name span{
  position: absolute;
  top: 50%;
  left: 98px;
  transform: translateY(-50%);
}
.superviseInfo .sum{
  color: #9fa2a4;
  font-size: 20px;
  padding: 0 23px;
}
.superviseInfo .sum span{
  color: #1aa6f4;
  font-size: 30px;
}
.superviseInfo .del{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
  background-color: #9aa2a6;
  color: #fff;
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  border-radius: 10px;
}
.applyList{
  padding: 32px 0;
}
.applyList .apply{
  position: relative;
  margin:0 auto;
  width: 538px;
  height: 85px;
  padding: 0 16px;
  box-shadow: 0 0 6px #ccc;
  border-radius: 10px;
}
.applyList .apply img{
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  height: 60px;
  width: 60px;
}
.applyList .apply p{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 355px;
  left: 90px;
  color: #0d1a26;
  font-size: 20px;
  word-break:break-all;
}
.applyList .apply .accept{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
  background-color: #1aa6f4;
  color: #fff;
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  border-radius: 10px;
}
.noApply{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}
.noApply img{
  width: 173px;
  height: 173px;
}
.noApply p{
  font-size: 24px;
}
</style>
