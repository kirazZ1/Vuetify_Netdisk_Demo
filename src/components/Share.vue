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
              <v-dialog v-model="dialog" persistent max-width="400">
                <v-alert
                    v-model="alert"
                    dismissible
                    type="error"
                    border="left"
                    elevation="2"
                    colored-border
                    transition="scale-transition"
                >
                  {{ message }}
                </v-alert>
                <v-card>
                <v-toolbar
                    color="light-blue darken-4"
                    dark
                    flat
                >
                  <v-toolbar-title>登 录</v-toolbar-title>

                  <v-spacer></v-spacer>
                  <v-tooltip bottom>

                  </v-tooltip>
                </v-toolbar>


                  <v-card-text>
                    <v-text-field
                        label="账号"
                        name="id"
                        v-model="id"
                        :rules="idRules"
                        prepend-icon="mdi-account"
                        type="text"
                    ></v-text-field>
                    <v-text-field
                        id="password"
                        label="密码"
                        name="password"
                        v-model="password"
                        :rules="passwordRules"
                        prepend-icon="mdi-lock"
                        type="password"
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>

                    <!--登录按钮颜色-color-->
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="Login(id,password)">登 录</v-btn>
                    <v-btn text small color="primary" @click="ForgetPassword()">忘记密码</v-btn>


                  </v-card-actions>
                </v-card>
              </v-dialog>
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
                  <h2>xxx给您分享了文件</h2>

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
                  <v-btn color="primary" @click="Login(id,password)">提 交</v-btn>



                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

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
  beforeMount() {
    if(this.$route.query.id===undefined){

      // this.$router.push({  //核心语句
      //   path: '/login',   //跳转的路径
      // })
      this.$router.replace({path:'/login'})
    }else{
      console.log(sessionStorage.getItem('token'));
      if(sessionStorage.getItem('token')==null){
        console.log(1);
        this.dialog=true;
      }else{
        console.log(2);
        this.dialog=false;
      }
    }

    //console.log()
  },
  data(){
    return {
      shareID:this.$route.query.id,
      dialog:false,
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
    }

  },
  methods:{
    Login(id,password){
      //alert(id);
      let me=this;
      if(id==null){
        me.message = '账号不能为空！';
        me.alert = true
        console.log(sessionStorage.getItem('token'));
      }else if(password==null){
        me.message = '密码不能为空！';
        me.alert = true
        console.log(sessionStorage.getItem('token'));
      }
      else {

        this.axios.post('/cloud/login', {
          userName: id,
          userPassword: password
        }).then(function (response) {

          console.log(response.data);
          if (response.data.data != null) {
            sessionStorage.setItem("token", JSON.stringify(response.data.data.token));
            console.log(sessionStorage.getItem('token'));
            sessionStorage.setItem("firstLogin", JSON.stringify(response.data.data.firstLogin));
            sessionStorage.setItem("permission", JSON.stringify(response.data.data.permission));
            //me.loginDash();
            me.dialog=false;
            //console.log(parseInt(sessionStorage.getItem('firstLogin')));
          }else {
            me.message = '您的账号或密码有误，请重新输入';
            me.alert = true
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    ForgetPassword(){
      //alert("忘记密码")
      let me=this;
      me.$router.push({  //核心语句
        path: '/forgetPassword',   //跳转的路径
      })
    }
  }
}
</script>
<style scoped>
#inspire{
  background-image: url("../assets/login1.png");
  background-size: cover;
}
</style>