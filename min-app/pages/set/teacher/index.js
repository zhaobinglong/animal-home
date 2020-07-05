const userModel = require("../../../utils/userModel.js");
const util = require("../../../utils/util.js");

// 任建龙
// 141031199203030013
var app = getApp();
Page({
  data: {
    form:{
      'zjhm': '', // 身份证号码
      'xm': '', // 姓名 
      'ksxm': '2nasVMoohJ6cFnsQEIjGYmh', // 固定值
      'pram': 'results', // 固定值
      'verify': '', // 验证码
      'Referer': 'http://search.neea.edu.cn/QueryMarkUpAction.do?act=doQueryCond&pram=results&community=Home&sid=2nasVMoohJ6cFnsQEIjGYmh',
      'cookie': ''
    },
    show_code: false
  },
  onShareAppMessage: function() {
    return {
      title: app.shareTitle,
    };
  },

  onLoad: function() {

  },

  // 只要在页面初始化的时候，主动登陆一次，其他时候需要点击登陆按钮完成登陆
  onReady: function() {

  },

  input(e) {
    this.data.form[e.target.dataset.name] = e.detail.value
  },
  
  // 点击获取验证码图片
  getCode() {
    if (!this.data.form.zjhm) {
       wx.showModal({
        title: '提示',
        content: '必须输入身份证号码',
        showCancel: false
      })
      return;
    }
    if (!this.data.form.xm) {
       wx.showModal({
        title: '提示',
        content: '必须输入姓名',
        showCancel: false
      })
      return;
    }
    app.api.getTeacherCode(this.data.form.zjhm).then(res => {
      console.log(res)
      if (res.msg == 'ok') {
        this.setData({
          show_code: true,
          img: res.res + '?t=' + Math.floor(Math.random()*100000)
        })
        this.data.form.cookie = res.cookie
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  
  // 获取成绩
  getScore() {
    console.log(this.data.form)
    if(!this.data.form.verify) {
      wx.showModal({
        title: '提示',
        content: '必须输入验证码',
        showCancel: false
      })
      return
    }
    if(this.data.form.verify.length !== 4) {
      wx.showModal({
        title: '提示',
        content: '验证码长度必须4位',
        showCancel: false
      })
      return
    }
    app.api.getTeacherScore(this.data.form).then(res => {
      console.log(res)
      if(res.msg == 'ok') {
        wx.setStorageSync('teacherScore', res.res)
        wx.navigateTo({
          url: '/pages/date/share/index?from=teacher&xm=' + this.data.form.xm +'&zjhm=' + this.data.form.zjhm
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
