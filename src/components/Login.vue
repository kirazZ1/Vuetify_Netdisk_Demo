<template>
  <v-app id="inspire">
    <v-app id="inspire">
      <Topbar/>

      <v-main>
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
                  <v-toolbar-title>登 录</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>

                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <!--rules指定对应区域校验规则-->
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
                  </v-form>
                </v-card-text>
                <v-card-actions>

                  <!--登录按钮颜色-color-->
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="Login(id,password)">登 录</v-btn>

                  <v-btn text small color="primary" @click="ForgetPassword()">忘记密码</v-btn>


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
import Topbar from "./common/Topbar";


export default {
  name: "Login",
  components: {
    Topbar,
  },
  inject:['loginDash'],
  data: () => ({
    valid: true,
    id: null,
    idRules: [
      v => !!v || '账号不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',  //正则验证，不符合正则，则输入框下方以红色字体显示'Name must be less than 10 characters'
    ],
    password: null,
    passwordRules: [
      v => !!v || '密码不能为空！',
      //也可以使用对象的形式，返回错误信息

    ],
    alert:false,
    message:null
  }),
  methods:{
    Login(id,password){
      //alert(id);
      var me=this;
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

        this.axios.post('/api/login', {
          userName: id,
          userPassword: password
        }).then(function (response) {

          console.log(response);
          if (response.data.token != null) {
            sessionStorage.setItem("token", JSON.stringify(response));
            console.log(sessionStorage.getItem('token'));

            me.loginDash();
          } else {
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
