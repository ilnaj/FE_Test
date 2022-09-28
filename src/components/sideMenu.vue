<template>
  <div class="container">
  <nav class="side-nav">
    <ul class="nav-menu">
        <li :class="item.active ?'nav-item active':'nav-item'" v-for="(item,idx) in menuList" :key="idx" @click="itemClick(idx)">
            <a>
                <font-awesome-icon :icon="item.icon" /><span class="menu-text">{{ item.title }}</span>
            </a>
        </li>
    </ul>
  </nav>
</div>
</template>

<script>
export default {
    data(){
        return{
            menuList:[
                {
                    title:"Home",
                    path:"/",
                    icon:"fa-gauge",
                    active:true
                },
                {
                    title:"Master Ruas",
                    path:"/master-ruas",
                    icon:"fa-chart-simple",
                    active:false
                }
            ]

        }
    },
    methods:{
        resetActive(){
            this.menuList.forEach((e)=>{
                e.active = false
            })
        },
        itemClick(idx){
            this.resetActive()

            this.menuList[idx].active = true
            this.$router.push(this.menuList[idx].path)
        },
        activeByRouter(){
            this.resetActive()

            for(let item of this.menuList){
                if(item.path == this.$route.path){
                    item.active = true
                }
            }
        }
    },
    created(){
        this.activeByRouter()
    }

}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Grandstander&display=swap");
body {
  font-family: "Grandstander", cursive;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  height: 100vh;
  padding:0;
  width: 100vh;
}
.side-nav,
.nav-menu {
  height: 100%;
}
.side-nav .nav-menu {
  list-style: none;
  padding: 40px 0;
  width: 250px;
  background-color: #3498db;
}
.side-nav .nav-item {
  position: relative;
  padding: 10px 20px;
}
.nav-item.active {
  background-color: #fff;
  box-shadow: 0px -3px rgba(0, 0, 0, 0.2), 0px 3px rgba(0, 0, 0, 0.2);
}
.nav-item.active a {
  color: #2980b9;
}
.nav-item a {
  text-decoration: none;
  color: #fff;
}
.menu-text {
  padding: 0 20px;
}
.side-nav .nav-item.active::before {
  content: "";
  position: absolute;
  background-color: transparent;
  bottom: 100%;
  right: 0;
  height: 150%;
  width: 20px;
  border-bottom-right-radius: 25px;
  box-shadow: 0 20px 0 0 #fff;
}
.side-nav .nav-item.active::after {
  content: "";
  position: absolute;
  background-color: transparent;
  top: 100%;
  right: 0;
  height: 150%;
  width: 20px;
  border-top-right-radius: 25px;
  box-shadow: 0 -20px 0 0 #fff;
}


</style>