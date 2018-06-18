<template>
  <div id="app" v-on:touchstart="touchstart($event)" v-on:touchmove="touchmove($event)" v-on:touchend="touchend($event)" v-on:touchcancel="touchcancel($event)">
    <header v-bind:style="{top:showBar?'0px':'-80px'}">
      <span>{{title}}</span>
      <img v-on:click="showSideBar" class="meau" src="data:image/png;base64,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">
    </header>
    <main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <addTodo v-show="showBar" />
    </main>
    <footer v-bind:style="{bottom:showBar?'0px':'-86px'}">
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
    <transition name="sideBar">
        <div class="sideBarBG" v-show="sideBar.show" v-on:click.self="close">
            <sideBar class="sideBar" v-bind:class="{sideBarAnime:sideBar.animeclass}" v-show="sideBar.show" v-bind:style="{right:sideBar.right}" />
        </div>
    </transition>
  </div>
</template>

<script>
import addTodo from './components/addtodo'
import sideBar from './components/sidebar'
import pubjs from './assets/public.js'
import config from './assets/config.js'
export default {
  name: 'app',
  data(){
    return {
      sideBar:{
        show:false,
        right:'',
        animeclass:false
      },
      touch:{
        startX:0,
        endX:0,
        offsetX:0
      }
    }
  },
  components: {
    addTodo,
    sideBar
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
          return '监督人'
      }
    },
    showBar(){
      return !(/created/.test(this.path)||/join/.test(this.path)||/hearted/.test(this.path))
    },
    path(){
      return this.$route.path
    }
  },
  methods:{
    touchstart(event){
      this.touch.startX = event.touches[0].clientX
    },
    touchmove(event){
      this.touch.offsetX = event.touches[0].clientX - this.touch.startX
    },
    touchend(event){
      // if(this.touch.offsetX < -10){
      //   //向左滑
      //
      // }
      if(this.touch.offsetX < -50&&!this.sideBar.show){
        //向左滑
        this.showSideBar()
      }
      // if(this.touch.offsetX > 10){
      //   console.log(123)
      //   //向右滑
      // }
      if(this.touch.offsetX > 50){
        //向右滑
        if(this.sideBar.show){
          this.close()
        }
        else{
          if((this.path !== '/personal'&&this.path !== '/team'&&this.path !== '/heart')||this.$route.hash){
            this.$router.go(-1)
          }
        }
      }
      this.touch.offsetX = 0
    },
    touchcancel(event){

    },
    getQueryString(name) {
      let reg = new RegExp("(\\?|&)" + name + "=([^&]*)(&|$)", "i");
      let r = location.href.match(reg);
      if (r != null) return unescape(r[2]); return null;
    },
    async login(){
      if(this.getQueryString('joinTeamsCode')){//通过扫描团队二维码打开
        //先保存团队code否则授权的时候会丢失参数
        localStorage.joinTeamsCode = this.getQueryString('joinTeamsCode')
      }
      let loginerr=false
      if(!this.$store.state.token){
        let code = this.getQueryString('code')
        if(code){
          let data = await this.axios.get(`/login/${code}`)
          if(data.data.code === 200){
            this.$store.commit({
              type:'updateToken',
              token:data.data.data.token,
            })
          }
          else{
            loginerr=true
            location=`${config.APIBASE}/auth`
            // setTimeout(()=>{
            //   this.login()
            // },1000)
          }
        }
        else{
          loginerr=true
          location=`${config.APIBASE}/auth`
          // setTimeout(()=>{
          //   this.login()
          // },1000)
        }
      }
      if(!loginerr){
        let joinTeamsCode = localStorage.joinTeamsCode
        if(joinTeamsCode){
          this.jointeam(joinTeamsCode)
        }
        else{
          this.$store.commit({//开始初始化各组件
            type:'initStart'
          })
        }
      }

    },
    showSideBar(){
      this.sideBar.show = true
      this.sideBar.animeclass = true
      setTimeout(()=>{
        this.sideBar.animeclass = false
      },250)
      this.$router.push(`${this.$route.path}/sidebar`)
    },
    close(){
      if(this.sideBar.show){
        this.$router.go(-1)
      }
      this.sideBar.show = false
    },
    jointeam(groupcode){
      this.axios.post('/group/add',{
        groupcode:groupcode
      }).then((res)=>{
        if(res.data.code === 200){
          localStorage.joinTeamsCode = ""
          pubjs.toast('加入团队成功')
          this.$router.push({
            path:'/join'
          })
        }
        this.$store.commit({//开始初始化各组件
          type:'initStart'
        })
      })
    },
    initCreateTeams(){
      this.axios.get('/group').then((res)=>{
        this.$store.commit({
          type:'pushCreateTeams',
          createTeams:res.data.data
        })
      })
    },
    initJoinTeams(){
      this.axios.get('/group/add').then((res)=>{
        this.$store.commit({
          type:'pushJoinTeams',
          joinTeams:res.data.data
        })
      })
    },
    initRouter(){//首次加载页面不显示侧边栏
      if(/sidebar/.test(this.$route.path)){
        this.$router.push(`${this.$route.path.match(/(.*)\/sidebar/)[1]}`)
      }
    },
    init(){
      this.initJoinTeams()
      this.initCreateTeams()
      this.initRouter()
    }
  },
  mounted(){
    localStorage.build=config.build
    this.login()
    if(this.$store.state.initStart){
      this.init()
    }

  },
  watch:{
    path(newValue,oldValue){
      if(!/\/sidebar/.test(newValue)&&/\/sidebar/.test(oldValue)){
        this.sideBar.show = false
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
  transition: top 0.2s;
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
  transition: bottom 0.2s;
}
footer .personal{
  position: relative;
  float: left;
  text-align: center;
  margin-left: 68px;
  padding: 10px 20px;
}
footer .team{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 10px 20px;
}
footer .heart{
  position: relative;
  float: right;
  text-align: center;
  margin-right: 68px;
  padding: 10px 20px;
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

/* 这是公共的todo部分 */
.todos{
  position: relative;
  padding-bottom: 150px;
}
.todos .todo{
  position: relative;
  box-shadow: 0 0 6px #ccc;
  width: 597px;
  margin: 24px auto;
  min-height: 106px;
  border-radius: 10px;
}
.todos .todo .view{
  position: relative;
}
.todos .todo .view .status{
  position: absolute;
  left: 0;
  top: 0;
  padding: 38px 24px;
}
.todos .todo .view .status img{
  width: 33px;
  height: 30px;
  display: block;
}
.todos .todo .view .text{
  float: left;
  margin: 33px 20px 33px 81px;
  line-height: 45px;
  font-size: 28px;
  transition: height 0.2s;
  word-break:break-all;
}
.todos .todo .view .showlimit{
  height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 115px);
  overflow: hidden;
}
.todos .todo .operation{
  position: relative;
}
.todos .todo .operation .personalTodo,.teamTodo,.superviseTodo{
  position: relative;
  color: #84caf1;
  height: 40px;
  padding: 0 20px 0 81px;
  line-height: 40px;
}
.todos .todo .operation span{
  float: left;
  font-size: 18px;
  margin-right: 32px;
}
.todos .todo .operation span i{
  padding: 0 11px 0 0;
  font-size: 18px;
}
.todos .todo .operation .nofinshed span{
  margin-right: 32px;
}
.todos .todo .operation .finshed span{
  margin-right: 66px;
}
.todos .todo .operation .teamName{
  float: right;
  padding: 0 8px;
  color:#9db6c4;
  font-size: 18px;
  margin-right: 0!important;
}
.sideBarBG{
  background-color: rgba(0,0,0,0.8);
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  z-index: 110;
}
.sideBarBG .sideBar{
  position: absolute;
  width: 68.75%;
  height: 100%;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transition: right 0.2s;
  right: 0;
}
.sideBarAnime{
  animation: forwards 0.2s ease-in openSideBar;
}
@keyframes openSideBar {
  from{right:-68.75%}
  to{right:0}
}
.sideBar-enter-active, .sideBar-leave-active {
  transition: opacity .2s;
}
.sideBar-enter, .sideBar-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* 确认框 */
.confirmBG{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.0.56);
  z-index: 100;
}
.confirmBG .confirm{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 440px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
}
.confirmBG .confirm .text{
  position: relative;
  height: 185px;
  font-size: 28px;
  text-align: center;
}
.confirmBG .confirm p{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-20%);
  width: 340px;
}
.confirmBG .confirm .button{
  position: relative;
  width: 370px;
  margin: 0 auto;
  height: 110px;
}
.confirmBG .confirm .button div{
  width: 160px;
  height: 52px;
  text-align: center;
  line-height:52px;
  color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.confirmBG .confirm .button .cancel{
  background-color: #1aa6f4;
  right: 0;
}
.confirmBG .confirm .button .accept{
  background-color: #9faeb6;
  left: 0;
}
</style>
