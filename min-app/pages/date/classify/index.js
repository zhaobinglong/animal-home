

const systemModel = require("../../../utils/systemModel.js");
const userModel = require("../../../utils/userModel.js");
const utils = require("../../../utils/util.js");
const pinyinUtil = require("../../../utils/pinyinUtil.js");

//获取应用实例
var app = getApp();
Page({
  data: {
    classify: []
  },

  onLoad: function() {
    if (wx.getStorageSync('college')) {
      wx.navigateTo({'url':'pages/date/city/index'})
    }
    app.api.getTypeList().then(res => {
      console.log(res)
      this.setData({
        classify: res
      })
      wx.setStorageSync('classify', res)
    })
  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {},

  onShow: function() {},
  clickType: function(e) {
    let type = e.detail
    let path = '../create/index?type=add&category=' + type;
    wx.uma.trackEvent('click_push_classify', path);
    try {
      var create_store_act=wx.getStorageSync('create_store_act')
      if (create_store_act && create_store_act=='showCategory') {
        // Do something with return value
        wx.setStorageSync('create_store_type',type);
        wx.removeStorageSync('create_store_act')
        wx.navigateBack({
          delta:1
        }) 
      }else{
        wx.navigateTo({
          url:path
        })    
      }
    } catch (e) {
      // Do something when catch error
    }
    
  },


});
