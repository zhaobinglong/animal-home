
Component({
  properties: {
    list: {
      type: Array ,
      value: [],
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  // 生命周期中，执行一次
  attached: function(){
    // var list = this.data.list;
    // for (var i = 0; i < list.length; i++) {
    //    if(list[i].nickName.length>5){
    //      list[i].nickName = list[i].nickName.substring(0,4)+'···'
    //    }
    // }
    // this.setData({
    //   list
    // })
  },
  methods: {
    // 这里是一个自定义方法
    clickItem: function(e){
      
    },

    // 点击一条消息，点击之后，将状态重置
    clickItem(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
           url: '/pages/date/detail/index?id='+item.ershou
        })
        this.updateMessageStatus(item.id)
    },
    
    // 更新消息状态为已读
    updateMessageStatus(id) {
      let data = {
        id: id,
        status: '已读'
      }
      getApp().api.updateMessageStatus(data).then(res => {
        console.log(res)
        if (res) {
          let message = this.properties.list;
          for (var i = 0; i < message.length; i++) {
              if(message[i].id == id){
                  message[i].status = '已读';
              }
          }
          this.setData({
             list: message
          })
        }
      })
    }
  }
})