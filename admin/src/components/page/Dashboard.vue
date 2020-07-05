<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>账号分配</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row :gutter="20">
            <el-col :span="10">
                <el-row>
                    <el-col>
                        <el-card shadow="hover" class="mgb20">
                            <div class="user-info">
                                <img :src="userInfo.avatarUrl" class="user-avator" alt="">
                                <div class="user-info-cont">
                                    <div class="user-info-name">{{userInfo.nickName}}</div>
                                    <div>{{userInfo.account}}</div>
                                    <div>{{role}}</div>
                                </div>
                            </div>
                        </el-card>
<!--                         <el-card shadow="hover">
                            <div slot="header" class="clearfix">
                                <span>语言详情</span>
                            </div>
                            Vue
                            <el-progress :percentage="57.2" color="#42b983"></el-progress>
                            JavaScript
                            <el-progress :percentage="29.8" color="#f1e05a"></el-progress>
                            CSS
                            <el-progress :percentage="11.9"></el-progress>
                            HTML
                            <el-progress :percentage="1.1" color="#f56c6c"></el-progress>
                        </el-card> -->
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div v-if="role === '超级管理员'">
            <el-table :data="data" border style="width: 100%" >
                <el-table-column prop="id"  label="ID" width="100px">
                </el-table-column>
                <el-table-column label="昵称" prop="nickName">
                </el-table-column>
                <el-table-column label="登录账号" prop="account">
                </el-table-column>
                <el-table-column prop="pwd" label="密码" >
                </el-table-column>
                <el-table-column label="权限列表" >
                   <template slot-scope="scope">
                      {{ scope.row.formId }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" type='text' @click="add(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="handle-box">
                <el-button type="primary"  @click="add">添加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { userList, getInfo } from '@/api/';
    export default {
        data() {
            return {
                data: [],
                name: localStorage.getItem('ms_username'),
                userInfo: {},
            }
        },
        computed: {
            role() {
                let userInfo = JSON.parse(localStorage.getItem('userInfo'))
                return userInfo.nickName === '超级管理员' ? '超级管理员' : '普通用户';
            }
        },
        activated(){
          // this.getList()
          this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
          if (!this.userInfo) {
            this.$message({
              message: '你的登录状态已过期，将重新登录',
              type: 'error',
              onClose: () => {
                this.$router.push({'path':'/login'})
              }
            });
            return false
          }
          // 如果用户更改了信息，在这里要重新获取
          console.log(this.userInfo)
          getInfo({openid: this.userInfo.openid}).then(data => {
            console.log(data)
            this.userInfo = data
            localStorage.setItem('userInfo', JSON.stringify(data))
          })
        },
        methods: {
            getList(){
                userList({belong: 'tianzhongda_admin'}).then(res => {
                  console.log(res)
                  this.data = res
                })                
            },
            add(obj){
                if (obj.openid) {
                    this.$router.push({'path': '/tianzhongda/editUser/' + obj.openid});
                } else {
                    this.$router.push({'path':'/tianzhongda/editUser/add'});
                }
            }
        }
    }

</script>


<style scoped>
    .el-row {
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 12px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }
    .handle-box {
        margin-top: 20px;
    }
</style>
