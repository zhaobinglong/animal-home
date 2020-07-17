
Page({
  data: {
    url:''
  },
  onLoad: function(e) {
     const url = e.url
     console.log(e)
     this.setData({
      url:url
     })
  },

})