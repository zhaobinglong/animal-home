const userModel = require("../../../utils/userModel.js");
const util = require("../../../utils/util.js");

//获取应用实例
// 测试帐号1
// username: '2016010301',
// password: '255714',

// 测试帐号2
// username: '2016010363',
// password: '199703152741',

var app = getApp();
Page({
  data: {
    form:{
      username: '',
      password: '',
      college: '',
      cookie: '',
      yzm: ''
    },
    img: '',
    show_code: false
  },

  onShareAppMessage: function() {
    let path = "pages/set/qimo/index?college=" + this.data.form.college
    return {
      title: this.data.form.college + ': 全校师生都在这里查成绩',
      path: path
    };
  },
  
  // 在url中获取学校，不是每个学校都可以查
  onLoad: function(e) {
    console.log(e)
    if (e.college) {
      if (e.college != '运城学院' && e.college != '太原工业学院') {
        wx.showModal({
        title: '提示',
        content: '该学校暂未开通成绩查询，请联系管理员开通',
        showCancel:false,
        success: function(res) {
          wx.navigateBack()
        }
      }) 
      } else {
        this.data.form.college = e.college
      } 
    } else {
        wx.showModal({
        title: '提示',
        content: '非法的学校名字',
        showCancel:false,
        success: function(res) {
        }
      })  
    }
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
        content: '必须输入帐号',
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
    app.api.getCollegeSystemCode(this.data.form).then(data => {
      console.log(data)
      this.data.form.cookie = data.cookie
      this.setData({
        show_code: true,
        img: data.img
      })      
    })
  },
  
  // 先登陆系统
  getScore() {
    console.log(this.data.form)
    if(!this.data.form.yzm) {
      wx.showModal({
        title: '提示',
        content: '必须输入验证码',
        showCancel: false
      })
      return
    }
    app.api.collegeSystemLogin(this.data.form).then(res => {
      console.log(res)
      // 把用户登陆成功的信息保存在storage中
      wx.setStorageSync('collegeSystem', res)
      wx.navigateTo({
          url: '/pages/set/score/index'
      })      
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
