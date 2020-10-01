import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
// import clipboard from 'clipboard';
// //注册到vue原型上
// Vue.prototype.clipboard = clipboard;



Vue.use(VueAxios, axios)
Vue.config.productionTip = false
//全局解析守卫（判断是否登录）

NProgress.configure({ showSpinner: false }); //进度条配置
router.beforeEach((to, from, next) => {
  // 时间：2020-09-03
  // 通过requiresAuth判断当前路由导航是否需要登录
  // 若需要登录访问，检查是否为登录状态
  // 在这里发起登录校验并进行判断
  //1.cookie 中存用户id，在进行判断是否登录时候取出用户id
  //let userName=Cookie.get('userID')
  //2.进行判断
  //if(userID){next()} 存在用户id的话说明在线，按正常路由跳转
  //else{next({path:'/login',query:{redirect:to.fullPath}})} 不存在id，说明登陆失效or没登录，重定向路由至登录
  //*全局钩子beforeEach在调用next()的时候会被再次调用，如果不对to.path进行判断，就会进入死循环


  // 时间：2020-09-06（新方案）
  // 用axios提交数据，后端返回json，登录成功时保存一个登录状态；
  // sessionStorage.setItem("flag", 1);
  // 在路由守卫钩子函数中取出保存的登陆状态
  // let flag = sessionStorage.getItem('flag ')
  // if(!=flag){...}else{...}

  // 相关问题：1.提交登陆表单的业务逻辑：
  //            基本流程：axios传数据到后台,服务器验证成功就在后台生成一个token返回给客户端（JWT）
  //            客户端将token存储到cookie（或者sessionStorage）中，服务端将token存储到redis中，可以设置存储token的有效期。
  //            后续客户端的每次请求资源都必须携带token，这里放在请求头中，服务端接收到请求首先校验是否携带token，以及token是否和redis中的匹配，若不存在或不匹配直接拦截返回错误信息（如未认证）
  //            前端处理：axios发送请求，接受请求并做路由跳转---Login.vue
  //                    全局路由守卫进行判断登陆状态---main.js
  //          2.登陆失败的情况：登陆失败在登录页弹出警告，不作路由跳转
  //          3.路由守卫的作用： 没有登陆的时候：sessionStorage没有token,路由守卫判断并跳转进/login
  //                          因为有了token，前端不需要严格判断，每次提交请求附上token即可，如果后端redis存储的token过期了就清空本地的sessionStorage
  //                          export const removeCache = (name) => {
  //                                    if (!name) return window.sessionStorage.removeItem(name)
  //                          }
  //                          清空sessionStorage后弹窗“登陆已经过期”后进行页面刷新，自然而然触发路由守卫，路由守卫此时找不到token，判定没有登陆，跳转进login
  //
  NProgress.start();
  if (sessionStorage.getItem('token')===null) {//这里的判断条件应该换为识别是否有权限登录
    console.log(111);
    //alert('111');
    if(to.path!=='/login'&&to.path!=='/forgetPassword'&&to.path!=='/Share')//需要再加个条件（to.path不是忘记密码的路由）
      next({ path: '/login'});
    else{
      next();
    }
  }else{
    //是否初次登录的判断
    let a=parseInt(sessionStorage.getItem('firstLogin'));
    console.log(a+'qwer');
    if(a===1){
      if(to.path!=='/FirstLogin') {
        next({path: '/FirstLogin'});
      }else{
        next();
      }
    }else{
      //if()
      //在这里进行用户权限的判断（管理员or普通用户）
      let b = parseInt(sessionStorage.getItem('firstLogin'));
      if(b===0){
        if(to.path==='/Dashboard/fileManagerManage') {
          next({path: '/Dashboard/myFiles'});
        }else if(to.path==='/Dashboard/manageGroupFile'){
          next({path: '/Dashboard/myFiles'});
        }else if(to.path==='/Dashboard/userManage'){
          next({path: '/Dashboard/myFiles'});
        }else{
          next();
        }
      }else if(b===2){
        if(to.path==='/Dashboard/manageGroupFile'){
          next({path: '/Dashboard/myFiles'});
        }else if(to.path==='/Dashboard/userManage'){
          next({path: '/Dashboard/myFiles'});
        }else{
          next();
        }
      }else{
          next();
      }

    }


  }

})
router.afterEach(() => {
  NProgress.done();
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

