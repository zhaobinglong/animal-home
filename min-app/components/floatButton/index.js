const util = require("../../utils/util.js");
const userModel = require("../../utils/userModel.js");

Component({
  properties: {
    path: {
      type: String ,
      value: null
      // observer:'loadData'
    },
    icon: {
      type: String ,
      value: 'icon-custom-service'      
    },
    openType: {
      type: String,
      value: null
    }
    // obj: {
    //   type: Object ,
    //   value: [],
    //   observer:'loadData'
    // }  
  },
  data: {
    'navigatePath':{
      'default': '/pages/feedback/index'
    }
  },
  attached: function(){
  },

  methods: {
    getUserInfoByButton(e) {
      let userInfo = wx.getStorageSync('userInfo')
      if(e.detail.errMsg == 'getUserInfo:ok'){
        const data = e.detail.userInfo;
        userInfo.nickName = data.nickName;
        userInfo.avatarUrl = data.avatarUrl;
        userModel.updateUser(userInfo,function(res){
          wx.setStorageSync('userInfo',userInfo)
        },false)     
      }    
      this.triggerEvent('floatbuttonevent') 
    },
    onClick: function() {
      console.log(this.properties.path)
      if (this.properties.path) {
        wx.navigateTo({
           url: this.properties.path
        })         
      } else {
        console.log('event')
        this.triggerEvent('floatbuttonevent')
      }
    }
  }
})