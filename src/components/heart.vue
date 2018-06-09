<template>
<div class="supervise">
  <div class="addSuperviseBg" v-if="noSupervise">
    <div class="addSupervise" v-on:click="openAlert('addSuperviseBg')">
      <img src="../assets/icon/createSupervise.png">
      请求一个监护人
    </div>
  </div>
  <div class="todos" v-if="!noSupervise">
    <div class="todo" style="background-color:#fff" v-for='(todo,index) in superviseTodos' v-bind:index='index'>
      <div class="view" v-on:click="showOperation(todo)">
        <div class="status">
          <div class="redStatus"></div>
        </div>
        <div class="text" v-bind:class="{showlimit:!todo.showmore}" v-bind:style="{color:todo.team?'#fff':'#000'}">{{todo.content}}</div>
        <div style="clear:both"></div>
      </div>
      <div class="operation" v-if="todo.showmore">
        <div class="superviseTodo">
          <div class="nofinshed" v-if="!todo.status">
            <span v-on:click="remind(todo)"><i class="iconfont icon-tixing"></i>催一下</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</div>
</template>
<script>
import ebus from '../assets/ebus.js'
import pubjs from '../assets/public.js'
export default {
  name: 'heart',
  data () {
    return {
      superviseTodos:[],
      lastFocus:null,
      noSupervise:false,//没有监督人
    }
  },
  methods: {
    showOperation(todo){
      if(todo.showmore){
        todo.showmore = false
      }
      else{
        if(this.lastFocus !== null){
          this.lastFocus.showmore = false
        }
        this.lastFocus = todo;
        todo.showmore = true
      }
    },
    openAlert(type,todo={}){
      this.$router.push({path:'/heart/alert',query:{redirect:this.$route.path,type,content:todo.content,teamInfo:todo.teamInfo,id:todo.id}})
    },
    remind(todo){//催一下
      this.axios.patch(`/supervise/${todo.id}/tourge`).then((res)=>{
        if(res.data.code === 200){
          pubjs.toast('催一下')
        }
      })
    },
    initEvent(){
      ebus.$on('heartAlertEvent',(data)=>{//alert组件回传数据
        //先查找需要操作的todoObj
        switch(data.type){
          case 'addSuperviseBg':
            if(data.content){
              pubjs.loadingToast()
              this.axios.post('/supervise',{
                usercode:data.content
              }).then((res)=>{
                if(res.data.code === 200){
                  pubjs.toast('申请成功')
                }
                else{
                  pubjs.alert('出错了',res.data.msg)
                }
              })
            }
            break
        }
      })
    },
    initSuperviseTodos(){
      this.axios.get('/supervise/todolist').then((res)=>{
        if(res.data.code === 200){
          for(let item of res.data.data){
            item.showmore = false
            this.superviseTodos.push(item)
          }
        }
        else{
          this.noSupervise = true
        }
      })
    },
    init(){
      if(this.$store.state.initStart){
        this.initSuperviseTodos()
        this.initEvent()
      }
      else{
        setTimeout(()=>{
          this.init()
        },1000)
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style scoped>
.supervise .addSuperviseBg{
  width: 100%;
  height: calc(100vh - 80px - 86px);
  position: relative;
}
.supervise .addSuperviseBg .addSupervise{
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
.supervise .addSuperviseBg .addSupervise img{
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 24px;
}
.todos .todo .view .status{
  height: 106px;
  width: 81px;
  padding: 0;
}
.todos .todo .view .status .redStatus{
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: #ff9b9b;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
