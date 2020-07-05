import Vue from 'vue'
// import moment from 'moment'
// import config from '../config/index'

// Vue.filter('durationToTime', value => {
//   let min = Number.parseInt(value / (60 * 1000), 10) + ''
//   let seconds = Number.parseInt((value / 1000) % 60, 10) + ''
//   min = min.length === 1 ? ('0' + min) : min
//   seconds = seconds.length === 1 ? ('0' + seconds) : seconds
//   return min + ':' + seconds
// })

// Vue.filter('playCount', value => {
//   value += ''
//   if (value.length >= 6) {
//     return value.substr(0, value.length - 4) + '万'
//   }
//   return value
// })

// Vue.filter('unix2Time', time => {
//   let date = new Date(time)
//   let year = date.getFullYear()
//   let month = date.getMonth()
//   let day = date.getDate()
//   return year + '-' + month + '-' + day
// })

// Vue.filter('splitTags', tags => {
//   if (typeof tags === 'object') {
//     return tags.join('/')
//   }
//   return ''
// })

// Vue.filter('timeToStr', time => {
//   let min = Number.parseInt(time / 60, 10) + ''
//   let seconds = Number.parseInt(time % 60, 10) + ''
//   min = min.length === 1 ? ('0' + min) : min
//   seconds = seconds.length === 1 ? ('0' + seconds) : seconds
//   return min + ':' + seconds
// })

// // 格式化时间
// Vue.filter('filterDateFormat', time => {
//   var time = parseInt(time);
//   time = time*1000;
//   return moment(time).format('YYYY-MM-DD HH:mm')
// })

// // 过滤订单状态
// Vue.filter('filterStatus', value => {
//       if(value == '1'){
//         return '未支付';
//       }else if (value == '2'){
//         return '已支付,等待安排保镖';
//       }else if(value == '3'){
//         return '保镖执行中';
//       }else if(value == '4'){
//         return '已结束';
//       }else if(value == '5'){
//         return '被取消'
//       }else{
//         return '其他'
//       }
// })

// //给图片增加前缀
// Vue.filter('filterImg', value => {
//     return config.base_img+value
// })

// //转int
// Vue.filter('filterInt', value => {
//     return parseInt(value)
// })

//换算用户级别等级
Vue.filter('filterUserStatus', value => {
  let level = [
    '无',
    '一级用户',
    '二级用户',
    '代理商'
  ]
  return level[parseInt(value)]
})

//格式化时间
Vue.filter('filterTime', v => {
  var time = new Date(parseInt(v) * 1000);
  var y = time.getFullYear();
  var m = time.getMonth()+1 < 10 ? '0' + (time.getMonth()+1) : time.getMonth()+1 
  var d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  var h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  var s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
  return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
})

// 换算订单状态
Vue.filter('filterOrderStatus', value => {
  if (value === '已结束') {
    return value 
  } else {
    let level = [
      '已删除',
      '等待支付',
      '等待发货',
      '等待收货',
      '等待评论'
    ]
    return level[parseInt(value)]
  }
})

// 状态转换
Vue.filter('filterStatus', value => {
  if (value === '1') {
    return '是' 
  } else {
    return '否' 
  }
})
