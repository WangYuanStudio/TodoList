<template>
<div class="personal">
  <div class="selector">
    <div class="slideAcutely">
      <span v-on:click="complete=0">未完成</span>
      <span v-on:click="complete=1">已完成</span>
      <div class="slide" v-bind:style="{left:complete?'50%':'0%'}">
        {{slideText}}
      </div>
    </div>
  </div>
  <div class="todos">
    <div class="todo" style="background-color:#fff" v-for='(todo,index) in todoFilter' v-bind:index='index'>
      <div class="view" v-on:click="showOperation(todo)">
        <div class="status" v-if="todo.status" v-on:click.stop="cancelTodo(todo)">
          <img src="../assets/icon/ok.png" alt="">
        </div>
        <div class="status" v-else v-on:click.stop="finshing(todo)">
          <img src="../assets/icon/no.png" alt="">
        </div>
        <div class="text" v-bind:class="{showlimit:!todo.showmore}" v-bind:style="{color:todo.team?'#fff':'#000'}">{{todo.content}}</div>
        <div style="clear:both"></div>
      </div>
      <div class="operation" v-if="todo.showmore">
        <div class="personalTodo">
          <div class="nofinshed" v-if="!todo.status">
            <span v-on:click="openAlert('xiugai',todo)"><i class="iconfont icon-xiugai"></i>修改</span>
            <span v-on:click="finshing(todo)"><i class="iconfont icon-wancheng1"></i>完成</span>
            <span v-on:click="deleteTodo(todo)"><i class="iconfont icon-icon"></i>删除</span>
          </div>
          <div class="finshed" v-else>
            <span v-on:click="deleteTodo(todo)"><i class="iconfont icon-icon"></i>删除</span>
            <span v-on:click="cancelTodo(todo)"><i class="iconfont icon-wuuiconsuoxiao"></i>取消</span>
          </div>
        </div>
      </div>
    </div>
    <div class="todo" style="background-color:#5d707b" v-for='(todo,index) in teamTodoFilter' v-bind:index='index'>
      <div class="view" v-on:click="showOperation(todo)">
        <div class="status" v-if="todo.status" v-on:click.stop="cancelTodo(todo)">
          <img src="../assets/icon/ok.png" alt="">
        </div>
        <div class="status" v-else v-on:click.stop="finshing(todo)">
          <img src="../assets/icon/no.png" alt="">
        </div>
        <div class="text" v-bind:class="{showlimit:!todo.showmore}" style="color:#fff">{{todo.content}}</div>
        <div style="clear:both"></div>
      </div>
      <div class="operation" v-if="todo.showmore">
        <div class="teamTodo">
          <div class="nofinshed" v-if="!todo.status">
            <span v-on:click="finshing(todo)"><i class="iconfont icon-wancheng1"></i>完成</span>
            <span v-on:click="openAlert('danmu',todo)"><i class="iconfont icon-danmu"></i>弹幕</span>
            <span v-on:click="openAlert('detail',todo)"><i class="iconfont icon-detail"></i>详细</span>
            <span class="teamName">{{todo.teamInfo.teamName}}</span>
          </div>
          <div class="finshed" v-else>
            <span v-on:click="deleteTodo(todo)"><i class="iconfont icon-icon"></i>删除</span>
            <span v-on:click="cancelTodo(todo)"><i class="iconfont icon-wuuiconsuoxiao"></i>取消</span>
            <span class="teamName">{{todo.teamInfo.teamName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="noTodo" v-if="!(todoFilter.length+teamTodoFilter.length)">
    <img src="../assets/icon/logo.png" v-if="complete">
    <img src="../assets/icon/logo2.png" v-else>
    <p style="color:#000" v-if="complete">Nothing finished!</p>
    <p style="color:#ccc" v-else>Nothing to do!</p>
  </div>
  <router-view></router-view>
</div>
</template>
<script>
import ebus from '../assets/ebus.js'
import pubjs from '../assets/public.js'

export default {
  name: 'personal',
  data () {
    return {
      todos:[
        // {
        //   content:'123123'
        //   team:false,
        //   showmore:false
        // },
        // {
        //   content:'123123'
        //   team:false,
        //   showmore:false
        // }
      ],
      teamTodos:[
        // {
        //   team:true,
        //   showmore:false,
        //   danmu:[
        //     666,6666,66666
        //   ],
        //   teamInfo:{
        //     teamName:'bilibili',
        //     created_at:'2018-03-05 25:16',
        //     end_time:'2018-06-16',
        //     groupcode:'23333333'
        //   }
        // }
      ],
      complete:0,//用于切换完成和未完成
      lastFocus:null,
    }
  },
  computed:{
    todoFilter(){
      return this.todos.filter((todo) => {
        return todo.status === this.complete
      })
    },
    teamTodoFilter(){
      return this.teamTodos.filter((todo) => {
        return todo.status === this.complete
      })
    },
    slideText(){
      return this.complete?'已完成':'未完成'
    },
    initStart(){
      return this.$store.state.initStart
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
    openAlert(type,todo){
      this.$router.push({path:'/personal/alert',query:{redirect:this.$route.path,type,content:todo.content,teamInfo:todo.teamInfo,id:todo.id}})
    },
    finshing(todo){//完成某个事件
      todo.showmore = false
      if(todo.team){
        todo.status=1
        this.axios.patch(`/task/${todo.id}`,{
          status:1
        })
      }
      else{
        todo.status = 1
        this.axios.patch(`/personal/${todo.id}`,{
          status:1
        })
      }
      this.$store.commit({
        type:'finshing',
      })
    },
    deleteTodo(todo){//删除某件已完成事件
      let index
      if(todo.team){
        index = this.teamTodos.indexOf(todo)
        this.teamTodos.splice(index,1);
        this.axios.delete(`/task/${todo.id}/personal`)
      }
      else{
        index = this.todos.indexOf(todo)
        this.todos.splice(index,1);
        this.axios.delete(`/personal/${todo.id}`)
      }
    },
    cancelTodo(todo){
      if(todo.team){
        todo.showmore = false
        todo.status = 0
        this.axios.patch(`/task/${todo.id}`,{
          status:0
        })
      }
      else{
        todo.showmore = false
        todo.status = 0
        this.axios.patch(`/personal/${todo.id}`,{
          status:0
        })
      }
      this.$store.commit({
        type:'cancelTodo',
      })
    },
    searchTodoObj(type,id){
      // let arry
      // if(type === 'personal'){
      //   arry = this.todos
      // }
      // else{//team
      //   arry = this.teamTodos
      // }
      // let s = 0
      // let t = arry.length-1
      // let mid = parseInt(t/2)
      // while(s<=t){
      //   if(arry[mid].id === parseInt(id)){
      //     return arry[mid]
      //   }
      //   else{
      //     if(arry[mid].id<parseInt(id)){
      //       s=mid+1;
      //       mid = parseInt((s+t)/2)
      //     }
      //     else{
      //       t=mid-1;
      //       mid = parseInt((s+t)/2)
      //     }
      //   }
      // }都不是有序序列，折半找个鬼
      let arry
      if(type === 'personal'){
        arry = this.todos
      }
      else{//team
        arry = this.teamTodos
      }
      for(let todo of arry){
        if(todo.id == id){
          return todo
        }
      }
    },
    initList(){
      this.axios.get('/personal').then((res)=>{
        for(let item of res.data.data){
          this.todos.push(Object.assign({
            team:false,
            showmore:false
          },item))
        }
      })
      this.axios.get('/task').then((res)=>{
        for(let item of res.data.data){
          for(let ttodo of item.task){
            ttodo.team=true
            ttodo.showmore=false
            this.teamTodos.push(ttodo)
            ttodo.teamInfo = {
              teamName:item.group.name,
              created_at:ttodo.created_at,
              end_time:ttodo.end_time,
              groupcode:item.group.groupcode
            }
          }
        }
      })
    },
    initEvent(){
      ebus.$on('pushNewPersonalTodo',(data)=>{
        data.status = 0
        data.danmu=[]
        this.todos.push(data)
        this.axios.post(`/personal`,{
          content:data.content
        }).then((res)=>{
          Object.assign(data,res.data.data)
        })
      })
      ebus.$on('personalAlertEvent',(data)=>{//alert组件回传数据
        //先查找需要操作的todoObj
        switch(data.type){
          case 'danmu':
            if(data.content){
              this.axios.post('/barrage',{
                content:data.content,
                task_id:data.id
              })
            }
            break
          case 'xiugai':
            if(data.content){
              let obj = this.searchTodoObj('personal',data.id)
              obj.content = data.content;
              this.axios.patch(`/personal/${data.id}`,{
                content:data.content
              })
            }
            break
        }
      })
    },
    init(){
      this.initEvent()
      this.initList()
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
.personal{
  position: relative;
  min-height: calc(100vh - 80px - 86px);
}
.personal .selector{
  position: relative;
  padding: 32px 0;
  font-size: 24px;
}
.personal .selector .slideAcutely{
  position: relative;
  width: 430px;
  height: 48px;
  border-radius: 50px;
  border: 1px solid #e5e5e5;
  margin: 0 auto;
  background-color: #e5e5e5;
}
.personal .selector .slideAcutely span{
  width: 50%;
  display: block;
  float: left;
  text-align: center;
  line-height: 48px;
  color: #aea0a0;
}
.personal .selector .slideAcutely .slide{
  position: absolute;
  background-color: #fff;
  width: 50%;
  height: 100%;
  border-radius: 50px;
  box-shadow: 0 0 10px #999;
  text-align: center;
  line-height: 48px;
  transition: left 0.2s;
}
.personal .noTodo{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}
.personal .noTodo img{
  width: 173px;
  height: 173px;
}
.personal .noTodo p{
  font-size: 24px;
}
</style>
