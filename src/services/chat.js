import request from '../utils/request'

// AI 问答
export const chatAPI = (input, sessionId) => {
  return request('/api/ai/stream-chat', 'POST', { 
    input, sessionId
  })
}

// 新建会话
export const createSessionAPI = () => {
  return request('/api/ai/create-session', 'POST')
}
