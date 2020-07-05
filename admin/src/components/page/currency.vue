<template>
    <div class="table">
<!--         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> </el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="handle-box">
            <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input> -->
            <el-button type="primary"  @click="add">添加</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" >
            <el-table-column prop="id"  label="ID" >
            </el-table-column>
            <el-table-column prop="nation" label="国家" >
            </el-table-column>
            <el-table-column prop="name" label="名字" >
            </el-table-column>            
            <el-table-column prop="symbol" label="符号" >
            </el-table-column>            
            <el-table-column prop="spell" label="代码" >
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        watch:{
            $route:function(){
               this.getList() 
            }
        },
        created:function(){
           console.log('create agagin') 
          this.getList()
        },
        mounted:function(){
           console.log('m agagin')
        },
        methods: {  
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            

            // 点击搜索按钮
            getList(){
                var self=this;
                var url = config.base+'user.php?code=getCurrency';
                axios.get(url)
                   .then(function (res) {
                      console.log(res)
                      self.data= res.data;
              
                   })                
            },

            add(){
               var data = {
                  'id':'add'
               }
               this.handleEdit(data)
            },

            edit(data){
                const api = config.base+'user.php?code=get';

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

            handleEdit(row){
                this.$router.push({'path':'/editCurrency/'+row.id});
            },

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