webpackJsonp([23],{z8wQ:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=o("6sKG"),r=o.n(a),n=o("2uFj"),l=o.n(n),s={data:function(){return{upload_url:l.a.base+"upload.php",form:{}}},watch:{$route:function(){this.getDetail()}},created:function(){this.getDetail()},mounted:function(){console.log("edit m agagin")},methods:{getDetail:function(){var e=this;if("add"==this.$route.params.openid)return!1;var t=l.a.base+"user.php?code=getCurrency";r.a.get(t).then(function(t){for(var o=t.data,a=(e.$route.params.id,0);a<o.length;a++)o[a].id==e.$route.params.id&&(e.form=o[a])})},onSubmit:function(){var e=l.a.base+"user.php?code=editCurrency",t=this;r.a.post(e,t.form).then(function(e){console.log(e),200==e.data.code&&(t.$message({message:"编辑成功",type:"success"}),t.$router.back())})},topUploadSuccess:function(e,t,o){console.log(e),this.form.avatarUrl=l.a.base_img+e.name}}},i={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("div",{staticClass:"form-box"},[o("el-form",{ref:"form",attrs:{model:e.form,"label-width":"80px"}},[o("el-form-item",{attrs:{label:"国家"}},[o("el-input",{model:{value:e.form.nation,callback:function(t){e.$set(e.form,"nation",t)},expression:"form.nation"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"名称"}},[o("el-input",{model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"符号"}},[o("el-input",{model:{value:e.form.symbol,callback:function(t){e.$set(e.form,"symbol",t)},expression:"form.symbol"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"代码"}},[o("el-input",{model:{value:e.form.spell,callback:function(t){e.$set(e.form,"spell",t)},expression:"form.spell"}})],1),e._v(" "),o("el-form-item",[o("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("提交")])],1)],1)],1)])},staticRenderFns:[]},m=o("C7Lr")(s,i,!1,null,null,null);t.default=m.exports}});