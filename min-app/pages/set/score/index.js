
const ershouModel = require("../../../utils/ershouModel.js");
const systemModel = require("../../../utils/systemModel.js");
const config = require("../../../config/index");


//获取应用实例
var app = getApp();
Page({
  data: {
    img: [],
    form: {},
    e: null,
    score: [],
    year: '2020'
  },


  onShareAppMessage: function() {
    var title = app.globalData.last_detail.college+': ' + app.globalData.last_detail.cont;
    var path = "pages/date/detail/index?&id=" + this.data.form.id;
    var imageUrl = app.globalData.last_detail.imgs[0] || ''
    return {
      title: title,
      path: path,
      imageUrl:imageUrl
    };
  },

  /**
  * from = share ，前往详情页面
  **/
  onLoad: function(e) {
    this.getScore(this.data.form.year)       
  },

  clickImg (res) {
      let url = res.currentTarget.dataset.name
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: this.data.img // 需要预览的图片http链接列表
      })
  },

  changeYear() {
    let self = this
    const itemList = ['2020','2019','2018','2017','2016']
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        console.log(res)
        console.log(itemList[res.tapIndex])
        this.setData({
          year: itemList[res.tapIndex]
        })
        this.getScore(itemList[res.tapIndex])
      }
    })    
  },
  
  // 获取成绩，
  getScore(year) {
    this.data.form = wx.getStorageSync('collegeSystem')
    this.data.form.xn = year
    let data = {
      ...this.data.form,
      xn: this.data.year
    }
    app.api.getCollegeExamScore(data).then(res => {
      wx.showLoading('加载成绩...')
      console.log(res)
      if (res.ossUrl.length) {
        let score = [...new Set(res.info)]
        this.setData({
          score: score.slice(0,5),
          img: res.ossUrl
        })  
      } else {
        wx.showModal({
          title: '提示',
          content: '该学年没有成绩,请选择合适的学年',
          showCancel:false,
          success: function(res) {
          }
        })        
      }
      wx.hideLoading()   
    })    
  },
  
  // 后端合成的图片载入完毕
  bindloadImage(e) {
    wx.hideLoading()
    console.log(e)
  },

  getCetCard(zkzh) {
    console.log(zkzh)

    app.api.getCetCard(zkzh).then(res => {
      this.setData({
        img: res
      })
    })
  },

  getTeacherScore(e){
    console.log(e)
    let score = wx.getStorageSync('teacherScore')
    this.setData({
      score: score
    })
  },

  getLanguageScore(e) {
    let score = wx.getStorageSync('LanguageScore')
    console.log(score)
    this.setData({
      score: score
    })
  },

  // 如果没有这个函数，请求无法发送出去
  onReady: function() {},

  // 每次切出页面，获取当前的
  onShow: function() {},





  // 头图下载ok
  loadimg:function(e){
    console.log(e)

  }
 

  

});
