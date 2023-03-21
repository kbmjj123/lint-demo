<template>
  <div id="app" class="app-main">
    <router-view/>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    components: {
    }
  }
</script>
<style lang="less" scope>
  html, body {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow-x: auto;
  }

  .app-main {
    width: 100%;
    height: 100%;
  }
</style>
