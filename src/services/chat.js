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

// 单文件上传
export const uploadFileAPI = (file, sessionId) => {
  const formData = new FormData()
  formData.append('file', file)
  return request('/api/ai/document-reader', 'POST', formData, { params: { sessionId } })
}

// 多文件上传，循环调用单文件上传接口实现
// 暂未实现
export const uploadMultipleFilesAPI = (fileList, sessionId) => {
  const resList = []
  for (const file of fileList) {
    const formData = new FormData()
    formData.append('file', file)
    const res = request('/api/ai/document-reader', 'POST', formData, { params: { sessionId } })
    resList.push(res)
  }

  if (resList.forEach(res => res.code !== 200)) {
    return Promise.reject(new Error('文件上传失败')) 
  } else {
    return Promise.resolve('文件上传成功')
  }
}

// 获取会话列表
export const getSessionListAPI = () => {
  return request('/api/ai/list-sessions', 'POST', {})
}
