webpackJsonp([5],{MpTN:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=new(s("kV13").default),i={data:function(){return{collapse:!1,fullscreen:!1,name:"请登录",message:0}},computed:{username:function(){var t=JSON.parse(localStorage.getItem("userInfo"));return t?t.nickName:this.name},avatarUrl:function(){return JSON.parse(localStorage.getItem("userInfo")).avatarUrl}},methods:{handleCommand:function(t){"loginout"==t&&(localStorage.removeItem("ms_username"),this.$router.push("/login"))},collapseChage:function(){this.collapse=!this.collapse,n.$emit("collapse",this.collapse)},handleFullScreen:function(){var t=document.documentElement;this.fullscreen?document.exitFullscreen?document.exitFullscreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen():t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullScreen?t.webkitRequestFullScreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.msRequestFullscreen&&t.msRequestFullscreen(),this.fullscreen=!this.fullscreen}}},l={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"header"},[s("div",{staticClass:"collapse-btn",on:{click:t.collapseChage}},[s("i",{staticClass:"el-icon-menu"})]),t._v(" "),s("div",{staticClass:"logo"},[t._v("UNIBBS后台管理系统")]),t._v(" "),s("div",{staticClass:"header-right"},[s("div",{staticClass:"header-user-con"},[s("div",{staticClass:"btn-fullscreen",on:{click:t.handleFullScreen}},[s("el-tooltip",{attrs:{effect:"dark",content:t.fullscreen?"取消全屏":"全屏",placement:"bottom"}},[s("i",{staticClass:"el-icon-rank"})])],1),t._v(" "),s("div",{staticClass:"btn-bell"},[s("el-tooltip",{attrs:{effect:"dark",content:t.message?"有"+t.message+"条未读消息":"消息中心",placement:"bottom"}},[s("router-link",{attrs:{to:"/tabs"}},[s("i",{staticClass:"el-icon-bell"})])],1)],1),t._v(" "),s("div",{staticClass:"user-avator"},[s("img",{attrs:{src:t.avatarUrl}})]),t._v(" "),s("el-dropdown",{staticClass:"user-name",attrs:{trigger:"click"},on:{command:t.handleCommand}},[s("span",{staticClass:"el-dropdown-link"},[t._v("\n                        "+t._s(t.username)+" "),s("i",{staticClass:"el-icon-caret-bottom"})]),t._v(" "),s("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[s("el-dropdown-item",{attrs:{divided:"",command:"loginout"}},[t._v("退出登录")])],1)],1)],1)])])},staticRenderFns:[]};var a={data:function(){return{collapse:!1,role:"",auth:[],items:[{icon:"el-icon-setting",index:"/dashboard",title:"系统首页",show:!0},{icon:"el-icon-tickets",index:"/schoolList",title:"学校管理",meta:{role:"unibbs"}},{icon:"el-icon-message",index:"/currency",title:"货币管理",meta:{role:"unibbs"}},{icon:"el-icon-star-on",index:"/userList",title:"用户管理",meta:{role:"unibbs"}},{icon:"el-icon-date",index:"4",title:"内容管理",meta:{role:"unibbs"},subs:[{index:"/goods",title:"内容列表"},{index:"/copy",title:"内容复制"}]},{icon:"el-icon-warning",index:"/typeList",title:"分类管理"},{icon:"el-icon-setting",index:"/permission",title:"账号配置",meta:{role:"admin"}},{icon:"el-icon-upload",index:"/upload",title:"excel解析",meta:{role:"admin"}},{icon:"el-icon-question",index:"/form",title:"期末成绩查询",meta:{role:"admin"}}]}},computed:{onRoutes:function(){return this.$route.path.replace("/","")}},activated:function(){},created:function(){var t=JSON.parse(localStorage.getItem("userInfo"));console.log(t.formId),this.auth=t.formId,console.log(this.auth),this.role=localStorage.getItem("role"),console.log(this.role)}},o={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"sidebar"},[s("el-menu",{staticClass:"sidebar-el-menu",attrs:{"default-active":t.onRoutes,collapse:t.collapse,"background-color":"#324157","text-color":"#bfcbd9","active-text-color":"#20a0ff","unique-opened":"",router:""}},[t._l(t.items,function(e){return[e.subs?[s("el-submenu",{key:e.index,attrs:{index:e.index}},[s("template",{slot:"title"},[s("i",{class:e.icon}),s("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.title))])]),t._v(" "),t._l(e.subs,function(e,n){return s("el-menu-item",{key:n,attrs:{index:e.index}},[t._v("\n                        "+t._s(e.title)+"\n                    ")])})],2)]:[s("el-menu-item",{key:e.index,attrs:{index:e.index}},[s("i",{class:e.icon}),s("span",{attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.title))])])]]})],2)],1)},staticRenderFns:[]};var r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.showTags?s("div",{staticClass:"tags"},[s("ul",t._l(t.tagsList,function(e,n){return s("li",{key:n,staticClass:"tags-li",class:{active:t.isActive(e.path)}},[s("router-link",{staticClass:"tags-li-title",attrs:{to:e.path}},[t._v("\n                "+t._s(e.title)+"\n            ")]),t._v(" "),s("span",{staticClass:"tags-li-icon",on:{click:function(e){return t.closeTags(n)}}},[s("i",{staticClass:"el-icon-close"})])],1)}),0),t._v(" "),s("div",{staticClass:"tags-close-box"},[s("el-dropdown",{on:{command:t.handleTags}},[s("el-button",{attrs:{size:"mini",type:"primary"}},[t._v("\n                标签选项"),s("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),t._v(" "),s("el-dropdown-menu",{attrs:{slot:"dropdown",size:"small"},slot:"dropdown"},[s("el-dropdown-item",{attrs:{command:"other"}},[t._v("关闭其他")]),t._v(" "),s("el-dropdown-item",{attrs:{command:"all"}},[t._v("关闭所有")])],1)],1)],1)]):t._e()},staticRenderFns:[]};var c={data:function(){return{collapse:!1}},components:{vHead:s("C7Lr")(i,l,!1,function(t){s("mnzf")},"data-v-97b2da74",null).exports,vSidebar:s("C7Lr")(a,o,!1,function(t){s("xnBc")},"data-v-8bc33e5e",null).exports,vTags:s("C7Lr")({data:function(){return{tagsList:[]}},methods:{isActive:function(t){return t===this.$route.path},closeTags:function(t){var e=this.tagsList.splice(t,1)[0],s=this.tagsList[t]?this.tagsList[t]:this.tagsList[t-1];s?e.path===this.$route.path&&this.$router.push(s.path):this.$router.push("/")},closeAll:function(){this.tagsList=[],this.$router.push("/")},closeOther:function(){var t=this,e=this.tagsList.filter(function(e){return e.path===t.$route.path});this.tagsList=e},setTags:function(t){!this.tagsList.some(function(e){return e.path===t.path})&&this.tagsList.push({title:t.meta.title,path:t.path})},handleTags:function(t){"other"===t?this.closeOther():this.closeAll()}},computed:{showTags:function(){return this.tagsList.length>0}},watch:{$route:function(t,e){this.setTags(t)}},created:function(){this.setTags(this.$route)}},r,!1,function(t){s("TKvr")},null,null).exports},created:function(){var t=this;n.$on("collapse",function(e){t.collapse=e})}},u={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"wrapper"},[e("v-head"),this._v(" "),e("v-sidebar"),this._v(" "),e("div",{staticClass:"content-box",class:{"content-collapse":this.collapse}},[e("div",{staticClass:"content"},[e("transition",{attrs:{name:"move",mode:"out-in"}},[e("keep-alive",[e("router-view")],1)],1)],1)])],1)},staticRenderFns:[]},d=s("C7Lr")(c,u,!1,null,null,null);e.default=d.exports},TKvr:function(t,e){},mnzf:function(t,e){},xnBc:function(t,e){}});