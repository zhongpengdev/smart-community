<template>
    <el-dialog
        v-model="dialogVisible"
        :title="chatUser ? `与 ${chatUser.userName} 的聊天` : '聊天'"
        width="600px"
        :close-on-click-modal="false"
        @close="handleClose"
        class="chat-dialog"
    >
        <div class="flex flex-col h-[600px]">
            <!-- 消息列表 -->
            <div ref="messageListRef" class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
                <!-- Loading -->
                <div v-if="loading" class="flex justify-center py-8">
                    <el-icon class="is-loading" size="24"><Loading /></el-icon>
                </div>
                
                <!-- Messages -->
                <div
                    v-for="message in messages"
                    :key="message.messageId"
                    class="flex"
                    :class="message.fromUserId === userStore.userInfo?.userId ? 'justify-end' : 'justify-start'"
                >
                    <div
                        class="flex gap-2 max-w-[70%]"
                        :class="message.fromUserId === userStore.userInfo?.userId ? 'flex-row-reverse' : 'flex-row'"
                    >
                        <!-- Avatar -->
                        <el-avatar :size="36" :src="message.fromUserAvatar" class="shrink-0">
                            {{ message.fromUserName.charAt(0) }}
                        </el-avatar>
                        
                        <!-- Message Content -->
                        <div>
                            <div
                                class="px-4 py-2 rounded break-words"
                                :class="message.fromUserId === userStore.userInfo?.userId 
                                    ? 'bg-[#ff5000] text-white rounded-none' 
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-none'"
                            >
                                {{ message.content }}
                            </div>
                            <div class="text-xs text-slate-400 mt-1 px-1">
                                {{ formatTime(message.createTime) }}
                                <span v-if="message.fromUserId === userStore.userInfo?.userId && message.isRead === 1" class="ml-1">
                                    已读
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Empty State -->
                <div v-if="!loading && messages.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Icon name="lucide:message-circle" size="48" class="mb-2 opacity-50" />
                    <p class="text-sm">暂无聊天记录</p>
                </div>
            </div>
            
            <!-- 输入框 -->
            <div class="border-t border-slate-200 dark:border-slate-700 p-4">
                <div class="flex gap-2">
                    <el-input
                        v-model="messageContent"
                        type="textarea"
                        :rows="3"
                        placeholder="输入消息..."
                        maxlength="500"
                        show-word-limit
                        @keydown.enter.ctrl="handleSend"
                    />
                </div>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-slate-400">
                        Ctrl + Enter 发送
                    </span>
                    <el-button
                        type="primary"
                        @click="handleSend"
                        :loading="sending"
                        :disabled="!messageContent.trim()"
                        class="!bg-[#ff5000] !border-[#ff5000] hover:!bg-[#ff6a00]"
                    >
                        发送
                    </el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

const props = defineProps<{
    visible: boolean
    chatUser: { userId: number; userName: string; avatar: string } | null
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
}>()

const userStore = useUserStore()
const { loading, sending, messages, sendMessage, openChat, closeChat } = useChat()

const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
})

const messageContent = ref('')
const messageListRef = ref<HTMLElement>()

// 格式化时间
const formatTime = (time: string) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    
    return date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// 发送消息
const handleSend = async () => {
    if (!messageContent.value.trim() || !props.chatUser) return
    
    try {
        await sendMessage(props.chatUser.userId, messageContent.value)
        messageContent.value = ''
        
        // 滚动到底部
        nextTick(() => {
            scrollToBottom()
        })
    } catch (error) {
        // 错误已在 composable 中处理
    }
}

// 滚动到底部
const scrollToBottom = () => {
    if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
}

// 关闭对话框
const handleClose = () => {
    messageContent.value = ''
    closeChat()
    dialogVisible.value = false
}

// 监听对话框打开
watch(() => props.visible, async (newVal) => {
    if (newVal && props.chatUser) {
        await openChat(props.chatUser)
        
        // 滚动到底部
        nextTick(() => {
            scrollToBottom()
        })
    }
})

// 监听新消息，自动滚动
watch(() => messages.value.length, () => {
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

<style scoped>
:deep(.chat-dialog .el-dialog__body) {
    padding: 0;
}

:deep(.el-textarea__inner) {
    resize: none;
}
</style>

