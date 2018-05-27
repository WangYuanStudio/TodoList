<template>
<div class="personal">
  <div class="noTodo">
    <img src="../assets/icon/logo.png">
    <p>Nothing finished</p>
  </div>
</div>
</template>
<script>
export default {
  name: 'personal',
  data () {
    return {

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
