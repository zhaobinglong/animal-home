<template>
    <div class="table">
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="微信昵称" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary"  @click="add">添加</el-button>
        </div>

        <el-table :data="data" border style="width: 100%"  >
            <el-table-column label="ID" >
               <template slot-scope="scope">
                  {{scope.$index+1}}
                </template>
            </el-table-column>

            <el-table-column prop="nickName" label="微信昵称" width="120">
            </el-table-column>
            <el-table-column label="头像" >
               <template slot-scope="scope">
                  <img :src="scope.row.avatarUrl" style="width:60px;border-radius:50%">
                </template>
            </el-table-column>
            <el-table-column prop="openid" label="微信唯一id" width="300">
            </el-table-column>
            <el-table-column label="状态" >
               <template slot-scope="scope">
                  <el-button type="text" >{{scope.row.status=='0'?'已删除':'有效'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="加入时间" >
               <template slot-scope="scope">
                   {{scope.row.createtime | filterDateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" type='text'
                            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                data:[]
            }
        },
        created(){
        },
        computed: {

        },
        methods: {  

            // 获取用户列表
            getData(){
                var self=this;
                var url = config.base+'user.php?code=getInfo';
                axios.get(url)
                   .then(function (res) {

                      console.log(res)
                      self.data = res.data;
                   })

              
            },

            search () {
              var url = config.base+'wechat.php?ctrl=api&action=getUserList';
              let obj = {'keyword': this.select_word}
              axios.post(url, obj)
                 .then((res) => {
                  console.log(res)
                  this.data = res.data.res
                 }) 
            },
            
            add(){
              this.$router.push({'path':'/editUser/add'});
            },

            // 查看详情
            handleEdit(index, row) {
                console.log(row)
                this.$router.push({'path':'/editUser/'+row.openid});
            },
            handleDelete(index, row) {
                var self=this;
                var url = config.base+'user.php?code=delUser&id='+row.id;
                axios.get(url)
                   .then(function (res) {
                       console.log(res)
                       if(res.data){

                           self.$message({
                              message: '删除成功',
                              type: 'success'
                            });
                           self.getData();
                       }
                   })
                   .catch(function (error) {
                       console.log(error);
                   });
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