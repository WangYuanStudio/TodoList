<template>
<div class="personal">
  <div class="selector">
    <div class="slideAcutely">
      <span v-on:click="complete=false">未完成</span>
      <span v-on:click="complete=true">已完成</span>
      <div class="slide" v-bind:style="{left:complete?'50%':'0%'}">
        {{slideText}}
      </div>
    </div>
  </div>
  <div class="todos">
    <div class="todo" v-on:click="todo.showmore=true" v-bind:style="{backgroundColor:todo.team?'#5d707b':'#fff'}" v-for='(todo,index) in filter' v-bind:index='index'>
      <div class="status">
        <img v-if="todo.finshed" src="../assets/icon/ok.png" alt="">
        <img v-else src="../assets/icon/no.png" alt="">
      </div>
      <div class="text" v-bind:class="{showlimit:!todo.showmore}" v-bind:style="{color:todo.team?'#fff':'#000'}">{{todo.text}}</div>
      <div style="clear:both"></div>
    </div>
  </div>
  <div class="noTodo" v-if="!filter.length">
    <img src="../assets/icon/logo.png" v-if="complete">
    <img src="../assets/icon/logo2.png" v-else>
    <p style="color:#000" v-if="complete">Nothing finished!</p>
    <p style="color:#ccc" v-else>Nothing to do!</p>
  </div>
</div>
</template>
<script>
export default {
  name: 'personal',
  data () {
    return {
      todos:[
        {
          text:'2233真可爱',
          finshed:false,
          team:false,
          showmore:false
        },
        {
          text:'真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱真可爱',
          finshed:false,
          team:false,
          showmore:false
        },
        {
          text:'2233真可爱',
          finshed:false,
          team:true,
          showmore:false
        }
      ],
      complete:false
    }
  },
  computed:{
    filter(){
      return this.todos.filter((todo) => {
        return todo.finshed === this.complete
      })
    },
    slideText(){
      return this.complete?'已完成':'未完成'
    }
  },
  methods: {

  },
  mounted() {

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
.personal .todos{
  position: relative;
}
.personal .todos .todo{
  position: relative;
  box-shadow: 0 0 6px #ccc;
  width: 597px;
  margin: 24px auto;
  min-height: 106px;
  border-radius: 10px;
}
.personal .todos .todo .status{
  position: absolute;
  left: 0;
  top: 0;
  padding: 38px 24px;
}
.personal .todos .todo .status img{
  width: 33px;
  height: 30px;
  display: block;
}
.personal .todos .todo .text{
  float: left;
  margin: 24px 20px 24px 81px;
  line-height: 36px;
  font-size: 24px;
  min-height: 58px;
  transition: height 0.2s;
}
.personal .todos .todo .showlimit{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
