// src/utils/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 使用/api前缀，通过Vite代理转发到后端
  timeout: 5000,
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 这里的 code 是后端 Result 对象里的 code
    if (res.code !== 200) {
      ElMessage.error(res.msg || '系统错误')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res.data // 直接返回后端 Result 中的 data 部分
  },
  (error) => {
    console.error('err' + error)
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)

export default request
