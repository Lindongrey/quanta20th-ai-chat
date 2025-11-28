// src/utils/request.js
import axios from 'axios'
import { message as messageAnt } from 'ant-design-vue'

const [message] = messageAnt.useMessage()

/* 1. 创建实例 */
const request = axios.create({
  // baseURL: 'http://localhost:8100', // 放在 .env 里：/api
  baseURL: '',  // 配置了代理，不能使用绝对路径，否则会被代理拦截
  timeout: 30000
})

/* 2. 请求拦截器 */
request.interceptors.request.use(
  config => {
    // 携带 token（如果有）
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `${token}`

    // 如果是 FormData，不设置 Content-Type，让浏览器自动设置
    if (config.data instanceof FormData) {
      // 对于 FormData，让浏览器自动设置 Content-Type 和 boundary
      delete config.headers['Content-Type']
    } else if (['POST', 'PUT', 'PATCH'].includes(config.method?.toUpperCase())) {
      // 对于普通 JSON 数据，设置 Content-Type
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json; charset=utf-8'
      }
      // 确保数据是对象格式
      if (config.data === null || config.data === undefined) {
        config.data = {}
      }
    }

    return config
  },
  error => Promise.reject(error)
)

/* 3. 响应拦截器 */
request.interceptors.response.use(
  response => {
    const { data } = response
    // 后端约定 code === 200 为成功
    if (data.code === 200) return data
    // 统一错误提示
    message.error(data.msg || '请求异常')
    return Promise.reject(data)
  },
  error => {
    // 网络或 http 状态码错误
    console.log('error: ', error)
    
    message.error(error.response?.data?.msg || '网络错误')
    return Promise.reject(error)
  }
)

/* 4. 导出通用 request；调用方只需传入路径与可选配置 */
export default (url, method = 'GET', data = null, extra = {}) =>
  request({ url, method, [method.toUpperCase() === 'GET' ? 'params' : 'data']: data, ...extra })

/* 5. 可选：再导出 get/post 快捷方法 */
// export const get = (url, params, extra) => request(url, 'GET', params, extra)
// export const post = (url, data, extra) => request(url, 'POST', data, extra)