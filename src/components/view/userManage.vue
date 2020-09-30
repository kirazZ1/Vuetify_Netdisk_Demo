<template>
<!--  <div>-->
<!--    <p>用户管理</p>-->
<!--  </div>-->
  <div>
    <div class="ma-1 pa-1"></div>
      <v-container>
        <v-card elevation="0">
          <v-row>
            <v-col md="6">
              <v-row>
                <div class="ma-1 pa-1"></div>
                <div class="ma-1 pa-1"></div>
                <div class="ma-1 pa-1" >
<!--                  <v-btn   color="primary">-->
<!--                    <v-icon dark left>{{ button1.icon }}</v-icon>导入-->
<!--                  </v-btn>-->
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                      >
                        <v-icon dark left>{{ button1.icon }}</v-icon>导入
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                          v-for="(item, index) in importItem"
                          :key="index"
                          @click="importButton(item)"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <div class="ma-1 pa-1" >
                  <v-btn  @click="Delete()" color="primary">
                    <v-icon dark  left>{{ button2.icon }}</v-icon>
                    删除
                  </v-btn>
                </div>
                <div class="ma-1 pa-1" >
                  <v-btn  :disabled="forbiddenButton" color="primary">
                    <v-icon dark left>{{ button3.icon }}</v-icon>
                    禁用
                  </v-btn>
                </div>
                <div class="ma-1 pa-1" >
                  <v-btn :disabled="releaseForbiddenButton"  color="primary">
                    <v-icon dark left>{{ button4.icon }}</v-icon>
                    解除禁用
                  </v-btn>
                </div>
                <div class="ma-1 pa-1" >
                  <v-btn  :disabled="forbiddenButton" v-show="backButton" color="primary" @click="Back()">
                    <v-icon dark left>{{ button5.icon }}</v-icon>
                    返回
                  </v-btn>
                </div>
              </v-row>
            </v-col>
            <v-col
                md="2"
                offset-md="1"
            >
              <div class="ma-1 pa-1" >
                <v-select
                    v-model="searchBy"
                    :items="SearchBasis"
                    label="查询依据"
                    outlined
                    dense
                ></v-select>
              </div>

            </v-col>
          <v-col  md="3">
            <v-text-field
                v-model="preSearch"
                color="primary"
                hide-details
                style="max-width: 200px;"
                @keyup.enter="SearchUser"
            >
              <template
                  v-if="$vuetify.breakpoint.mdAndUp"
                  v-slot:append-outer
              >
                <v-btn
                    class="mt-n2"
                    elevation="1"
                    color="primary"
                    fab
                    small
                    @click="SearchUser"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          </v-row>
        </v-card>
        <div class="ma-1 pa-1"></div>
<!--        查看用户详细信息-->
        <v-dialog
            v-model="userInfoDialog"
            persistent max-width="600px"
        >
          <v-card>

            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>详细用户信息</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-list three-line subheader>


                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>工号</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.workID}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
