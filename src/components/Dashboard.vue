<template>
  <v-app>
    <Topbar2/>
    <Sidebar/>
<!--    <v-content v-show="showMyFiles">-->
<!--      <my-files/>-->
<!--    </v-content>-->
<!--    <v-content v-show="showMyGroups">-->
<!--      <my-groups/>-->
<!--    </v-content>-->
<!--    <v-content v-show="showViewShare">-->
<!--      <view-share/>-->
<!--    </v-content>-->
<!--    <v-content v-show="showTrash">-->
<!--      <trash/>-->
<!--    </v-content>-->
    <v-content>
    <router-view></router-view>
    </v-content>
    <v-footer
        color="light-blue darken-4"
        app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>

</template>

<script>
import Topbar2 from "@/components/common/Topbar2";
import Sidebar from "@/components/common/Sidebar";
import Bus from './common/bus.js' //父子组件通信
// import myFiles from "@/components/view/myFiles";
// import trash from "@/components/view/trash";
// import viewShare from "@/components/view/viewShare";
// import myGroups from "@/components/view/myGroups";
//2020-09-04
//完成视图的显示（点击侧边栏视图区域跳转到不同的组件）
//想用局部路由实现组件跳转，但是对vue路由理解有限，写不出来
//变换思路后的实现方式，加载全部组件，然后通过SideBar传过来的信息判断应该显示哪一个组件（用v-show）
//比较消耗资源，因为一次性加载完所有组件，不过本地运行速度还过得去

//2020-09-09
//用vue路由重写了此部分内容
export default {
  name: "Dashboard",
  components:{
    Topbar2,
    Sidebar,
    // myFiles,
    // trash,
    // viewShare,
    // myGroups

  },
  created() {
    var me = this;
    me.$router.push({  //核心语句
      path: '/dashboard/myFiles' ,   //跳转的路径
    })
  },
  mounted() {
     var me = this;
     Bus.$on('msg2', (e) => { //点击按钮侧导航栏开关
    //   //路由跳转的相关语句
    //   //alert(e);
      if(e==='myFiles'){
        me.$router.push({  //核心语句
          path: '/dashboard/myFiles' ,   //跳转的路径
        })
    //     this.showMyFiles=true;
    //     this.showMyGroups=false;
    //     this.showViewShare=false;
    //     this.showTrash=false;
      }else if(e==='myGroups'){
    //     this.showMyFiles=false;
    //     this.showMyGroups=true;
    //     this.showViewShare=false;
    //     this.showTrash=false;
        me.$router.push({  //核心语句
          path: '/dashboard/myGroups' ,   //跳转的路径
        })
      }else if(e==='viewShare') {
    //     this.showMyFiles = false;
    //     this.showMyGroups = false;
    //     this.showViewShare = true;
    //     this.showTrash = false;
        me.$router.push({  //核心语句
          path: '/dashboard/viewShare' ,   //跳转的路径
        })
      }else if(e==='trash'){
    //     this.showMyFiles=false;
    //     this.showMyGroups=false;
    //     this.showViewShare=false;
    //     this.showTrash=true;
        me.$router.push({  //核心语句
          path: '/dashboard/trash' ,   //跳转的路径
        })
      }

     }
    );
     //父组件接受局部刷新请求进行路由跳转
    // Bus.$on('refresh_myFile',(e) =>{
    //   console.log(e);
    //   me.$router.push({  //核心语句
    //     path: '/dashboard/myFiles' ,   //跳转的路径
    //   })
    // })
  },
  data(){
    return{
      route:null,
      // showMyFiles:false,
      // showMyGroups:false,
      // showViewShare:false,
      // showTrash:false
    }

  }

}
</script>

<style scoped>

</style>
