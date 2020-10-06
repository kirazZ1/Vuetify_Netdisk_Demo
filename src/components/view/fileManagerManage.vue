<template>
  <div>
<!--    <p>文件管理员管理</p>-->
    <v-container>
      <v-card elevation="1">
        <v-row>
          <v-col md="6">
            <v-row>
              <div class="ma-1 pa-1"></div>
              <div class="ma-1 pa-1"></div>
            <div class="ma-1 pa-1">
              <v-btn color="primary" @click="add()">
                <v-icon dark left>mdi-plus</v-icon>
                新增文档管理员
              </v-btn>

            </div>
              <div class="ma-1 pa-1">
                <v-btn color="primary" @click="removeManager()">
                  <v-icon dark left>mdi-delete</v-icon>
                  移除文档管理员
                </v-btn>

              </div>
            </v-row>
          </v-col>

        </v-row>
      </v-card>



      <v-dialog
          v-model="addDialog"
          persistent max-width="600px"
      >
        <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>新增管理员</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-progress-linear
              :active="addProgress"

              indeterminate
              absolute
              bottom
              color="deep-purple accent-4"
          ></v-progress-linear>
          <v-card-text>
            <v-container>
              <v-select
                  v-model="addValue"
                  item-text="userName"
                  item-value="workID"
                  :items="addWho"
                  return-object
                  label="新的群组成员"
                  chips
                  hint="请选择要设定为新的群组成员的用户"
              ></v-select>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" :disabled="addButton" text @click="addFileManager()">新增</v-btn>
            <v-btn color="blue darken-1" :disabled="closeAddDialog" text @click="addDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="removeDialog"
          persistent max-width="600px"
      >
        <v-card>

        </v-card>
      </v-dialog>


      <div class="ma-1 pa-1"></div>
      <v-card>
        <v-data-table
            :loading="loading"
            :headers="headers"
            :items="Info"
            item-key="workID"
            no-data-text="暂时没有用户条目"
            loading-text="Loading... Please wait"
            :single-select="singleSelect"
            class="elevation-1"
            v-model="selected"
            show-select
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "fileManagerManage",
  beforeMount() {
    let me = this;
    this.loading=true;
    let a = sessionStorage.getItem('token');
    let b =  a.substring(1,a.length-1);
    this.axios.post('/cloud/user/manage/sup/allManages',{
      token:b
    }).then(function (response){
      console.log(response.data.data.data);
      if(response.data.status===200){
        for(let i=0;i<response.data.data.data.length;i++){
          let obj={
            userID:'',
            workID:'',
            name:'',
            sex:'',
            phone:'',
            email:'',
            createTime:''
          };
          obj.userID=response.data.data.data[i].userId;
          obj.workID=response.data.data.data[i].userWorkId;
          obj.name=response.data.data.data[i].userName;
          if(response.data.data.data[i].userSex==="M"){
            obj.sex="男";
          }else{
            obj.sex="女";
          }
          obj.phone=response.data.data.data[i].userMobie;
          obj.email=response.data.data.data[i].userEmail;
          obj.createTime=response.data.data.data[i].userTime;
          me.Info.push(obj);
        }
        me.loading=false;
      }
    }).catch(function (error){
      console.log(error);
    })
  },
  data(){
    return{
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
      ],
      selected:[],
      singleSelect:true,
      Info:[],
      loading:false,
      addDialog:false,
      removeDialog:false,
      addButton:false,
      closeAddDialog:false,
      addProgress:false,
      addValue:[],
      addWho: [
        {userID:'',workID:'',userName:''},
      ],
    }
  },

  methods:{
    add(){
      let me = this;
      me.addWho=[];
      let a = sessionStorage.getItem('token');
      //let resultArray=[];
      let b =  a.substring(1,a.length-1);
      this.axios.post('/cloud/user/manage/sup/simpleUser',{
          token:b
      }).then(function (response){
          console.log(response);
          if(response.data.status===200){
            if(response.data.data!==null){
              for(let i=0;i<response.data.data.length;i++){
                let obj={
                  userID:'',
                  workID:'',
                  userName:''
                };
                obj.workID=response.data.data[i].workID;
                obj.userID=response.data.data[i].userID;
                obj.userName=response.data.data[i].workID+"    "+response.data.data[i].userName;
                me.addWho.push(obj);
              }
            }
          }
        }).catch(function (error){
          console.log(error);
        })
      this.addDialog=true;
    },
    addFileManager(){
      let me = this;
      let a = sessionStorage.getItem('token');
      let b =  a.substring(1,a.length-1);
      console.log(this.addValue);//this.addValue.length===0
      if(this.addValue.length===0){
        alert('请选择用户');
      }else if(this.addValue.userID===""){
        alert('请选择用户');
      }else{
          this.addButton=true;
          this.closeAddDialog=true;
          this.addProgress=true;
          this.axios.post('/cloud/user/manage/sup/addManage',{
            token:b,
            userId:this.addValue.userID
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert('新增成功!');
              me.loading=true;
              me.addButton=false;
              me.closeAddDialog=false;
              me.addDialog=false;

              me.addProgress=false;
              me.Info=[];
              me.axios.post('/cloud/user/manage/sup/allManages',{
                token:b
              }).then(function (response){
                console.log(response.data.data.data);
                if(response.data.status===200){
                  for(let i=0;i<response.data.data.data.length;i++){
                    let obj={
                      userID:'',
                      workID:'',
                      name:'',
                      sex:'',
                      phone:'',
                      email:'',
                      createTime:''
                    };
                    obj.userID=response.data.data.data[i].userId;
                    obj.workID=response.data.data.data[i].userWorkId;
                    obj.name=response.data.data.data[i].userName;
                    if(response.data.data.data[i].userSex==="M"){
                      obj.sex="男";
                    }else{
                      obj.sex="女";
                    }
                    obj.phone=response.data.data.data[i].userMobie;
                    obj.email=response.data.data.data[i].userEmail;
                    obj.createTime=response.data.data.data[i].userTime;
                    me.Info.push(obj);
                  }
                  me.loading=false;
                }
              }).catch(function (error){
                console.log(error);
              })
            }
          }).catch(function (error){
            console.log(error);
          });
      }
    },
