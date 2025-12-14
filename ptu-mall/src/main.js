import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

// 引入 Element Plus
import ElementPlus from 'element-plus'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(ElementPlus) // 使用 Element Plus

app.mount('#app')

// main.ts

// 如果您正在使用CDN引入，请删除下面一行。

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}