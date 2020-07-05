<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item>banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary"  @click="add">添加</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" >
            <el-table-column prop="id"  label="ID" >
            </el-table-column>
            <el-table-column label="banner" >
               <template slot-scope="scope">
                  <img :src="scope.row.img" style="width:60px;">
                </template>
            </el-table-column>
            <el-table-column prop="title" label="简短描述" >
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" type='text' @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import axios from 'axios';
    import { getBanner } from '@/api/';
    import config from '../../config/index';
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                data:[],
                api:config.base
            }
        },
        activated(){
          this.getList()
        },
        methods: {              
            getList(){
                let role = localStorage.getItem('role')
                getBanner({id: '',belong: role}).then(res => {
                  console.log(res)
                  this.data = res
                })                
            },

            add(){
               var data = {
                  'name':'',
                  'id':'add'
               }
               this.handleEdit(data)
            },

            edit(data){
                const api = config.base+'wechat.php?ctrl=api&action=editType';
                console.log(data)
                var self = this;
                axios.post(api, data)
                   .then(function (res) {
                       console.log(res);
                       if(res.data.code == 200){
                           self.$message({
                              message: '编辑成功',
                              type: 'success'
                            });
                           self.getList()
                       }
                   })                
            },
            
            // status == 1 有效
            // status == 0 被删除
            handleEdit(data){
                this.$router.push({'path':'/banner/' + data.id});
                // this.$prompt('请输入新名字', '提示', {
                //   confirmButtonText: '确定',
                //   cancelButtonText: '取消',
                // }).then(({ value }) => {
                //   data.name = value
                //   this.edit(data)
                // }).catch(() => {
       
                // });
            },
            handleDel(data){
              data.status=0;
              this.edit(data)
            }

        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>