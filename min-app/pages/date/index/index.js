
const ershouModel = require("../../../utils/ershouModel.js");
const userModel = require("../../../utils/userModel.js");
const systemModel = require("../../../utils/systemModel.js");
const util = require("../../../utils/util.js");
const config = require("../../../config/index.js");

//获取应用实例
var app = getApp();
Page({
  data: {
    e:{}, //url中的参数
    all:[],//列表原始数据
    list:[],
    types:[],
    imgbase:app.imgbase,
    loading:true,//加载中
    city:'',
    wxLocation:{},
    location:{}, //顶部显示的位置信息
    page:0, //默认第0页
    
    college:{
      member:[] 
    },
    is_loading:false, //数据正在请求中，不要重复请求
    no_page:false, //最后一页数据获取后，为true
    is_first_loading:true,
    unread:0,
    types:config.type,
    current_type:'全部',
    current_level: 'first', // 当前查询的分类级别
    openid:'', //用户发openid
    e:{},  //保存load阶段给的参数对象
    yesterday: 0,
    show_subcate: false, // 显示多级分类
    is_goods: false, // 判断是不是商品，是商品，要显示瀑布流
    classify: '全部', //当前一级分类
    category: '', //当前二级分类
    current_top_type: 'city',
    current_category: null, //当前应该显示的二级菜单信息
    notice: null
  },

  // 监视滚动距离
  bindscroll:function (e) {
    // console.log(e.detail.scrollTop)
    var top=e.detail.scrollTop,
      float_nav;
    if (top>=90) {
      float_nav=true;
    }else{
      float_nav=false;
    }
    this.setData({
      float_nav
    })
  },

  // 下拉刷新
  onPullDownRefresh:function(e){
    this.updateList();
  },
  
  // 底部记载
  onReachBottom: function() {
    let college = '' 
    if (this.data.e && this.data.e.college) {
      college = this.data.e.college
    } else {
      college = wx.getStorageSync('college')
    }
    this.getList(college)
  },

  /**
   * 首页进入情况
   * - 新用户或者老用户搜索小程序进入
   * - 新用户点击别人分享的学校主页进入
   * - 用户通过扫描学校二维码进入
  **/
  onLoad (e) {
     this.data.e = e
     // 获取分类 
     app.api.getTypeList().then((res)=>{
        wx.setStorageSync('classify',res)
        this.setData({
          types: res
        })
     })

     // 如果首页是重新加载，则将缓存移除
     wx.removeStorageSync('indexList')
  },

  // 每次切出页面，刷新数据，因为其他页面可能有删除和添加操作
  // 回到首页， 要把刚刚下载的图片清除
  // 每次onshow，判断用户是否授权，如果不美授权获取信息，则重新发起授权
  // 每次onshow，刷新消息数量
  onShow: function() {
    // 首页的url中一定要有college，如果意外没有，则使用本地保存的大学名字
    let title = 'unibbs'
    if (this.data.e && this.data.e.college) {
      title = title + '-' + this.data.e.college
      wx.setStorageSync('college', this.data.e.college)
    } else {
      title = title + '-' + wx.getStorageSync('college')
    }
    wx.setNavigationBarTitle({
      title: title
    })      

    // 如果列表有缓存，直接使用缓存
    let indexList = wx.getStorageSync('indexList')
    if (indexList) {
      this.setData({
        list: indexList,
        loading: false
      })
      return false
    }

      let college = wx.getStorageSync('college')
     if(this.data.e.scene){
       this.getCollgeById(e.scene)
     // 用户通过小程序首页或者学校主页进入
     }else{
       // 如果路由中存在大学
       if(this.data.e && this.data.e.college){
         this.getList(this.data.e.college);         
         wx.setStorageSync('college',college)
       // 路由中没有大学，但是你本地有大学
       } else if (college){
         this.getList(college);
       } else {
         wx.redirectTo({
          url:'../city/index'
         })          
       }
     }
    this.setData({
      loading: false
    })

     // 获取学校通知，延迟2s弹出
     app.api.getCollegeNotice(wx.getStorageSync('college')).then(res => {
      this.setData({
        notice: res
      })
     })
    // let indexList = wx.getStorageSync('indexList')  
    // console.log('=======')
    // console.log(indexList) 
    // if (indexList) {
    //   this.setData({
    //     list: indexList,
    //   })
    // }
  },
  

  onClickBannerType (e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    this.setData({
      current_top_type: item
    })
  },
  
  // 卡片点击事件
  onClickEvent (e) {
    console.log(e)
    let college = wx.getStorageSync('college')
    const path = '/pages/date/detail/index?college='+college+'&id=' + e.detail.obj.id
    wx.navigateTo({
      url:path
    })
  },
  

  // 局部更新列表上的点赞数
  // updateLiked (id,status) {
  //   for (var i = 0; i < this.data.list.length; i++) {
  //     if (id === this.data.list[i].id) {
  //       let obj = this.data.list[i];
  //       if (status == '1') {
  //         obj.liked = parseInt(obj.liked) + 1
  //       } else {
  //         if (parseInt(obj.liked) >= 1) {
  //           obj.liked = parseInt(obj.liked) - 1
  //         }
  //       }
        
  //       this.setData({
  //         ["list[" + i + "]"]:obj
  //       })
  //     }
  //   }
  // },

  // 根据关键词模糊搜索
  search(v){
    let data = {
      keyword: v.detail.value,
      college: app.userInfo.college || wx.getStorageSync('college'),
      page: 0
    }
    app.api.search(data).then(res => {
      this.setData({
        list: res
      })
    })
  },

  // 点击个人中心
  clickUser(){
    const path = '../../set/index/index?openid='+wx.getStorageSync('openid');
     wx.navigateTo({
      url:path
     })
  },

  // 首页下拉刷新
  // 下拉刷新的时候，本地的college肯定是已经存在的了
  updateList(){
     this.data.page = 0;
     this.data.list = [];
     this.setData({
      no_page:false,
      loading: true
     })
     let college = wx.getStorageSync('college')
     this.getList(college);
  },


  // 获取大学信息
  getCollege:function(name){
     let self = this;
     let collegeInfo = wx.getStorageSync('collegeInfo')
     console.log(this.data.e)
     console.log(collegeInfo)
     if (collegeInfo.top_img && collegeInfo.uName == this.data.e.college) {
      self.setData({
        college: collegeInfo
      })
     } else {
       systemModel.getCollege(name,function(res){
          res.count = 630+res.member.length;
          // 把请求的大学信息保存在storage中，每次切换学校，都要重新更新
          wx.setStorageSync('collegeInfo', res)
          self.setData({
            college: res
          })
       },false) 
     }
   },

  // 点击子分类
  clickType(e){
     const type = e.currentTarget.dataset.type;
     const is_goods = util.is_goods(type)
     this.setData({
       category: type,
       classify: '',
       show_subcate: false,
       is_goods: is_goods
     })
     this.updateList();
  },

  // 点击一级分类 弹出二级分类的显示，只显示本分类下的信息
  // 如果二级分类已经展开，这个时候只需要收起，其他不做
  clickClassify(e) {
    if (this.data.show_subcate) {
      this.setData({
        show_subcate: false
      })
      return false
    }

    let classify = e.currentTarget.dataset.classify;
    let allType = wx.getStorageSync('classify')
    let is_goods = false;
    if (classify == '二手' || classify == '租房' || classify == '兼职') {
      is_goods = true;
    }
    this.setData({
      classify: classify,
      category: '',
      is_goods: is_goods
    }) 
    
    // 只有等于全部，才刷新列表
    if (classify === '全部') {
      this.setData({
        show_subcate: true,
        current_category: allType
      })
     this.updateList();  
    } else {
      // 点击某个分类，只显示当前这个分类下的二级菜单
      let types = [] 
      allType.map((item) => {
         if (item.name === classify) {
          types.push(item)
         }
      })
      this.setData({
        current_category: types,
        show_subcate: true
      })
    }

    this.updateList('')
  },
  
  // 点击分类菜单右侧的箭头
  clickTypeMore () {
    const show_subcate = !this.data.show_subcate
    let allType = wx.getStorageSync('classify')
    this.setData({
      current_category: allType,
      show_subcate: show_subcate
    })
  },

  // 获取二手列表
  // 如果当前学校还没有发布，跳转加入我们页面
  // 将第二页的数据，开始乱序排列：目的是因为一个人会发布多个，让数据看起来更接近理想情况
  // 如果没有数据，就跳转合伙人页面
  getList(name){
  
      if(this.data.no_page){
         return false;
      }

      const self = this;
      const page = this.data.page;
      this.data.is_loading = true;
      let classify = self.data.classify === '全部' ? '':self.data.classify;
      // 如果没有参数，就获取当前url中的大学名字
      ershouModel.getList({
        college: name,
        classify: classify,
        category: self.data.category,
        page: page,
        openid: ''
      },function(r){
         // wx.hideLoading();
         wx.hideNavigationBarLoading()
         wx.stopPullDownRefresh();
         self.data.is_loading = false;
         // for (var i = 0; i < r.res.length; i++) {
         //    r.res[i].is_goods = util.is_goods_by_classify(r.res[i].classify)
         //    if(!r.res[i].symbol){
         //       r.res[i].symbol = config.default_symbol
         //    }
         //   var time = parseInt(r.res[i].createtime)*1000;
         //   r.res[i].formatDate = new Date(time).toLocaleDateString()
         // }
         const list =  self.data.list.concat(r.res);

          self.setData({
            list:list,
            is_first_loading:false,
            loading: false
          })
          
          // 缓存首页列表数据
          wx.setStorageSync('indexList', list)
         // 如果返回小于十条，表示后面没有了
         if(r.res.length<20){
            self.setData({
               no_page:true
            })
         }
         self.data.page++;
      },false)       
  },

  // 获取位置描述
  // 用户当前地理位置只请求一次
  // 将用户当前的地理位置保存进入userInfo
  // getLocation(){
  //     console.log('进入getLocation')
  //     var self = this;
  //     util.getLocationDesc(function(res,other){
  //        console.log('定位服务返回：')
  //        console.log(res)
  //        if(res.city){
  //          app.city = res.city
  //          // console.log('city不存在，使用locality：'+res.locality)
  //          // res.city = res.locality
  //        }else{
  //          app.city = res.locality
  //        }
  //        app.nation  = res.nation;
  //        app.userInfo.nation = res.nation;
  //        app.userInfo.address = res.street;
  //        app.userInfo.city = res.city?res.city:res.locality;
  //        self.getList('');
  //        var location = {
  //          nation:app.nation,
  //          city:app.city
  //        }
  //        self.setData({
  //           location
  //        })

  //     // 用户拒绝地理位置授权
  //     },function(res){

  //        if(res.status == 1000){
  //          wx.showModal({
  //             title: '提示',
  //             content: '拒绝获取位置将无法使用小程序，重新去授权吗?',
  //             cancelText:'不用了',
  //             confirmText:'去授权',
  //             success: function(res) {
  //               if (res.confirm) {
  //                 console.log('用户点击确定')
  //                 wx.openSetting({
  //                     success: (res) => {}
  //                 })
  //               }else{
  //                 wx.reLaunch({
  //                   url: '../error/index'
  //                 })
  //               } 
  //             }
  //           })
  //        }
  //     })
  // }, 

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

  
  // 选择照片，准备发布
  // 在首页选择的照片，因为不能直接传递给下一个页面，所以只能保存进入全局对象app中
  chooseImg:function(){
        wx.navigateTo({
           url: '../create/index?type=add'
        }) 
  
  },

  // 通过sid获取学校名字
  getCollgeById:function(sid){
    systemModel.getCollegeById(sid,function(res){
      const url = '/pages/date/index/index?college='+res.uName;
      wx.redirectTo({
        url:url
      })
    },false)
  },

  onShareAppMessage: function() {
    let college = wx.getStorageSync('college')
    let path = "pages/date/index/index?college=" + college;
    console.log(path)
    wx.uma.trackEvent('home_share', path);
    return {
      title: college + '主页',
      path: path,
    };
  },

});
