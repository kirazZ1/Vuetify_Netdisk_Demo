<template>
  <div>
    <div class="ma-1 pa-1"></div>
    <v-container >
      <v-card>
      <v-row>
          <v-col md="6">
            <v-row>


              <div class="ma-1 pa-1"></div>
              <div class="ma-1 pa-1"></div>
              <div class="ma-1 pa-1" >
                <v-btn  color="primary"  v-show="backButton" @click="Back()">
                  <v-icon dark left>mdi-arrow-left</v-icon>
                  返回
                </v-btn>
              </div>
              <div class="ma-1 pa-1">
                   <v-btn v-show="uploadButton"  color="primary" @click="uploadDialog=true"><v-icon>{{button1.icon}}</v-icon>上传</v-btn>
              </div>
              <div class="ma-1 pa-1">
                    <v-btn  color="primary" @click="download()"><v-icon >{{button2.icon}}</v-icon>下载</v-btn>
              </div>
              <div class="ma-1 pa-1">
                <v-btn  color="primary"  @click="Refresh()"><v-icon>{{button4.icon}}</v-icon>刷新</v-btn>
              </div>
              <div class="ma-1 pa-1">
                     <v-btn v-show="newFolderButton"  @click="newFolderDialog=true" color="primary"><v-icon>mdi-plus</v-icon>新建文件夹</v-btn>
              </div>
            </v-row>
          </v-col>
        <!--上传文件对话框-->
        <v-dialog
            v-model="uploadDialog"
            persistent max-width="600px"
        >
          <v-alert
              v-model="uploadAlert"
              dismissible
              type="error"
              border="left"
              elevation="2"
              colored-border
              transition="scale-transition"
          >
            {{uploadMessage}}
          </v-alert>
          <v-card>
            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>上传文件</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-progress-linear
                :active="uploadProgress"

                indeterminate
                absolute
                bottom
                color="deep-purple accent-4"
            ></v-progress-linear>
            <v-card-text>
              <v-container>
                <v-text-field
                    v-model="uploadFileName"
                    :counter="10"
                    label="新文件名"
                    required
                ></v-text-field>
                <v-file-input  label="上传您的文件" id="upload" outlined dense></v-file-input>

              </v-container>
              <small>*请输入新的文件名并选择文件后点击提交</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="closeUploadDialog" color="blue darken-1" text  @click="uploadDialog = false">关闭</v-btn>
              <v-btn :disabled="clickToUpload" color="blue darken-1" text @click="uploadFile()">上传</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--新建文件夹对话框-->
        <v-dialog
            v-model="newFolderDialog"
            persistent max-width="600px"
        >
        <v-card>

          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>新建文件夹</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-progress-linear
              :active="createFolderProgress"
              indeterminate
              absolute
              bottom
              color="deep-purple accent-4"
          ></v-progress-linear>
          <v-card-text>
            <v-container>
              <v-text-field
                  v-model="newFolderName"
                  :counter="10"
                  label="新文件夹名"
                  required
              ></v-text-field>


            </v-container>
            <small>*请输入新的文件夹名点击提交</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="closeCreateFolder" color="blue darken-1" text @click="newFolderDialog = false">关闭</v-btn>
            <v-btn :disabled="clickToNewFolder" color="blue darken-1" text @click="newFolder()">创建</v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
        <!--显示文件信息对话框-->
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
              <v-toolbar-title>文件详情</v-toolbar-title>

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
                    <v-list-item-subtitle>{{fileInfo.name}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>类型</v-list-item-title>
                    <v-list-item-subtitle>{{fileInfo.type}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>文件大小</v-list-item-title>
                    <v-list-item-subtitle>{{fileInfo.size}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title>更新日期</v-list-item-title>
                    <v-list-item-subtitle>{{fileInfo.modificationDate}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="infoDialog = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--重命名文件/文件夹对话框-->
        <v-dialog
            v-model="renameDialog"
            persistent max-width="600px"
        >
          <v-alert
              v-model="renameAlert"
              dismissible
              type="error"
              border="left"
              elevation="2"
              colored-border
              transition="scale-transition"
          >
            {{renameMessage}}
          </v-alert>
          <v-card>

            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>重命名</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-container>
                <v-text-field
                    v-model="renameFileName"
                    :counter="10"
                    label="新文件名"
                    required
                ></v-text-field>


              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="renameDialog = false">关闭</v-btn>
              <v-btn color="blue darken-1" text @click="rename()">提交</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--移动文件/文件夹对话框-->
        <v-dialog
            v-model="moveDialog"
            persistent max-width="600px"
        >
          <v-alert
              v-model="moveAlert"
              dismissible
              type="error"
              border="left"
              elevation="2"
              colored-border
              transition="scale-transition"
          >
            {{moveMessage}}
          </v-alert>
          <v-card>
<!--            <v-card-title>-->
<!--              <span class="headline">移动到</span>-->
<!--            </v-card-title>-->
            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>移动到</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-progress-linear
                :active="moveProgress"

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
                      <v-btn text color="primary" @click="moveFile(item)" v-show="!item.locked" :disabled="chooseFolder">选择</v-btn>
                    </template>
                  </v-treeview>
                </v-card>

<!--                </v-treeview>-->
              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="moveDialog = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--复制文件/文件夹对话框-->
        <v-dialog
            v-model="copyDialog"
            persistent max-width="600px"
        >

          <v-card>

            <v-toolbar
                color="light-blue darken-4"
                dark
                flat
            >
              <v-toolbar-title>复制到</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-tooltip bottom>

              </v-tooltip>
            </v-toolbar>
            <v-progress-linear
                :active="copyProgress"

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


                  >

                    <template v-slot:prepend="{ item, open }">
                      <v-icon>
                        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                      </v-icon>
                    </template>
                    <template v-slot:append="{ item }">
                      <v-btn text color="primary" @click="copyFile(item)" :disabled="chooseFolder">选择</v-btn>
                    </template>
                  </v-treeview>
                </v-card>

                <!--                </v-treeview>-->
              </v-container>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="copyDialog = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--私密分享对话框-->
        <v-dialog
            v-model="privateShareDialog"
            persistent max-width="600px"
        >
          <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>私密分享</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
            <v-card-text>
              <v-container>
                <v-select
                    v-model="shareToValue"
                    item-text="userName"
                    item-value="userID"
                    :items="shareToWho"
                    return-object
                    label="分享给"
                    multiple
                    chips
                    hint="请选择要进行私密分享的用户"
                    persistent-hint
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                        ripple
                      @click="toggle()"
                    >
                      <v-list-item-action>
                        <v-icon :color="shareToWho.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>全选</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>

                </v-select>
                <v-radio-group v-model="privateShareDays" row>
                  <v-radio label="7天" value=7></v-radio>
                  <v-radio label="30天" value=30></v-radio>
                  <v-radio label="60天" value=60></v-radio>
                </v-radio-group>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="privateShare()">分享</v-btn>
              <v-btn color="blue darken-1" text @click="privateShareDialog = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--搜索框-->
        <v-col
            md="2"
            offset-md="3"
        >
                  <v-text-field
                      v-model="preSearch"
                      color="primary  "
                      hide-details
                      style="max-width: 250px;"
                      @keyup.enter="SearchFile"
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
                          @click="SearchFile"
                      >
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
        </v-col>
      </v-row>
      </v-card>
      <!--面包屑-->
      <v-row>
          <v-breadcrumbs :items="breadcrumb_items" v-show="showBreadcrumb">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                  :href="item.href"
                  large
              >
                <v-btn text large color="primary"  :disabled="item.disabled" @click="breadcrumb(item)">{{ item.text }} </v-btn>

              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
          <v-breadcrumbs v-show="showBreadcrumb2"><v-breadcrumbs-item>搜索结果</v-breadcrumbs-item></v-breadcrumbs>

      </v-row>
      <v-divider></v-divider>

    <!--显示文件用表格代码-->
      <v-card elevation="5">
        <v-data-table
            :loading="loading"
          v-model="selected"
          :headers="headers"
          :items="files"
          :single-select="singleSelect"
            no-data-text="暂时没有文件"

          item-key="id"
          show-select
          class="elevation-1"
      >
      <!-- 文件名and图标-->
        <template v-slot:item.name="{item}">
          <v-icon  v-if="!item.type">
              mdi-folder
          </v-icon>
          <v-icon v-else>
            {{ filesIcon[item.type] }}
          </v-icon>
<!--          这里是表格中显示文件名的位置-->
<!--          如果是文件夹名称，则可点击进入，面包屑对应更新-->
<!--          初步设想，用v-if,v-else实现对type的判断，跟上面图标判别的逻辑大致相同-->
<!--          <v-btn text @click="clickFile(item)">-->
            <span @click="clickFile(item)">                {{ item.name }}</span>
<!--          </v-btn>-->
        </template>
        <!--操作按钮-->
        <template v-slot:item.action="{ item }">
<!--          <v-tooltip bottom>-->
<!--            <template v-slot:activator="{ on, attrs }">-->
<!--          <v-icon-->
<!--              medium-->
<!--              v-bind="attrs"-->
<!--              v-on="on"-->
<!--              @click="shareItem(item)"-->
<!--          >-->
<!--            mdi-share-->
<!--          </v-icon>-->
<!--            </template>-->
<!--            <span>分享文件</span>-->
<!--          </v-tooltip>-->


          <v-menu  transition="scale-transition">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-icon
                      medium
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                      @click="shareButton(item)"
                  >
                    mdi-share
                  </v-icon>
                </template>
                <span>分享</span>
              </v-tooltip>
            </template>

            <v-list>
              <v-list-item
                  v-for="(item, index) in ShareItems"
                  :key="index"
                  @click="share(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>






          <!--删除文件/文件夹按钮-->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  medium
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>删除文件</span>
          </v-tooltip>
          <!--更多按钮-->
          <v-menu  transition="scale-transition">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                    <v-icon
                        medium
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                        @click="moreOptionIcon(item)"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                </template>
                <span>更多</span>
              </v-tooltip>
            </template>

            <v-list>
              <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  @click="moreOption(item)"
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
//import Bus from '../common/bus.js'  //父子组件通信
import {
  mdiCloudUpload,
  mdiCloudDownload,
  mdiZipBox,
  mdiFilePowerpoint,
  mdiRefresh,
  mdiFileVideo,
  mdiFileMusic
} from '@mdi/js'


export default {
  name: "myFile",
  data(){
    return{
      button1:{icon:mdiCloudUpload},
      button2:{icon:mdiCloudDownload },
      button4:{icon:mdiRefresh },
      preSearch:'',  //搜索文本框
      backButton:false, //是否显示返回按钮
      newFolderButton:true,//是否显示新建文件夹按钮
      uploadButton:true,//是否显示上传文件按钮
      uploadDialog:false,
      renameDialog:false,
      moveDialog:false,
      copyDialog:false,
      //upload:null,
      uploadFileName:'',
      renameFileName:'',
      shareCode:'',
      viewFolder:[],
      //2020-09-11
      //面包屑导航
      //效果：进入文件夹之后，面包屑栏增加一个返回上级的面包屑便于返回上一级目录
      //思路：进入文件夹的函数中最后给  breadcrumb_items 增加一个元素
      // {
      //   text: 'Link 1',
      //   disabled: false,
      //   href: 'breadcrumbs_link_1',
      // },
      // {
      //   text: 'Link 2',
      //   disabled: true,
      //   href: 'breadcrumbs_link_2',
      // },
      breadcrumb_items: [ //面包屑的数据项
        {
          text: '我的文件',
          disabled: true,
          href: '',
          id:''
        }

      ],
      singleSelect: true,    //表格单选
      selected: [],   //表格左边勾选选项（默认为空）
      headers: [    //表格标题
        {
          text: '文件名',
          align: 'start',
          sortable: false,  //全选按钮
          value: 'name',    //选项名（用来取数据）
        },
        { text: '大小', value: 'size' },
        { text: '修改日期', value: 'modificationDate' },
        { text: '操作', value: 'action' }
      ],
      files:null,   //显示在界面的文件信息
      breadcrumbNum:1,    //面包屑项个数（最少为1）
      showBreadcrumb:true,//是否显示导航面包屑
      showBreadcrumb2:false,//是否显示搜索结果面包屑
      resultArray:[],
      //接收后台传来的文件信息的变量receiveFiles

      items: [
          //操作-更多 的下拉菜单文字内容
        { title: '移动到' },
        { title: '复制到' },
        { title: '重命名' }
      ],
      ShareItems:[
        { title: '私密分享' },
        { title: '外链分享' },
      ],
      filesIcon: {
        //文件类型对应图标
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        jpeg: 'mdi-file-image',
        jpg: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
        doc:'mdi-file-word',
        docx:'mdi-file-word',
        zip:mdiZipBox,
        rar:mdiZipBox,
        '7z':mdiZipBox,
        ppt:mdiFilePowerpoint,
        pptx:mdiFilePowerpoint,
        mp4:mdiFileVideo,
        avi:mdiFileVideo,
        mp3:mdiFileMusic,
        m4a:mdiFileMusic,
        flac:mdiFileMusic,

      },
      //  directID:'10000',        //文件夹ID
      // name:'四大名著',		//文件夹名称
      // size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
      // modificationDate:'2020-01-01',	//上传时间
      // includeDirects:[]
      //  includeFiles:[]
      item:{
        directID:'',        //文件夹ID
        name:'',		//文件夹名称
        size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
        modificationDate:'',	//上传时间
        includeDirects:[],
        includeFiles:[]
      },
      formData:null,
      uploadMessage:'',
      renameMessage:'',
      moveMessage:'',
      uploadAlert:false,
      renameAlert:false,
      moveAlert:false,
      copyAlert:false,
      privateShareDays:null,
      fileInfo:
      {
            id:'',
            type:'',						//文件类型
            name:'',		 			//文件名
            size:'',						//文件大小
            modificationDate:''	//更新时间
      },
      infoDialog:false,
      newFolderDialog:false,
      privateShareDialog:false,
      newFolderName:'',
      optionItem:null,
      folderTree:null,
      open: ['public'],
      findFolder:[],
      shareToValue:[],
      loading:false,
      uploadProgress:false,
      createFolderProgress:false,
      copyProgress:false,
      moveProgress:false,
      closeUploadDialog:false,
      clickToUpload:false,
      closeCreateFolder:false,
      clickToNewFolder:false,
      chooseFolder:false,
      shareToWho: [
        {userID:'',workID:'',userName:''},

      ],
      shareFile:null
    }
  },
  computed:{
    icon(){
      if(this.shareToValue.length===this.shareToWho.length){//全选
       // console.log('全选');
        return 'mdi-close-box';
      }else if(this.shareToValue.length>0&&this.shareToValue<this.shareToWho){//多选但不是全选
       // console.log('多选');
        return 'mdi-minus-box';
      }else{
       // console.log('不选');
        return 'mdi-checkbox-blank-outline';
      }

    }

  },
  beforeMount() {
    //this.files=this.receiveFiles;
    //let me =this;

    // console.log(11111);
    // console.log(this.item);
    let me=this;
    me.loading=true;
    this.files = this.dataSolver(this.item);
    let a = sessionStorage.getItem('token');
    let b =  a.substring(1,a.length-1);
    this.axios.post('/cloud/user/userCatalogue',{
      token:b
    }).then(function (response) {
      console.log(response.data.data);
      if(response.data.data!=null){
        me.item= response.data.data;
        me.breadcrumb_items[0].id=response.data.data.directID;
        //console.log( 'fuck');
        //console.log( me.item);
        me.files = me.dataSolver(me.item);
        me.loading=false;
      }
      // console.log(response.data.data);
    }).catch(function (error) {
      console.log(error);
    });


    //this.files = this.dataSolver(this.item);

    //console.log();
  },

  methods:{
    //编辑每页显示几条数据
    toggle () {
      this.$nextTick(() => {
        //console.log(this.shareToValue.length);
        //console.log(this.shareToWho.length);
        if (this.shareToValue.length===this.shareToWho.length) {//全选点击清空

          this.shareToValue = [];
        } else {//非全选点击
          this.shareToValue = this.shareToWho;
        }
      })
    },
    editItem (item) {
      this.editedIndex = this.files.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    //查找文件
    SearchFile(){
      //let name =this.preSearch;
      if(this.preSearch===''){
        this.files=[];
      }else{
        let array=[];
        let resultView=[];
        this.resultArray=[];
        let reg=new RegExp(".*"+this.preSearch+".*","g");
        array.push(this.item);
        this.parseTreeJson(array);
        console.log(this.resultArray);

        for(let i=0;i<this.resultArray.length;i++){
          if(reg.test(this.resultArray[i].name)){//正则表达式匹配
            let obj={
              id:this.resultArray[i].fileID,
              type:this.resultArray[i].type,
              name:this.resultArray[i].name,
              size:this.resultArray[i].size,
              modificationDate:this.resultArray[i].modificationDate,
            };
            resultView.push(obj);

          }
        }
        this.files=resultView;
      }
      this.showBreadcrumb=false;
      this.showBreadcrumb2=true;

      this.backButton=true;
      this.newFolderButton=false;
      this.uploadButton=false;
      this.selected=[];
    },
    //删除文件/文件夹
    deleteItem (item) {
      // {
      //      "token": "eabe00623c924cd6a6267eec187c2c11",
      //     "directID": "1",
      //     "fileID": "1"
      // }
      let me = this;
      //1.处理token
      let a = sessionStorage.getItem('token');
      let b =  a.substring(1,a.length-1);
      console.log(item);
      if(item.type===null){//删除文件夹
        //alert('删除文件夹');
          this.axios.post('/cloud/user/deleteDirectory',{
            token:b,
            directID:item.id
          }).then(function (response){
              console.log(response);
            if(response.data.status===200){
              alert('删除成功！');
              while(me.breadcrumbNum!=1){
                me.breadcrumb_items.pop();
                me.breadcrumbNum--;
              }
              me.breadcrumb_items[0].disabled=true;
              me.loading=true;
              me.axios.post('/cloud/user/userCatalogue',{
                token:b
              }).then(function (response) {
                console.log(response.data.data);
                if(response.data.data!=null){
                  me.item= response.data.data;
                  me.breadcrumb_items[0].id=response.data.data.directID;
                  //console.log( 'fuck');
                  //console.log( me.item);
                  me.files = me.dataSolver(me.item);
                  me.loading=false;

                }
                console.log(response.data.data);
              }).catch(function (error) {
                console.log(error);
              });
            }
          }).catch(function (error){
              console.log(error);
          });
      }else{//删除文件
        console.log(item.id);
        console.log(this.breadcrumb_items[this.breadcrumb_items.length-1].id);

        //2.取出fileID（item.id）
        //3.取出directID(breadcrumb_item[breadcrumb_item.lenth-1].id)
        this.axios.post('/cloud/user/deleteFile',{
            token:b,
            fileID:item.id,
            directID:this.breadcrumb_items[this.breadcrumb_items.length-1].id
        }).then(function(response){
            console.log(response.data);
            if(response.data.status===200){
              alert('删除成功！');
              me.loading=true;
              while(me.breadcrumbNum!=1){
                me.breadcrumb_items.pop();
                me.breadcrumbNum--;
              }
              me.breadcrumb_items[0].disabled=true;
              me.axios.post('/cloud/user/userCatalogue',{
                token:b
              }).then(function (response) {
                console.log(response.data.data);
                if(response.data.data!=null){
                  me.item= response.data.data;
                  me.breadcrumb_items[0].id=response.data.data.directID;
                  //console.log( 'fuck');
                  //console.log( me.item);
                  me.files = me.dataSolver(me.item);
                  me.loading=false;


                }
                console.log(response.data.data);
              }).catch(function (error) {
                console.log(error);
              });
            }
        }).catch(function (error){
              console.log(error);
        })

      }

    },
    //刷新文件列表
    Refresh(){

      //alert("111");
      // Bus.$emit('refresh_myFile', '重新加载视图部分组件');
      //后来想了一下可能没必要，直接向后台发请求要新的数据就好了
      //新:刷新列表
      //过程分析：
      //1.向后台重发请求更新item
      //2.根据当前面包屑来找到文件夹
      //已经有的json处理方法：dataSolver(item)，用于把传回的格式转化成为列表可接受的json
      //可以复用的代码breadcrumb(item)中步骤2（可进行封装）
      let me=this;
      this.files=[];
      me.loading=true;

      while(me.breadcrumbNum!=1){
        me.breadcrumb_items.pop();
        me.breadcrumbNum--;
      }
      me.breadcrumb_items[0].disabled=true;
      this.files = this.dataSolver(this.item);
      let a = sessionStorage.getItem('token');
      let b =  a.substring(1,a.length-1);
      this.axios.post('/cloud/user/userCatalogue',{
        token:b
      }).then(function (response) {
        console.log(response.data.data);
        if(response.data.data!=null){
          me.item= response.data.data;
          me.breadcrumb_items[0].id=response.data.data.directID;
          //console.log( 'fuck');
          //console.log( me.item);
          me.files = me.dataSolver(me.item);
          me.loading=false;
        }
        // console.log(response.data.data);
      }).catch(function (error) {
        console.log(error);
      });
    },
    clickFile(item){//点击文件触发的事件
      //根据type字段来识别是否为文件夹

      //需要考虑的情况：通过搜索访问文件夹
      //搜索了文件夹，但是文件层级又不清楚
      //写的代码必须是在所有场景都可使用的
      if(item.type===null){    //文件夹

        for(let i=0;i<this.breadcrumbNum;i++){
           this.breadcrumb_items[i]['disabled']=false;
        }
        let breadcrumb ={"text": item.name,"disabled":true,"href":"","id":item.id} ;
        //alert(item.id);
        this.breadcrumb_items.push(breadcrumb);
        this.breadcrumbNum=this.breadcrumbNum+1;

        this.selected=[];
        this.files = this.dataSolver(item.include);
        //console.log(item);
      }else{//其他文件
        this.fileInfo=item;
        this.infoDialog=true;
      }
    },
    breadcrumb(item) {
      //1.变更面包屑总数量以及显示
      //alert(item.id);
      while (item.id !== this.breadcrumb_items[this.breadcrumb_items.length - 1]['id']) {
        this.breadcrumb_items.pop();

        this.breadcrumbNum--;
      }
      //alert( this.breadcrumbNum);
      //2.加载新的数据
      let fileList = this.dataSolver(this.item);
      this.breadcrumb_items[this.breadcrumb_items.length - 1]['disabled'] = true;

      if (this.breadcrumbNum === 1) {       //如果返回我的文件，则显示初始内容
                                            // this.files=this.receiveFiles;

        this.files = this.dataSolver(this.item);
        this.selected=[];
      }else{     //如果是其他层级的子文件夹，执行以下操作
        console.log(this.breadcrumb_items.length);
        for(let i=0;i<this.breadcrumb_items.length;i++){
          let folderName=this.breadcrumb_items[i]['text'];    //获取面包屑中文件名
          let folderId=this.breadcrumb_items[i]['id'];
          console.log(folderName);
          console.log(folderId);
          for(let j=0;j<=(fileList.length-1);j++){
            if(fileList[j]['name']===folderName&&fileList[j]['id']===folderId){
              fileList=fileList[j]['include'];
              fileList=this.dataSolver(fileList);
            }
          }
          this.files=fileList;

        }
        this.selected=[];
      }

    },
    dataSolver(item){//用于将后台传来json处理成前端可用的字符串（自力更生，丰衣足食）,item为文件夹
      //收到的数据格式
      // {
      //   directID:''         //文件夹ID
      //   name:'四大名著',		//文件夹名称
      //   size:,			//为了方便，文件夹大小不做计算，如果后台传来更好
      //   modificationDate:'2020-01-01'	//上传时间
      //   includeDirects:[]
      //   includeFiles:[]
      // }
      //期望的数据格式
      //文件
      // {
      //       id:'',
      //       type:'pdf',						//文件类型
      //       name:'西游记',		 			//文件名
      //       size:'10M',						//文件大小
      //       modificationDate:'2020-01-01'	//更新时间
      // }
      //文件夹
      // {
      //     name:'四大名著',		//文件夹名称
      //     size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
      //     modificationDate:null,	//更新时间感觉文件夹也没啥必要，如果后台传实际值也能显示
      //     include:[]
      //}
      let expectJson = [];     //新的json数组
      if(item.includeDirects!==null) {
        for (let i = 0; i <= (item.includeDirects.length - 1); i++) {//文件夹数据处理
          let jsonItem = {
            "id": null,
            "name": null,
            "type": null,
            "size": null,
            "modificationDate": null,
            "include": {
              "includeDirects": null,
              "includeFiles": null
            }
          };
          jsonItem.id = item.includeDirects[i].directID;
          jsonItem.name = item.includeDirects[i].name;
          jsonItem.modificationDate = item.includeDirects[i].modificationDate;
          jsonItem.include.includeDirects = item.includeDirects[i].includeDirects;
          jsonItem.include.includeFiles = item.includeDirects[i].includeFiles;
          //文件夹中type和size为null
          //console.log(this.item.includeDirects[i]);
          expectJson.push(jsonItem);
        }
      }
      // console.log(expectJson);
      if(item.includeFiles!==null){
      for(let j=0;j<=(item.includeFiles.length-1);j++) {//文件数据处理
        //
        let jsonItem = {
          "id": null,
          "name": null,
          "type": null,
          "size": null,
          "modificationDate": null,
          "include": {
            "includeDirects": null,
            "includeFiles": null
          }
        };

        jsonItem.id=item.includeFiles[j].fileID;
        jsonItem.name=item.includeFiles[j].name;
        jsonItem.type=item.includeFiles[j].type;
        jsonItem.size=item.includeFiles[j].size;
        jsonItem.modificationDate=item.includeFiles[j].modificationDate;
        jsonItem.include=null;
        //文件夹中type和size为null
        expectJson.push(jsonItem);
      }
        // console.log(expectJson);
        return expectJson;
      }
    },
    parseTreeJson(item){//对json树进行遍历获取叶子节点（递归实现）item-传入的json字符串数组(后台发来的，未经过处理的json字符串，需要用数组包装后调用)
      //可以知道，所有文件都是根节点，文件夹和文件的区别在于type字段是否为空
      //let resultArray = [];

      for(let index = 0;index<item.length;index++){
        const element =item[index];         //逐级访问
        if(element.type===undefined){//文件夹(两部分 includeDirects  includeFiles)
          if(element.includeFiles!==null){//不是空文件夹
              for(let i=0;i<element.includeFiles.length;i++){
                this.resultArray.push(element.includeFiles[i]);
              }
          }
          if(element.includeDirects!=null){
            this.parseTreeJson(element.includeDirects);
          }
        }else{//文件
          this.resultArray.push(element);
        }
      }

    },
    folderTreeBuild(item){     //用于文件夹树形结构字符串构造（结果用于输入vuetify组件），移动/复制时候显示形式为树状结构
        //源字符串来自this.item，即系统接收到的文件列表数据
      //收到的数据格式
      // {
      //   directID:''         //文件夹ID
      //   name:'四大名著',		//文件夹名称
      //   size:,			//为了方便，文件夹大小不做计算，如果后台传来更好
      //   modificationDate:'2020-01-01'	//上传时间
      //   includeDirects:[]
      //   includeFiles:[]      //包含文件，此处可忽略
      // }
      //需求的数据格式
      // {
      //       id: 1,
      //       name: 'Applications :',
      //       children: [
      //        { id: 2, name: 'Calendar : app' },
      //        { id: 3, name: 'Chrome : app' },
      //        { id: 4, name: 'Webstorm : app' },
      //       ],
      // },
      //最底层，最小的递归元素：
      //new obj ={
      //    id:null,    //文件夹id
      //    name:null,  //文件夹名称
      //    children:null   //文件夹下文件夹（底层文件夹为null）includeDirects:[](includeDirects.length===0)
      // }
      // obj.id=item[i].directID;
      // obj.name=item[i].name;
      let resultArray = [];
      for(let i=0;i<item.length;i++){
        if(item[i].type===undefined){//文件夹
          let obj ={
            id:null,    //文件夹id
            name:null,  //文件夹名称
            locked:null,
            children:null   //文件夹下文件夹（底层文件夹为null）includeDirects:[](includeDirects.length===0)
          };
          obj.id=item[i].directID;
          obj.name=item[i].name;

          if(item[i].directID===this.optionItem.id){
            obj.locked=true;
          }else{
            obj.locked=false;
          }
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
    folderTreeLock(item){
      // {
      //       id: 1,
      //       name: 'Applications :',
      //       locked:false,
      //       children: [
      //        { id: 2, name: 'Calendar : app' },
      //        { id: 3, name: 'Chrome : app' },
      //        { id: 4, name: 'Webstorm : app' },
      //       ],
      // },
      //console.log(33333);
      //console.log(item[0].children.length);
      //console.log(11111);
       for(let i=0;i<item.length;i++){
          if(item[i].children!==undefined){
              if(item[i].locked===true){
                    for(let j=0;j<item[i].children.length;j++){
                      item[i].children[j].locked=true;
                    }
              }
         //
              this.folderTreeLock(item[i].children);

          }

       }
    },
    Back(){
      //初始化数据
      this.files=this.dataSolver(this.item);
      //恢复面包屑
      this.breadcrumbNum=1;
      this.breadcrumb_items=[];
      let obj={
        text: '我的文件',
        disabled: true,
        href: '',
        id:''
      };
      this.breadcrumb_items.push(obj);
      //调整按钮显示
      this.showBreadcrumb=true;
      this.showBreadcrumb2=false;
      this.uploadButton=true;
      this.newFolderButton=true;
      this.backButton=false;
      this.preSearch='';
      this.selected=[];

    },
    shareItem(item){
      console.log(item);
      console.log(this.selected);
    },
    uploadFile(){
      //console.log(document.querySelector("#upload").files[0]);//----无文件时为undefined
      // let  reopt = {
      //   method:"put",
      //   url:"",
      //   withCredentials:false,
      //   headers:{'content-type': 'multipart/form-data'},
      //   maxRedirects:0,
      //   responseType:'text',
      //   data:null,
      // };
      if(this.uploadFileName===''){
        //alert("请输入文件名");
        this.uploadMessage="请输入文件名！";
        this.uploadAlert=true;
      }else if(document.querySelector("#upload").files[0]===undefined){
        //alert("请选择待上传的文件");
        this.uploadMessage="请选择待上传的文件！";
        this.uploadAlert=true;
      }
      //要考虑当前的文件是否会造成重复（类型相同，文件名相同）
          //新文件名是用户给的，需要检测当前层的文件夹有没有重复的文件
      else{
        //console.log(document.querySelector("#upload"));
        let fileName = document.querySelector("#upload").files[0].name;
        let type=fileName.replace(/.+\./,"");       //匹配后缀名
        //console.log(type);
        let flag=0;
        for(let i=0;i<this.files.length;i++){
          if(this.uploadFileName===this.files[i].name&&type===this.files[i].type){
               flag++;
          }
        }
        if(flag===0){
          //let formData = new window.FormData()

          let a = sessionStorage.getItem('token');
          //let resultArray=[];
          let b =  a.substring(1,a.length-1);
          let size =document.querySelector('input[type=file]').files[0].size;
          size = size / 1024;//kb
          size = (size / 1024).toFixed(2);
          //console.log(document.getElementById('upload').value+size);

          // let obj={
          //     token:b,
          //     directID:this.breadcrumb_items[this.breadcrumb_items.length-1].id,
          //     fileName:this.uploadFileName,
          //     fileSize:size,
          //     fileType:type
          //   };
          // console.log(obj);
          //alert(this.breadcrumb_items[this.breadcrumb_items.length-1].id);
          let me=this;
          this.uploadProgress=true;
          this.clickToUpload=true;
          this.closeUploadDialog=true;
          this.axios.post('/cloud/user/getUploadUrl',{
            token:b,
            directID:this.breadcrumb_items[this.breadcrumb_items.length-1].id,
            fileName:this.uploadFileName+"."+type,
            fileSize:size,
            fileType:type
          }).then(function (response) {
            console.log(response.data.data);
            if(response.data.data.uploadUrl!==''){
             // let reader = new FileReader();
              //let  UrlBase64 = reader.readAsDataURL(document.getElementById("upload").files[0]);
              // let formData = new window.FormData();
              // formData.append(me.uploadFileName, document.getElementById("upload").files[0]);
              // reopt.data= formData;
             // reopt.data=UrlBase64;
              let file=document.getElementById("upload").files[0];
              let reader = new FileReader();

              reader.readAsArrayBuffer(file);
              reader.onloadend = function() {
                let content = reader.result;
                let reopt = {
                  method : "put",
                  url : response.data.data.uploadUrl,
                  withCredentials: false,
                  headers : {'content-type': 'multipart/form-data'},
                  maxRedirects : 0,
                  responseType : 'text',
                    data : content,
                  };
                  me.axios.request(reopt).then(function (response) {
                    if(response.status < 300){
                      console.log('Creating object using temporary signature succeed.');
                    me.axios.post('/cloud/user/upload',{
                      token:b,
                      directID:me.breadcrumb_items[me.breadcrumb_items.length-1].id,
                      fileName:me.uploadFileName+"."+type,
                      fileSize:size,
                      fileType:type
                    }).then(function(response){
                      console.log(response.data);
                      if(response.data.status===200){
                        alert('上传成功');
                        me.loading=true;
                        while(me.breadcrumbNum!=1){
                          me.breadcrumb_items.pop();
                          me.breadcrumbNum--;
                        }
                        me.breadcrumb_items[0].disabled=true;
                        me.axios.post('/cloud/user/userCatalogue',{
                          token:b
                        }).then(function (response) {
                          console.log(response.data.data);
                          if(response.data.data!=null){
                            me.item= response.data.data;
                            me.breadcrumb_items[0].id=response.data.data.directID;
                            //console.log( 'fuck');
                            //console.log( me.item);
                            me.files = me.dataSolver(me.item);
                            me.loading=false;
                            me.clickToUpload=false;
                            me.closeUploadDialog=false;
                            me.uploadProgress=false;
                            me.uploadDialog=false;
                          }
                                // console.log(response.data.data);
                        }).catch(function (error) {
                          console.log(error);
                        });
                      }
                    }).catch(function (error){
                      console.log(error);
                    });
                  }else{
                    console.log('Creating object using temporary signature failed!');
                    console.log('status:' + response.status);
                    console.log('\n');
                  }
                  console.log(response.data);
                  console.log('\n');
                }).catch(function (err) {
                  console.log('Creating object using temporary signature failed!');
                  console.log(err);
                  console.log('\n');
                });
              };
              }

          }).catch(function (error) {
            console.log(error);
          });


  //         ｛
  //
	//            token：
	//            directID:       //文件夹ID
  //            fileName:'test.txt'	//文件名
  //            fileSize:'3.3MB'		//文件大小 如 3.3MB
  //            fileType:'txt'		//文件类型 如 txt
  //          ｝
  //
          //formData.append(this.uploadFileName, document.querySelector('input[type=file]').files[0]);
          //在这里发送请求给后端接口
          //上传的内容用formData封装（父文件夹id，文件名和文件）
          //父文件夹id获取
          // let folderID = this.breadcrumb_items[this.breadcrumbNum-1].id
          // if(folderID===""){
          //     folderID = this.item.directID;
          // }
          // let a = document.querySelector("#upload").files[0];//用console.log进行测试，成功取到文件
          // let formData = new window.FormData() // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
          // formData.append('userFile', a);
          // console.log(formData);//输出结果
        }else{
          //alert("有同名文件");
          this.uploadMessage="文件夹中存在同名文件，请重新命名！";
          this.uploadAlert=true;
        }
        // let strArray = fileName.split(".");
        // let fileType = strArray.pop();
        // console.log(fileType);
        //alert("可以上传");

      }
    },
    moreOptionIcon(item){
      //console.log(item);
      this.optionItem=item;
      let test =[];
      test.push(this.item);
      let a =this.folderTreeBuild(test);
      //console.log(11111);
      //console.log(a);
      this.viewFolder=a;
      //console.log(this.viewFolder);

    },
    newFolder(){//新建文件夹
        //文件夹同名检测
      if(this.newFolderName===''){
        alert("文件夹名不能为空！");
      }else{
        //console.log(this.files.length);
         let flag=0;
         for(let i=0;i<this.files.length;i++) {
           if (this.files[i].type === null) {//type字段为null,说明为文件夹
              if (this.newFolderName === this.files[i].name){
                 flag++;
              }
           }
         }
         //console.log(this.files[1]);
         if(flag===1){
           alert("存在同名文件夹");
         }else{
           //alert("可以创建");
           // {
           //     "token": "eabe00623c924cd6a6267eec187c2c11",
           //     "parentDirectID": "af0df5590ba54d67afb94468f5d61454",
           //     "directName": "lzh的秘密"
           // }
           let me=this;
           //1.处理token
           this.createFolderProgress=true;
           this.clickToNewFolder=true;
           this.closeCreateFolder=true;
           let a = sessionStorage.getItem('token');
           //let resultArray=[];
           let b =  a.substring(1,a.length-1);
           //2.parentDirectID:
           //me.breadcrumb_items[me.breadcrumb_items.length-1].id,
           //3.directName:文件夹名称
           this.axios.post('/cloud/user/newDirectory',{
             token:b,
             parentDirectID:this.breadcrumb_items[this.breadcrumb_items.length-1].id,
             directName:this.newFolderName
           }).then(function (response){
             console.log(response);
             me.createFolderProgress=false;
             me.clickToNewFolder=false;
             me.closeCreateFolder=false;
             alert('新建文件夹成功');
             while(me.breadcrumbNum!=1){
               me.breadcrumb_items.pop();
               me.breadcrumbNum--;
             }
             me.breadcrumb_items[0].disabled=true;
             me.loading=true;
             me.axios.post('/cloud/user/userCatalogue',{
               token:b
             }).then(function (response) {
               console.log(response.data.data);
               if(response.data.data!=null){
                 me.item= response.data.data;
                 me.breadcrumb_items[0].id=response.data.data.directID;
                 //console.log( 'fuck');
                 //console.log( me.item);
                 me.files = me.dataSolver(me.item);
                 me.loading=false;
                 // this.createFolderProgress=false;
                 // this.clickToNewFolder=false;
                 // this.closeCreateFolder=false;
               }
               // console.log(response.data.data);
             }).catch(function (error) {
               console.log(error);
             });
           }).catch(function (error){
             console.log(error);
           })
         }
      }
    },
    moreOption(item){
      // console.log(item);
      // this.optionItem=item;
      if(item.title==='移动到'){
        //alert('移动到');
        this.folderTreeLock(this.viewFolder);
        this.moveDialog=true;
      }else if(item.title==='复制到'){

        this.copyDialog=true;
      }else{
        //alert('重命名');
        //this.optionItem=item;
        this.renameDialog = true
      }
    },
    download(){
      //console.log(this.selected);
      let a = sessionStorage.getItem('token');
      //let resultArray=[];
      let b =  a.substring(1,a.length-1);
      let me = this;
      if(this.selected.length===0){
        alert("请勾选待下载的文件");
      }else{
        let downloadFile = this.selected[0];
        if(downloadFile.type===null){
          alert("暂不支持下载文件夹！");

        }else{
          //alert("下载文件"+downloadFile.name);
          // {
          //   token:
          //   directID:       //文件夹ID
          //   fileID:       //文件ID
          // }
          this.axios.post('/cloud/user/download',{
            token:b,
            directID:me.breadcrumb_items[me.breadcrumb_items.length-1].id,
            fileID:downloadFile.id
          }).then(function (response){
            console.log(response.data.data.data);
            window.open(response.data.data.data);
          }).catch(function (error){
            console.log(error);
          });
          console.log(downloadFile);
        }
      }

    },
    moveFile(item){//移动文件/文件夹
      //需要判断当前文件夹是否有同名文件
      //item.id--->目标文件夹id
      //this.optionItem.name--->要移动的文件/文件夹名称
      //this.optionItem.type--->要移动的文件类型
      //过程：1.通过目标文件夹id在文件树中找到对应文件夹的json，格式如下：
      // {
      //   directID:''         //文件夹ID
      //   name:'四大名著',		//文件夹名称
      //   size:,			//为了方便，文件夹大小不做计算，如果后台传来更好
      //   modificationDate:'2020-01-01'	//上传时间
      //   includeDirects:[]
      //   includeFiles:[]      //包含文件，此处可忽略
      // }
      //    2.在includeDirects/includeFiles里面找是否有同名同类型文件/文件夹
      //      判断文件依据：type是否为undefined
      //        移动的是文件:在includeFiles里找，同名同类型就是相同文件
      //        移动的是文件夹:在includeDirects里找，同名就是相同文件夹
      //过程1实现如下:
      let a = [];
      this.findFolder=[];
      a.push(this.item);
      this.findFolderMethod(item.id,a);
      let token = sessionStorage.getItem('token');
      //let resultArray=[];
      let b =  token.substring(1,token.length-1);
      //console.log(this.findFolder);
     // console.log(item);
      //过程2实现如下:
      // let b= this.findFolder[0].includeDirects;
      // console.log(b);
      //console.log(this.findFolder.includeFiles.length);
      let flag = 0;
      //console.log(this.optionItem.type);
      if(this.optionItem.type===null){
          //文件夹判断同名
        for(let i=0;i<this.findFolder[0].includeDirects.length;i++){
          if(this.optionItem.name===this.findFolder[0].includeDirects[i].name){
            //console.log(this.findFolder[0].includeDirects[i].name);
                flag++;
          }
        }
      }else{
          //文件判断同名
        for(let i=0;i<this.findFolder[0].includeFiles.length;i++){
          if(this.optionItem.name===this.findFolder[0].includeFiles[i].name&&this.optionItem.type===this.findFolder[0].includeFiles[i].type){
            flag++;
          }
        }
      }
      //alert(flag);
      if(flag === 1){
          alert("存在同名文件/文件夹！");
      }else{
        this.moveProgress=true;
        this.chooseFolder=true;
        if(this.optionItem.type!==null){
          let me = this;

            this.axios.post('/cloud/user/movefile',{
              token:b,
              newDirectID:item.id,
              fileID:this.optionItem.id
            }).then(function (response){
              console.log(response);
              if(response.data.status===200){
                alert("移动成功！");
                me.Refresh();
                me.moveProgress=false;
                me.moveDialog=false;
              }
            }).catch(function (error){
              console.log(error);
            })
          console.log(this.optionItem.type);
        }else{
          //alert("移动文件夹!");
          // {
          //   "token":"c88f4abaa675463787f2b3d2cc91d891",
          //     "newDirectID":"05dc4ebf6fa44c709485ccb881eb3a6e",
          //     "directID":"1"
          // }
          let me = this;
          this.axios.post('/cloud/user/movedirectfile',{
            token:b,
            newDirectID:item.id,
            directID:this.optionItem.id
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert("移动成功！");
              me.Refresh();
              me.chooseFolder=false;
              me.moveProgress=false;
              me.moveDialog=false;
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
    rename(){
      if(this.renameFileName===''){
        this.renameAlert=true;
        this.renameMessage="文件名不能为空";
      }else {
        console.log(this.optionItem);
        if(this.optionItem.type===null){//文件夹重命名
          //需要进行同目录同名检验
          let flag = 0;
          for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].type === null) {//type字段为null,说明为文件夹
              if (this.renameFileName === this.files[i].name) {
                flag++;
              }
            }
          }
          //console.log(this.files[1]);
          if (flag === 1) {
            alert("存在同名文件夹");
          }else{
            //alert("可以重命名");
            // {
            //   "token":"c88f4abaa675463787f2b3d2cc91d891",
            //     "directID":"1",
            //     "fileID":"1",
            //     "newName":"新的命名"
            // }
            let a = sessionStorage.getItem('token');
            //let resultArray=[];
            let b =  a.substring(1,a.length-1);
            let me = this;
            this.axios.post('/cloud/user/redefilename',{
              token:b,
              directID:this.optionItem.id,
              newName:this.renameFileName
            }).then(function (response){
              console.log(response);
              if(response.data.status===200){
                alert('重命名成功！');
                console.log(response.data);
                me.loading=true;
                while(me.breadcrumbNum!=1){
                  me.breadcrumb_items.pop();
                  me.breadcrumbNum--;
                }
                me.breadcrumb_items[0].disabled=true;
                me.axios.post('/cloud/user/userCatalogue',{
                  token:b
                }).then(function (response) {
                  console.log(response.data.data);
                  if(response.data.data!=null){
                    me.item= response.data.data;
                    me.breadcrumb_items[0].id=response.data.data.directID;
                    //console.log( 'fuck');
                    //console.log( me.item);
                    me.files = me.dataSolver(me.item);
                    me.loading=false;
                    me.renameDialog=false;
                    // this.createFolderProgress=false;
                    // this.clickToNewFolder=false;
                    // this.closeCreateFolder=false;
                  }
                  // console.log(response.data.data);
                }).catch(function (error) {
                  console.log(error);
                });
              }
            }).catch(function (error){
              console.log(error);
            })

          }
        }else{//文件重命名
          let flag = 0;
          for(let i=0;i<this.files.length;i++){
            if(this.files[i].type !== null){
              //console.log(this.renameFileName+"."+this.optionItem.type);
              let name=this.renameFileName+"."+this.optionItem.type;
              //console.log(this.files[i].name);
              if(name === this.files[i].name){
                flag++;
              }
            }
          }
          if (flag !== 0) {
            alert("存在同名文件");
          }else{
           // alert("可以重命名");
            //this.renameFileName+"."+this.optionItem.type
            let a = sessionStorage.getItem('token');
            //let resultArray=[];
            let b =  a.substring(1,a.length-1);
            let me = this;
            this.axios.post('/cloud/user/refilename',{
              token:b,
              directID:this.breadcrumb_items[this.breadcrumb_items.length-1].id,
              fileID:this.optionItem.id,
              newName:this.renameFileName+"."+this.optionItem.type
            }).then(function (response){
              console.log(response);
              if(response.data.status===200){
                alert('重命名成功！');
                console.log(response.data);
                while(me.breadcrumbNum!=1){
                  me.breadcrumb_items.pop();
                  me.breadcrumbNum--;
                }
                me.breadcrumb_items[0].disabled=true;
                me.loading=true;
                me.axios.post('/cloud/user/userCatalogue',{
                  token:b
                }).then(function (response) {
                  console.log(response.data.data);
                  if(response.data.data!=null){
                    me.item= response.data.data;
                    me.breadcrumb_items[0].id=response.data.data.directID;
                    //console.log( 'fuck');
                    //console.log( me.item);
                    me.files = me.dataSolver(me.item);
                    me.loading=false;
                    me.renameDialog=false;
                    // this.createFolderProgress=false;
                    // this.clickToNewFolder=false;
                    // this.closeCreateFolder=false;
                  }
                  // console.log(response.data.data);
                }).catch(function (error) {
                  console.log(error);
                });
              }
            }).catch(function (error){
              console.log(error);
            })
          }
        }
      }
    },
    shareButton(item){
      console.log(item);
      this.shareFile=item;
    },
    share(item){
      console.log(item);
      //this.shareFile=item;
      let me = this;
      let a = sessionStorage.getItem('token');
      //let resultArray=[];
      let b =  a.substring(1,a.length-1);
      if(item.title==='私密分享'){
       // alert('私密分享');
       // console.log(this.shareFile.type);
       //  if(this.shareFile.type===null){
       //    alert('暂不支持分享文件夹');
       //  }else{
          //this.shareFile=item;
          console.log('分享文件');
          console.log(this.shareFile);
          this.shareToWho=[];
          this.axios.post('/cloud/user/showUserForShare',{
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
                  me.shareToWho.push(obj);
                }
              }
            }
          }).catch(function (error){
            console.log(error);
          })
          this.privateShareDialog=true;

        //}

      }else{
        if(this.shareFile.type===null){
          alert('暂不支持文件夹外链分享!');
        }else{
          alert('可以外链分享');
        }

        // {
        //     "token": "eabe00623c924cd6a6267eec187c2c11",
        //     "newDirectID": "1",
        //     "fileID": "1",
        //     "shareTime": "3600",
        //     "code": "1234"
        // }
      }
    },
    privateShare(){
      // {
      //   "token": "fb1ec2efa1734e0da0cd486db363f8b5",
      //     "directID": "1",       //面包屑
      //     "fileID":"1",        //this.shareFile.id
      //     "shareTime": "3600",   //this.privateShareDays*60*60*24
      //     "users": [
      //   1,
      //   2
      // ]
      // }
      if(this.shareToValue.length===0){
        alert('请选择私密分享给的用户！');
      }else if(this.privateShareDays===null){
        alert('请选择分享时间！');
      }else{
         let me = this;
         let a = sessionStorage.getItem('token');
        // //let resultArray=[];
         let b =  a.substring(1,a.length-1);
        //console.log(this.shareToValue);
        //用户数组
        let userIDArray=[];
        for(let i=0;i<this.shareToValue.length;i++){
          userIDArray.push(this.shareToValue[i].userID);
        }
        console.log(userIDArray);
        //分享时间（秒）
        //console.log()
        let shareTime = this.privateShareDays*60*60*24;
        if(this.shareFile.type===null){//分享的是文件夹
          //alert('文件夹');
          this.axios.post('/cloud/user/privateShare',{
            token:b,
            directID:this.shareFile.id,
            shareTime:shareTime,
            users:userIDArray
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert('分享成功!');
              me.shareToValue=[];
              me.privateShareDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
        }else{
          this.axios.post('/cloud/user/privateShare',{
            token:b,
            directID:this.breadcrumb_items[this.breadcrumb_items.length-1].id,
            fileID:this.shareFile.id,
            shareTime:shareTime,
            users:userIDArray
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert('分享成功!');
              me.shareToValue=[];
              me.privateShareDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
        }

      }
    },
    copyFile(item){
      let a = [];
      this.findFolder=[];
      a.push(this.item);
      this.findFolderMethod(item.id,a);
      let token = sessionStorage.getItem('token');
      let b =  token.substring(1,token.length-1);
      let flag = 0;
      if(this.optionItem.type===null){
        //文件夹判断同名
        for(let i=0;i<this.findFolder[0].includeDirects.length;i++){
          if(this.optionItem.name===this.findFolder[0].includeDirects[i].name){
            //console.log(this.findFolder[0].includeDirects[i].name);
            flag++;
          }
        }
      }else{
        //文件判断同名
        for(let i=0;i<this.findFolder[0].includeFiles.length;i++){
          if(this.optionItem.name===this.findFolder[0].includeFiles[i].name&&this.optionItem.type===this.findFolder[0].includeFiles[i].type){
            flag++;
          }
        }
      }
      //alert(flag);
      if(flag === 1){
        alert("存在同名文件/文件夹！");
      }else{
        this.copyProgress=true;
        this.chooseFolder=true;
        if(this.optionItem.type!==null){
          //alert('复制文件');
          let me = this;
          this.axios.post('/cloud/user/copyfile',{
            token:b,
            newDirectID:item.id,
            fileID:this.optionItem.id
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert("复制成功！");
              me.Refresh();
              me.chooseFolder=false;
              me.copyProgress=false;
              me.copyDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
          console.log(this.optionItem.type);
        }else{
          //alert("文件夹复制检修中!");
          // {
          //   "token":"c88f4abaa675463787f2b3d2cc91d891",
          //     "newDirectID":"05dc4ebf6fa44c709485ccb881eb3a6e",
          //     "directID":"1"
          // }
          let me = this;
          this.axios.post('/cloud/user/movedepartdirectfile',{
            token:b,
            newDirectID:item.id,
            directID:this.optionItem.id
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              alert("复制成功！");
              me.Refresh();
              me.copyProgress=false;
              me.chooseFolder=false;
              me.copyDialog=false;
            }
          }).catch(function (error){
            console.log(error);
          })
        }
      }
    }
  }
}
</script>
