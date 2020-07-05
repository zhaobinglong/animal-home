<template>
    <div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题">
                    <el-input type="textarea" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.cont"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="原始价格">
                    <el-input v-model="form.old_price"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input  v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="选择分类">
                  <el-cascader
                    expand-trigger="hover"
                    :options="classify"
                    v-model="form.selectedOptions"
                    @change="handleChange">
                  </el-cascader>
                </el-form-item>

                <el-form-item label="选择大学">
                  <el-select
                    v-model="form.college"
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
                <el-form-item label="选择用户">

                  <el-select
                    v-model="form.nickName"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="form.nickName"
                    :remote-method="remoteGetUser"
                    :loading="loading">
                    <el-option
                      v-for="item in users"
                      :key="item.openid"
                      :label="item.nickName"
                      :value="item.nickName">
                    </el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="微信号码">
                    <el-input  v-model="form.wechat"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                  <el-col >
                      <el-upload
                        class="upload-demo"
                        :file-list="form.img_arr"
                        :action="upload_url"
                        :on-success='topUploadSuccess'
                        :on-remove="handleRemove"
                        :on-progress="handleProgress"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">可上传多张</div> -->
                      </el-upload>
                  </el-col>
                </el-form-item>
<!--                 <el-form-item label="详情图">
                  <el-col >
                      <el-upload
                        class="upload-demo"
                        :file-list="form.img_detail_arr"
                        :action="upload_url"
                        :on-success='detailUploadSuccess'
                        :on-remove="handleDetailRemove"
                        :on-progress="handleProgress"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">可上传多张</div>
                      </el-upload>
                  </el-col>
                </el-form-item> -->
                <el-form-item label="是否卖出">
                    <!-- <el-switch on-text="" off-text="" v-model="form.status"></el-switch> -->
                    <el-checkbox v-model="form.status"></el-checkbox>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <!-- <el-button type="primary" @click="onCopy" v-if="show_copy">复制到指定大学</el-button> -->
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    import util from '../../util/index';
    import {getDetail, getTypeList} from '@/api/index'
    export default {
        data: function(){
            return {
                upload_url:config.base+'upload_tencent_cloud.php',
                colleges:[],
                college:'',
                users:[],
                user:'',
                form: {
                  openid: '',
                  title: '',
                  address: '',
                  cont: '',
                  imgs: [],
                  category: "学习交流",
                  classify: "论坛",
                  wechat: '',
                  price: 0,
                  old_price: 0,
                  status: 1,
                  college: '西北政法大学',
                  imgs_detail: [],
                  symbol: '￥'
                },
                loading:false,
                show_copy: false,
                loading: false,
                classify: [],
                selectedOptions: []
            }
        },
        watch:{
          $route:function(){
             this.getDetail()
             if(this.$route.params.id == 'add'){
               this.show_copy = false;
             }
          }
        },
        created(){
          this.remoteClassify()
        },
        mounted() {
          // this.getDetail()
        },
        methods: {
          // 级联选择
          handleChange(value) {
            console.log(value)
            this.form.classify = value[0]
            this.form.category = value[1]
          },
          openFullScreen() {
            const loading = this.$loading({
              lock: true,
              text: '正在上传',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
              loading.close();
            }, 2000);
          },
          getDetail(){
            getDetail({id: this.$route.params.id})
              .then(r => {
                console.log(r)
                r.img_arr=[];
                r.img_detail_arr=[];
                r.imgs.map((item,index)=>{
                  r.img_arr.push({
                    'index':index,
                    'name':'',
                    'url':item                      
                  })
                })
                if (r.imgs_detail) {
                  r.imgs_detail.map((item,index)=>{
                    r.img_detail_arr.push({
                      'index':index,
                      'name':'',
                      'url':item                      
                    })
                  })                
                }      
                r.selectedOptions = [r.classify,r.category]        
                if (r.status == 1) {
                  r.status = false
                } else if (r.status == 2) {
                  r.status = true
                } else {
                  r.status = false
                }
                this.form = r;
              })
              .catch(res => {
                console.log(res)
              })
          },
            onSubmit() {

              this.users.map((item,index)=>{
                if(item.nickName == this.form.nickName){
                   this.form.openid = item.openid
                }
              })

              let obj = Object.assign({}, this.form);
              obj.status = obj.status ? 2 : 1
              const api = config.base+'wechat.php?ctrl=api&action=push';
              var self = this;
              axios.post(api, obj)
                 .then(function (r) {
                   console.log(r)
                   if(r.data.res.code == 200){
                       self.$message({
                          message: '编辑成功',
                          type: 'success'
                        });
                   } else {
                       self.$message({
                          message: r.data.msg,
                          type: 'success'
                        });
                   }
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
          handleProgress () {
            this.openFullScreen()
          },

          // 封面图
          topUploadSuccess(response, file, fileList){
             console.log(response)
             let item = response.oss_url ; 
             if(!this.form.imgs){
                this.form.imgs = []
             }
             this.form.imgs.push(item)
          },
          
          // 详情图上传
          // detailUploadSuccess(response, file, fileList){
          //    let item = response.oss_url ; 
          //    if(!this.form.imgs_detail){
          //       this.form.imgs_detail = []
          //    }
          //    this.form.imgs_detail.push(item)
          // },

          
          // 删除指定图片
          handleRemove(file, fileList) {
            console.log(file)
            let index = file.index;
            this.form.imgs.splice(index,1);
            console.log(this.form.imgs)
          },

          // 删除详情中的指定图片
          handleDetailRemove(file, fileList) {

            let index = file.index;
            this.form.imgs_detail.splice(index,1);
            console.log(this.form.imgs)
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

          // 根据关键字查找一级分类
          remoteClassify(){
            var self=this;
            getTypeList().then( res => {
              console.log(res)
              let arr = res.map(i => {
                let children = i.subCategory.map(item => {
                  return {
                    value: item,
                    label: item
                  }
                })
                return {
                  value: i.name,
                  label: i.name,
                  children: children
                }
              })
              console.log(arr)
              self.classify = arr

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