<!--                      workID-->
                      <v-list-item-title>姓名</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.name}}</v-list-item-subtitle>
                    </v-list-item-content>

                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>性别</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.sex}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>手机号</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.phone}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>电子邮箱</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.email}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>用户创建时间</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.createTime}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>用户状态</v-list-item-title>
                      <v-list-item-subtitle>{{userInfo.status===1?'可用':'禁用'}}</v-list-item-subtitle>
                    </v-list-item-content>

                  </v-list-item>
                </v-list>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="userInfoDialog = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!--        修改用户信息-->
        <v-dialog
            v-model="updateUserDialog"
            persistent max-width="600px"
        >
          <v-card>

            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>修改用户信息</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-container>

                <v-row>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        outlined
                        dense
                        v-model="userUpdateInfo.workID"
                        label="工号"
                        :rules="workIDRules"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        outlined
                        dense
                        v-model="userUpdateInfo.name"
                        label="姓名"
                        :rules="nameRules"
                        required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-select
                        dense
                        v-model="userUpdateInfo.sex"
                        :items="sexItems"
                        label="性别"
                        solo
                    ></v-select>
                  </v-col>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        dense
                        outlined
                        v-model="userUpdateInfo.phone"
                        :counter="11"
                        label="手机号"
                        :rules="phoneRules"
                        required
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-text-field
                    dense
                    outlined
                    v-model="userUpdateInfo.email"
                    :rules="emailRules"
                    label="电子邮箱"
                    required
                ></v-text-field>

              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="updateUserDialog = false">关闭</v-btn>
              <v-btn color="blue darken-1" @click="Update()" text>修改</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!--        单条导入(导入单挑数据)-->
        <v-dialog
            v-model="addOneUserDialog"
            persistent max-width="600px"
        >
          <v-card>

            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>单次导入用户</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        outlined
                        dense
                        v-model="userAddInfo.workID"
                        label="工号"
                        :rules="workIDRules"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        outlined
                        dense
                        v-model="userAddInfo.name"
                        label="姓名"
                        :rules="nameRules"
                        required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-select
                        dense
                        v-model="userAddInfo.sex"
                        :items="sexItems"
                        :rules="sexRules"
                        label="性别"
                        solo
                    ></v-select>
                  </v-col>
                  <v-col
                      cols="12"
                      md="6"
                  >
                    <v-text-field
                        dense
                        outlined
                        v-model="userAddInfo.phone"
                        :counter="11"
                        label="手机号"
                        :rules="phoneRules"
                        required
                    ></v-text-field>
                  </v-col>

                </v-row>
                <v-text-field
                    dense
                    outlined
                    v-model="userAddInfo.email"
                    :rules="emailRules"
                    label="电子邮箱"
                    required
                ></v-text-field>

              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="addOneUserDialog = false">关闭</v-btn>
              <v-btn color="blue darken-1" @click="importOne()" text>导入</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card>
          <v-data-table
              dense
              :loading="loading"
              :headers="headers"
              :items="Info"
              item-key="workID"
              :single-select="singleSelect"
              class="elevation-1"
              v-model="selected"
              show-select
          >

            <template v-slot:item.action="{item}">

              <v-menu  transition="scale-transition" :offset-x="menuOffset">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="primary"
                      dark
                      small
                      text
                      v-bind="attrs"
                      v-on="on"
                      @click="userListActionButton(item)"
                  >
                    操作
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="userListAction(item)"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

            </template>

          </v-data-table>
        </v-card>
      </v-container>
    </div>
</template>
<script>
import {
  mdiPlus,
  mdiTrashCanOutline,
  mdiCancel,
  mdiAccountReactivate,
  mdiArrowLeft
} from '@mdi/js'


