// 引入 HTTP 类 路径是相对路径
import http  from '../lib/http.js'

const  getCollegeNotice = (college) => {
  return http.request({
    url: 'getCollegeNotice',
    method: 'POST',
    data: {
      college: college
    }
  })
}

// 查询指定大学的期末考试成绩
const  getCollegeExamScore = (data) => {
  return http.request({
    url: 'getCollegeExamScore',
    method: 'POST',
    data: data
  })
}

const  getCollegeSystemCode = (data) => {
  return http.request({
    url: 'getCollegeSystemCode',
    method: 'POST',
    data: data
  })
}

// 登陆教务系统
const  collegeSystemLogin = (data) => {
  return http.request({
    url: 'collegeSystemLogin',
    method: 'POST',
    data: data
  })
}
// 抛出 此类 供页面使用
// export {
//   indexModel
// }
export default {
  getCollegeNotice,
  getCollegeExamScore,
  getCollegeSystemCode,
  collegeSystemLogin
}