import request from '../utils/request'

// 测试
export const testAPI = () => {
  return request('/api/ai/test', 'GET', { input: '你好' })
}

// AI 问答
export const chatAPI = (input, sessionId) => {
  return request('/api/ai/stream-chat', 'POST', { 
    input, sessionId
  })
}

// 新建会话
export const createSessionAPI = () => {
  return request('/api/ai/create-session', 'POST', {} )
}
