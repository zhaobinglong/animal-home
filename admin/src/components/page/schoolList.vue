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
            <el-button type="primary" icon="search" @click="add">添加学校</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" >
            <el-table-column prop="sid"  label="ID" >
            </el-table-column>
            <el-table-column prop="uName" label="大学名称" width="200">
            </el-table-column>
            <el-table-column prop="uName" label="logo" width="100">
               <template slot-scope="scope">
                  <img :src="scope.row.logo" style="width:60px;border-radius:50%">
                </template>
            </el-table-column>
            <el-table-column prop="nation" label="头图" width="120">
               <template slot-scope="scope">
                  <img :src="scope.row.top_img" style="width:60px;">
                </template>
            </el-table-column>
            <el-table-column prop="province" label="省份" >
            </el-table-column>
            <el-table-column prop="city" label="城市" >
            </el-table-column>
            <el-table-column prop="district" label="辖区" >
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <a :href="api+'user.php?code=getLittleImg&page=index&id='+scope.row.sid">小程序二维码下载</a>
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
    import { searchCollege } from '@/api/';
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
                // var self=this;
                // var url = config.base+'user.php?code=searchSchool&name='+this.select_word;
                // axios.get(url)
                //    .then(function (res) {
                //       self.data= res.data;

                //    })   
                searchCollege({name: this.select_word}).then(res => {
                    console.log(res)
                    this.data= res;
                })         
            },

            add(){
                this.$router.push({'path':'/school/add'});
            },


            // 查看详情
            handleEdit(row) {
                console.log(row)
                this.$router.push({'path':'/school/'+row.sid});
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