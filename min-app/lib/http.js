// 定义基础url 
const BASE_URL = "https://examlab.cn/animal-home/wechat.php?ctrl=api&action=";

// 定义http 请求类
class HTTP {
  // 定义方法 传入参数 使用对象解构形式 外加默认参数
  request({
    url,
    data={},
    method="GET"
  }){
    // resolve 成功 reject 失败
    return new Promise((resolve, reject) => {
      // 调用方法 传入参数 url 路径 data 传递的参数 method 请求方式
      this._request(url, resolve, reject, data, method)
    })
  }
  // 定义请求方法 需要的参数 data 不传 默认为空对象 请求方式默认get
  _request(url, resolve, reject,data = {}, method = "GET") {
    wx.request({
      // 基础路径 加上 接口的路径
      url: BASE_URL + url,
      header: {
        // 这里用这种 是post请求时候，后台容易出问题 这种写法可以正常使用
        'content-type': 'application/json;charset=utf-8',
      },
      // 传递的参数
      data: data,
      // 请求方式
      method: method,
      // 成功回调
      success: res => {
        // 微信提供的 请求响应 200 为成功
        var code = res.statusCode.toString();
        // 取首个字符 如果是2xx 成功
        var startChar = code.charAt(0);
        // 判断是否 2开头 并且 后台自定义返回的code 为0 则为成功
        if (startChar == '2' && res.data.code == 0 || res.data.code == 200) {
          // 直接使用 Promise 的成功回调 把res.data return 出去
          resolve(res.data.data)
          // 如果请求成功 但是后台返回code 404 则根据情况 做出处理 这里是需要登录
        }  else {
          // 失败直接提示 根据需求改动
          this.showMsg(res.data)
        }
      },
      // 断网情况 失败 500 等
      fail: err => {
        // 走 catch 失败函数
        reject(err)
        this.showMsg('网络超时，请重试')
      },
      // 无论成功失败 都会执行的函数
      complete:function(){
        wx.hideLoading()
      }
    })
  }
  // 定义toast 提示 
  showMsg(str) {
    wx.showToast({
      title: str,
      icon: 'none',
      duration: 2500
    });
  }

}
// 抛出 供其他页面使用
module.exports  = new HTTP()