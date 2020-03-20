import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})
// 给所有http请求加一个请求头，把localstorage中的东西提取出来
http.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 在localStorage.token进行判断，如果没有的话 就不传
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 前端通用是错误处理进行拦截
// 对于错误的捕获，一般来说时全局捕获,然后用箭头函数去写
http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.data.message) {
    Vue.prototype.$message({
      message: err.response.data.message,
      type: 'error'
    })
    // console.log(err.response)
    // 再次对错误信息进行提取判断，当等于401时，直接跳转至登陆页面
    if (err.response.status === 401) {
      router.push('/login')
    }
  }
  return Promise.reject(err)
})
export default http
