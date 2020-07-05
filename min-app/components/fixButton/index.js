const util = require("../../utils/util.js");
Component({
  properties: {  
  },
  data: {
  },
  attached: function(){
  },
  methods: {
    // 这个按钮的点击就负责发布，全局的登陆入口应该保持只有一个，要不然根本无法维护
    onClick: function() {
      wx.navigateTo({
         url: '/pages/create/index'
      }) 
    }
  }
})