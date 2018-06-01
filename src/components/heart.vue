<template>
<div class="supervise">
  <div class="addSuperviseBg" v-if="!noSupervise">
    <div class="addSupervise" v-on:click="openAlert">
      <img src="../assets/icon/createTeam.png">
      创建一个团队
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
</div>
</template>
<script>
export default {
  name: 'heart',
  data () {
    return {
      superviseTodos:[
        {
          "id": 2,
          "content": "I love you!！I love you!！I love you!！I love you!！I love you!！I love you!！I love you!！I love you!！！",
          "status": 0,
          "dynamic": 0,
          "user_id": 2,
          "created_at": "2018-05-22 17:19:48",
          "updated_at": "2018-05-22 17:19:48",
          showmore :false
        },
        {
          "id": 3,
          "content": "I love you!！",
          "status": 0,
          "dynamic": 0,
          "user_id": 2,
          "created_at": "2018-05-22 17:19:50",
          "updated_at": "2018-05-22 17:19:50",
          showmore :false
        },
        {
          "id": 4,
          "content": "I love you!",
          "status": 0,
          "dynamic": 0,
          "user_id": 2,
          "created_at": "2018-05-22 17:19:52",
          "updated_at": "2018-05-22 17:19:52",
          showmore :false
        }
      ],
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
    remind(todo){
      this.axios.patch(`/supervise/${todo.id}/tourge`)
    },
    initSuperviseTodos(){
      this.axios.get('/supervise/todolist').then((rep)=>{
        if(rep.data.code === 200){
          for(let item of rep.data.data){
            item.showmore = false
            this.superviseTodos.push(item)
          }
        }
        else{
          this.noSupervise = true
        }
      })
    }
  },
  mounted() {
    //this.initSuperviseTodos()
  }
}
</script>
<style scoped>
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
