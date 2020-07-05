<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index" >
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <!-- <el-menu-item :index="item.index" :key="item.index" v-if="!item.meta || item.meta.role === role"> -->
                    <el-menu-item :index="item.index" :key="item.index" >
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                role: '',
                auth: [], // 用户权限，可以操作的菜单
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: '/dashboard',
                        title: '系统首页',
                        show: true
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: '/schoolList',
                        title: '学校管理',
                        meta: {role: 'unibbs'}
                    },
                    {
                        icon: 'el-icon-message',
                        index: '/currency',
                        title: '货币管理',
                        meta: {role: 'unibbs'}
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: '/userList',
                        title: '用户管理',
                        meta: {role: 'unibbs'}
                    },
                    {
                        icon: 'el-icon-date',
                        index: '4',
                        title: '内容管理',
                        meta: {role: 'unibbs'},
                        subs: [
                            {
                                index: '/goods',
                                title: '内容列表'
                            },
                            {
                                index: '/copy',
                                title: '内容复制'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-warning',
                        index: '/typeList',
                        title: '分类管理'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '/permission',
                        title: '账号配置',
                        meta: {role: 'admin'}
                    },
                    {
                        icon: 'el-icon-upload',
                        index: '/upload',
                        title: 'excel解析',
                        meta: {role: 'admin'}
                    },
                    {
                        icon: 'el-icon-question',
                        index: '/form',
                        title: '期末成绩查询',
                        meta: {role: 'admin'}
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        activated(){

        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            // bus.$on('collapse', msg => {
            //     this.collapse = msg;
            // })
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            console.log(userInfo.formId)
            this.auth = userInfo.formId
            console.log(this.auth)
            this.role = localStorage.getItem('role')
            console.log(this.role)
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
