// mocks/browser.js
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// worker.start({
//   onUnhandledRequest: 'bypass',
//   quiet: false  // 开启详细日志
// }).then(() => {
//   console.log('🎯 MSW 已启动，注册的 handlers:')
//   handlers.forEach(handler => {
//     console.log(`- ${handler.info.method} ${handler.info.path}`)
//   })
// })
