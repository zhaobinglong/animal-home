<template>
    <div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">

                <el-form-item label="图片">
                  <el-col >
                      <el-upload
                        class="upload-demo"
                        :file-list="form.img_arr"
                        :action="upload_url"
                        :on-success='topUploadSuccess'
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                  </el-col>
                </el-form-item>

                <el-form-item label="简短描述">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button type="text"@click="onDel" >删除</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    import util from '../../util/index';
    import { getBanner } from '@/api/';
    export default {
        data: function(){
            return {
                upload_url:config.base+'upload_tencent_cloud.php',
                form: {
                  img: '',
                  title: '',
                  belong: 'tianzhongda',
                  img_arr: [],
                  status: '1'
                }
            }
        },

        activated(){
          this.getDetail();
        },

        methods: {
          getDetail(){
            if(this.$route.params.id == 'add'){
                return false;
            }
            let role = localStorage.getItem('role')
            getBanner({id: this.$route.params.id,belong: role}).then(res => {
              console.log(res)
                res[0].img_arr=[];
                res[0].img_arr.push({
                  'name':'',
                  'url':res[0].img                      
                })
              this.form = res[0]
            }) 
          },


          onSubmit() {
            if (!this.form.img) {
              this.$message({
                message: 'banner不能为空',
                type: 'error'
              });
              return false
            }
            const api = config.base+'wechat.php?ctrl=api&action=editBanner';
            const self = this;
            axios.post(api, this.form)
               .then(function (res) {
                   console.log(res);
                   self.$message({
                      message: '编辑成功',
                      type: 'success'
                    });
                   self.$router.back()
               })
          },

          onDel() {
            this.form.status = 0;
            this.onSubmit()
          },

          topUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.img = response.oss_url;
          },
        }
    }
</script>