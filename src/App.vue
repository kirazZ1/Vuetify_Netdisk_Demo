<!--<style>-->
<!--/*进度条颜色*/-->
<!--/*#nprogress .bar {*/-->
<!--/*  background: #1E90FF !important;*/-->
<!--/*}*/-->
<!--</style>-->
<template>
  <div id="app">
    <transition :name="animate">
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App',
  provide(){
    return{
      loginDash:this.loginDash,
      reload:this.reload
    }
  },
  watch: {
    $route(to, from) {
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.animate= 'slide-left';
      }else{
        this.animate= 'slide-right';
      }
    }
  },

  data: () => ({
    //
    isRouterAlive:true,
    animate:''
  }),
  methods:{
    loginDash(){
      //console.log("tiaozhuan1");
      this.$router.push({  //核心语句
        path: '/dashboard',   //跳转的路径
      })
    },
    reload(){
      this.isRouterAlive= false;
      this.$nextTick(function (){
        this.isRouterAlive= true;
        this.$router.push({  //核心语句
          path: '/login' ,   //跳转的路径
        })
      })
    }
  }
};
</script>


