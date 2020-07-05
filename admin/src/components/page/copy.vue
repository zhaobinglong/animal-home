<template>
    <div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">

                <el-form-item label="选择来源大学">
                  <el-select
                    v-model="form.fromCollege"
                    :value="form.college"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="form.college"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                      v-for="item in colleges"
                      :key="item.sid"
                      :label="item.uName"
                      :value="item.uName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择目标大学">

                  <el-select
                    v-model="form.toCollege"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="form.nickName"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                      v-for="item in colleges"
                      :key="item.sid"
                      :label="item.uName"
                      :value="item.uName">
                    </el-option>
                  </el-select>

                </el-form-item>




                <el-form-item>
                    <el-button type="primary" @click="onSubmit">开始复制</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    import util from '../../util/index';
    export default {
        data: function(){
            return {
                upload_url:config.base+'upload_tencent_cloud.php',
                colleges:[],
                college:'',
                users:[],
                user:'',
                form: {},
                loading:false,
                show_copy: false
            }
        },
        watch:{
          $route:function(){
             // this.getDetail()
             // if(this.$route.params.id == 'add'){
             //   this.show_copy = false;
             // }
          }
        },
        created(){
          // this.getDetail();
        },

        methods: {

            onSubmit() {


              console.log(this.form)
              const api = config.base+'user.php?code=copy';
              var self = this;
              axios.post(api, self.form)
                 .then(function (res) {
                     console.log(res);
                     self.$message({
                        message: '复制成功',
                        type: 'success'
                      });

                 })
            },


          // copy二手信息进入指定大学
          onCopy(){
            delete this.form.id
            const api = config.base+'user.php?code=push';
            var self = this;
            axios.post(api, this.form)
               .then(function (res) {
                   console.log(res);
                   if(res.data.code == 200){
                       self.$message({
                          message: '复制成功',
                          type: 'success'
                        });
                   }
               })                        
          },
 
          
          // 根据关键字查找大学
          remoteMethod(query){
            var self=this;
            console.log(query)
            var url = config.base+'user.php?code=searchSchool&name='+query;
            axios.get(url)
               .then(function (res) {
                  console.log(res)
                  self.colleges= res.data;

               }) 
          },
          

          // 根据关键字查找用户
          remoteGetUser(query){
            var self=this;

            var url = config.base+'user.php?code=searchUser&name='+query;
            axios.get(url)
               .then(function (res) {
                  console.log(res)
                  self.users= res.data;

               })             
          },

          changeUser(res){
            console.log(res)
          }

        }
    }
</script>