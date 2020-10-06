<template>
  <v-app id="inspire">
    <v-app id="inspire">
      <Topbar/>
      <v-main>
<!--        <h1>{{ shareID }}</h1>-->

        <v-container
            class="fill-height"
            fluid
        >

          <v-row
              align="center"
              justify="center"
          >
            <v-col
                cols="12"
                sm="8"
                md="4"
            >
              <v-card class="elevation-12">
                <!--登录栏颜色-color-->
                <v-toolbar
                    color="light-blue darken-4"
                    dark
                    flat
                >
                  <v-toolbar-title>分 享</v-toolbar-title>

                  <v-spacer></v-spacer>
                  <v-tooltip bottom>

                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <h2>{{ shareName }}给您分享了文件</h2>

                  <small>请输入文件分享提取码：</small>
                  <v-form>
                    <!--rules指定对应区域校验规则-->



                    <v-text-field
                        name="code"
                        v-model="code"
                        :rules="codeRules"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        prepend-icon="mdi-lock"
                        :type="show1 ? 'text' : 'password'"
                        label="提取码"
                        hint="请输入4位提取码"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>

                  <!--登录按钮颜色-color-->
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="Check()">提 交</v-btn>



                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
          <v-toolbar
              color="light-blue darken-4"
              dark
              flat
          >
            <v-toolbar-title>分 享</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>

            </v-tooltip>
          </v-toolbar>

            <v-card>
              <v-data-table
                  :headers="headers"
                  :items="fileList"
                  no-data-text="群组列表为空"
                  item-key="id"
                  class="elevation-1"
                  hide-default-footer
              >
                <template v-slot:item.action="{item}">
                  <v-btn text x-large @click="download(item)" color="primary">下载</v-btn>
                </template>
              </v-data-table>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">关闭</v-btn>
              </v-card-actions>
            </v-card>


        </v-card>
      </v-dialog>
      <v-footer
          color="light-blue darken-4                                                                                                                                                                                                                                                                                                                                       4"
          app
      >
        <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </v-app>

</template>
<script>
import Topbar from "@/components/common/Topbar";

export default{
  name: "Login",
  components: {
      Topbar,
  },
  created() {
    if(this.$route.query.id===undefined){

      // this.$router.push({  //核心语句
      //   path: '/login',   //跳转的路径
      // })
      this.$router.replace({path:'/login'})
    }else{
      let me = this;
      this.axios.post('/cloud/getShareInfo',{
        shareID:this.$route.query.id
      }).then(function (response){
        console.log(response);
        if(response.data.status===200){
          me.checkCode=response.data.data.code;
          me.shareName=response.data.data.shareName;

        }else{
          alert('分享的文件不存在！');
          me.$router.replace({path:'/login'})
        }
      }).catch(function (error){
        alert('分享的文件不存在！');
        me.$router.replace({path:'/login'})
        console.log(error);
      })
      console.log(sessionStorage.getItem('token'));

    }
    //console.log()
  },
  data(){
    return {
      shareID:this.$route.query.id,
      id: null,
      idRules: [
        v => !!v || '账号不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
        v => (v && v.length <= 11) || 'Name must be less than 10 characters',  //正则验证，不符合正则，则输入框下方以红色字体显示'Name must be less than 10 characters'
      ],
      password: null,
      passwordRules: [
        v => !!v || '密码不能为空！',
        //也可以使用对象的形式，返回错误信息

      ],
      code:null,
      codeRules: [
        v => !!v || '提取码不能为空！',
        //也可以使用对象的形式，返回错误信息

      ],
      alert:false,
      message:null,
      show1: false,
      checkCode:'',
      shareName:'',
      dialog:false,
      headers: [      //表格标题
        {
          text: '文件名称',
          align: 'start',
          sortable: false,
          value: 'fileName',
        },
        { text: '分享时间', value: 'shareTime' },
        { text: '操作', value: 'action' },
      ],
      fileList:[]
    }

  },
  methods:{
    Check(){
      if(this.code!==this.checkCode){
        alert('提取码错误！请重新输入。');
      }else{
        // this.axios.post('')
        alert('提取码正确！');
        let me = this;
        this.axios.post('/cloud/publicVerifyCode',{
          shareID:this.$route.query.id,
          code:this.code
        }).then(function (response){
          //console.log(response);
        if(response.data.status===200){
          let obj={
            fileName:response.data.data.fileName,
            shareTime:response.data.data.shareTime,
            downloadURL:response.data.data.downloadURL
          }
            me.fileList.push(obj);
        }
        }).catch(function (error){
          console.log(error);
        })
        this.dialog=true;
      }
    },
    download(item){
      window.open(item.downloadURL);
    }
  },
}
</script>
<style scoped>
#inspire{
  background-image: url("../assets/login1.png");
  background-size: cover;
}
</style>