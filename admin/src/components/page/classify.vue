<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="一级分类">
                    <el-col >
                      <el-input v-model="form.name"></el-input>
                   </el-col>
                </el-form-item>
                  <el-form-item label="二级分类">
                    <el-tag
                      :key="tag"
                      v-for="tag in form.subCategory"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">点击编辑</el-button>
                  </el-form-item>
                  <el-form-item label="是否显示">
                      <el-radio v-model="form.is_show" label="1">显示</el-radio>
                      <el-radio v-model="form.is_show" label="0">不显示</el-radio>
                    </el-switch>
                  </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button type='text' @click="handleDel">删除分类</el-button>
            </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import { getTypeList, editType } from '@/api/';
    import config from '../../config/index';
    export default {
        data: function(){
            return {
                form:{
                  is_show: 1
                },
                upload_url:config.base+'upload.php',
                api:config.base,
                inputVisible: false,
                inputValue: ''
            }
        },
        activated(){
          this.getList()
        },
        mounted:function(){
         
        },
        methods: {
          handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
              console.log(this.form)
              this.form.subCategory.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
          },
          showInput() {
            this.inputVisible = true;
          },
          handleClose(tag) {
            this.form.subCategory.splice(this.form.subCategory.indexOf(tag), 1);
          },
          handleDel() {
            if (!this.form.name) {
              this.$message({
                message: '不能删除空的分类',
                type: 'error'
              });
              return false
            }
            this.form.status = '0';
            this.onSubmit()
          },

          getList(){
            let role = localStorage.getItem('role')
            if (this.$route.params.id == 'add') {
              this.form = {
                name: '',
                subCategory: [],
                belong: role,
                is_show: '1'
              }
            }
            getTypeList({belong: role}).then(res => {
              res.map( item => {
                if (item.id == this.$route.params.id) {
                  this.form = item
                }
                console.log(item)
              })
            })               
          },

          // 提交一个分类
          onSubmit() {
            if (!this.form.name) {
              this.$message({
                message: '不能提交空的分类名字',
                type: 'error'
              });
              return false
            }

            editType(this.form).then(res => {
              this.$message({
                message: '编辑成功',
                type: 'success'
              });
              this.$router.back()
            })              
          },
          
          // 头图上传
          topUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.top_img=response.name;
          },
          // logo上传
          logoUploadSuccess(response, file, fileList){
             console.log(response)
             this.form.logo=response.name;
          },
          handleRemove(file, fileList){
             
          },
        }
    }
</script>
<style>

.el-tag + .el-tag {
  margin-left: 10px;
}
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>  