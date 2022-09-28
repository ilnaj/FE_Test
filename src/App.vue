<template>
    <b-row style="padding:0;margin:0">
      <b-col cols="2" class="left">
        <sideMenu ></sideMenu>
      </b-col>
      <b-col cols="10" class="right">
        <router-view/>
      </b-col>
  </b-row>
</template>

<script>
import SideMenu from '@/components/sideMenu.vue'

export default {
  name: 'App',
  components:{
    SideMenu
  },
}
</script>

<style>
.left{
    position: absolute;
    left: 0;
    padding:0
}
.right{
    position: absolute;
    right: 0;
    overflow-y: auto;
    height: 100vh;
    padding: 40px;
}


</style>