//     "token":"d8833ece64cf437b907802e9ca84e8a9",
//     "userId":"23420feb1b9449f08030ea4823895bb2"
//   }
    removeManager(){
      //alert('111');
      //console.log(this.selected);
      // createTime: "2020-09-25 06:43:27"
      // email: "5891111123@qq.com"
      // name: "王五"
      // phone: "15811111121"
      // sex: "男"
      // userID: "23420feb1b9449f08030ea4823895bb2"
      // workID: 202000000003
      let me = this;
      let a = sessionStorage.getItem('token');
      let b =  a.substring(1,a.length-1);
      this.axios.post('/cloud/user/manage/sup/delManage',{
      // {
      //   "token":"d8833ece64cf437b907802e9ca84e8a9",
      //     "userId":"23420feb1b9449f08030ea4823895bb2"
      // }
        token:b,
        userId:this.selected[0].userID
      }).then(function (response){
        console.log(response);
        if(response.data.status===200){
          alert('移除文档管理员成功!');
          //alert('新增成功!');
          me.loading=true;
          me.Info=[];
          me.axios.post('/cloud/user/manage/sup/allManages',{
            token:b
          }).then(function (response){
            console.log(response.data.data.data);
            if(response.data.status===200){
              for(let i=0;i<response.data.data.data.length;i++){
                let obj={
                  userID:'',
                  workID:'',
                  name:'',
                  sex:'',
                  phone:'',
                  email:'',
                  createTime:''
                };
                obj.userID=response.data.data.data[i].userId;
                obj.workID=response.data.data.data[i].userWorkId;
                obj.name=response.data.data.data[i].userName;
                if(response.data.data.data[i].userSex==="M"){
                  obj.sex="男";
                }else{
                  obj.sex="女";
                }
                obj.phone=response.data.data.data[i].userMobie;
                obj.email=response.data.data.data[i].userEmail;
                obj.createTime=response.data.data.data[i].userTime;
                me.Info.push(obj);
              }
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
  }
}
</script>
