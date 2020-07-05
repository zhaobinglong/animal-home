// 引入 HTTP 类 路径是相对路径
import http  from '../lib/http.js'

const  setLangs = (lang) => {
  return http.request({
    url: 'getInfo',
    // 需要传递的参数 放入data
    data:{
      // 参数赋值 发送给后台
      type: lang
    }
  })
}

const  getList = (data) => {
  return http.request({
    url: 'getList',
    method: 'POST',
    data: data
  })
}

const  getListByUser = (data) => {
  return http.request({
    url: 'getListByUser',
    method: 'POST',
    data: data
  })
}

// 抛出 此类 供页面使用
// export {
//   indexModel
// }
export default {
  setLangs,
  getList,
  getListByUser
}