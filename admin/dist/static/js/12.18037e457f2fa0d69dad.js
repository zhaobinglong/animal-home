webpackJsonp([12],{OxL4:function(t,e){},"u/24":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("6sKG"),l=a.n(n),o=a("2uFj"),s=a.n(o),r={data:function(){return{data:[]}},created:function(){},computed:{},methods:{getData:function(){var t=this,e=s.a.base+"user.php?code=getInfo";l.a.get(e).then(function(e){console.log(e),t.data=e.data})},search:function(){var t=this,e=s.a.base+"wechat.php?ctrl=api&action=getUserList",a={keyword:this.select_word};l.a.post(e,a).then(function(e){console.log(e),t.data=e.data.res})},add:function(){this.$router.push({path:"/editUser/add"})},handleEdit:function(t,e){console.log(e),this.$router.push({path:"/editUser/"+e.openid})},handleDelete:function(t,e){var a=this,n=s.a.base+"user.php?code=delUser&id="+e.id;l.a.get(n).then(function(t){console.log(t),t.data&&(a.$message({message:"删除成功",type:"success"}),a.getData())}).catch(function(t){console.log(t)})}}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table"},[a("div",{staticClass:"handle-box"},[a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"微信昵称"},model:{value:t.select_word,callback:function(e){t.select_word=e},expression:"select_word"}}),t._v(" "),a("el-button",{attrs:{type:"primary",icon:"search"},on:{click:t.search}},[t._v("搜索")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.add}},[t._v("添加")])],1),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.data,border:""}},[a("el-table-column",{attrs:{label:"ID"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                  "+t._s(e.$index+1)+"\n                ")]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"nickName",label:"微信昵称",width:"120"}}),t._v(" "),a("el-table-column",{attrs:{label:"头像"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{staticStyle:{width:"60px","border-radius":"50%"},attrs:{src:t.row.avatarUrl}})]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"openid",label:"微信唯一id",width:"300"}}),t._v(" "),a("el-table-column",{attrs:{label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text"}},[t._v(t._s("0"==e.row.status?"已删除":"有效"))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"加入时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                   "+t._s(t._f("filterDateFormat")(e.row.createtime))+"\n                ")]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"small",type:"text"},on:{click:function(a){return t.handleEdit(e.$index,e.row)}}},[t._v("查看")]),t._v(" "),a("el-button",{attrs:{size:"small",type:"danger"},on:{click:function(a){return t.handleDelete(e.$index,e.row)}}},[t._v("删除")])]}}])})],1)],1)},staticRenderFns:[]};var i=a("C7Lr")(r,c,!1,function(t){a("OxL4")},"data-v-b51f3f08",null);e.default=i.exports}});