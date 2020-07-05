const userModel = require("../../../utils/userModel.js");
const util = require("../../../utils/util.js");

//获取应用实例
// 'zkzh': '610171192115310',
// 'xm': '郭旭',
var app = getApp();
Page({
  data: {
    form:{
      'username': '18291934412',
      'password': 'q448411098',
      '_eventId': 'submit',
      'submit': '登录',
      'captcha': '',
      'headers': null,
      'Cookie': ''
    },
    cookie: '',
    img: '',
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
  onReady: function() {},

  input(e) {
    this.data.form[e.target.dataset.name] = e.detail.value
  },
  
  // 点击获取验证码图片
  getCode() {
    if (!this.data.form.username) {
       wx.showModal({
        title: '提示',
        content: '必须输入',
        showCancel: false
      })
      return;
    }
    if (!this.data.form.password) {
       wx.showModal({
        title: '提示',
        content: '必须输入密码',
        showCancel: false
      })
      return;
    }
    app.api.getChsiCode(this.data.form).then(data => {
      console.log(data)
      this.setData({
        'img': data.res +'?t='+ Math.floor(Math.random()*100),
        'show_code': true
      })
      this.data.form.lt = data.headers.lt
      this.data.form.execution = data.headers.execution
      this.data.form.Cookie = data.headers.Cookie
      this.data.form.headers = data.headers
      if (data['Set-Cookie'].length) {
        this.data.form.Cookie = this.data.form.Cookie + ';' + data['Set-Cookie']
      } 
    })
  },
  
  // 获取成绩
  getScore() {
    console.log(this.data.form)
    if(!this.data.form.captcha) {
      wx.showModal({
        title: '提示',
        content: '必须输入验证码',
        showCancel: false
      })
      return
    }
    app.api.getChsiScore(this.data.form).then(res => {
      console.log(res)

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
