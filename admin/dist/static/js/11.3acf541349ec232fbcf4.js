webpackJsonp([11],{Exvd:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("6sKG"),l=a.n(n),s=a("gyMJ"),i=a("2uFj"),r=a.n(i),c={data:function(){return{tableData:[],cur_page:1,multipleSelection:[],select_cate:"",select_word:"",del_list:[],is_search:!1,data:[],api:r.a.base}},activated:function(){this.getList()},methods:{getList:function(){var t=this,e=localStorage.getItem("role");Object(s.d)({id:"",belong:e}).then(function(e){console.log(e),t.data=e})},add:function(){this.handleEdit({name:"",id:"add"})},edit:function(t){var e=r.a.base+"wechat.php?ctrl=api&action=editType";console.log(t);var a=this;l.a.post(e,t).then(function(t){console.log(t),200==t.data.code&&(a.$message({message:"编辑成功",type:"success"}),a.getList())})},handleEdit:function(t){this.$router.push({path:"/banner/"+t.id})},handleDel:function(t){t.status=0,this.edit(t)}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[t._v("首页")]),t._v(" "),a("el-breadcrumb-item",[t._v("banner管理")])],1)],1),t._v(" "),a("div",{staticClass:"handle-box"},[a("el-button",{attrs:{type:"primary"},on:{click:t.add}},[t._v("添加")])],1),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.data,border:""}},[a("el-table-column",{attrs:{prop:"id",label:"ID"}}),t._v(" "),a("el-table-column",{attrs:{label:"banner"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{staticStyle:{width:"60px"},attrs:{src:t.row.img}})]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"title",label:"简短描述"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"small",type:"text"},on:{click:function(a){return t.handleEdit(e.row)}}},[t._v("编辑")])]}}])})],1)],1)},staticRenderFns:[]};var d=a("C7Lr")(c,o,!1,function(t){a("Ri1k")},"data-v-cb7ad0d8",null);e.default=d.exports},Ri1k:function(t,e){}});