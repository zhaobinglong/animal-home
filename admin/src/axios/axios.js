import axios from 'axios'; //使用axios作为基础
import { Message, Loading } from 'element-ui';
// import store from '../store';


let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loading = Loading.service({
      lock: true,
      text: '加载中……',
      background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

//让ajax携带cookie
//axios.defaults.withCredentials=true;

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://test.com/' : 'https://examlab.cn/uniapi/',
  timeout: 5000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) {
  //   config.headers['X-Token'] = store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  showFullScreenLoading()
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

//对拦截的参数进行处理，post的参数，需要转换一次


// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    console.log(response)
    const res = response.data;
    if (res.code !== 200) {
      tryHideFullScreenLoading()
      return Promise.reject(res);
      // Message({
      //   message: res.data || '有警告信息出现，请联系管理员',
      //   type: 'error',
      //   duration: 5 * 1000
      // });

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload();// 为了重新实例化vue-router对象 避免bug
      //     });
      //   })
      // }
    } else {
      tryHideFullScreenLoading()
      return Promise.resolve(res.data);
    }
  },
  error => {
    console.log('err' + error);// for debug
    if (error.message === 'Network Error') {
      Message({
        message: '网络异常，请检查您的网络',
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      });
    }
    tryHideFullScreenLoading()
    return Promise.reject(error);
  }
)

export default service;
