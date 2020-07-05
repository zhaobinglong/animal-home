import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import './filters';
import Axios from './axios/axios';
import ElementUI from 'element-ui';            // 组件库已经通过CND引入，这个就不需要加载了
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import './filters/index'
import store from './store/'

Vue.use(ElementUI, { size: 'small' });


//修改原型链，全局使用axios,这样之后可在每个组件的methods中调用$axios命令完成数据请求
Vue.prototype.$axios = Axios;
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('role');
    // 这里先不做登录判断
    console.log(to)
    if(!role && to.path !== '/login' && false){
        next('/login');
    }else if(to.meta.permission){
        // 用户都可以看到该页面，但是只有管理员才可以进入该页面，其他用户则被导航进入403
        // role === 'admin' ? next() : next('/403');
        next()
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');