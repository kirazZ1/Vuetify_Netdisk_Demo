<template>

  <v-navigation-drawer
      id="core-navigation-drawer"
      color="blue darken-3 "
      v-model="drawer"
      :right="$vuetify.rtl"
      mobile-breakpoint="960"
      app
      width="240"
  >
    <v-list
        dense
        nav
    >
      <v-list-item two-line :class="miniVariant && 'px-0'">
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/men/81.jpg">
        </v-list-item-avatar>
        <!--显示当前本机时间（动态变化）-->
        <!-- 完成后vue报警告，但不影响视图显示，尚不知道原因-->
        <v-list-item-content >
          <v-list-item-title class="white--text">欢迎你，{{ userName }}</v-list-item-title>
          <v-list-item-subtitle class="white--text">当前日期：{{nowTime}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="btnNavClick(item.route)"
          link
      >
        <v-list-item-icon>
          <v-icon class="white--text">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title  class="white--text">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-card
          class="mx-auto"
          max-width="230"
          :shaped="true"
          color="blue lighten-4"
      >
      <!-- 显示存储空间的进度条-->
        <v-chip
            class="ma-2"
            color="primary"
            small
        >
          存储用量
        </v-chip>

        <v-card max-width="210" :raised="true"  class="mx-auto">

          <v-progress-linear
              color="light-blue"
              height="15"
              :value="progress"
              striped
          >
            <template v-slot="{ value }">
              <strong style="font-size: small">{{ value }}%</strong>
            </template>
          </v-progress-linear>

        </v-card>

        <p class="caption text-center">{{storage.used}}G/{{ storage.total }}G</p>

      </v-card>
      <br>
    </template>
  </v-navigation-drawer>
</template>

<script>
//2020-09-03
//完成了侧边栏伸缩的功能
//利用$emit和$on进行兄弟组件的通信
import Bus from './bus.js'  //兄弟组件通信
import {
  mdiShareVariant,
  mdiFolder,
  mdiTrashCanOutline,
  mdiAccountMultiple,
  mdiAccountBox,
  mdiBadgeAccount,
  mdiFileDocumentMultiple
} from '@mdi/js'    //导入图标
export default {
  name: "Sidebar",

  beforeMount() {
    Bus.$on('userName', (e) => { //点击按钮侧导航栏开关
      this.userName=e;
    });
    Bus.$on('userTotalZone', (e) => { //点击按钮侧导航栏开关
      console.log(e);
      this.storage.total=e;
    });
    Bus.$on('userUsedZone', (e) => { //点击按钮侧导航栏开关
      this.storage.used=e;
    });
    //userStatus
    Bus.$on('userPermission', (e) => { //点击按钮侧导航栏开关
      this.permission=e;
      if(this.permission===3){
        let obj1 = {
          title: '用户管理', icon: mdiAccountBox, route:'userManage'
        };
        let obj2 = {
          title: '文档管理员管理', icon: mdiBadgeAccount , route:'fileManagerManage'
        };
        let obj3  = {
          title: '部门管理', icon: mdiFileDocumentMultiple , route:'manageGroupFile'
        };
        this.items.push(obj1);
        this.items.push(obj2);
        this.items.push(obj3);
      }else if(this.permission==2){
        let obj4  = {
          title: '部门管理', icon: mdiFileDocumentMultiple , route:'manageGroupFile'
        };
        this.items.push(obj4);
      }
      console.log("用户权限:"+this.permission);
    });

  },
  mounted() {

    Bus.$on('msg1', (e) => { //点击按钮侧导航栏开关
      if(this.drawer===true){
        this.drawer=false;
      }else{
        this.drawer=true;
      }
      console.log(e)
    });

  },

  beforeUpdate() {
    const pg=(this.storage.used/this.storage.total)*100;
    console.log(this.userName);
    console.log(this.storage.used);
    console.log(this.storage.total);
    console.log(pg);
    this.progress=pg.toFixed(2);
    console.log(this.progress);
    //alert(this.progress);
  },
  data(){
    return{
      drawer:false,                         //侧导航栏初始状态：关闭
      items: [                              //侧导航栏的内容
        { title: '我的文件', icon: mdiFolder, route:'myFiles'},
        { title: '我的部门', icon: mdiAccountMultiple, route:'myGroups'  },
        { title: '查看分享',icon:mdiShareVariant, route:'viewShare'},
        { title: '回收站',icon:mdiTrashCanOutline, route:'trash'},

      ],
      nowTime:new Date(),                         //当前系统时间
      miniVariant: false,                         //主体是否深色
      userName:'',              //用户姓名
      storage:{                 //用户存储用量
        total:0,
        used:0
      },
      progress:null,
      permission:0
    }

  },

  created(){
    this.getTime();
  },
  methods:{
    getTime(){
      //计算当前系统时间
        //new Date() new一个data对象，当前日期和时间
        //toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
        this.nowTime = new Date().toLocaleDateString();

    },
    btnNavClick(routeName){
      //导航栏路由跳转
      //alert(routeName)
     Bus.$emit('msg2', routeName)
    }
  }
}
</script>

<style scoped>

</style>
