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
            align="center"
        >
          <v-breadcrumbs :items="items" large></v-breadcrumbs>
          <br>

          <v-stepper v-model="e1">
            <!--步骤条-->
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1" :rules="[() => !stepAlert]">输入您的手机号</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">验证手机验证码</v-stepper-step>

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
                        :rules="phoneRules"
                        label="手机号"
                        required
                    ></v-text-field>


                  </v-form>
                <v-subheader>请在上方输入您的手机号并点击下一步</v-subheader>
                <br>
                <v-btn
                    color="primary"
                    @click="firstStep()"
                >
                  下一步
                </v-btn>


              </v-stepper-content>

              <v-stepper-content step="2">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                  <v-text-field
                      v-model="userPhone"

                      :rules="nameRules"
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
                      :rules="emailRules"
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
                </v-form>

             

                <v-btn
                    color="primary"
                    @click="e1 = 3"
                >
                  下一步
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                  <v-text-field
                      id="password"
                      label="新密码"
                      name="password"
                      v-model="password"
                      :rules="passwordRules"

                      type="password"
                  ></v-text-field>
                  <v-text-field
                      id="password"
                      label="再次输入新密码"
                      name="password"
                      v-model="password"
                      :rules="passwordRules"

                      type="password"
                  ></v-text-field>


                </v-form>

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
      alert:false,    //警告信息框的显示情况
      stepAlert:false,  //步骤台哦的警告标志是否显示（用于提示用户）
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
      phoneRules:[      //手机号校验规则
        v => !!v || '手机号不能为空！',   //不能为空，如果为空则输入框下方以红色字体显示‘Name is required’
        v => (v && v.length == 11) || '手机号长度不对',  //正则验证，不符合正则，则输入框下方以红色字体显示'Name must be less than 10 characters'
        v => (v && /^1[34578]\d{9}$/.test(this.userPhone))|| '手机号格式不对',//用正则表达式对手机号合法性进行验证
      ]

    }
  },
  //2020-09-19
  //在第一步之后点击下一步，像后端发请求（携带手机号）获取计时器信息（如果已经发送验证码，后台应该有剩余秒数，把这个东西返回给前端）
  //如果还没发送验证码，置计时器字段为空
  //methods中还要添加一个计时器方法，传入参数为剩余秒数
  //计时器字段和按钮的倒计时是双向绑定关系，即按钮呈现的效果为：剩余x秒，且按钮此时不可用
  //2020-09-20  不做计时器了，操
  //首先按照市面上应用的情况，计时器计算秒数和对应手机号同步
  //直接让前端搞个60s计时没暂存地方，用户刷新变回原样，这样的计时器有意义？
  //说白了，不想让前端接触太多数据，懂得都懂
  //之前我听到更蠢的东西还是分页点一次换页发一次页码请求，我就笑了，十年前没有三大框架时你这样做没啥
  //但现在nm都2020年了，还有一个企业云盘显示用户信息，企业本身能多少人，直接把数据全部请求到前端，前端加载到dom就可以
  //vueui组件库不用，拿分页条写一堆按钮又丑，每点击一次用get传页码，反正我是笑了
  //不是不知道你后台能处理，后台代码我也会写
  //真就把前端只当一画画的啊，xswl
  //那这样我tm还不如用jquery，模板一大堆，啥都不用自己写
  //建议全体前端辞职当场失业，让ui干前端的工作，让后台去和ui扯皮
  methods: {
    firstStep() {//第一步：输入手机号并验证--点击下一步所触发的事件
      if(this.userPhone==''){
        this.message='请输入手机号！';
        this.stepAlert=true;
        this.alert=true;
      }else if(this.userPhone.length!=11){
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
    }
  },
  name: "Forget"
}
</script>