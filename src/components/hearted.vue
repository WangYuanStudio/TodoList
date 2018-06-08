<template>
  <div>
    <header>
      <i class="iconfont icon-zhixiang-zuo" v-on:click="goBack"></i>
      <span>监护人设置</span>
    </header>
  </div>
</template>
<script>
export default {
  name: 'created',
  data(){
    return {

    }
  },
  computed:{

  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
  },
  mounted(){

  }
}
</script>
<style scoped>
header i{
  position: absolute;
  left: 23px;
  font-size: 60px;
}
</style>
