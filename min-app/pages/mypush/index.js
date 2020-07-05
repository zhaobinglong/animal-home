
const ershouModel = require("../../utils/ershouModel.js");
const userModel = require("../../utils/userModel.js");
const systemModel = require("../../utils/systemModel.js");
const util = require("../../utils/util.js");
const config = require("../../config/index.js");


//获取应用实例
var app = getApp();
Page({
  data: {
    list:[],
    page: 0,
    e: null
  },

  onShareAppMessage: function() {
    return {
      title: 'UNIBBS: 来看看我发布的帖子吧',
    };
  },

  /**
  * 如果from不存在，则来自首页
  * from = share,来自微信消息。前往详情页面
  **/
  onLoad: function(e) {
    this.data.e = e
    this.getList(this.data.page)      
  },

  // 每次切出页面，刷新数据，因为其他页面可能有删除和添加操作
  onShow: function() {},

  // 获取列表
  getList(page){
    let data = {
      openid: this.data.e.openid,
      page: page
    }
    app.api.getListByUser(data).then(res => {
      console.log(res)
      // if (res.length == 0) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '没有更多了',
      //     showCancel: false
      //   })
      //   return false
      // }
      this.setData({
        list: this.data.list.concat(res),
        page: page + 1
      })
    })
  },
    // 底部记载
  // onReachBottom: function() {
  //   this.getList(this.data.page);
  // },

  // 获取位置描述
  // 用户当前地理位置只请求一次
  // 将用户当前的地理位置保存进入userInfo
  getLocation(){
      console.log('进入getLocation')
      var self = this;
      util.getLocationDesc(function(res,other){
         console.log('定位服务返回：')
         console.log(res)
         if(res.city){
           app.city = res.city
           // console.log('city不存在，使用locality：'+res.locality)
           // res.city = res.locality
         }else{
           app.city = res.locality
         }
         app.nation  = res.nation;
         app.userInfo.nation = res.nation;
         app.userInfo.address = res.street;
         app.userInfo.city = res.city?res.city:res.locality;
         self.getList();
         var location = {
           nation:app.nation,
           city:app.city
         }
         self.setData({
            location
         })

      // 用户拒绝地理位置授权
      },function(res){

         if(res.status == 1000){
           wx.showModal({
              title: '提示',
              content: '拒绝获取位置将无法使用小程序，重新去授权吗?',
              cancelText:'不用了',
              confirmText:'去授权',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                      success: (res) => {}
                  })
                }else{
                  wx.reLaunch({
                    url: '../error/index'
                  })
                } 
              }
            })
         }
      })
  }, 

  // 数据过滤 哥怒type展示
  filterList(type){
    var list=[];
    if(type == '广场'){
       list = this.data.all;
    }else{
       for (var i = 0; i < this.data.all.length; i++) {
          if(this.data.all[i].type == type){
              list.push(this.data.all[i])
          }
       }
    }

    this.setData({
      list
    })
  },




  

  // 如果没有这个函数，请求无法发送出去
  onReady: function() {},








});
