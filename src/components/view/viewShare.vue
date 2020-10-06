<template>
  <div>
    <v-container class="grey lighten-5">
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
            <v-btn color="blue darken-1" text>转存</v-btn>
            <v-btn color="blue darken-1" text @click="beShareInfoDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      toShareInfoDialog:false,
      beShareInfoDialog:false,
      confirmCancelDialog:false,
      dialogInfo:{
            shareID: "",
            fileName: null,
            directName: "",
            type: "",
            status: "",
            shareTime: "",
            shareLink:""
          },
      beShareDialogInfo:{
        fileName: null,
        directName: "",
        shareUserName: "",
        shareTime: ""
      }
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
      this.dialogInfo.shareLink = 'http://localhost:8080/#/Share?' + item.shareID;
      this.dialogInfo.fileName = item.fileName;
      this.dialogInfo.directName = item.directName;
      this.dialogInfo.type = item.type;
      this.dialogInfo.status = item.status;
      this.dialogInfo.shareTime = item.shareTime;

      this.dialogInfo.shareID = item.shareID;
      this.toShareInfoDialog = true;

    },
    copyLink() {
      alert("已经复制到剪贴板");
    },
    beShareInfo(item){
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
    }
    //this.dialogInfo.shareID
  }
}
</script>
