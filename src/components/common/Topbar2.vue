<template>
<!--  进入主界面后的顶栏-->
  <v-app-bar
      app
      color="light-blue darken-4"
      dark

  >
    <div class="d-flex align-center">
      <v-app-bar-nav-icon  @click="bus()"></v-app-bar-nav-icon>
      <!--logo和产品名字-->
      <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="../../assets/logo2.png"
          transition="scale-transition"
          width="200"
      />


    </div>

    <v-spacer></v-spacer>

<!--    点击个人信息弹出一个对话框-->
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on: dialog, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn icon
                 v-bind="attrs"
                 v-on="{ ...tooltip, ...dialog }">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <span>个人信息</span>
      </v-tooltip>
      </template>

      <v-card>
        <v-toolbar dark color="light-blue darken-4">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>个人信息</v-toolbar-title>
          <v-spacer></v-spacer>


          <v-dialog v-model="dialog2" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
          <v-toolbar-items>
            <v-btn dark text
                   v-bind="attrs"
                   v-on="on"
                   @click="dialog2 = true">编辑</v-btn>
          </v-toolbar-items>
            </template>
            <v-card>

              <v-toolbar
                  color="light-blue darken-4"
                  dark
                  flat
              >
                <v-toolbar-title>编辑用户信息</v-toolbar-title>

                <v-spacer></v-spacer>
                <v-tooltip bottom>

                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field label="手机号*" v-model="userModify.userPhone" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field label="邮箱*"  v-model="userModify.userEmail" required></v-text-field>
                    </v-col>


                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog2()">关闭</v-btn>
                <v-btn color="blue darken-1" text @click="dialog2 = false">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


        </v-toolbar>
