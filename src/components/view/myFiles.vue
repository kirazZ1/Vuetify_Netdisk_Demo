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
          <v-breadcrumbs :items="breadcrumb_items"></v-breadcrumbs>
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
          {{ item.name }}
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
          disabled: false,
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
      files:[     //文件信息json格式
        {
            name:'西游记',
            size:'10M',
            modificationDate:'2020-01-01'
        },
        {
          type:'pdf',
          name:'西游记',
          size:'10M',
          modificationDate:'2020-01-01'
        },
        {
          type:'pdf',
          name:'西游记',
          size:'10M',
          modificationDate:'2020-01-01'
        },
        {
          type:'pdf',
          name:'西游记',
          size:'10M',
          modificationDate:'2020-01-01'
        },
        {
          type:'txt',
          name:'西游记',
          size:'10M',
          modificationDate:'2020-01-01'
        },
        {
          type:'txt',
          name:'西游记',
          size:'10M',
          modificationDate:'2020-01-01'
        },
      ],
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

    }
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
    }
  }
}
</script>
