<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default ({
  name: 'App'
});
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  font-size: 24px;
  color: #333333;
  overflow-x: hidden;
}
</style>
