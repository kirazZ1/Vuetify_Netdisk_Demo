<template>
  <div>

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
                    <v-btn  color="primary" ><v-icon>{{button2.icon}}</v-icon>下载</v-btn>
              </div>
              <div class="ma-1 pa-1">
                <v-btn  color="primary"  @click="Refresh()"><v-icon>{{button4.icon}}</v-icon>刷新</v-btn>
              </div>
              <div class="ma-1 pa-1">
                     <v-btn v-show="newFolderButton"  @click="newFolderDialog=true" color="primary"><v-icon>mdi-plus</v-icon>新建文件夹</v-btn>
              </div>


            </v-row>
          </v-col>

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
            <v-card-title>
              <span class="headline">上传文件</span>
            </v-card-title>
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
              <v-btn color="blue darken-1" text @click="uploadDialog = false">关闭</v-btn>
              <v-btn color="blue darken-1" text @click="uploadFile()">上传</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!--        <v-alert-->
<!--            v-model="uploadAlert"-->
<!--            dismissible-->
<!--            type="error"-->
<!--            border="left"-->
<!--            elevation="2"-->
<!--            colored-border-->
<!--            transition="scale-transition"-->
<!--        >-->
<!--          {{uploadMessage}}-->
<!--        </v-alert>-->
        <v-dialog
            v-model="newFolderDialog"
            persistent max-width="600px"
        >
        <v-card>
          <v-card-title>
            <span class="headline">新建文件夹</span>
          </v-card-title>
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
            <v-btn color="blue darken-1" text @click="newFolderDialog = false">关闭</v-btn>
            <v-btn color="blue darken-1" text @click="newFolder()">创建</v-btn>
          </v-card-actions>
        </v-card>
        </v-dialog>
        <v-dialog
            v-model="infoDialog"
            max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">文件详情</span>
            </v-card-title>
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

      <v-row>

          <v-breadcrumbs :items="breadcrumb_items" v-show="showBreadcrumb">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                  :href="item.href"
                  large
              >
                <v-btn text x-large color="primary"  :disabled="item.disabled" @click="breadcrumb(item)">{{ item.text }} </v-btn>

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
      <v-data-table
          v-model="selected"
          :headers="headers"
          :items="files"
          :single-select="singleSelect"
          item-key="name"
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
          <v-btn text @click="clickFile(item)"> {{ item.name }}</v-btn>

        </template>

        <!--操作按钮-->
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
          <v-icon
              medium
              v-bind="attrs"
              v-on="on"
              @click="shareItem(item)"
          >
            mdi-share
          </v-icon>
            </template>
            <span>分享文件</span>
          </v-tooltip>


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
          <v-menu  transition="scale-transition">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                    <v-icon
                        medium
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
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

              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </template>

      </v-data-table>
    </v-container>
  </div>
</template>
<script>
//import Bus from '../common/bus.js'  //父子组件通信
import {
  mdiCloudUpload,
  mdiCloudDownload,

  mdiRefresh
} from '@mdi/js'    //导入图标

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
      //upload:null,
      uploadFileName:'',
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
      singleSelect: false,    //表格单选
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
      filesIcon: {
        //文件类型对应图标
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      item:{//后台返回给前台的文件数据
          directID:'',        //文件夹ID
          name:'四大名著',		//文件夹名称
          size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
          modificationDate:'2020-01-01',	//上传时间
          includeDirects:[
            {
              directID:'20001',        //文件夹ID
              name:'阅读笔记',		//文件夹名称
              size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
              modificationDate:null,	//更新时间感觉文件夹也没啥必要，如果后台传实际值也能显示
              includeDirects:[],
              includeFiles:[	//嵌套文件
                {
                  fileID:'10008',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观水浒传有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                },
                {
                  fileID:'10007',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观红楼梦有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                }
              ]
            },
            {
              directID:'20002',        //文件夹ID
              name:'阅读笔记2',		//文件夹名称
              size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
              modificationDate:null,	//更新时间感觉文件夹也没啥必要，如果后台传实际值也能显示
              includeDirects:[
                {
                  directID:'20003',        //文件夹ID
                  name:'阅读笔记2',		//文件夹名称
                  size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
                  modificationDate:null,	//更新时间感觉文件夹也没啥必要，如果后台传实际值也能显示
                  includeDirects:[],
                  includeFiles:[	//嵌套文件
                    {
                      fileID:'10009',						//文件ID 用于后续操作
                      type:'pdf',						//文件类型
                      name:'观水浒传有感',		 			//文件名
                      size:'10M',						//文件大小
                      modificationDate:'2020-01-01'	//更新时间
                    },
                    {
                      fileID:'10010',						//文件ID 用于后续操作
                      type:'pdf',						//文件类型
                      name:'观红楼梦有感',		 			//文件名
                      size:'10M',						//文件大小
                      modificationDate:'2020-01-01'	//更新时间
                    }
                  ]
                }
              ],
              includeFiles:[	//嵌套文件
                {
                  fileID:'10005',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观水浒传有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                },
                {
                  fileID:'10006',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观红楼梦有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                }
              ]
            }
          ],
          includeFiles:[				//文件夹内的内容，文件夹内可以嵌套文件夹
            {
              fileID:"10001",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'西游记',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },
            {
              fileID:"10002",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'红楼梦',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },
            {
              fileID:"10003",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'三国演义',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },
            {
              fileID:"10004",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'水浒传',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },

          ],

        },
      //uploadFile:null,
      formData:null,
      uploadMessage:'',
      uploadAlert:false,
      fileInfo:
      {
            id:'',
            type:'',						//文件类型
            name:'',		 			//文件名
            size:'',						//文件大小
            modificationDate:''	//更新时间
      }
      ,
      infoDialog:false,
      newFolderDialog:false,
      newFolderName:''
    }
  },

  beforeMount() {
    //this.files=this.receiveFiles;
    this.files = this.dataSolver(this.item);
  },

  methods:{
    //编辑每页显示几条数据
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
    },
    //删除文件
    deleteItem (item) {
      console.log(item);
      // const index = this.files.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
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
    parseTreeJson(item){//对json树进行遍历获取根节点（递归实现）item-传入的json字符串数组(后台发来的，未经过处理的json字符串，需要用数组包装后调用)
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
    },
    shareItem(item){
      console.log(item);
      console.log(this.selected);
    },
    uploadFile(){
      console.log(document.querySelector("#upload").files[0]);//----无文件时为undefined
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
        console.log(type);
        let flag=0;
        for(let i=0;i<this.files.length;i++){
          if(this.uploadFileName===this.files[i].name&&type===this.files[i].type){
               flag++;
          }
        }
        if(flag===0){
          alert("可以上传");
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
           alert("可以创建");
         }
      }
    }

  }
}
</script>
