<template>
    <div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="国家">
                    <el-input v-model="form.nation"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="符号">
                    <el-input v-model="form.symbol"></el-input>
                </el-form-item>
                <el-form-item label="代码">
                    <el-input v-model="form.spell"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    export default {
        data: function(){
            return {
                upload_url:config.base+'upload.php',
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

            this.getDetail()
        },

        mounted:function(){
           console.log('edit m agagin')
        },
        methods: {
            getDetail(){
                if(this.$route.params.openid == 'add'){
                    return false;
                }
                var self=this;
                var url = config.base+'user.php?code=getCurrency';
                axios.get(url)
                   .then((res) => {
                      const list = res.data;
                      const id = this.$route.params.id
                      for (var i = 0; i < list.length; i++) {
                        if(list[i].id == this.$route.params.id){
                           this.form = list[i]
                        }
                      }
      
                   })
            },
            onSubmit() {
                const api = config.base+'user.php?code=editCurrency';

                var self = this;
                axios.post(api, self.form)
                   .then(function (res) {
                       console.log(res);
                       if(res.data.code == 200){
                            self.$message({
                              message: '编辑成功',
                              type: 'success'
                            });
                            self.$router.back();
                           
                       }
                   })
            },
          // 
          topUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.avatarUrl = config.base_img + response.name;
          },
        }
    }
</script>