export default {
  name: "userManage",
  data(){
    return{
      button1:{
        icon:mdiPlus
      },
      button2:{
        icon:mdiTrashCanOutline
      },
      button3:{
        icon:mdiCancel
      },
      button4:{
        icon:mdiAccountReactivate
      },
      button5:{
        icon:mdiArrowLeft
      },
      forbiddenButton:false,
      releaseForbiddenButton:false,
      menuOffset:true,
      backButton:false,
      searchBy:'',
      preSearch:'',
      SearchBasis:[//查询依据
        '按用户名查询', '按工号查询', '按电话查询'
      ],
      headers: [//表格标题
        {
          text: '工号',
          align: 'start',
          sortable: false,
          value: 'workID',
        },
        { text: '姓名', value: 'name' },
        { text: '性别', value: 'sex' },
        { text: '手机号', value: 'phone' },
        { text: '邮箱', value: 'email' },
        { text: '创建时间', value: 'createTime' },
        { text: '', value: 'action' },
      ],
      Info:[
        {
          workID:'',
          name:'',
          sex:'',
          phone:'',
          email:'',
          createTime:'',
          status:0

        }
      ],
      importItem:[
        { title: '单次导入' },
        { title: '批量导入' },
      ],
      items: [
        { title: '详细信息' },
        { title: '修改信息' },

      ],
      singleSelect:true,//是否开启单选
      selected: [],//存放单选选中元素
      loading:false,//表格加载时进度条
      tempInfo:null,//暂存首页列表的数据
      userInfo:{//点击操作按钮后获取对应条目个人信息
        userID:'',
        workID:'',
        name:'',
        sex:'',
        phone:'',
        email:'',
        createTime:'',
        status:0
      },
      userUpdateInfo:{
        userID:'',
        workID:'',
        name:'',
        sex:'',
        phone:'',
        email:'',

      },
      userAddInfo:{
        userID:'',
        workID:'',
        name:'',
        sex:'',
        phone:'',
        email:'',
      },

      userInfoDialog:false,//用户详情对话框
      updateUserDialog:false,//修改用户对话框
      addOneUserDialog:false,
      sexItems: ['男', '女'],
      //检验规则（组件实时提示）
      workIDRules: [
        v => !!v || '工号不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
      ],
      nameRules: [
        v => !!v || '姓名不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
      ],
      phoneRules: [
        v => !!v || '手机号不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
        v => (v && v.length <= 11) || '手机号长度不对',
        v => (v && /^1[34578]\d{9}$/.test(this.userUpdateInfo.phone))|| '手机号格式不对',
      ],
      emailRules: [
        v => !!v || '电子邮箱不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
          //^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$
        v => (v && /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.userUpdateInfo.email))|| '邮箱格式不对',
      ],
      sexRules:[
        v => !!v || '性别不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
      ]
    }

  },
  beforeMount() {
    let me = this;
    me.loading=true;
    //this.files = this.dataSolver(this.item);
    let a = sessionStorage.getItem('token');
    let resultArray=[];
    let b =  a.substring(1,a.length-1);
    this.axios.post('/cloud/user/manage/all',{
      token:b
    }).then(function (response) {
      console.log(response.data.data);
      // userEmail: "5811111123@qq.com"
      // userGarbage: "ddd79393e4294e4f945677bc5c1af433"
      // userId: "04dbcd031e304561abfbd7fa46a986fb"
      // userMobie: "15767195555"
      // userName: "zhangsan1"
      // userPassword: "1111111"
      // userPermission: 3
      // userRootId: "a6332e748b2749a5bfd2e2dcd87b1987"
      // userSex: "M"
      // userSize: 20
      // userStatus: 1
      // userTime: "2020-09-25T03:15:22.000+0000"
      // userUsed: 0
      // userWorkId: 202000000001
      // {
      //   workID:'10010',
      //       name:'张三',
      //     sex:'男',
      //     phone:'123456789',
      //     email:'1223131231@qq.com',
      //     createTime:'2020-01-01',
      //     status:0
      // },
      if(response.data.data.length!==0){
        for(let i=0;i<response.data.data.length;i++){
          let obj={
                userID:'',
                workID:'',
                name:'',
                sex:'',
                phone:'',
                email:'',
                createTime:'',
                status:0
          };
          obj.userID=response.data.data[i].userId;
          obj.workID=response.data.data[i].userWorkId;
          obj.name=response.data.data[i].userName;
          if(response.data.data[i].userSex==="M"){
            obj.sex="男";
          }else{
            obj.sex="女";
          }
          obj.phone=response.data.data[i].userMobie;
          obj.email=response.data.data[i].userEmail;
          //obj.createTime=response.data.data[i].userTime;

          //以下进行时间格式转换
          let d = new Date(response.data.data[i].userTime);
          // var a= d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();              /*d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1*/
          obj.createTime= d.getFullYear() + '-' + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + '-' + (d.getDate()<10 ? "0" +d.getDate():d.getDate());
          //转换完毕
          obj.status=response.data.data[i].userStatus;
          resultArray.push(obj);
        }
      }
      me.Info=resultArray;
      me.tempInfo=resultArray;
      me.loading=false;
      // console.log(response.data.data);
    }).catch(function (error) {
      console.log(error);
    });
  },
  watch:{
    selected:{//深度监听，可监听到对象、数组的变化
        handler(){
          console.log(this.selected);
          if(this.selected.length===0){
            this.forbiddenButton=false;
            this.releaseForbiddenButton=false;
          }else{
            if(this.selected[0].status===1){
              this.forbiddenButton=false;
              this.releaseForbiddenButton=true;
            }else{
              this.forbiddenButton=true;
              this.releaseForbiddenButton=false;
            }
          }

        },
        deep:true //true 深度监听
      }
  },
  methods:{
    SearchUser(){
      // console.log(this.preSearch);
      let resultView=[];
      if(this.searchBy===''){
        alert("请选择查询依据！");
      }else{
        if(this.preSearch===''){
          this.Info=this.tempInfo;
          this.backButton=false;
        }else{
          let reg=new RegExp(".*"+this.preSearch+".*","g");
          if(this.searchBy==='按用户名查询'){
            for(let i=0;i<this.tempInfo.length;i++){
              if(reg.test(this.tempInfo[i].name)){
                let obj={
                  workID:this.tempInfo[i].workID,
                  name:this.tempInfo[i].name,
                  sex:this.tempInfo[i].sex,
                  phone:this.tempInfo[i].phone,
                  email:this.tempInfo[i].email,
                  createTime:this.tempInfo[i].createTime,
                  status:this.tempInfo[i].status,
                };
                resultView.push(obj);
              }
            }
            this.backButton=true;
          }else if(this.searchBy==='按工号查询'){
            for(let i=0;i<this.tempInfo.length;i++){
              if(reg.test(this.tempInfo[i].workID)){
                let obj={
                  workID:this.tempInfo[i].workID,
                  name:this.tempInfo[i].name,
                  sex:this.tempInfo[i].sex,
                  phone:this.tempInfo[i].phone,
                  email:this.tempInfo[i].email,
                  createTime:this.tempInfo[i].createTime,
                  status:this.tempInfo[i].status,
                };
                resultView.push(obj);
              }
            }
            this.backButton=true;
          }else if(this.searchBy==='按电话查询'){
            for(let i=0;i<this.tempInfo.length;i++){
              if(reg.test(this.tempInfo[i].phone)){
                let obj={
                  workID:this.tempInfo[i].workID,
                  name:this.tempInfo[i].name,
                  sex:this.tempInfo[i].sex,
                  phone:this.tempInfo[i].phone,
                  email:this.tempInfo[i].email,
                  createTime:this.tempInfo[i].createTime,
                  status:this.tempInfo[i].status,
                };
                resultView.push(obj);
              }
            }
            this.backButton=true;
          }
          this.Info=resultView;
          this.selected=[];
        }
      }
    },
    Back(){
      this.Info=this.tempInfo;
      this.preSearch='';
      this.backButton=false;
    },
    userListAction(item){
      if(item.title==='详细信息'){
        //alert('详细信息');
        this.userInfoDialog=true;
      }else{
        //alert('修改信息');
        this.updateUserDialog=true;
      }

    },
    userListActionButton(item){

      this.userInfo=item;
      this.userUpdateInfo.userID=item.userID;
      this.userUpdateInfo.name=item.name;
      this.userUpdateInfo.phone=item.phone;
      this.userUpdateInfo.workID=item.workID;
      this.userUpdateInfo.email=item.email;
      this.userUpdateInfo.sex=item.sex;

      console.log(this.userInfo);
    },
    Update(){
      alert('修改信息');
    },
    importButton(item){
      if(item.title==='单次导入'){
        this.addOneUserDialog=true;
        //alert('单次导入');
      }else{
        alert('批量导入');
      }
    },
    importOne(){
      alert('单次导入');
    },
    Delete(){
      alert('删除');
    }
  }
}
</script>
