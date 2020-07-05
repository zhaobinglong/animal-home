<template>
    <div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="学校名字">
                    <el-col >
                      <el-input v-model="form.uName"></el-input>
                   </el-col>
                </el-form-item>
                  <el-form-item label="国家">
                    <el-col >
                       <el-input  v-model="form.nation"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="省份">
                     <el-col :span="4">
                        <el-input v-model="form.province"></el-input>
                     </el-col>
                  </el-form-item>
                  <el-form-item label="城市">
                    <el-col :span="4">
                       <el-input v-model="form.city"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="辖区">
                    <el-col :span="4">
                       <el-input v-model="form.district"></el-input>
                    </el-col>
                  </el-form-item>
            <el-form-item label="学校头图">
              <el-col >
                  <el-upload
                    class="upload-demo"
                    :file-list="form.top_img_arr"
                    :action="upload_url"
                    :on-success='topUploadSuccess'
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">可上传多张</div> -->
                  </el-upload>
              </el-col>
            </el-form-item>
            <el-form-item label="logo">
              <el-col >
                  <el-upload
                    class="upload-demo"
                    :file-list="form.logo_img_arr"
                    :action="upload_url"
                    :on-success='logoUploadSuccess'
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">可上传多张</div> -->
                  </el-upload>
              </el-col>
            </el-form-item>
            <el-form-item label="渠道">
              <el-col :span="8">
                 <a :href="api+'unibbs/wechat.php?ctrl=weixin&action=createQrcode&college='+form.uName">服务号二维码下载</a>
              </el-col>
            </el-form-item>
            <el-form-item label="学校爬虫">
                <el-switch on-text="" off-text="" v-model="form.tieba_spider"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    import { getCollegeById, editCollege } from '@/api/';
    export default {
        data: function(){
            return {
                form:{
                  uName:'',
                  top_img:'',
                  logo:'',
                  nation:'',
                  tieba_spider: false
                },
                upload_url:config.base+'upload_tencent_cloud.php',
                api:config.base

            }
        },
        created(){
            if(this.$route.params.id == 'add'){
                this.form = {};
                return false;
            }
            getCollegeById(this.$route.params.id).then(res => {
              console.log(res)
              res.top_img_arr = [];
              if(res.top_img){
                res.top_img_arr.push({
                  'id':1,
                  'name':res.top_img,
                  'url': res.top_img                      
                })                    
              }

              res.logo_img_arr = [];
              if(res.logo){
                res.logo_img_arr.push({
                  'id':1,
                  'name':res.logo,
                  'url':res.logo                      
                })                    
              }     
              if (res.tieba_spider == "") {
                res.tieba_spider = false
              } else {
                res.tieba_spider = true
              }            
              

              this.form = res;
            })
            // var self=this;
            // var url = config.base+'user.php?code=getSchool&id='+this.$route.params.id;
            // axios.get(url)
            //    .then(function (res) {
      
            //       console.log(res)
            //       if(!res.data){
            //         return false;
            //       }
            //       res.data.top_img_arr = [];
            //       if(res.data.top_img){
            //         res.data.top_img_arr.push({
            //           'id':1,
            //           'name':res.data.top_img,
            //           'url':config.base_img+res.data.top_img                      
            //         })                    
            //       }

            //       res.data.logo_img_arr = [];
            //       if(res.data.logo){
            //         res.data.logo_img_arr.push({
            //           'id':1,
            //           'name':res.data.logo,
            //           'url':config.base_img+res.data.logo                      
            //         })                    
            //       }                  
                  

            //       self.form = res.data;
            //    }) 

        },
        mounted:function(){
         
        },
        methods: {
            onSubmit() {
              editCollege(this.form).then(res => {
                console.log(res)
                if(res) {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: '编辑异常',
                    type: 'error'
                  });                  
                }
              })
                // const api = config.base+'user.php?code=editSchool';

                // var self = this;
                // axios.post(api, self.form)
                //    .then(function (res) {
                //        console.log(res);
                //        if(res.data.code == 200){
                //            self.$message({
                //               message: '编辑成功',
                //               type: 'success'
                //             });
                //        }
                //    })              
            },
          
          // 头图上传
          topUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.top_img=response.oss_url;
          },
          // logo上传
          logoUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.logo=response.oss_url;
          },
          handleRemove(file, fileList){
             
          },
        }
    }
</script>