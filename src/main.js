import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { worker } from './mock/browsers'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// if (process.env.NODE_ENV === 'development') {
//   worker.start({
//     serviceWorker: {
//       url: '/mockServiceWorker.js',
//       options: {
//         // 明确指定作用域，确保覆盖所有路由
//         scope: '/'
//       }
//     },
//     onUnhandledRequest: 'bypass',
//     // 可选：打印更多日志
//     quiet: false
//   }).then(() => {
//     console.log('MSW 启动成功！')
//   })
// }