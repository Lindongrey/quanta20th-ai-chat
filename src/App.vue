<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { Conversations } from 'ant-design-x-vue'
import { Layout, Space } from 'ant-design-vue'
import { computed, onMounted } from 'vue'
import { getSessionListAPI } from './services/chat.js'
import { useSessionStore } from './stores/sessions.js'

defineOptions({ name: 'AXConversationsBasicSetup' })

const sessionStore = useSessionStore()

const items = sessionStore.sessions

// 获取会话列表
const getSessionList = async () => {
  const res = await getSessionListAPI()
  res.data.forEach(session => {
    sessionStore.sessions.push({
      key: session.sessionId,
      label: session.title || `会话 ${session.sessionId}`,
    })
  })
}

// 切换会话
const changeSession = (e) => {
  console.log("active session change to ", e)
  sessionStore.currentSession = e
  console.log("current session is ", sessionStore.currentSession)
}

onMounted(() => {
  getSessionList()
})
</script>

<template>
  <div class="main">
    <Conversations
      :items="items"
      class="convPart"
      @activeChange="changeSession"
    />
    <RouterView class="routerPart"/>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.convPart {
  flex: 1;
  height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.routerPart {
  flex: 5;
  height: 100%;
}
</style>
