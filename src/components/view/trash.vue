<template>
  <div>
<!--    <p>回收站</p>-->
    <div class="ma-1 pa-1" ></div>
    <v-container >
    <v-card elevation="0">
      <v-row>
        <div class="ma-1 pa-1" ></div>


        <div class="ma-1 pa-1" >
          <v-btn  color="primary" @click="recoverFiles()">
            <v-icon dark left>{{ button1.icon }}</v-icon>
            还原
          </v-btn>
        </div>
        <div class="ma-1 pa-1" >
          <v-btn  color="primary" @click="deleteForever()">
            <v-icon dark left>{{ button2.icon }}</v-icon>
            永久删除
          </v-btn>
        </div>
      </v-row>
    </v-card>
      <v-dialog
          v-model="deleteForeverDialog"
          max-width="290"
      >
        <v-card>
          <v-card-title class="headline">确认永久删除?</v-card-title>
          <v-progress-linear
              :active="deleteProgress"

              indeterminate
              absolute
              bottom
              color="deep-purple accent-4"
          ></v-progress-linear>
          <v-card-text>
            确认永久删除之后，您将无法再次从回收站找回您的文件。
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                color="primary"
                text
                :disabled="cancelDelete"
                @click="deleteForeverDialog = false"
            >
              取消
            </v-btn>

            <v-btn
                color="primary"
                text
                :disabled="confirmDeleteForever"
                @click="readyToDelete()"
            >
              确认删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="chooseRecoverPathDialog"
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
            <v-toolbar-title>还原到</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>
          <v-progress-linear
              :active="chooseRecoverPathProgress"

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
                    :items="folderTree"
                    :open="open"
                    item-disabled="locked"

                >

                  <template v-slot:prepend="{ item, open }">
                    <v-icon>
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                  </template>
                  <template v-slot:append="{ item }">
                    <v-btn text color="primary" @click="recoverNewPath(item)" v-show="!item.locked" :disabled="choosePath">选择</v-btn>
                  </template>
                </v-treeview>
              </v-card>

              <!--                </v-treeview>-->
            </v-container>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="chooseRecoverPathDialog = false" :disabled="closeChooseRecoverPathDialog">关闭</v-btn>
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
                :items="deleteFiles"
                :single-select="singleSelect"
                no-data-text="回收站为空"

                item-key="id"
                show-select
                class="elevation-1"
            >
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
                <span>                {{ item.name }}</span>
                <!--          </v-btn>-->
              </template>

            </v-data-table>
          </v-card>
        </v-card>
    </v-container>
  </div>
