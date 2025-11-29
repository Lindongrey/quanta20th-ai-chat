import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref([])

  const hasSession = (id) => sessions.value.includes(id)

  function addSession(id) {
    if (!hasSession(id)) sessions.value.push(id)
  }
  function removeSession(id) {
    const idx = sessions.value.indexOf(id)
    if (idx > -1) sessions.value.splice(idx, 1)
  }
  function clearSessions() {
    sessions.value = []
  }

  // 当前正在用的 session
  const currentSession = ref(null)

  return { sessions, hasSession, addSession, removeSession, clearSessions, currentSession }
}, {
  persist: {
    key: 'session-store',
    paths: ['sessions'],   // 数组直接可序列化，无需自定义 serializer
  },
})