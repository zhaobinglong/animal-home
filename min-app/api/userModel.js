// 引入 HTTP 类 路径是相对路径
import http  from '../lib/http.js'

const  requestSubscribeMessage = (ids) => {
  return new Promise((resolve, reject) => {
  	wx.requestSubscribeMessage({
	  tmplIds: ids,
	  success: (res) => { 
        resolve(res)
	  },
	  fail: (res) => {
	  	reject(res)
	  }
	})
  })
}

// 获取验证码和cookie
const  getEnglishTestCode = (data) => {
  return http.request({
    url: 'getEnglishTestCode',
    method: 'POST',
    data: data
  })
}

// 获取成绩
const  getEnglishScore = (data) => {
  return http.request({
    url: 'getEnglishScore',
    method: 'POST',
    data: data
  })
}

// 获取帖子下面的评论
const  getMessageByDetail = (id) => {
  return http.request({
    url: 'getMessageByDetail',
    method: 'POST',
    data: {
      'id': id
    }
  })
}

// 发布评论
const  pushComment = (data) => {
  return http.request({
    url: 'pushComment',
    method: 'POST',
    data: data
  })
}

// 获取分类信息
const getTypeList = () => {
  return http.request({
    url: 'getTypeList'
  })
}

const searchCollege = (name) => {
  return http.request({
    url: 'searchCollege',
    method: 'POST',
    data: {
      'name': name
    }
  })
}

const getInfo = (openid) => {
  return http.request({
    url: 'getInfo',
    method: 'POST',
    data: {
      'openid': openid
    }
  })
}

const saveScore = (data) => {
  return http.request({
    url: 'saveScore',
    method: 'POST',
    data: data
  })  
}

const getCetCard = (data) => {
  return http.request({
    url: 'getCetCard',
    method: 'POST',
    data: {
      zkzh: data
    }
  })  
}

// getTeacherCode
const getTeacherCode = (zjhm) => {
  return http.request({
    url: 'getTeacherCode',
    method: 'POST',
    data:{
      zjhm: zjhm
    }
  })  
}
// getTeacherScore
const getTeacherScore = (data) => {
  return http.request({
    url: 'getTeacherScore',
    method: 'POST',
    data: data
  })  
}

// g
const getOpenid = (code) => {
  return http.request({
    url: 'getOpenid',
    method: 'POST',
    data: {
      code: code
    }
  })  
}

const getLanguageScore = (data) => {
  return http.request({
    url: 'getLanguageScore',
    method: 'POST',
    data: data
  })  
}


const getShareImg = (id) => {
  return http.request({
    url: 'getShareImg',
    method: 'POST',
    data: {
      id: id
    }
  })  
}

const getMyMessage = (data) => {
  return http.request({
    url: 'getMyMessage',
    method: 'POST',
    data: data
  })  
}


const updateMessageStatus = (data) => {
  return http.request({
    url: 'updateMessageStatus',
    method: 'POST',
    data: data
  })  
}

// 根据关键词对指定学校的帖子进行模糊搜索
const search = (data) => {
  return http.request({
    url: 'search',
    method: 'POST',
    data: data
  })  
}

const getChsiCode = (data) => {
  return http.request({
    url: 'getChsiCode',
    method: 'POST',
    data: data
  })  
}


const getChsiScore = (data) => {
  return http.request({
    url: 'getChsiScore',
    method: 'POST',
    data: data
  })  
}

// 用户发布
const push = (data) => {
  return http.request({
    url: 'push',
    method: 'POST',
    data: data
  })  
}

export default {
  requestSubscribeMessage,
  getEnglishTestCode,
  getEnglishScore,
  getMessageByDetail,
  pushComment,
  getTypeList,
  searchCollege,
  getInfo,
  saveScore,
  getCetCard,
  getTeacherCode,
  getTeacherScore,
  getOpenid,
  getLanguageScore,
  getShareImg,
  getMyMessage,
  updateMessageStatus,
  search,
  getChsiCode,
  getChsiScore,
  push
}