<!--        显示个人信息的列表-->
        <v-list three-line subheader>
          <v-subheader>个人信息</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>姓名:</v-list-item-title>
              <v-list-item-subtitle>{{user.userName}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>性别:</v-list-item-title>
              <v-list-item-subtitle>{{user.userSex}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>手机号:</v-list-item-title>
              <v-list-item-subtitle>{{ user.userPhone }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>邮箱地址:</v-list-item-title>
              <v-list-item-subtitle>{{ user.userEmail }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>个人空间总量:</v-list-item-title>
              <v-list-item-subtitle>{{ user.userTotalZone }}G</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>个人空间用量</v-list-item-title>
              <v-list-item-subtitle>{{ user.userUsedZone }}G</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>用户创建时间:</v-list-item-title>
              <v-list-item-subtitle>{{ user.userCreateTime }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-card>

    </v-dialog>



    <v-tooltip bottom>
      <template v-slot:activator="{ on,attrs }">
        <v-btn icon
               v-bind="attrs"
               v-on="on">
          <v-icon @click="exit()">{{button.icon}}</v-icon>
        </v-btn>
      </template>
      <span>退出登录</span>
    </v-tooltip>

  </v-app-bar>
</template>


<script>
//mdiExitRun
import Bus from './bus.js'
import {mdiExitRun } from "@mdi/js";
export default {
  name: "Topbar",
  inject:['reload'],//注入父页面（App.vue）的reload方法
  beforeMount(){
    //在这里像后端发起请求拿用户信息
    //需要做的事情：
    //1.获取用户信息(使用axios发送POST请求)
    // "data": {     reponse.data.data
    //   "userRootId": "11111111",
    //       "userSex": "M",
    //       "userPassword": null,
    //       "userStatus": 1,
    //       "userPermission": 3,
    //       "userTime": "2020-09-25T08:20:49.000+0000",
    //       "userWorkId": 2,
    //       "userName": "aaa",
    //       "userId": "2",
    //       "userMobie": "453453",
    //       "userSize": 100000.000000,
    //       "userGarbage": "11111",
    //       "userUsed": 0.000000,
    //       "userEmail": "45345"
    // }
    let me =this;
    let a = sessionStorage.getItem('token');
    let b =  a.substring(1,a.length-1);

    console.log(b);
    this.axios.post('/cloud/user/userInfo',{
      token:b
    }).then(function (response) {
      console.log(response);
      me.user.userName=response.data.data.userName;       //用户姓名
      //console.log(me.user.userName);
      if(response.data.data.userSex==="M"){              //用户性别
        me.user.userSex="男";
      }else{
        me.user.userSex="女";
      }
      me.user.userPhone=response.data.data.userMobie;     //用户手机号
      me.user.userEmail=response.data.data.userEmail;       //用户邮箱
      let userCreateTimeString=response.data.data.userTime;     //拿到时间字符串
      //以下进行时间格式转换
      me.user.userCreateTime=me.timefilters(userCreateTimeString);
      // let d = new Date(userCreateTimeString);
      // // var a= d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();              /*d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1*/
      // me.user.userCreateTime= d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + '-' + (d.getDate()<10 ? "0" +d.getDate():d.getDate())+ ' ' + (d.getHours()<10 ?"0"+d.getDate():d.getDate()) + ':' + (d.getMinutes()<10 ? "0" + d.getMinutes(): d.getMinutes()) + ':' + (d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds() );
      //转换完毕
      me.user.userTotalZone = response.data.data.userSize;
      me.user.userUsedZone =  response.data.data.userUsed;
      //2.组件通信，把存储总量用量和用户姓名发给Sidebar
     // console.log(this.user.userName);
      Bus.$emit('userName',response.data.data.userName);
      Bus.$emit('userTotalZone',response.data.data.userSize);
      Bus.$emit('userUsedZone', response.data.data.userUsed);
      Bus.$emit('userPermission', response.data.data.userPermission);
      //设置编辑个人信息中文本域的默认值
      me.userModify.userPhone=me.user.userPhone;
      me.userModify.userEmail=me.user.userEmail;
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });

    //3.编辑的对话框内数据初始化
    this.userModify.userPhone=this.user.userPhone;
    this.userModify.userEmail=this.user.userEmail;
  },
  methods: {
    //控制侧边栏开关（信息发出部分）
    bus () {
      Bus.$emit('msg1', '开门或者关门')
    },
    //退出登录按钮

    timefilters(val) {
      if (val == null || val == "") {
        return "暂无时间";
      } else {
        let d = new Date(val);   //val 为表格内取到的后台时间
        console.log(d);
        let month =
            d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
        let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        // let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        // let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        // let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        let times=d.getFullYear() + '-' + month + '-' + day ;
        return times;
      }

    },


    exit(){
      var me=this;

      let a = sessionStorage.getItem('token');
      let b =a.substring(1,a.length-1);
      //这里还需要向后台发送请求，让后台把redis中把token移除
      this.axios.post('/cloud/user/logout', {
        token:b
      }).then(function (response) {
        console.log(response.data);
        if(response.data.msg==='退出成功'){
          window.sessionStorage.removeItem('token');
          //重新加载页面（实际上是对全局进行路由跳转）
          me.reload();
        }else{
          console.log(response);
        }

      }).catch(function (error) {
        console.log(error);
      });

    },
    closeDialog2(){
      // alert("111");

      this.dialog2 = false;
      this.userModify.userPhone=this.user.userPhone;
      this.userModify.userEmail=this.user.userEmail;
    }

  },
  data(){
    return{
      //退出按钮图标
      button:{icon:mdiExitRun },
      //个人信息对话框开闭状态
      dialog: false,
      //编辑个人信息对话框开闭状态
      dialog2:false,
      //用户信息

      user:{
        //用户姓名
        userName:'张三',
        //用户性别
        userSex:'男',
        //用户手机号码
        userPhone:'15811111123',
        //用户邮箱地址
        userEmail:'5811111123@qq.com',
        //用户拥有空间总量
        userTotalZone:100,
        //用户拥有空间用量
        userUsedZone:20,
        //用户创建时间
        userCreateTime:'2020-01-01'
      },
      userModify:{
        userPhone:'',
        userEmail:''
      }

    }
  }

}
</script>

<style scoped>

</style>
