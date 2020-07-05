<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>EXCEl解析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box" style="margin: 20px 0">
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
           <el-button type="primary" icon="search" @click="importExcel" >一键导入</el-button>
        </div>
        
            <!-- <div class='' v-for="item in fileList">{{ item }}</div> -->
   <!--  <div class="handle-box" style="margin: 20px 0">
        <el-button type="primary" icon="search" @click="chooseTable(item)" v-for="item in tables" :key="item"
    >{{ item }} </el-button>
    </div> -->
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
    </div>
</template>

<script>
    import UploadExcelComponent from '@/components/UploadExcel/index.vue'
    import VueCropper  from 'vue-cropperjs';
    import config from '../../config/index';
    import XLSX from 'xlsx'
    import { uploadExcel } from '@/api/market';
    export default {
        data: function(){
            return {
                upload_url:config.base+'upload_tencent_cloud.php',
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
                 tableData: [],
                  tableHeader: [],
                  tables: [],
                  worksheet: [], // 多张表的数组
                  uploadData: [],
                  uniqueString: '', // 随机字符串，防止导入错误
                  fullscreenLoading: false, // loading时候全局遮盖
                  loading: null
            }
        },
        components: {
            VueCropper,
            UploadExcelComponent
        },
        methods:{
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                this.cropImg = this.defaultSrc;
            },
            uploadSuccess(res) {
                console.log(res)
                this.fileList.push(res.oss_url)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            },
// 全局遮盖
    openFullScreen() {
      this.loading = this.$loading({
        lock: true,
        text: '正在导入',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },

    randomString(length) {
      var str = '';
      for ( ; str.length < length;){
         str += Math.random().toString(36).substr(2);
      } 
      return str.substr(0, length);
    },


    // 要导入的索引，从0开始
    startUploadData(index) {
      console.log(this.uploadData[index])
      uploadExcel(this.uploadData[index]).then(res => {
        console.log(res)
        if (index < this.uploadData.length - 1) {
          this.startUploadData(index + 1)
        } else {
          this.loading.close();
          this.$message({
            type: 'success',
            message: '导入结束'
          });
        }
      })
    },
    importExcel() {
      console.log(this.table)
      // return;
      if (this.tableData.length) {
        this.uploadData = []
        this.uniqueString = this.randomString(10)
        this.tableData.map(item => {
            this.uploadData.push({
              name: item['货品名称']?item['货品名称']:'',
              size: item['规格(单位)']?item['规格(单位)']:'',
              price_pre: item['昨日价格']?item['昨日价格']:'',
              price_now: item['今日价格']?item['今日价格']:'',
              price_updown: item['价格波动']?item['价格波动']:'',
              order_num: item['订货量']?item['订货量']:'',
              remark: item['备注']?item['备注']:'',
              scale: item['每件货大概重量']?item['每件货大概重量']:''
            })
        })
        console.log(this.tableData)
        // this.openFullScreen()
        this.startUploadData(0)
      } else {
        this.$message({
          type: 'error',
          message: '请先选择excel表格'
        });
      }
    },
    // 选择不同的表
    // chooseTable(table) {
    //   const worksheet = this.worksheet[table]
    //   this.tableData = XLSX.utils.sheet_to_json(worksheet)
    //   this.current_table_name = table

    //   // 重置表头
    //   const header = this.getHeaderRow(worksheet)
    //   console.log(header)
    //   this.tableHeader = header
    // },
    // getHeaderRow(sheet) {
    //   const headers = []
    //   const range = XLSX.utils.decode_range(sheet['!ref'])
    //   let C
    //   const R = range.s.r
    //   /* start in the first row */
    //   for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
    //     const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    //     /* find the cell in the first row */
    //     let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    //     if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    //     headers.push(hdr)
    //   }
    //   return headers
    // },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },

            // 数据表选择成功，默认加载表一
            handleSuccess({ results, header, sheetNames}) {
              console.log(results)
              this.tables = sheetNames
              this.tableHeader = header.slice(0,9)
              this.worksheet = results.Sheets
              // 取出第一张表中的数据
              let firstSheetName = results.SheetNames[0]
              console.log(firstSheetName)
              const worksheet = results.Sheets[firstSheetName]
              console.log(worksheet)
              this.tableData = XLSX.utils.sheet_to_json(worksheet)
            }
        },
        created(){
            this.cropImg = this.defaultSrc;
        }
    }
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>