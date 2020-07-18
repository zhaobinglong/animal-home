

const ershouModel = require("../../utils/ershouModel.js");
const systemModel = require("../../utils/systemModel.js");
const userModel = require("../../utils/userModel.js");
const util = require("../../utils/util.js");
const config = require("../../config/index");
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const COS = require("../../lib/cos-wx-sdk-v5.js");
const Bucket = 'unibbs-1251120507';
const Region = 'ap-beijing';
// 初始化实例
let cos = new COS({
    getAuthorization: function (options, callback) {
        // 异步获取签名
        wx.request({
            url: 'https://examlab.cn/uniapi/cos-js-sdk-v5/sts.php', // 步骤二提供的签名接口
            data: {
                Method: options.Method,
                Key: options.Key
            },
            dataType: 'text',
            success: function (result) {
                let data = JSON.parse(result.data)
                callback({
                    TmpSecretId: data.credentials && data.credentials.tmpSecretId,
                    TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
                    XCosSecurityToken: data.credentials && data.credentials.sessionToken,
                    ExpiredTime: data.expiredTime,
                });
            }
        });
    }
});

var app = getApp();
Page({
  data: {
    category: config.types,
    form: {
      openid: wx.getStorageSync('openid'),
      title: '',
      cont: "",
      imgs: [],
      videos:[],
      imgs_detail: [], 
      is_new:false,
      age:'',
      timeStamp:0, //记录单击时间
      name:'',
      address:'来自哪里？',
      is_my:false,
      is_edit:false,
      tempFilePaths:app.tempFilePaths,
      wechat:'',
      type_index:0, //宝贝默认分类索引
      category:{name: '滁州动保'}, //二级分类
      classify:'', // 一级分类
      status: 1, // 0删除，1正常，2卖出, 3下架
      cos: null
    },

    chooseImgCount: 9, //可以选择的图片数量
    imgbase:app.imgbase,
    symbol:config.momey, //货币符号
    type:config.type,
    imgs:[], //保存上传的图片名字
    tempFile:[], //本地上传的图片，缓存的本地图片的路径，
    pageType:'', // 页面类型：新建或者编辑 add/edit
    default_address: '你在哪里？'

  },
  // onShareAppMessage: function() {
  //   return {
  //     title: app.shareTitle,
  //     path: app.shareUrl
  //   };
  // },
  // 下拉刷新
  // onPullDownRefresh:function(e){
  //    wx.stopPullDownRefresh();
  // },

  /**
  * 每次进入前，先判断用户有没有学校
  * 从微信菜单进入该页面，需要在这个页面获取当前用户定位信息
  * 从首页进入载入发布页面，立刻上传之前选择的照片
  *
  * 如果是全新的用户，它第一次进入发布页面，storage中只保存了它的openid和学校
  * 没有保存其他信息，所以需要调用已接口，获取它的信息
  **/
  onLoad: function(e) {
     const self = this;
     if(e.type == 'edit'){
        app.api.getDetail({id: e.id}).then((r) => {
           r.is_edit = true;
           r.tempFilePaths=[];
           for (var i = 0; i < r.imgs.length; i++) {
              r.tempFilePaths.push(r.imgs[i]);
           }
           r.category = {name: r.category}
           this.setData({
               form: r
           })
           
           //下载目前的第一张图片
           // self.downLoadImg(res.tempFilePaths[0]);
        })        
     }else if(e.type=='add'){
       this.data.form.openid = wx.getStorageSync('openid');
       this.data.form.wechat = wx.getStorageSync('wechat') || '';
       this.data.form.address = wx.getStorageSync('address') || this.data.form.address;
       this.data.form.symbol = wx.getStorageSync('symbol') || config.default_symbol;
       this.data.form.category = e.category
       this.data.form.classify = util.get_classify(e.category)
       this.data.form.is_goods = util.is_goods(e.category)
       this.setData({
         form:this.data.form
       })
               
     }else{
        console.log('other mode')
     }
     this.data.pageType=e.type;

     this.setData({
       symbol:config.momey
     })

     // systemModel.getCurrency((res)=>{
     //   console.log(res)
     //   this.setData({
     //     money:res
     //   })
     // },false)


     // 判断storage中用户的信息全不全，如果没有头像和昵称，就重新获取一次用户信息


  },
  
  // 下载第一张图片到本地，给生成二维码用
  downLoadImg(url){
    console.log(url)
      wx.downloadFile({
        url: url,
        success: function(res) {
          console.log(res)
          if (res.statusCode == 200) {
             app.tempFilePaths = [];
             app.tempFilePaths.push(res.tempFilePath);
             console.log(app.tempFilePaths)
          }
        }
      }) 
  },

  onClickFloatButton() {
    this.create()
  },

  // 页面准备好之后再判断
  onReady: function() {},

  onShow: function() {
    const form = this.data.form;
    form.college = app.userInfo.college;

    this.setData({
       form:form
    })
  },

  // 选择类型
  chooseType:function(e){
     var index = parseInt(e.detail.value);
     var form = this.data.form;
     form.type = this.data.type[index].name;
     this.setData({
        form
     })   
  },
  

  // 点击位置，选择地点
  chooseLocation:function(){
    var self = this;
    var form = this.data.form;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        form.address = res.name;
        self.setData({
          form: form
        });
      }
    });    
  },

  chooseCategory (res) {
    console.log(res.detail.value)
    let index = parseInt(res.detail.value)
    console.log(this.data.category[index])
    let key = "form.category"
    this.setData({
      [key]: this.data.category[index]
    })
  },
  

  // 预览图片
  preViewImg(e){
    var index = e.currentTarget.dataset.index;
    var urls = [];

    urls.push(this.data.imgbase+this.data.form.imgs[index]);
    wx.previewImage({
      urls: urls // 需要预览的图片http链接列表
    })
  },



  bindInput: function(e) {
    var name = e.target.dataset.value;
    var form = this.data.form;
    form[name] = e.detail.value;
  },

  // 点击上传图片
  // 图片只能上传九张，之后上传按钮消失
  // 图片多选上传
  // 也可以上传视频，只能上传一个视频，并且不能有图片
  addImg() {
    var self = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认用原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        
        // 当选中图片后，就更新本地的预览
        let form = self.data.form;
        form.tempFilePaths = form.tempFilePaths.concat(res.tempFilePaths);
        self.setData({
          form:form
        })
        
        for (var i = 0; i < res.tempFiles.length; i++) {
          let filePath = res.tempFiles[i].path;
          let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          self.uploadImg(filePath, filename)
        }      
      }
    });
  },

  uploadImg (filePath, filename) {
    // 给图片命令，名字：当前时间戳+五位数字的随机整数，开始上传
    // 图片名字前增加的参数，会被生成路径
    let self = this
    let key = 'chuzhoudongbao/' + new Date().getTime() + Math.floor(Math.random()*10000) + filename.substring(filename.lastIndexOf('.'))
    cos.postObject({
          Bucket: Bucket,
          Region: Region,
          Key: key,
          FilePath: filePath,
          onProgress: function (info) {}
      }, function (err, data) {
          let form = self.data.form;
          form.imgs.push('https://' + data.Location);
      })
  },

  // 删除图片
  // 将缓存的本地图片数组中对应的也删除
  delImg(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var images = this.data.form.imgs;
    var arr = [];
    for (var i = 0; i < images.length; i++) {
      if (i != index) {
        arr.push(images[i]);
      }
    }
    const form = this.data.form;
    form.imgs = arr;
    this.data.form.tempFilePaths.splice(index,1);

    this.setData({
      form
    });

  },
  
  // 添加视频
  addVideo() {
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        console.log(res.tempFilePath)
        this.uploadVideo(res.tempFilePath)
      }
    })
  },
  longPressVideo () {
    console.log('okk')
    let form = Object.assign({}, this.data.form, {videos: []})
    this.setData({
      form: form
    })
    console.log(this.data.form.videos)
     console.log(this.data.form)
  },

  uploadVideo (filePath) {
    // 给图片命令，名字：当前时间戳+五位数字的随机整数，开始上传
    // 图片名字前增加的参数，会被生成路径
    let self = this
    let key = 'chuzhoudongbao/' + new Date().getTime() + Math.floor(Math.random()*10000) + filePath.substring(filePath.lastIndexOf('.'))
    cos.postObject({
          Bucket: Bucket,
          Region: Region,
          Key: key,
          FilePath: filePath,
          onProgress: function (info) {}
      }, function (err, data) {
          console.log(data)
          let videos = ['https://' + data.Location];
          let form = Object.assign({}, self.data.form, {videos: videos})
          self.setData({
            form: form
          })
      })
  },

  sellDown(){
    this.data.form.status = '0';
    this.create();
  },
  
  // 点击发布按钮，先尝试授权获取用户信息
  // 调用订阅消息，无法和获取用户信息一起
  // async getUserInfo(e){
  //   let ids = ['dgp1OjAIjfz2mr9PbLJ5U2vU4edvkLO0uXpjJhSfAy4', 'w7HeJjn-_4G1i0wAkdw8M77f6vvZTpJYtlezi4CdO7s'];
  //   let  appleSubscribeMessage = await app.api.requestSubscribeMessage(ids);
  //   console.log(appleSubscribeMessage);
  //   this.create();
  // },



  /**
   * 发布帖子
   * 如果地址没有选择，则重新设置为空
   * 将用户最近发布时用到的微信号和地理位置保存在storage中，下次直接读取
  **/
  create(e) {
    if(this.data.form.status != '0'){
       this.data.form.status = '1'
    }
  
    const self = this;

    if(!this.data.form.imgs.length && !this.data.form.cont && this.data.form.status!='0'){
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '不能发布空内容',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return false;
    } 

    if (this.data.form.address === this.data.default_address) {
      this.data.form.address = ''
    }  

    // wx.uma.trackEvent('click_push', this.data.form);
    wx.showLoading({title: '发布中…'});
    let data = Object.assign({}, this.data.form, {category: this.data.form.category.name})
    app.api.push(data).then((res) =>{
      wx.hideLoading();
      wx.redirectTo({
         url: '../success/index?from=create&id='+res.id
      })            
          
    })
  },


   // 点击选择城市
   selectCity(){
      wx.navigateTo({
          url: '../city/index?from=edit'
      })      
   },


   // 选择货币符号
   selectMoney(e){

     var index = parseInt( e.detail.value);
     var form = this.data.form;
     form.symbol = this.data.money[index].value;
     form.unit = this.data.money[index].unit;
     this.setData({
        form
     })
   },

    formSubmit: function(e) {
      userModel.collectFormId(e);
    },
});
