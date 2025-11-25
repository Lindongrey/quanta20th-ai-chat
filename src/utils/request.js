// src/utils/request.js
import axios from 'axios'
import { message as messageAnt } from 'ant-design-vue'

const [message] = messageAnt.useMessage()

/* 1. 创建实例 */
const request = axios.create({
  baseURL: 'http://localhost:8988', // 放在 .env 里：/api
  timeout: 10000
})

/* 2. 请求拦截器 */
request.interceptors.request.use(
  config => {
    // 携带 token（如果有）
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    if (config.data && typeof config.data === 'object') {
      config.headers['Content-Type'] = 'application/json; charset=utf-8'
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