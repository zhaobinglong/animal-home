
const network = require("/utils/network.js");
const userModel = require("/utils/userModel.js");
const systemModel = require("/utils/userModel.js");
const util = require("/utils/util.js");

import api from '/api/index.js'

import 'umtrack-wx'
import uma from 'umtrack-wx'

App({
  umengConfig: {
    appKey: '5e7c9309978eea06fd7fbe50', //由友盟分配的APP_KEY
    // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。
    // 使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
    useOpenid:false,
    autoGetOpenid: false, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug: false //是否打开调试模式
  },
  statusMap:['删除','正常','卖出', '下架','管理员删除'],  // 帖子的状态值对应的文本
  userInfo: {
    college:"",
    openid:'',
    nickName:'',
    avatarUrl:''
  }, //小程序返回的用户信息
  apibase: "https://examlab.cn/ershouAPI",
  imgbase: "https://examlab.cn/img/",
  location:{}, //首页当前筛选条件（国家+城市）可以被修改
  shareTitle: "UNIBBS,你的掌上大学",
  shareUrl: "pages/date/index/index?from=normal",
  api: api,
  form: {
      openid:'',
      title: "",
      address:'',
      cont: "",
      imgs: [],
      is_new:false,
      price:'',
      old_price:'',
      phone:'',
      level:'全新',
      type:'选择分类',
      naton:'',
      city:'',
      symbol:'yuan',//货币符号
      unit:'',//货币单位
      status: 0, //0 删除，1 正在卖 2 卖出了
    },//二手物品的属性
  nation:'', //首页请求数据使用的国家
  city:'',//首页请求数据使用的城市
  id:'',//临时保存的二手id
  myMessage:[], //缓存我的xiao xi


  week: [
    { index: 0, value: "星期天",name: '日', key: "0" },
    { index: 1, value: "星期一",name: "一", key: "1" },
    { index: 2, value: "星期二",name: "二", key: "2" },
    { index: 3, value: "星期三",name: "三", key: "3" },
    { index: 4, value: "星期四",name: "四", key: "4" },
    { index: 5, value: "星期五",name: "五", key: "5" },
    { index: 6, value: "星期六",name: "六", key: "6" }
  ],
  
  index:0,
  formIds: [], //每次收集到五个，就发送一次
  canvas:{
    img:'http://tmp/wx7dae92e36fcbfdf5.o6zAJs_gZ_z_8pIa-23ybe4fsH5A.H8gxSiCnN39W2b6a4971651234aa073eea22411f5b66.jpg',
    qrcode:'',
    width:300,
    height:300,
    sx:0,
    sy:0
  },
  tempFilePaths:[], //用户选择的手机中的图片，给发布页面使用
  test:0,
  need_update:false , // 标志位，判断返回首页的时候是否需要刷新
  new_school:false , //新的学校，还没有发布，不显示成员和发布数量
  unread:0,                //未读消息
  show_admin_delete_menu: false, // 是否显示管理员的删除菜单
  admin_openid: {
    'ok-v05WiVuERal41Oi-k6PyUvC1Q':'博策',
    'ok-v05YjZolVFZBTRYX-NgMw_ONA':'赵冰龙'
  },
  globalData: {
    detail_share_img: '',   // 帖子详情分享的图片链接
    last_detail: null       // 用户最后一次查看的帖子详情
  },
  /** 
  * 小程序每次启动，登陆逻辑如下
  * 先利用微信接口判断session是否有效
  * session无效，重新发起一次登陆
  * 小程序在使用的过程中不用判断，如果用户一直在使用小程序，则用户登录态一直保持有效
  * 小程序首页逻辑不要强制获取用户昵称和头像，官方反对这样处理
  **/
  onLaunch: function() {
    this.getOpenid()
    wx.uma.trackEvent('小程序启动');
  },

  // 静默获取用户openid，
  getOpenid: function() {
    var self = this; 
    wx.login({
      success: (res) => {
        if (res.code) {
          api.getOpenid(res.code).then(res => {
            wx.setStorageSync('openid', res.openid)
            if (this.admin_openid[res.openid]) {
              // console.log('管理员')
              this.show_admin_delete_menu = true
            } 
            this.getUserInfo(res.openid);
          })
        } else {
          //console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });      
  },
   
  // 获取服务器中用户信息
  // 如果服务器中没有用户信息，接口直接返回false
  // 有两种情况会让用户进入这个逻辑：1、全新的用户 2 、用户换了手机
  getUserInfo:function(openid){
    var self = this;
    api.getInfo(openid).then((res) => {
      if(res){
        self.userInfo = res;
        // 将用户的信息缓存在storage中
        wx.setStorageSync('userInfo', res)
        // wx.setStorageSync('college',res.college)
      }else{
        self.updateUser()
      }

    },false)
  },
  
  // 全新的用户，把用户的openid和college插入数据库
  updateUser:function(){
    const data = {
      openid: wx.getStorageSync('openid'),
      avatarUrl: '',
      nickName: '',
      ad: '',
      wechat: '',
      douyin: '',
      weibo: ''
    }

    api.updateUser(data).then((res) => {
       console.log('在app.js中保存新用户')
    })   
  },
  
  // 通过点击按钮获取到用户信息
  // getUserInfoByButton (e) {
  //     let self = this;
  //     let userInfo = wx.getStorageSync('userInfo')
  //     if(e.detail.errMsg == 'getUserInfo:ok'){
  //       const data = e.detail.userInfo;
  //       userInfo.nickName = data.nickName;
  //       userInfo.avatarUrl = data.avatarUrl;
  //       this.setData({
  //         userInfo: e.detail.userInfo
  //       userModel.updateUser(userInfo,function(res){
  //         wx.setStorageSync('userInfo',userInfo)
  //         self.getInfo(userInfo.openid)
  //       },false)     
  //     } else {
  //       console.log(e)
  //     }
  // }
  
  // 弹出微信分享，给全局调用
  wechatShare (res) {
    let is_goods = util.is_goods(res.category)
    let title = '' 
    let imageUrl = './img/v2/default.jpg'
    let price  = '' 
    let path = "pages/date/detail/index?&id=" + res.id;
    if (res.price) {
      price = res.price + res.symbol + ','
    } else {
      price = ''
    } 
    if (is_goods){
      title = res.college+'：'+ price + res.cont;
    } else {
      title = res.college+'：'+ res.cont;
    }
    
    if (res.imgs.length) {
      imageUrl = res.imgs[0];
    }
    let obj = {
      title: title,
      path: path,
      imageUrl:imageUrl
    }
    console.log(obj)
    return obj
  },

    // 返回主页
  backHome (){
    var url = '/pages/home/index';
    console.log(url)
    wx.switchTab({
      url: url
    })    
  },

});
