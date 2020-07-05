const userModel = require("../../../utils/userModel.js");
const util = require("../../../utils/util.js");

//获取应用实例
// http://www.cltt.org/studentscore/
// 'idCard': '141031199203030013',
// 'name': '任建龙',
var app = getApp();
Page({
  data: {
    form:{
      'idCard': '',
      'name': ''
    },
  },
  onShareAppMessage: function() {
    return {
      title: app.shareTitle,
    };
  },

  onLoad: function(e) {
    wx.uma.trackEvent('user_from', e.from);
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  input(e) {
    this.data.form[e.target.dataset.name] = e.detail.value
  },
  
  // 点击获取验证码图片
  getScore() {
    if (!this.data.form.idCard) {
       wx.showModal({
        title: '提示',
        content: '必须输入身份证号码',
        showCancel: false
      })
      return;
    }
    if (!this.data.form.name) {
       wx.showModal({
        title: '提示',
        content: '必须输入姓名',
        showCancel: false
      })
      return;
    }

    app.api.getLanguageScore(this.data.form).then(res => {
      console.log(res)
      if (res.msg == 'ok') {
        wx.setStorageSync('LanguageScore', res.res)
        wx.navigateTo({
          url: '/pages/date/share/index?from=language' 
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  
  saveScore(obj) {
    console.log(obj)
    app.api.saveScore(obj).then(res => {
      console.log(obj)
    })
  },


  onShow: function() {

  },


});
