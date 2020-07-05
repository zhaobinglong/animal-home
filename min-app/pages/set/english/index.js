const userModel = require("../../../utils/userModel.js");
const util = require("../../../utils/util.js");

//获取应用实例
// 'zkzh': '610171192115310',
// 'xm': '郭旭',
var app = getApp();
Page({
  data: {
    form:{
      'zkzh': '',
      'xm': '',
      'yzm': ''
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
  onReady: function() {

  },

  input(e) {
    this.data.form[e.target.dataset.name] = e.detail.value
  },
  
  // 点击获取验证码图片
  getCode() {
    if (!this.data.form.zkzh) {
       wx.showModal({
        title: '提示',
        content: '必须输入准考证号',
        showCancel: false
      })
      return;
    }
    if (this.data.form.zkzh.length != 15) {
       wx.showModal({
        title: '提示',
        content: '准考证号长度不符合要求',
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
    let data = {
      'c': 'CET',
      'ik': this.data.form.zkzh,
      't': Math.floor(Math.random()*100000)
    }
    app.api.getEnglishTestCode(data).then(res => {
      console.log(res)
      let code = res.res.split('"');
      let path = 'http://cet.neea.edu.cn/imgs/' + code[1] +'.png'
      console.log(path)
      this.setData({
        'img': path,
        'show_code': true
      })
      this.data.form.cookie = res.cookie

    })
  },
  
  // 获取成绩
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
    if(this.data.form.yzm.length !== 4) {
      wx.showModal({
        title: '提示',
        content: '验证码长度必须4位',
        showCancel: false
      })
      return
    }
    app.api.getEnglishScore(this.data.form).then(res => {
      console.log(res)
      let json = util.getParenthesesStr(res);
      console.log(json)

      let str = json.substring(1, json.length - 1)
      let arr = str.split(',')
      if (arr.length == 1) {
        wx.showModal({
          title: '提示',
          content: arr[0].split(":")[1],
          showCancel: false
        })
      } else if(arr.length == 11) {
        let score = '总分：' + arr[3].split(":")[1] + ','
        let listen = '听力：' + arr[6].split(":")[1] + ','
        let read = '读写：' + arr[7].split(":")[1] + ','
        let write = '作文：' + arr[8].split(":")[1]
        wx.showModal({
          title: '提示',
          content: score + listen + read + write,
          showCancel: false,
          confirmText: '查看证书',
          success: (res) => {
            wx.navigateTo({
              url: '/pages/date/share/index?from=cet&zkzh=' + this.data.form.zkzh
            })
          }
        }) 
        let obj = {
          ...this.data.form,
          college: arr[2].split(":")[1].replace(/'/g, ''),
          s: arr[3].split(":")[1],
          id_number: arr[5].split(":")[1].replace(/'/g, ''),
          l: arr[6].split(":")[1],
          r: arr[7].split(":")[1],
          w: arr[8].split(":")[1],
          kyz: arr[9].split(":")[1].replace(/'/g, ''),
          kys: arr[10].split(":")[1].replace(/'/g, ''),
        }
        this.saveScore(obj)
      } else {
        wx.showModal({
          title: '提示',
          content: str,
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
