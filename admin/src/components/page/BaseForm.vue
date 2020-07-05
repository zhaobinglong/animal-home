<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>表单</el-breadcrumb-item>
                <el-breadcrumb-item>期末成绩查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="学校名字">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option key="运城学院" label="运城学院" value="运城学院"></el-option>
                        </el-select>
                    </el-form-item >
                    <el-form-item label="教务帐号">
                        <el-input v-model="form.username" placeholder="输入帐号" ></el-input>
                    </el-form-item>
                    <el-form-item label="教务密码">
                        <el-input v-model="form.password" placeholder="输入密码" ></el-input>
                    </el-form-item>
                    <el-form-item label= "验证码" >
                        <div @click="getYcuCodeImg" class="default_code">
                            <img :src="form.codeImg" >
                        </div>
                    </el-form-item>
                    <el-form-item label="输入">
                        <el-input v-model="form.yzm" placeholder="点击上方灰色区域获取验证码" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">登陆系统</el-button>
                    </el-form-item>
                    <el-form-item label="切换年份" v-if="login">
                        <el-date-picker
                          v-model="form.xn"
                          type="year"
                          @change="changeYear"
                          value-format="yyyy"
                          placeholder="选择年">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="成绩" v-if="login">
                        <img :src="item" v-for="(item, i) in score">
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
    import { getYcuHome, getYcuCodeImg, ycuLogin, ycuScoreImg } from '@/api/index'
    export default {
        data: function(){
            return {
                // 账号2016010363
                // 密码199703152741
                    // username: '2016010301',
                    // password: '255714',
                form: {
                    username: '2016010363',
                    password: '199703152741',
                    region: '运城学院',
                    yzm:'',
                    codeImg: '',
                    xn: '2019',
                    xq: '0',
                    cookie: localStorage.getItem('cookie')
                },
                score: [],
                login: true
            }
        },
        activated(){
        },
        mounted:function(){
          // getYcuHome().then(data => {
          //     console.log(data)
          //     this.data = data
          // })
        },
        methods: {

            onSubmit() {
                // this.$message.success('提交成功！');
                // this.data.yzm = this.form.yzm
                ycuLogin(this.form).then(res => {
                    console.log(res)
                    if (res == '登陆成功') {
                      // 登陆成功，把cookie写在sttorage中
                      localStorage.setItem('cookie', this.form.cookie)
                      this.login = true
                    } else {
                        // error
                    }
                })
            },
            // 获取验证码，同时获取一个cookie，后端把验证码保存了
            getYcuCodeImg() {
                getYcuCodeImg().then(res => {
                    this.form.codeImg = res.img + '?t=' + Math.random()
                    this.form.cookie = res.cookie
                })
            },
            changeYear(val) {
                this.score = []
                ycuScoreImg(this.form).then(res => {
                    console.log(res)
                    this.info = [...new Set(res.info)]
                    this.score = res.ossUrl
                    console.log(this.info)
                    // this.$set(this.score,0,res) 
                })
            }
        }
    }
</script>
<style type="text/css">
.default_code {
    display: inline-block;
    background-color: #Efefef;
    min-width: 100px;
    min-height: 40px;
}
</style>