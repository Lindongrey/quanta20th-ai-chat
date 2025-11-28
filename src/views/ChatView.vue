<template>
  <context-holder />
  <Flex
    style="height: 90vh;"
    justify="end"
    vertical="true"
  >
    <List class="scroll-list">
      <ListItem
        v-for="(item, index) in context"
        :key="index"
        class="bubble-item">
        <Bubble
          :typing="true"
          :content=item.content
          :placement="item.role === 'user' ? 'end' : 'start'"
          :messageRender="renderMarkdown"
        />
      </ListItem>
    </List>
    <Sender
      :key="senderKey"
      placeholder="← 点击上传文件"
      @submit="senderSubmit"
      :disabled="isGen"
    >
      <!-- 上传文件 -->
      <template #header>
        <Sender.Header
          title="Upload Sample"
          :open="open"
          @open-change="openChange"
        >
          <Flex
            vertical
            align="center"
            gap="small"
            :style="{ marginBlock: token.paddingLG }"
          >
            <UploadDragger
              v-model:fileList="fileList"
              :multiple="true"
              @change="handleChange"
              @drop="handleDrop"
              :before-upload="beforeUpload">
              <p class="ant-upload-drag-icon">
                <inbox-outlined></inbox-outlined>
              </p>
              <p class="ant-upload-text">Click or drag file to this area to upload</p>
              <p class="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
              </p>
            </UploadDragger>
          </Flex>
        </Sender.Header>
      </template>

      <!-- 上传文件按钮 -->
      <template #prefix>
        <Button
          type="text"
          @click="triggerOpen"
        >
          <template #icon>
            <LinkOutlined />
          </template>
        </Button>
      </template>
    </Sender>
  </Flex>
</template>

<script setup>
  import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue'
  import { Button, Flex, theme, Typography, List, UploadDragger, message as messageAnt } from 'ant-design-vue'
  import { Sender, Bubble } from 'ant-design-x-vue'
  import { ref, onMounted, h } from 'vue'
  import { chatAPI, createSessionAPI, uploadFileAPI, uploadMultipleFilesAPI } from '../services/chat'
  import { useSessionStore } from '../stores/sessions'
  import markdownit from 'markdown-it'

  defineOptions({ name: 'AXSenderHeaderSetup' })

  const store = useSessionStore()
  const { token } = theme.useToken()
  const [message, contextHolder] = messageAnt.useMessage()
  // 当前对话的 sessionId
  const currentSessionId = ref()
  // 对话上下文列表
  const context = ref([])
  // 是否处于生成中，若是则禁用发送按钮
  const isGen = ref(false)
  // 输入框的key，用于触发重新渲染
  const senderKey = ref(0)
  // 文件列表
  const fileList = ref([])
  // 是否打开文件上传弹窗
  const open = ref(false)

  const openChange = (v) => {
    open.value = v
  }

  const triggerOpen = () => {
    open.value = !open.value
  }

  // 禁用自动上传
  const beforeUpload = () => {
    return false
  }

  // 渲染Markdown
  const md = markdownit({ html: true, breaks: true })
  const renderMarkdown = (content) =>
    h(Typography, null, {
      default: () => h('div', { innerHTML: md.render(content) }),
    })

  // 处理文件上传，目前可传单个
  const handleChange = (info) => {
    console.log('handleChange', info)
    const { file, fileList: newFileList } = info
    fileList.value = newFileList
  }

  // 提交对话信息
  const senderSubmit = async (e) => {
    // 如果当前会话为空，则创建新会话
    if (context.value.length === 0) {
      await createSession()
    }
    context.value.push({ role: 'user', content: e })
    isGen.value = true
    // 直接更换 key，刷新整个组件，触发重新渲染，清空对话框
    senderKey.value++
    // 单文件上传
    if (fileList.value.length === 1) {
      const file = fileList.value[0]
      const uploadFile = file.originFileObj || file
      // const uploadFileList = fileList.value.map((file) => file.originFileObj || file)
      const res = await uploadFileAPI(uploadFile, store.sessions[0])
      // const res = await uploadFileAPI(uploadFileList, store.sessions[0])
      if (res.code === 200) {
        message.success('文件上传成功')
      } else {
        message.error('文件上传失败')
      }
    } else if (fileList.value.length > 1) {
      const uploadFileList = fileList.value.map((file) => file.originFileObj || file)
      const res = await uploadMultipleFilesAPI(uploadFileList, store.sessions[0])
      console.log(res)
    }
    // 问答请求
    console.log("sessionId: ", store.sessions[0])
    const res = await chatAPI(e, store.sessions[0])
    console.log("chat result: ", res)
    if (res.code === 200) {
      context.value.push({ role: 'ai', content: res.data })
    } else {
      message.error('发生错误！')
    }
    isGen.value = false
    fileList.value = []
    open.value = false
    return ''
  }

  // 进入页面时创建对话并保存 sessionId
  const createSession = async () => {
    const res = await createSessionAPI()
    console.log("create session result: ", res)
    if (res.code === 200) {
      store.addSession(res.data)
    }
  }
</script>

<style scoped>
  .scroll-list {
    flex: 1;
    overflow-y: auto; /* 关键：启用垂直滚动 */
    max-height: 100%;
  }

  .ant-bubble {
    margin: 20px 0;
  }

  :deep(.ant-bubble-content p) {
    margin: 0 !important;
  }
</style>