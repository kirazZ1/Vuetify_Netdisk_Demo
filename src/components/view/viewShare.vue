<template>
  <div>
    <v-container class="grey lighten-5">
      <!--我的分享-->
      <v-dialog
          v-model="toShareInfoDialog"
          max-width="600px"
      >
        <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>分享详情</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-list three-line subheader>


                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>文件名</v-list-item-title>
                    <v-list-item-subtitle>{{dialogInfo.directName===null?dialogInfo.fileName:dialogInfo.directName}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>分享时间</v-list-item-title>
                    <v-list-item-subtitle>{{dialogInfo.shareTime}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>

                    <v-list-item-title>分享类型</v-list-item-title>
                    <v-list-item-subtitle>{{dialogInfo.type}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>状态</v-list-item-title>
                    <v-list-item-subtitle>{{dialogInfo.status}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content v-if="dialogInfo.type!=='私密'">
                    <v-list-item-title>分享链接</v-list-item-title>
                    <v-textarea
                        id="copy"
                        v-model="this.dialogInfo.shareLink"
                        readonly
                    >

                    </v-textarea>
                  </v-list-item-content>
                </v-list-item>

              </v-list>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1"  class="btn" text @click="copyLink()" data-clipboard-target="#copy" v-show="dialogInfo.type!=='私密'?true:false"
            >复制分享链接</v-btn>
            <v-btn color="blue darken-1" text @click="cancelShareDialog()">取消分享</v-btn>
            <v-btn color="blue darken-1" text @click="toShareInfoDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--分享给我-->
      <v-dialog
          v-model="beShareInfoDialog"
          max-width="600px"
      >
        <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>分享详情</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-list three-line subheader>


                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>文件名</v-list-item-title>
                    <v-list-item-subtitle>{{beShareDialogInfo.directName===null?beShareDialogInfo.fileName:beShareDialogInfo.directName}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>分享时间</v-list-item-title>
                    <v-list-item-subtitle>{{beShareDialogInfo.shareTime}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>分享人</v-list-item-title>
                    <v-list-item-subtitle>{{beShareDialogInfo.shareUserName}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>


              </v-list>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="saveToDialog()" text>转存</v-btn>
            <v-btn color="blue darken-1" text @click="beShareInfoDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--确认取消分享-->
      <v-dialog v-model="confirmCancelDialog" persistent max-width="290">
        <v-card>
          <v-card-title  color="light-blue darken-4">
           取消分享
          </v-card-title>

          <v-card-text>
           确认取消分享吗？
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="cancelShare()"
            >
              确认
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="confirmCancelDialog = false"
            >
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="saveDialog"
          persistent max-width="600px"
      >
        <v-card>
          <!--            <v-card-title>-->
          <!--              <span class="headline">移动到</span>-->
          <!--            </v-card-title>-->
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>转存到</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-progress-linear
              :active="saveProgress"

              indeterminate
              absolute
              bottom
              color="deep-purple accent-4"
          ></v-progress-linear>
          <v-card-text>
            <v-container>
              <div class="ma-1 pa-1"></div>

              <!--                <v-treeview :items="viewFolder">-->
              <v-card elevation="10">
                <v-card-title>
                  <small>请选择目标文件夹：</small>
                </v-card-title>
                <v-treeview
                    activatable
                    :items="viewFolder"
                    :open="open"
                    item-disabled="locked"

                >

                  <template v-slot:prepend="{ item, open }">
                    <v-icon>
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                  </template>
                  <template v-slot:append="{ item }">
                    <v-btn text color="primary" @click="saveFile(item)" v-show="!item.locked" :disabled="chooseFolder">选择</v-btn>
                  </template>
                </v-treeview>
              </v-card>

              <!--                </v-treeview>-->
            </v-container>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="saveDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>



    <v-row justify="center">
      <v-expansion-panels popout inset>
        <v-expansion-panel>
          <v-expansion-panel-header>

            我分享的
          </v-expansion-panel-header>
          <v-expansion-panel-content v-if="this.toSharesListItems.length===0">
            <v-card>
              <v-card-title class="headline" >

                <!--                v-text="item.fileName===null?item.directName:item.fileName"-->
                <span>暂无分享信息</span>
              </v-card-title>




            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content v-else v-for="(item, i) in toSharesListItems"  :key="i">
            <v-card
                :color="item.fileName==null?'light-blue darken-4':'blue darken-1'"
                dark
            >
              <v-card-title class="headline" >
                <v-icon
                    large
                    left
                    v-if="item.fileName===null"
                >
                  mdi-folder
                </v-icon>
                <v-icon
                    large
                    left
                    v-else
                >
                  mdi-file
                </v-icon>
<!--                v-text="item.fileName===null?item.directName:item.fileName"-->
                <span  v-text="item.fileName===null?item.directName:item.fileName"></span>
              </v-card-title>

              <v-card-subtitle v-text="item.shareTime"></v-card-subtitle>

              <v-card-actions>
                <v-btn text x-large @click="shareInfo(item)">查看详情</v-btn>
              </v-card-actions>
            </v-card>


          </v-expansion-panel-content>



        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>分享给我的</v-expansion-panel-header>
          <v-expansion-panel-content v-if="this.beSharesListItems.length===0">
            <v-card>
              <v-card-title class="headline" >

                <!--                v-text="item.fileName===null?item.directName:item.fileName"-->
                <span>暂无分享信息</span>
              </v-card-title>




            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content v-else v-for="(item, i) in beSharesListItems"  :key="i">
            <v-card
                :color="item.fileName==null?'light-blue darken-4':'blue darken-1'"
                dark
            >
              <v-card-title class="headline" >
                <v-icon
                    large
                    left
                    v-if="item.fileName===null"
                >
                  mdi-folder
                </v-icon>
                <v-icon
                    large
                    left
                    v-else
                >
                  mdi-file
                </v-icon>
                <!--                v-text="item.fileName===null?item.directName:item.fileName"-->
                <span  v-text="item.fileName===null?item.directName:item.fileName"></span>
              </v-card-title>

              <v-card-subtitle v-text="item.shareTime"></v-card-subtitle>

              <v-card-actions>
                <v-btn text x-large @click="beShareInfo(item)">查看详情</v-btn>
              </v-card-actions>
            </v-card>


          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    </v-container>
  </div>
</template>
<script>
// import {
//   mdiShareVariant
// } from '@mdi/js'    //导入图标
//import Clipboard from 'clipboard';
import Clipboard from 'clipboard';
export default {
  name: "viewShare",
  mounted() {
    const clipboard = new Clipboard('.btn');
    clipboard.on('success', e => {
     console.log(e.text + ' 已复制到剪贴板！');
    });
  },
  beforeMount() {
    let me = this;
    // me.loading=true;
    //this.files = this.dataSolver(this.item);
    //this.files = this.dataSolver(this.item);
    let a = sessionStorage.getItem('token');
    //let resultArray=[];
    let b =  a.substring(1,a.length-1);
    this.groupListLoading=true;
    this.axios.post('/cloud/user/showShare',{
      token:b
    }).then(function (response) {
      console.log(response.data.data);
      me.toSharesListItems=response.data.data.toShares;
      me.beSharesListItems=response.data.data.beShares;
      //console.log( me.beSharesListItems);
     // console.log(me.toSharesListItems);
      // me.listItems=response.data.data;
      // me.groupListLoading=false;
    }).catch(function (error) {
      console.log(error);
    });
  },

  data(){
    return {
      toSharesListItems:[],
      beSharesListItems:[],
      viewFolder:[],
      open:['public'],
      toShareInfoDialog:false,
      beShareInfoDialog:false,
      confirmCancelDialog:false,
      saveDialog:false,
      saveProgress:false,
      chooseFolder:false,
      dialogInfo:{
            shareID: "",
            fileName: null,
            directName: "",
            type: "",
            status: "",
            shareTime: "",
            shareLink:"",
            shareCode:""
          },
      beShareDialogInfo:{
        shareID: "",
        fileName: null,
        directName: "",
        shareUserName: "",
        shareTime: ""
      },
      item:null
    }
  }
  // "toShares": [
  //   {
  //     "shareID": "04dbcd031e304561abfbd7fa46a986f1",
  //     "fileName": null,
  //     "directName": "我的图片",
  //     "type": "私密",
  //     "status": "未过期",
  //     "shareTime": "Sun Sep 27 11:03:06 UTC 2020"
  //   },
  //   {
  //     "shareID": "04dbcd031e304561abfbd7fa46a986ff",
  //     "fileName": "产品需求.docx",
  //     "directName": null,
  //     "type": "私密",
  //     "status": "过期",
  //     "shareTime": "Sun Sep 27 11:00:34 UTC 2020"
  //   }
  // ]
  ,methods: {
    shareInfo(item) {
      // if(item.directName!==null){
      //   alert(item.directName);
      // }else{
      //   alert(item.fileName);
      // }
      this.dialogInfo.shareLink = 'http://dgutsu.cn/#/Share?id=' + item.shareID +"   提取密码："+item.shareCode;
      this.dialogInfo.fileName = item.fileName;
      this.dialogInfo.directName = item.directName;
      this.dialogInfo.type = item.type;
      this.dialogInfo.status = item.status;
      this.dialogInfo.shareTime = item.shareTime;
      this.dialogInfo.shareCode = item.shareCode;
      this.dialogInfo.shareID = item.shareID;
      this.toShareInfoDialog = true;

    },
    copyLink() {
      alert("已经复制到剪贴板");
    },
    beShareInfo(item){
      this.beShareDialogInfo.shareID = item.shareID;
      this.beShareDialogInfo.fileName = item.fileName;
      this.beShareDialogInfo.directName = item.directName;
      this.beShareDialogInfo.shareUserName = item.shareUserName;
      this.beShareDialogInfo.shareTime = item.shareTime;
      this.beShareInfoDialog = true;
    },
    cancelShareDialog(){
        this.confirmCancelDialog=true;
    },
    cancelShare(){
      console.log(this.dialogInfo.shareID);
      let me = this;
      // me.loading=true;
      //this.files = this.dataSolver(this.item);
      //this.files = this.dataSolver(this.item);
      let a = sessionStorage.getItem('token');
      let resultArray=[];
      let b =  a.substring(1,a.length-1);
      // {
      //     "token":"",
      //     "shareIDs":[
      //     "113f660e6ec44b6fab4e2625cc116cb7","c005b04b159745ac8e6798db7256a30c","1b00638252f34b51a5c859dfb071083a"
      // ]
      // }
      resultArray.push(this.dialogInfo.shareID);
      this.axios.post('/cloud/user/deleteShare',{
        token:b,
        shareIDs:resultArray
      }).then(function (response){
        console.log(response);

        if(response.data.status===200){
          alert('取消分享成功!');
          me.confirmCancelDialog=false;
          me.toShareInfoDialog=false;
          me.groupListLoading=true;
          me.axios.post('/cloud/user/showShare',{
            token:b
          }).then(function (response) {
            console.log(response.data.data);
            me.toSharesListItems=response.data.data.toShares;
            me.beSharesListItems=response.data.data.beShares;
            //console.log( me.beSharesListItems);
            // console.log(me.toSharesListItems);
            // me.listItems=response.data.data;
            // me.groupListLoading=false;
          }).catch(function (error) {
            console.log(error);
          });
        }
      }).catch(function (error){
        console.log(error);
      })
    },
    folderTreeBuild(item){     //用于文件夹树形结构字符串构造（结果用于输入vuetify组件），移动/复制时候显示形式为树状结构
      let resultArray = [];
      for(let i=0;i<item.length;i++){
        if(item[i].type===undefined){//文件夹
          let obj ={
            id:null,    //文件夹id
            name:null,  //文件夹名称
            locked:false,
            children:null   //文件夹下文件夹（底层文件夹为null）includeDirects:[](includeDirects.length===0)
          };
          obj.id=item[i].directID;
          obj.name=item[i].name;


          if(item[i].includeDirects.length!==0){
            obj.children= this.folderTreeBuild(item[i].includeDirects);
          }else{
            obj.children=undefined;
          }
          resultArray.push(obj);
        }

      }
      return resultArray;
    },
    saveToDialog(){
      let me = this;
      let a = sessionStorage.getItem('token');
      let resultArray=[];
      let b =  a.substring(1,a.length-1);
      this.axios.post('/cloud/user/userCatalogue',{
        token:b
      }).then(function (response){
        console.log(response);
        if(response.data.status===200){
          resultArray.push(response.data.data);
          me.item=resultArray;
          me.viewFolder=me.folderTreeBuild(resultArray);
        }

      }).catch(function (error){
        console.log(error);
      })

      this.saveDialog=true;
    },
    saveFile(item){
      console.log(item);
      console.log(this.beShareDialogInfo);
      let me = this;
      let a = this.item;
      this.findFolder=[];
      this.findFolderMethod(item.id,a);
      let token = sessionStorage.getItem('token');
      //let resultArray=[];
      let b =  token.substring(1,token.length-1);
      let flag = 0;
      if(this.beShareDialogInfo.directName!==null){//文件夹
        for(let i=0;i<this.findFolder[0].includeDirects.length;i++){
          if(this.beShareDialogInfo.directName===this.findFolder[0].includeDirects[i].name){
            //console.log(this.findFolder[0].includeDirects[i].name);
            flag++;
          }
        }
      }else{//文件
        for(let i=0;i<this.findFolder[0].includeFiles.length;i++){
          if(this.beShareDialogInfo.fileName===this.findFolder[0].includeFiles[i].name){
            flag++;
          }
        }
      }
      if(flag === 1){
        alert("存在同名文件/文件夹！");
      }else{
       //alert('可以转存');
       console.log(this.beShareDialogInfo.shareID);
        if(this.beShareDialogInfo.directName!==null){
          this.axios.post('/cloud/user/reStorageDirectory',{
            token:b,
            shareID:this.beShareDialogInfo.shareID,
            newDirectID:item.id
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert('转存成功!');
              me.saveDialog=false;
              me.toShareInfoDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
        }else{
          this.axios.post('/cloud/user/reStorageFile',{
            token:b,
            shareID:this.beShareDialogInfo.shareID,
            newDirectID:item.id
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert('转存成功!');
              me.saveDialog=false;
              me.toShareInfoDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
        }
      }
    },
    findFolderMethod(id,item){
      //通过目标文件夹id在文件树中找到对应文件夹的json
      //传入参数：文件夹id
      //遍历整棵树，找到的话压入数组，并返回
      for(let i=0;i<item.length;i++){
        if(item[i].type===undefined){
          if(item[i].directID===id){
            let a = this.findFolder.push(item[i]);
            console.log(a);
          }
          this.findFolderMethod(id,item[i].includeDirects);
        }
      }


    },
    //this.dialogInfo.shareID
  }
}
</script>
