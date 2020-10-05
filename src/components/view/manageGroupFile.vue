<template>
  <div>
    <div class="ma-1 pa-1" ></div>
    <div class="ma-1 pa-1" ></div>
    <v-container>
      <v-card elevation="0">

        <v-row>
          <div class="ma-1 pa-1" ></div>
          <div class="ma-1 pa-1" ></div>
          <div class="ma-1 pa-1" >
            <v-btn  color="primary" @click="newGroupDialog=true">
              <v-icon dark left>{{ button1.icon }}</v-icon>
              创建部门文件夹
            </v-btn>
          </div>
          <div class="ma-1 pa-1" >
            <v-btn  color="primary" @click="authoritySetting()">
              <v-icon dark left>{{ button2.icon }}</v-icon>
              设置权限
            </v-btn>
          </div>
          <div class="ma-1 pa-1" >
            <v-btn  color="primary" @click="viewGroup()">
              <v-icon dark left>{{ button3.icon }}</v-icon>
              查看部门成员
            </v-btn>
          </div>

        </v-row>
      </v-card>
      <!--新增部门文件夹对话框-->
      <v-dialog
          v-model="newGroupDialog"
          persistent max-width="600px"
      >
        <v-card>

          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>创建部门文件夹</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-progress-linear
              :active="createGroupProgress"
              indeterminate
              absolute
              bottom
              color="deep-purple accent-4"
          ></v-progress-linear>
          <v-card-text>
            <v-container>
              <v-text-field
                  v-model="newGroupName"
                  :counter="10"
                  label="新部门文件夹名"
                  required
              ></v-text-field>


            </v-container>
            <small>*请输入新的部门文件夹名点击提交</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" :disabled="closeNewGroupDialog" text @click="newGroupDialog = false">关闭</v-btn>
            <v-btn  color="blue darken-1" :disabled="createButton" @click="createGroup()"  text>创建</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--权限管理对话框-->
      <v-dialog
          v-model="authorityDialog"
          persistent max-width="800px"
      >
          <v-card>
            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>权限管理</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-progress-linear
                :active="authoritySettingProgress"
                indeterminate
                absolute
                bottom
                color="deep-purple accent-4"
            ></v-progress-linear>
            <v-container>
              <v-row>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox
                      v-model="upload"
                      label="上传"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                  <v-checkbox
                      v-model="download"
                      label="下载"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox
                      v-model="deleteFiles"
                      label="删除"
                      color="indigo"
                      value="1"
                      hide-details
                  ></v-checkbox>
                  <v-checkbox
                      v-model="newFolder"
                      label="创建文件夹"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox
                      v-model="shareFile"
                      label="分享"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                  <v-checkbox
                      v-model="copy"
                      label="复制"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-checkbox
                      v-model="move"
                      label="移动"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                  <v-checkbox
                      v-model="rename"
                      label="重命名"
                      color="indigo darken-3"
                      value="1"
                      hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" :disabled="closeAuthorityDialog" text @click="authorityDialog = false">关闭</v-btn>
              <v-btn  color="blue darken-1" :disabled="settingAuthority"  @click="authoritySettingSubmit()"  text>创建</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
      <!--查看群组成员-->
      <v-dialog
          v-model="viewGroupDialog"
          persistent max-width="800px"
      >
        <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>查看部门成员</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-container>



            <v-list subheader dense v-if="items.length!==0">
              <v-subheader v-if="selected.length!==0">{{selected[0].name}}</v-subheader>

              <v-list-item
                  v-for="item in items"
                  :key="item.id"
              >
                <v-checkbox v-model="selectGroupUser" :value="item.id"></v-checkbox>
                <v-list-item-avatar>

