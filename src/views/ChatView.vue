<template>
  <context-holder />
  <Flex
    style="height: 90vh;"
    justify="end"
    vertical="true"
  >
    <!-- <Bubble
      v-for="item in context"
      :key="item.content"
      :typing="true"
      :content=item.content
      :placement="item.role === 'user' ? 'end' : 'start'"
    /> -->
    <List class="scroll-list">
      <ListItem
        v-for="(item, index) in context"
        :key="index">
        <Bubble
          :typing="true"
          :content=item.content
          :placement="item.role === 'user' ? 'end' : 'start'"
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
            <CloudUploadOutlined style="font-size: 4em" />
            <Typography.Title
              :level="5"
              style="margin: 0"
            >
              Drag file here(just demo)
            </Typography.Title>
            <Typography.Text type="secondary">
              Support pdf, doc, xlsx, ppt, txt, image file types
            </Typography.Text>
            <Button @click="selectFileClick">
              Select File
            </Button>
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
  import { Button, Flex, theme, Typography, List, message as messageAnt } from 'ant-design-vue'
  import { Sender, Bubble } from 'ant-design-x-vue'
  import { ref, onMounted } from 'vue'
  import { chatAPI, createSessionAPI } from '../services/chat'

  defineOptions({ name: 'AXSenderHeaderSetup' })

  const { token } = theme.useToken()
  const [message, contextHolder] = messageAnt.useMessage()
  // 对话上下文列表
  const context = ref([
    {
      role: 'user',
      content: '你好，我是用户'
    },
    {
      role: 'ai',
      content: '你好，我是AI助手' 
    },
    {
      role: 'user',
      content: '你好，我是用户'
    },
    {
      role: 'ai',
      content: '你好，我是AI助手' 
    }
  ])
  // 是否处于生成中，若是则禁用发送按钮
  const isGen = ref(false)
  // 输入框的key，用于触发重新渲染
  const senderKey = ref(0)

  const open = ref(false)

  const openChange = (v) => {
    open.value = v
  }

  const triggerOpen = () => {
    open.value = !open.value
  }

  const senderSubmit = (e) => {
    message.success('Send message successfully!')
    context.value.push({ role: 'user', content: e })
    isGen.value = true
    // 问答请求
    const res = chatAPI(e)
    // 直接更换 key，刷新整个组件，触发重新渲染
    senderKey.value++
    setTimeout(() => {
      isGen.value = false
    }, 3000)
    return ''
  }

  const selectFileClick = () => {
    message.info('Mock select file')
  }

  onMounted(() => {
    // 创建会话
    createSessionAPI()
  })
</script>

<style scoped>
  .scroll-list {
    flex: 1;
    overflow-y: auto; /* 关键：启用垂直滚动 */
    max-height: 100%;
  }
</style>