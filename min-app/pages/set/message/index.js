const util = require("../../../utils/util.js");

//获取应用实例
var app = getApp();
Page({
  data: {
     message:[],
     loading: true,
     page: 0
  },

  onLoad: function() {
    this.getMyMessage(this.data.page)
  },

  getMyMessage(page) {
     let openid = wx.getStorageSync('openid')
     let data = {
      openid: openid,
      page: this.data.page
     }
     app.api.getMyMessage(data).then(res => {
      console.log(res)
        res.map(item => {
          item.createtime = util.formatTimeStamp(item.createtime + '000')
        })
       this.setData({
        message: this.data.message.concat(res),
        page: page + 1,
        loading: false
       })
     })
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},
  onShow: function() {}
  
});
