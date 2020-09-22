<template>
  <div>

    <v-container class="grey lighten-5">
      <v-row>
        <v-col md="5">
          <v-row

              class="grey lighten-5"
              style="height: 50px;"
          >
            <div class="ma-1 pa-1">
                 <v-btn  color="primary"><v-icon>{{button1.icon}}</v-icon>上传</v-btn>
            </div>
            <div class="ma-1 pa-1">
                  <v-btn  color="primary"><v-icon>{{button2.icon}}</v-icon>下载</v-btn>
            </div>
            <div class="ma-1 pa-1">
                   <v-btn  color="primary"><v-icon>mdi-plus</v-icon>新建文件夹</v-btn>
            </div>
            <div class="ma-1 pa-1">
              <v-btn  color="primary" @click="Refresh()"><v-icon>{{button4.icon}}</v-icon>刷新</v-btn>
            </div>
          </v-row>
        </v-col>
        <v-col
            md="2"
            offset-md="5"
        >
                  <v-text-field
                      v-model="preSearch"
                      color="primary  "
                      hide-details
                      style="max-width: 250px;"
                      clearable
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
      <v-row>
        <div>
          <v-breadcrumbs :items="breadcrumb_items">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                  :href="item.href"
              >
                <v-btn text large color="primary"  :disabled="item.disabled" @click="breadcrumb(item)">{{ item.text }} </v-btn>

              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>
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
              @click="deleteItem(item)"
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
import Bus from '../common/bus.js'  //父子组件通信
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
      preSearch:'',
      search: '',
      breadcrumb_items: [
        {
          text: '我的文件',
          disabled: true,
          href: '',
        },
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
      ],
      singleSelect: false,
      selected: [],//表格左边勾选选项（默认为空）
      headers: [
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
      breadcrumbNum:1,

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
      item:{
          directID:'',        //文件夹ID
          name:'四大名著',		//文件夹名称
          size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
          modificationDate:'2020-01-01',	//上传时间
          includeDirects:[
            {
              directID:'',        //文件夹ID
              name:'阅读笔记',		//文件夹名称
              size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
              modificationDate:null,	//更新时间感觉文件夹也没啥必要，如果后台传实际值也能显示
              includeDirects:[],
              includeFiles:[	//嵌套文件
                {
                  fileID:'',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观水浒传有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                },
                {
                  fileID:'',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观红楼梦有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                }
              ]
            },
            {
              directID:'',        //文件夹ID
              name:'阅读笔记2',		//文件夹名称
              size:null,			//为了方便，文件夹大小不做计算，如果后台传来更好
              modificationDate:null,	//更新时间感觉文件夹也没啥必要，如果后台传实际值也能显示
              includeDirects:[],
              includeFiles:[	//嵌套文件
                {
                  fileID:'',						//文件ID 用于后续操作
                  type:'pdf',						//文件类型
                  name:'观水浒传有感',		 			//文件名
                  size:'10M',						//文件大小
                  modificationDate:'2020-01-01'	//更新时间
                },
                {
                  fileID:'',						//文件ID 用于后续操作
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
              fileID:"",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'西游记',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },
            {
              fileID:"",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'红楼梦',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },
            {
              fileID:"",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'三国演义',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },
            {
              fileID:"",						//文件ID 用于后续操作
              type:'pdf',						//文件类型
              name:'水浒传',		 			//文件名
              size:'10M',						//文件大小
              modificationDate:'2020-01-01'	//更新时间
            },

          ]

        }

    }
  },
  // updated() {//搜索功能在这里执行
  //   if()
  //
  // },
  beforeMount() {
    //this.files=this.receiveFiles;
    this.dataSolver(this.item);
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
      //preSearch存放待查询数据,点击按钮触发函数进行查找操作（把数据用axios发送给后端）
    },
    //删除文件
    deleteItem (item) {
      const index = this.files.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },
    //刷新文件列表
    Refresh(){
      //alert("111");
      Bus.$emit('refresh_myFile', '重新加载视图部分组件');
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
        let breadcrumb ={"text": item.name,"disabled":true,"href":""} ;
        this.breadcrumb_items.push(breadcrumb);
        this.breadcrumbNum=this.breadcrumbNum+1;


        this.dataSolver(item.include);
        //console.log(item);
      }else{//其他文件
        alert(item.type);
      }
    },
    breadcrumb(item){
      //1.变更面包屑总数量以及显示
       while(item.text !== this.breadcrumb_items[this.breadcrumb_items.length - 1]['text']){
         let a = this.breadcrumb_items.pop();
         this.breadcrumbNum--;
         console.log(a);
       }
      //2.加载新的数据
       let fileList = this.item;
        this.breadcrumb_items[this.breadcrumb_items.length - 1]['disabled']=true;
       if(this.breadcrumbNum===1){       //如果返回我的文件，则显示初始内容
         // this.files=this.receiveFiles;
         this.dataSolver(this.item);
       }
      else{     //如果是其他层级的子文件夹，执行以下操作
         for(let i=1;i<this.breadcrumbNum;i++){  //i-面包屑层级索引，面包屑此时已经是最终状态，这里的目的是根据面包屑数据breadcrumb_items中的text项对文件夹进行逐级访问
             let folderName=this.breadcrumb_items[i]['text'];    //获取面包屑中文件名
           for(let j=0;j<=(fileList.length-1);j++){        //内层循环，主要用来匹配文件夹
             if(fileList[j]['name']===folderName){         //如果fileList[j]['name']===folderName，证明访问的路径经过当前文件夹
               fileList=fileList[j]['include'];            //把文件夹中的include付给暂存文件列表变量fileList
             }
           }
         }
         this.dataSolver(fileList);
      }
      // this.files=fileList;


      // let a = this.breadcrumb_items[this.breadcrumb_items.length - 1]['text'];
      // alert(a);
        //this.dataSolver(item.include);
      console.log(item);
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
        this.files=expectJson;
      }

    }
  }
}
</script>
