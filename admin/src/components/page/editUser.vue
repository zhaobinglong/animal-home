<template>
    <div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="微信昵称">
                    <el-input v-model="form.nickName"></el-input>
                </el-form-item>
                <el-form-item label="初始大学">
                    <el-input v-model="form.college"></el-input>
                </el-form-item>
                <el-form-item label="微信openid">
                    <el-input disabled v-model="form.openid"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                  <el-col >
                      <el-upload
                        class="upload-demo"
                        :file-list="form.img_arr"
                        :action="upload_url"
                        :on-success='topUploadSuccess'
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">可上传多张</div> -->
                      </el-upload>
                  </el-col>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-switch on-text="" off-text="" v-model="form.status"></el-switch>
                </el-form-item>


                <el-form-item label="加入时间">
                     <!-- {{form.createtime | filterDateFormat}} -->
                  <el-date-picker
                    disabled
                    v-model="form.createtime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    import util from '../../util/index';
    import { getInfo }  from '@/api/index'
    export default {
        data: function(){
            return {
                upload_url:config.base+'upload_tencent_cloud.php',
                form: {
                }
            }
        },
        watch:{
          $route:function(){
             this.getDetail()
          }
        },
        created(){
          this.getDetail();
        },

        methods: {
          getDetail(){
            if(this.$route.params.openid == 'add'){
                var createtime = new Date().getTime();
                this.form = {
                    createtime:parseInt(createtime),
                    openid:util.randomString(28)
                };
                return false;
            }

            getInfo({openid: this.$route.params.openid}).then(data => {
              console.log(data)
              this.form = data
            })

          },

          // 提交编辑过的用户
          onSubmit() {
              const api = config.base+'wechat.php?ctrl=api&action=adminEditUser';
              var self = this;
              axios.post(api, self.form)
                 .then(function (res) {
                     console.log(res);
                     self.$message({
                        message: '编辑成功',
                        type: 'success'
                      });
                     
                 })
          },

          topUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.avatarUrl = response.url;
          },
        }
    }
</script>