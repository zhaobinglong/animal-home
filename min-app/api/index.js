// api入口文件，一个项目可能有很多api，
// 和user相关的api，和xxx相关的api，都导入到index中，index统一导出
import indexModel  from './indexModel.js'
import userModel  from './userModel.js'
import wechatModel  from './wechatModel.js'
import collegeModel  from './collegeModel.js'
export default {
  ...indexModel,
  ...userModel,
  ...wechatModel,
  ...collegeModel
}