import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 需要被动态增加的路由
let addRouter = [
]

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/currency',
                    component: resolve => require(['../components/page/currency.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/editCurrency/:id',
                    component: resolve => require(['../components/page/editCurrency.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '成绩查询' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传', permission: true}   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/schoolList',
                    component: resolve => require(['../components/page/schoolList.vue'], resolve)
                },                 
                {
                    path: '/school/:id',
                    component: resolve => require(['../components/page/school.vue'], resolve)
                },
                {
                    path: '/userList',
                    component: resolve => require(['../components/page/userList.vue'], resolve)
                },                
                {
                    path: '/editUser/:openid',
                    component: resolve => require(['../components/page/editUser.vue'], resolve)
                },
                {
                    path: '/goods',
                    component: resolve => require(['../components/page/goods.vue'], resolve)
                },
                {
                    path: '/goods/:id',
                    component: resolve => require(['../components/page/editGoods.vue'], resolve)
                },
                {
                    path: '/copy',
                    component: resolve => require(['../components/page/copy.vue'], resolve)
                },
                {
                    path: '/typeList',
                    component: resolve => require(['../components/page/typeList.vue'], resolve)
                },
                {
                    path: '/banner',
                    component: resolve => require(['../components/page/banner.vue'], resolve)
                },
                {
                    path: '/banner/:id',
                    component: resolve => require(['../components/page/editBanner.vue'], resolve)
                },
                {
                    path: '/classify/:id',
                    component: resolve => require(['../components/page/classify.vue'], resolve)
                }             
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