<!--                  <v-img :src="item.avatar"></v-img>-->
                  <v-icon>mdi-account</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>


              </v-list-item>
            </v-list>
            <v-list v-else>
              <v-list-item>

                <v-list-item-content>
                  <v-list-item-title >群组内暂无用户</v-list-item-title>
                </v-list-item-content>


              </v-list-item>
            </v-list>
            <v-row>
              <v-col md="3">
                <div class="ma-1 pa-1" >
                  <v-btn  color="primary" @click="addGroupUserDialog=true">
                    <v-icon dark left >mdi-plus</v-icon>
                    增加部门成员
                  </v-btn>
                </div>
              </v-col>
              <v-col>
                <div class="ma-1 pa-1" >
                  <v-btn  color="primary" @click="deleteGroupUser()">
                    <v-icon dark left>mdi-delete</v-icon>
                    删除部门成员
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  text @click="viewGroupDialog = false">关闭</v-btn>

          </v-card-actions>
        </v-card>

      </v-dialog>

      <v-dialog
          v-model="addGroupUserDialog"
          persistent max-width="600px"
      >
        <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>增加部门成员</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>
            </v-tooltip>
          </v-toolbar>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" :disabled="closeAuthorityDialog" text @click="addGroupUserDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="ma-1 pa-1" ></div>
      <v-card>
        <v-card elevation="5">
          <v-data-table
              :loading="loading"
              v-model="selected"
              :headers="headers"
              :items="groupList"
              :single-select="singleSelect"
              no-data-text="群组列表为空"

              item-key="id"
              show-select
              class="elevation-1"
          >
          </v-data-table>
        </v-card>
      </v-card>

    </v-container>
  </div>
