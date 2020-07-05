<template>
    <div class="table">
<!--         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> </el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="search" @click="add">添加</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" >
            <el-table-column prop="id"  label="ID" >
            </el-table-column>
            <el-table-column prop="cont" label="描述" width="200">
            </el-table-column>
            <el-table-column prop="openid" label="微信id" width="240">
            </el-table-column>
<!--             <el-table-column prop="wechat" label="微信号码">
            </el-table-column> -->
            <el-table-column prop="college" label="大学名称" width="100">
            </el-table-column>
<!--             <el-table-column prop="price" label="价格" width="120">
            </el-table-column> -->
<!--             <el-table-column prop="address" label="地址" >
            </el-table-column> -->
            <el-table-column prop="type" label="分类" >
            </el-table-column>

            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
<!--         <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../config/index';
    import {search, editStatus} from '@/api/index'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
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
        created(){

        },
        computed: {},
        methods: {  
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            

            // 点击搜索按钮
            search(){
                this.data=[]
                let option = {
                    college: '',
                    keyword: this.select_word,
                    size: 10000
                }
                search(option).then(res => {
                  this.data=res
                })              
            },

            add(){
                this.$router.push({'path':'/goods/add'});
            },


            // 查看详情
            handleEdit(row) {
                this.$router.push({'path':'/goods/'+row.id});
            },

            // 删除内容 //0 删除，1 正在卖 2 卖出了
            handleDel(row){
                let self = this;
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  editStatus({id: row.id}).then( res => {
                     console.log(res);
                     if(res){
                         self.$message({
                            message: '删除成功',
                            type: 'success'
                          });
                         self.search()
                     }
                 })
                }).catch(() => {});
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