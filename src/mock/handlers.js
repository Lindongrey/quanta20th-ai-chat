// mocks/handlers.js
import { http, HttpResponse } from 'msw'

export const handlers = [
  // 模拟聊天发送接口
  http.post('*/api/ai/stream-chat', async ({ request }) => {
    console.log('🎯 MSW 拦截到 /api/ai/stream-chat')
    
    const requestBody = await request.json()
    console.log('📨 请求体:', requestBody)
    
    // 使用正确的字段名
    const { input, sessionId } = requestBody
    
    // 模拟 AI 回复 - 返回前端期望的格式
    return HttpResponse.json({
      code: 200,                    // 前端拦截器期望的字段
      msg: 'success',               // 可选：错误消息字段
      data: {                       // 前端拦截器会返回这个 data
        role: 'ai',
        data: `这是AI对"${input}"的回复，会话ID: ${sessionId}`,
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
  }),

  // 模拟创建会话接口
  http.post('*/api/ai/create-session', async () => {
    console.log('🎯 MSW 拦截到 /api/ai/create-session')
    
    return HttpResponse.json({
      code: 200,
      msg: 'success',
      data: {
        data: '7f7d2348-a117-4787-a2b3-35e01e15b7be'
      }
    })
  })
]