</template>
<script>
import {
  mdiAccountMultiplePlus,
  mdiPencilRuler,
  mdiAccountMultipleCheck
} from '@mdi/js'    //导入图标
//import Clipboard from 'clipboard';
export default {
  name: "managerGroupFile",
  beforeMount() {
    this.loading=true;
    let a = sessionStorage.getItem('token');
    let resultArray=[];
    let me = this;
    let b =  a.substring(1,a.length-1);
    this.axios.post('/cloud/user/manage/allDepart',{
      token:b
    }).then(function (response){
      console.log(response);
      // "data": [
      //   {
      //     "departId": "e311ec6f2d8e45d0a078b5e5ed529671",
      //     "departName": "宣传部",
      //     "departRoot": "519367101a874750b437102c3684d44b",
      //     "departTime": "2020-10-05T02:55:25.000+0000",
      //     "departPermission": "00000000"
      //   }
      // ]
      //console.log(response.data.data);
      if(response.data.status===200){
        for(let i=0;i<response.data.data.length;i++){
          let obj={
                id:'',
                name:'',
                createTime:'',
                permission:''
              };
          obj.id=response.data.data[i].departId;
          obj.name=response.data.data[i].departName;
          obj.createTime=response.data.data[i].departTime;
          obj.permission=response.data.data[i].departPermission;
          console.log(obj);
          resultArray.push(obj);
        }
        me.groupList=resultArray;
        //console.log(resultArray);
        me.loading=false;
      }
    }).catch(function (error){
      console.log(error);
    })
  },
  data(){
    return{
      button1:{icon:mdiAccountMultiplePlus},
      button2:{icon:mdiPencilRuler},
      button3:{icon:mdiAccountMultipleCheck},
      loading:false,//表格进度条
      selected:[],    //选择的项
      headers: [      //表格标题
        {
          text: '群组名称',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '创建时间', value: 'createTime' },
      ],
      groupList:[],
      singleSelect:true,
      newGroupDialog:false,
      addGroupUserDialog:false,
      createGroupProgress:false,
      newGroupName:'',
      closeNewGroupDialog:false,
      createButton:false,
      authorityDialog:false,
      authoritySettingProgress:false,
      closeAuthorityDialog:false,
      settingAuthority:false,
      upload:'0',
      download:'0',
      deleteFiles:'0',
      newFolder:'0',
      shareFile:'0',
      copy:'0',
      move:'0',
      rename:'0',
      viewGroupDialog:false,
      items: [],
      selectGroupUser:[]
    }
  },
  methods:{
    createGroup(){
      if(this.newGroupName===''){
        alert('请输入群组名！');
      }else{

        let a = sessionStorage.getItem('token');
        let resultArray=[];
        let me = this;
        this.createGroupProgress=true;
        let b =  a.substring(1,a.length-1);
        this.axios.post('/cloud/user/manage/addDepart',{
          token:b,
          departName:this.newGroupName
        }).then(function (response){
          //console.log(response);
          if(response.data.status===200){
            me.createGroupProgress=false;
            alert('创建成功！');
            me.newGroupDialog=false;
            me.loading=true;
            me.axios.post('/cloud/user/manage/allDepart',{
              token:b
            }).then(function (response){
              //console.log(response);
              // "data": [
              //   {
              //     "departId": "e311ec6f2d8e45d0a078b5e5ed529671",
              //     "departName": "宣传部",
              //     "departRoot": "519367101a874750b437102c3684d44b",
              //     "departTime": "2020-10-05T02:55:25.000+0000",
              //     "departPermission": "00000000"
              //   }
              // ]
              //console.log(response.data.data);
              if(response.data.status===200){
                for(let i=0;i<response.data.data.length;i++){
                  let obj={
                    id:'',
                    name:'',
                    createTime:'',
                    permission:''
                  };
                  obj.id=response.data.data[i].departId;
                  obj.name=response.data.data[i].departName;
                  obj.createTime=response.data.data[i].departTime;
                  obj.permission=response.data.data[i].departPermission;
                  console.log(obj);
                  resultArray.push(obj);
                }
                me.groupList=resultArray;
                //console.log(resultArray);
                me.loading=false;
              }
            }).catch(function (error){
              console.log(error);
            })
          }
        }).catch(function (error){
          console.log(error);
        })
      }
    },
    authoritySetting(){
      if(this.selected.length===0){
        alert('请勾选下面待操作的群组!');
      }else{
        //console.log(this.selected[0]);
        //this.selected[0].permission
        this.authorityDialog=true;
        let permissionArray= Array.prototype.slice.call(this.selected[0].permission);
        //console.log(permissionArray);
        if(permissionArray[0]==='1'){
          this.upload='1';
        }else{
          this.upload=null;
        }
        if(permissionArray[1]==='1'){
          this.download='1';
        }else{
          this.download=null;
        }
        if(permissionArray[2]==='1'){
          this.deleteFiles='1';
        }else{
          this.deleteFiles=null;
        }
        if(permissionArray[3]==='1'){
          this.newFolder='1';
        }else{
          this.newFolder=null;
        }
        if(permissionArray[4]==='1'){
          this.shareFile='1';
        }else{
          this.shareFile=null;
        }
        if(permissionArray[5]==='1'){
          this.copy='1';
        }else{
          this.copy=null;
        }
        if(permissionArray[6]==='1'){
          this.move='1';
        }else{
          this.move=null;
        }
        if(permissionArray[7]==='1'){
          this.rename='1';
        }else{
          this.rename=null;
        }
      }
    },
    authoritySettingSubmit(){
      if(this.upload===null){
        this.upload="0";
      }
      if(this.download===null){
        this.download="0";
      }
      if(this.deleteFiles===null){
        this.deleteFiles="0";
      }
      if(this.newFolder===null){
        this.newFolder="0";
      }
      if(this.shareFile===null){
        this.shareFile="0";
      }
      if(this.copy===null){
        this.copy="0";
      }
      if(this.move===null){
        this.move="0";
      }
      if(this.rename===null){
        this.rename="0";
      }
      this.authoritySettingProgress=true;
      this.settingAuthority=true;
      this.closeAuthorityDialog=true;
      let a = sessionStorage.getItem('token');
      //let resultArray=[];
      let me = this;
      let b =  a.substring(1,a.length-1);
      let permissionString="";
      permissionString=this.upload+this.download+this.deleteFiles+this.newFolder+this.shareFile+ this.copy+ this.move+this.rename;
      this.axios.post('/cloud/user/manage/setDepPerm',{
        token:b,
        departID:this.selected[0].id,
        departPermission:permissionString
      }).then(function (response){
        //console.log(response);
        if(response.data.status===200){
          alert('修改权限成功！');
          me.selected=[];
          me.authoritySettingProgress=false;
          me.authorityDialog=false;
          me.loading=true;
          let resultArray=[];
          me.axios.post('/cloud/user/manage/allDepart',{
            token:b
          }).then(function (response){
            //console.log(response);
            // "data": [
            //   {
            //     "departId": "e311ec6f2d8e45d0a078b5e5ed529671",
            //     "departName": "宣传部",
            //     "departRoot": "519367101a874750b437102c3684d44b",
            //     "departTime": "2020-10-05T02:55:25.000+0000",
            //     "departPermission": "00000000"
            //   }
            // ]
            //console.log(response.data.data);
            if(response.data.status===200){
              for(let i=0;i<response.data.data.length;i++){
                let obj={
                  id:'',
                  name:'',
                  createTime:'',
                  permission:''
                };
                obj.id=response.data.data[i].departId;
                obj.name=response.data.data[i].departName;
                obj.createTime=response.data.data[i].departTime;
                obj.permission=response.data.data[i].departPermission;
                //console.log(obj);
                resultArray.push(obj);
              }
              me.groupList=resultArray;
              //console.log(resultArray);
              me.loading=false;
              me.settingAuthority=false;
              me.closeAuthorityDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
        }
      }).catch(function (error){
        console.log(error);
      })

    },
    viewGroup(){
      if(this.selected.length===0){
        alert('请勾选下面待操作的群组!');
      }else{
        this.items=[];
        this.selectGroupUser=[];
        console.log(this.selected[0].name);
        let a = sessionStorage.getItem('token');
        let resultArray=[];
        let me = this;
        let b =  a.substring(1,a.length-1);
        this.axios.post('/cloud/user/manage/selUserAtDep',{
          token:b,
          departID:this.selected[0].id
        }).then(function (response){
          console.log(response);
          for(let i=0;i<response.data.data.length;i++){
            let obj={
              name:response.data.data[i].userWorkId+"   "+response.data.data[i].userName,
              id:response.data.data[i].userId
            };
            console.log(obj);
            resultArray.push(obj);
          }
          me.items=resultArray;
        })
        this.viewGroupDialog=true;
        // "userId": "072d68640ae2438b93994aad6be9dcd7",
        // "userWorkId": 202000000049,
        // "userName": "王浩",

      }

    },
    deleteGroupUser(){
      if(this.selectGroupUser.length===0){
          alert("请勾选待删除的用户！");
      }else{
        //alert("可以删除!");
        // {
        //   "token":"bc4e8cde0b7c4f7d97c7d6eec460e195",
        //     "departId":"8fab45bcdf7743e09088a50e8ba16185",
        //     "userIds":[
        //   "23420feb1b9449f08030ea4823895bb2","2d115381bdd04a9f80657e61f17ec060"
        // ]
        // }
        let a = sessionStorage.getItem('token');
        let b =  a.substring(1,a.length-1);
        let me = this;
        this.axios.post('/cloud/user/manage/delDepartUserByIds',{
          token:b,
          departId:this.selected[0].id,
          userIds:this.selectGroupUser
        }).then(function (response){
          //console.log(response);
          if(response.data.status===200){
            alert("删除成功！");
            me.axios.post('/cloud/user/manage/selUserAtDep',{
              token:b,
              departID:me.selected[0].id
            }).then(function (response){
              //console.log(response);
              let resultArray=[];
              for(let i=0;i<response.data.data.length;i++){
                let obj={
                  name:response.data.data[i].userWorkId+"   "+response.data.data[i].userName,
                  id:response.data.data[i].userId
                };
                console.log(obj);
                resultArray.push(obj);
              }
              me.items=resultArray;
            })
          }
        }).catch(function (error){
          console.log(error);
        })
      //console.log(this.selectGroupUser);
      }
    }
  }
}
</script>
