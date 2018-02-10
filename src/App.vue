<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <TodoList/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import TodoList from './components/TodoList'

export default {
  name: 'App',
  components: {
    TodoList
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
}
</style>
