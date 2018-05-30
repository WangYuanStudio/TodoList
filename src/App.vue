<template>
  <div id="app">
    <header>
      <span>{{title}}</span>
      <img class="meau" src="./assets/icon/hamburger.png">
    </header>
    <main>
      <router-view></router-view>
      <addTodo />
    </main>
    <footer>
      <router-link to="/personal">
        <div class="personal" v-bind:class="{select:select === 'personal'}">
          <i class="icon iconfont icon-personal"></i>
          <p>个人</p>
        </div>
      </router-link>
      <router-link to="/team">
        <div class="team" v-bind:class="{select:select === 'team'}">
          <i class="icon iconfont icon-tuandui"></i>
          <p>团队</p>
        </div>
      </router-link>
      <router-link to="/heart">
        <div class="heart" v-bind:class="{select:select === 'heart'}">
          <i class="icon iconfont icon-xin"></i>
          <p>监督人</p>
        </div>
      </router-link>
    </footer>
  </div>
</template>

<script>
import addTodo from './components/addtodo'
export default {
  name: 'app',
  data(){
    return {

    }
  },
  components: {
    addTodo
  },
  computed:{
    select(){
      return this.$route.name
    },
    title(){
      switch(this.select){
        case 'personal':
          return '个人'
        case 'team':
          return '团队'
        case 'heart':
          return '监护人'
      }
    }
  }

}
</script>

<style>
a:hover, a:visited, a:link, a:active, a:focus {
  color:#000;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
  outline:none;
  background: none;
  text-decoration: none;
}
body {
  margin: 0;
}
header {
  margin: 0;
  height: 80px;
  background-color: #fff;
  color: #000;
  text-align: center;
  box-shadow: 0px 5px 5px #eee;
  font-size: 28px;
  line-height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 100;
}
header .meau{
  position: absolute;
  right: 28px;
  width: 45px;
  top: 50%;
  transform: translateY(-50%);
}
main {
  height: calc(100vh - 80px - 86px);
  position: relative;
  margin: 80px 0 86px 0;
  overflow-y: auto;
}
footer{
  position: fixed;
  height: 86px;
  box-shadow: 0 -4px 4px #eee;
  bottom: 0;
  width: 100%;
  font-size: 20px;
  background-color: #fff;
}
footer .personal{
  position: relative;
  float: left;
  text-align: center;
  margin-left: 68px;
  padding: 16px 20px;
}
footer .team{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 15px 20px;
}
footer .heart{
  position: relative;
  float: right;
  text-align: center;
  margin-right: 68px;
  padding: 16px 20px;
}
footer .icon{
  position: relative;
  height: 24px;
}
footer .select{
  color: #1aa6f4;
}
footer p{
  margin:0
}
</style>
