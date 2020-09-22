<template>
<!--  <h1>忘记密码（施工中）</h1>-->
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

        >
          <v-breadcrumbs :items="items" large></v-breadcrumbs>
          <br>

          <v-stepper v-model="e1">
            <!--步骤条-->
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1" :rules="[() => !stepAlert]">输入您的手机号</v-stepper-step>
              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2" :rules="[() => !stepAlert2]">验证手机验证码</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">设置新密码</v-stepper-step>
            </v-stepper-header>
              <!--  步骤内容-->
            <br>
            <v-stepper-items>
              <v-stepper-content step="1">

                  <v-form
                      ref="form"
                      lazy-validation
                  >
                    <v-text-field
                        v-model="userPhone"
                        :counter="11"
                        :rules="[rules.required, rules.min,rules.format]"
                        label="手机号"
                        required
                    ></v-text-field>


                  </v-form>
                <v-subheader>*请在上方输入您的手机号并点击下一步</v-subheader>
                <br>
                <v-btn
                    color="primary"
                    @click="firstStep()"
                >
                  下一步
                </v-btn>


              </v-stepper-content>

              <v-stepper-content step="2">

                  <v-text-field
                      v-model="userPhone"

                      label="手机号"
                      required
                      disabled
                  ></v-text-field>

                  <v-row
                      class="pa-2"
                      justify="center"
                      no-gutters
                  >
                    <v-col
                        md="16"

                    >
                  <v-text-field
                      v-model="checkNum"
                      :rules="[rules.checkNum]"
                      :counter="6"
                      label="验证码"
                      required
                  >

                  </v-text-field>
                    </v-col>
                    <v-col
                      md="2"
                      offset-md="0.5"
                    >
                      <v-btn text large color="primary">点击获取手机验证码</v-btn>
                    </v-col>
                  </v-row>


             

                <v-btn
                    color="primary"
                    @click="secondStep()"
                >
                  下一步
                </v-btn>
              </v-stepper-content>

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
                        :rules="[rules.password_require, rules.password_min]"
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

                <v-btn
                    color="primary"
                    @click="e1 = 1"
                >
                  提交
                </v-btn>

              </v-stepper-content>
            </v-stepper-items>
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
      e1: 1,        //步骤
      message:null,   //警告信息框信息，按需赋值显示
      userPhone:'',   //用户手机号存放的变量
      checkNum:'',    //验证码
      alert:false,    //警告信息框的显示情况
      stepAlert:false,  //步骤台哦的警告标志是否显示（用于提示用户）
      stepAlert2:false,
      password1:'',
      password2:'',
      show1: false,
      show2: false,
      progress:0,
      checkPasswordSecurity:false,
      progressColor:'',
      items: [          //面包屑
        {
          text: '登录',
          disabled: false,
          href: '/',
        },
        {
          text: '忘记密码',
          disabled: true

        }
      ],
      // phoneRules:[      //手机号校验规则
      //   v => !!v || '手机号不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
      //   v => (v && v.length === 11) || '手机号长度不对',  //正则验证，不符合正则，则输入框下方以红色字体显示'Name must be less than 10 characters'
      //   v => (v && /^1[34578]\d{9}$/.test(this.userPhone))|| '手机号格式不对',//用正则表达式对手机号合法性进行验证
      // ],
      rules: {
        required: value => !!value || '手机号不能为空！',
        min: v => (v && v.length === 11) || '手机号长度不对',  //正则验证，不符合正则，则输入框下方以红色字体显示
        format:v => (v && /^1[34578]\d{9}$/.test(this.userPhone))|| '手机号格式不对',//用正则表达式对手机号合法性进行验证
        // emailMatch: () => ('The email and password you entered don\'t match'),
        checkNum:v =>(v && this.checkNum.length===6)||'验证码长度不对',
        password_require:value => !!value || '密码不能为空！',
        password_min: v => (v.length >=6 && v.length <=14) || '密码长度应为6-14位',
        again:v => !!v || '请再次输入密码！',
        same: v => (v===this.password1)|| '两次密码不一致' ,

      },

    }
  },
  //2020-09-19
  //在第一步之后点击下一步，像后端发请求（携带手机号）获取计时器信息（如果已经发送验证码，后台应该有剩余秒数，把这个东西返回给前端）
  //如果还没发送验证码，置计时器字段为空
  //methods中还要添加一个计时器方法，传入参数为剩余秒数
  //计时器字段和按钮的倒计时是双向绑定关系，即按钮呈现的效果为：剩余x秒，且按钮此时不可用
  //2020-09-20  不做计时器了，操
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
    firstStep() {//第一步：输入手机号并验证--点击下一步所触发的事件
      if(this.userPhone===''){
        this.message='请输入手机号！';
        this.stepAlert=true;
        this.alert=true;
      }else if(this.userPhone.length!==11){
        this.message='手机号长度有误，请重新输入！';
        this.stepAlert=true;
        this.alert=true;
      }else if(!/^1[34578]\d{9}$/.test(this.userPhone)){
        this.message='手机号格式有误，请重新输入！';
        this.stepAlert=true;
        this.alert=true;
      }else{
        //向后端发送手机号，接受返回结果，如果成功进入下一步
        this.stepAlert=false;
        this.alert=false;
        this.e1 = 2;
      //如果失败则提示用户输入的手机号不存在（提示用户后台处理失败）
      }
    },
    secondStep(){//第二步：验证手机验证码
      //1.验证码合法性判断（纯数字，6位）
      //2.向后台发送验证码进行检验,接受返回结果，如果成功进入下一步
      //如果失败提示用户验证码不正确（提示用户后台处理失败）
      if(this.checkNum===''){
        this.message='请输入6位纯数字验证码！';
        this.stepAlert2=true;
        this.alert=true;
      }else if(/^[0-9]*$/.test(this.checkNum)){
        //验证成功的情况，在这里发请求
        this.e1 = 3;
      }else{
        this.message='验证码格式有误，请重新输入！';
        this.stepAlert=true;
        this.alert=true;
      }

    },
    // sendCheckNum(){
    //   //发送验证码，并触发计时器进行计时
    // }//不触发了，触发你妈了个逼
    sendCheckNum(){
      //发送验证码请求，后台计时，如果失败就返回不能再发
    },
    thirdStep(){//第三步：设置新密码
      //密码安全性校验（给用户看）
      //密码长度校验(6-15位)
      //两次密码是否一致检验
      //检验完发手机号和密码给后台，后台返回是否成功（可能性两种，成功或失败）
      //若成功做路由跳转到登录页面
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
  name: "Forget"
}
</script>