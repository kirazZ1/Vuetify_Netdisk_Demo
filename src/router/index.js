import Vue from 'vue';
import Router from 'vue-router';
import myFiles from "@/components/view/myFiles";
import myGroups from "@/components/view/myGroups";
import viewShare from "@/components/view/viewShare";
import trash from "@/components/view/trash";
import userManage from "@/components/view/userManage";
import fileManagerManage from "@/components/view/fileManagerManage";
import manageGroupFile from "@/components/view/manageGroupFile";
Vue.use(Router);
export default new Router({
    routes:[
        // {
        //     path: '/',
        //     //主页面，包括侧边栏，顶栏，标签显示栏和传入组件区域
        //     component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
        //     meta: { title: '自述文件' },
        //     children: [         //跳转到同一页面，但不同路由调用的组件有所差别，children中进行配置
        //         {
        //             path: '/dashboard',     //访问/#/dashboard
        //             component: () => import(/* webpackChunkName: "dashboard" */ '../components/Dashboard.vue'), //主页面引入这个组件
        //             meta: { title: '系统首页' }     //传入标签栏中标签现实的标题
        //         }
        //     ]
        // },
        {
            //如果直接访问，进行重定向至dashboard，然后按照下面的配置进行路由跳转
            path: '/',
            redirect: '/dashboard/myFiles'
        },
        {
            name: 'Dashboard',
            path: '/dashboard',     //访问/#/dashboard
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/Dashboard.vue'), //主页面引入这个组件
            meta: {
                title: '系统首页' ,
                index:2
            },     //传入标签栏中标签现实的标题
            children: [
                {
                    path: 'myFiles',
                    component: myFiles
                },
                {
                    path: 'myGroups',
                    component: myGroups
                },
                {
                    path: 'viewShare',
                    component: viewShare
                },
                {
                    path: 'trash',
                    component: trash
                },
                {
                    path: 'userManage',
                    component: userManage
                },
                {
                    path: 'fileManagerManage',
                    component: fileManagerManage
                },
                {
                    path: 'manageGroupFile',
                    component: manageGroupFile
                },
                ]
        },
        //登录的route
        {
            name: 'Login',
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue'),
            meta: {
                title: '登录' ,

            }
        },
        {
            name: 'ForgetPassword',
            path: '/forgetPassword',
            component: () => import(/* webpackChunkName: "login" */ '../components/ForgetPassword.vue'),
            meta: {
                title: '忘记密码' ,

            }
        },
        {
            name: 'FirstLogin',
            path: '/FirstLogin',
            component: () => import(/* webpackChunkName: "login" */ '../components/FirstLogin.vue'),
            meta: {
                title: '首次登陆' ,

            }
        },
        {
            name: 'Share',
            path: '/Share',
            component: ()=>import('../components/Share.vue'),

        }
    ]

})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