</template>
<script>
import {
  mdiBackupRestore, mdiFileMusic, mdiFilePowerpoint, mdiFileVideo,
  mdiTrashCanOutline, mdiZipBox
} from '@mdi/js';
export default {
  name: "trash",
  beforeMount() {
    this.loading=true;
    let a = sessionStorage.getItem('token');
    //let resultArray=[];
    let me = this;
    let b =  a.substring(1,a.length-1);
    this.axios.post('/cloud/user/showRecycleBin',{
      token:b
    }).then(function (response){
      console.log(response);
      if(response.data.status===200){
        for(let i=0;i<response.data.data.length;i++){
          me.deleteFiles.push(response.data.data[i]);
        }
          me.loading=false;
      }

    }).catch(function (error){
      console.log(error);
    });
  },
  data(){
    return{
      button1:{icon:mdiBackupRestore},
      button2:{icon:mdiTrashCanOutline},
      loading:false,
      headers: [//表格标题
        {
          text: '文件名',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '类型', value: 'type' },

        { text: '删除时间', value: 'deleteTime' },
      ],
      open: ['public'],
      deleteFiles:[],
      selected:[],
      singleSelect:true,
      deleteForeverDialog:false,
      deleteProgress:false,
      cancelDelete:false,
      confirmDeleteForever:false,
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
      folderTree:[],
      chooseRecoverPathDialog:false,
      chooseRecoverPathProgress:false,
      choosePath:false,
      closeChooseRecoverPathDialog:false,
    // {
    //   "deleteTime": "2020-10-02T05:33:17.000+0000",
    //     "name": "zzzz",
    //     "id": "7d131542dce24d848a77b49a939f18b5",
    //     "type": 1
    // },
    }
  },
  methods:{
    readyToDelete(){
      //alert('确认删除');

      let flag = 0;
      if(this.selected[0].type===null){
        flag=1;
      }else{
        flag=2;
      }
      // {
      //   "token": "5a65508c8612474e994fd28d636a01f2",
      //     "type": "2",
      //     "id": "7c170b79b2084628ae8b9491a315756a"
      // }
      let me = this;
      this.deleteProgress=true;
      this.cancelDelete=true;
      this.confirmDeleteForever=true;
      let a = sessionStorage.getItem('token');
      let b =  a.substring(1,a.length-1);
      this.axios.post('/cloud/user/deleteForever',{
        token:b,
        type:flag,
        id:this.selected[0].id
      }).then(function (response){
          console.log(response);
        // if(response.data.status===200){
        me.deleteProgress=false;
        me.cancelDelete=false;
        me.confirmDeleteForever=false;

          alert('永久删除成功！');
        me.deleteFiles=[];
        me.deleteForeverDialog=false;
          me.loading=true;
          me.axios.post('/cloud/user/showRecycleBin',{
            token:b
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              for(let i=0;i<response.data.data.length;i++){
                me.deleteFiles.push(response.data.data[i]);
              }
              me.loading=false;
            }
          }).catch(function (error){
            console.log(error);
          });
        // }
      }).catch(function (error){
        console.log(error);
      })
    },
    deleteForever(){
      if(this.selected.length===0){
        alert('请勾选待删除文件!');
      }else{
        this.deleteForeverDialog=true;
      }
    },
    recoverFiles(){
      if(this.selected.length===0){
        alert('请勾选待还原文件!');
      }else{
        console.log(this.selected[0].type);
        console.log(this.selected[0].id);
         let flag = 0;
        if(this.selected[0].type===null){
          flag=1;
        }else{
          flag=2;
        }
        console.log(flag);
        // {
        //     "token": "99e15606e44b4f9090870889e303aea0",
        //     "type":"1",
        //     "id": "1"
        // }
        let me = this;
        let a = sessionStorage.getItem('token');
        let b =  a.substring(1,a.length-1);
        this.axios.post('/cloud/user/restore',{
          token:b,
          type:flag,
          id:this.selected[0].id
        }).then(function (response){
          console.log(response);
         if(response.data.status===601){
           //还原失败的情况，需要重新选择路径
           //需要什么？文件路径树.收到传来的文件路径并进行构造文件路径树传入组件
           //接口："/cloud/user/userCatalogue",传token就够
           //调用folderTreeBuild(response.data.data),由this.folderTree存放
           alert('源路径不存在，请重新选择路径！')
           me.axios.post('/cloud/user/userCatalogue',{
               token:b
           }).then(function(response){
             console.log(response.data);
             if(response.data.status===200){
               console.log(111);
               let array = [];
               array.push(response.data.data);
               me.folderTree=me.folderTreeBuild(array);
               me.chooseRecoverPathDialog=true;//选择新路径对话框此时打开
             }
           })
         }else if(response.data.status===200){//正常还原的情况
               alert('还原成功！');
               //进行列表刷新
               me.deleteFiles=[];
               me.loading=true;
               me.axios.post('/cloud/user/showRecycleBin',{
                   token:b
               }).then(function (response){
                   console.log(response);
                   if(response.data.status===200){
                       for(let i=0;i<response.data.data.length;i++){
                           me.deleteFiles.push(response.data.data[i]);
                       }
                    me.loading=false;
                   }
               }).catch(function (error){
                   console.log(error);
               });
           }
          }).catch(function (error){
            console.log(error);
          })

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
      let resultArray = [];
      for(let i=0;i<item.length;i++){
        if(item[i].type===undefined){//文件夹
          let obj ={
            id:null,    //文件夹id
            name:null,  //文件夹名称
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
    recoverNewPath(item){
      let flag = 0;
      if(this.selected[0].type===null){
        flag=1;
      }else{
        flag=2;
      }
      let me = this;
      let a = sessionStorage.getItem('token');
      let b =  a.substring(1,a.length-1);
      console.log(item);
      //item.id
      // {
      //   "token": "bc4e8cde0b7c4f7d97c7d6eec460e195",
      //     "type":"1",
      //     "id": "1",
      //     "directID":"b9117548583a4dbd9c0454dc53796900"
      // }
      this.axios.post('/cloud/user/restoreToNew',{
        token:b,
        type:flag,
        id:this.selected[0].id,
        directID:item.id
      }).then(function (response){
        console.log(response);
        if(response.data.status===200){
          alert('还原成功！');
          me.chooseRecoverPathDialog=false;
          //进行列表刷新
          me.deleteFiles=[];
          me.loading=true;
          me.axios.post('/cloud/user/showRecycleBin',{
            token:b
          }).then(function (response){
            console.log(response);
            if(response.data.status===200){
              for(let i=0;i<response.data.data.length;i++){
                me.deleteFiles.push(response.data.data[i]);
              }
              me.loading=false;
            }
          }).catch(function (error){
            console.log(error);
          });
        }
      }).catch(function (error){
        console.log(error);
      })
    }
  }
}
</script>
