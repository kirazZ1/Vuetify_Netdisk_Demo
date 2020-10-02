<template>
  <div>
<!--    <p>回收站</p>-->
    <div class="ma-1 pa-1" ></div>
    <v-container >
    <v-card elevation="0">
      <v-row>
        <div class="ma-1 pa-1" ></div>


        <div class="ma-1 pa-1" >
          <v-btn  color="primary">
            <v-icon dark left>{{ button1.icon }}</v-icon>
            还原
          </v-btn>
        </div>
        <div class="ma-1 pa-1" >
          <v-btn  color="primary">
            <v-icon dark left>{{ button2.icon }}</v-icon>
            永久删除
          </v-btn>
        </div>
      </v-row>
    </v-card>
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
            ></v-data-table>
          </v-card>
        </v-card>
    </v-container>
  </div>
</template>
<script>
import {
  mdiBackupRestore,
  mdiTrashCanOutline
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
      deleteFiles:[],
      selected:[],
      singleSelect:true,
    // {
    //   "deleteTime": "2020-10-02T05:33:17.000+0000",
    //     "name": "zzzz",
    //     "id": "7d131542dce24d848a77b49a939f18b5",
    //     "type": 1
    // },
    }
  }
}
</script>
