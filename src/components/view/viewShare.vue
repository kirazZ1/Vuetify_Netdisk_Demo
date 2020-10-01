<template>
  <div>
    <v-container class="grey lighten-5">
      <v-dialog
          v-model="infoDialog"
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
                  <v-list-item-content>
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
            <v-btn color="blue darken-1"  class="btn" text @click="copyLink()" data-clipboard-target="#copy"
            >复制分享链接</v-btn>
            <v-btn color="blue darken-1" text @click="infoDialog = false">取消分享</v-btn>
            <v-btn color="blue darken-1" text @click="infoDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <v-row justify="center">
      <v-expansion-panels popout inset>
        <v-expansion-panel>
          <v-expansion-panel-header>

            我分享的
          </v-expansion-panel-header>

          <v-expansion-panel-content  v-for="(item, i) in toSharesListItems"  :key="i">
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
          <v-expansion-panel-content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
      // me.listItems=response.data.data;
      // me.groupListLoading=false;
    }).catch(function (error) {
      console.log(error);
    });
  },

  data(){
    return {
      toSharesListItems:[],
      infoDialog:false,
      dialogInfo:{
           // shareID: "",
            fileName: null,
            directName: "",
            type: "",
            status: "",
            shareTime: "",
            shareLink:""
          },

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
      this.infoDialog = true;

    },
    copyLink() {
      alert("已经复制到剪贴板");

    }
  }
}
</script>
