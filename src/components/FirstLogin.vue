<template>

  <v-app id="inspire">
    <v-app id="inspire">
      <Topbar/>

      <v-main>
<!--        警告提示框-->
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

        >
          <v-subheader>登录/首次登陆</v-subheader>

          <v-stepper v-model="e6" vertical>
            <v-stepper-step :complete="e6 > 1" step="1">
              确认您的手机号
            </v-stepper-step>

            <v-stepper-content step="1">
<!--              <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>-->
              <v-text-field
                  v-model="userPhone"
                  label="您的手机号"
                  disabled
              ></v-text-field>
              <v-btn color="primary" @click="firstStep()">下一步</v-btn>

            </v-stepper-content>

            <v-stepper-step :complete="e6 > 2" step="2" :rules="[() => !stepAlert]">输入您收到的6位手机验证码</v-stepper-step>

            <v-stepper-content step="2" >
              <v-text-field
                  v-model="checkNum"
                  :counter="6"
                  label="请输入验证码"
              ></v-text-field>
              <v-btn color="primary" @click="secondStep()">下一步</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="e6 > 3" step="3" :rules="[() => !stepAlert2]">设置您的新密码</v-stepper-step>

            <v-stepper-content step="3">
              <v-row>
                <v-col
                    cols="12"
                    md="9"

                >


                  <v-text-field
                      v-model="password1"
                      label="请输入新密码"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      :rules="[rules.required, rules.min]"
                      @click:append="show1 = !show1"
                  ></v-text-field>
                  <v-text-field
                      v-model="password2"
                      label="请再次输入新密码"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      name="input-10-1"
                      :rules="[rules.again, rules.same]"
                      @click:append="show2 = !show2"
                  ></v-text-field>


                </v-col>
                <v-col
                    cols="6"
                    v-show="checkPasswordSecurity"
                    md="3"
                >
                  <v-subheader>密码强度: {{ PasswordSecurityDescription }}</v-subheader>
                  <v-card
                      class="pa-2"
                      max-width="200px"

                      tile
                  >


                    <v-progress-linear
                        background-color="grey"
                        :color="progressColor"
                        :value="progress"
                    ></v-progress-linear>
                  </v-card>
                </v-col>
              </v-row>
              <v-btn color="primary" @click="thirdStep()">完成</v-btn>

            </v-stepper-content>


          </v-stepper>

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
import Topbar from "./common/Topbar";//引入Topbar组件（顶栏）
export default {
  components:{
    Topbar
  },
  data () {
    return {
      stepAlert:false,
      stepAlert2:false,
      show1: false,
      show2: false,
      e6: 1,
      userPhone:'15815013212',//暂存手机号
      alert:false,
      message:'',
      checkNum:'',
      password1:'',
      password2:'',
      PasswordSecurityDescription:'',
      progress:0,
      checkPasswordSecurity:false,
      progressColor:'',
      rules: {    //校验规则
        required: value => !!value || '密码不能为空',
        min: v => (v.length >=6 && v.length <=14) || '密码长度应为6-14位',
        again:v => !!v || '请再次输入密码！',
        same: v => (v===this.password1)|| '两次密码不一致' ,
      },

    }
  },

  //根据输入密码来控制密码强度提示框的显示以及情况
  updated() {
    if(this.password1.length <6 || this.password1.length >14){
        this.checkPasswordSecurity=false;

    }else{
      this.checkPasswordSecurity=true;
      let modes = 0;
      //正则表达式验证密码强度
      if (/\d/.test(this.password1)) modes++; //数字
      if (/[a-z]/.test(this.password1)) modes++; //小写
      if (/[A-Z]/.test(this.password1)) modes++; //大写
      if (/\W/.test(this.password1)) modes++; //特殊字符
      //根据mode的情况对视图进行调整
      switch (modes){

        case 1:
          this.PasswordSecurityDescription='弱';
          this.progressColor='red'
          this.progress=25;
          break;
        case 2:
          this.PasswordSecurityDescription='中';
          this.progressColor='yellow'
          this.progress=50;
          break;
        case 3:
          this.PasswordSecurityDescription='强';
          this.progressColor='lime'
          this.progress=75;
          break;
        case 4:
          this.PasswordSecurityDescription='极强';
          this.progressColor='green accent-4'
          this.progress=100;
          break;
      }
    }
  },
  methods: {
    firstStep() {
      //发送请求验证码  调用sendNum
      //如果正常进入步骤二
      this.e6= 2;
    },
    secondStep(){
      if(this.checkNum===''){
        this.alert=true;
        this.message="验证码不能为空！";
        this.stepAlert=true;
      } else if(this.checkNum.length!==6){
        this.alert=true;
        this.message="输入的验证码长度不对，请重新输入！";
        this.stepAlert=true;
      }else{
        //发送验证码去后端校验
        this.stepAlert=false;
        this.alert=false;
        this.e6= 3;
      }
    },
    sendCheckNum(){
      //发送请求给后端发验证码
    },
    thirdStep(){
      //把手机号和新密码发后端进行密码修改
      if(this.password1!==this.password2){
        this.stepAlert2=true;
        alert("两次输入密码不一致!");
      }else if(this.password1.length<6||this.password1.length>14){
        this.stepAlert2=true;
        alert("密码长度不符合要求，请重新输入!");
      }else{
        //把手机号和新密码发后端进行密码修改
        this.stepAlert2=false;
        alert("成功");
      }
    }
  },
  name: "FirstLogin"
}
</script>