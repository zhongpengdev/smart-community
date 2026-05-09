<template>
    <div class="h-[calc(100vh-3rem)] relative overflow-clip bg-white dark:bg-black">
        <div class="h-full flex flex-col relative">
            <AgentSiderBarSiderBarCo />
            <AgentHomepageContentCo :messages="messages" :agent-status="agentStatus" :tool-calls="toolCalls"
                class="flex-1 z-10" />
            <div
                class="w-full flex justify-center px-4 pb-12 pt-2 z-10 shrink-0 bg-gradient-to-t to-transparent from-white dark:from-black via-white dark:via-black">
                <AgentHomepageInputCo :loading="isProcessing" @send="handleSendMessage" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAgent } from '~/composables/agent/useAgent'
import { useSession } from '~/composables/agent/useSession'
import type { Message } from '~/components/Agent/Homepage/ContentCo.vue'
import { useAgentStore } from '~/stores/agent'
import AgentSiderBarSiderBarCo from '~/components/Agent/SiderBar/SiderBarCo.vue'

definePageMeta({
    layout: 'agent'
})

const route = useRoute()
const colorMode = useColorMode()
const agentStore = useAgentStore()

// 使用 computed 响应路由变化
const currentSessionId = computed(() => route.params.sessionId as string)

const { sendStreamMessage, streamingMessage, isStreaming, loading, agentStatus, toolCalls } = useAgent()
const { fetchSessionMessages } = useSession()

const messages = ref<Message[]>([])
const isProcessing = computed(() => loading.value || isStreaming.value)

// 加载会话历史
const loadSessionHistory = async (sessionId: string) => {
    // 清空当前消息
    messages.value = []

    // 更新 store
    agentStore.setSession(sessionId)

    // 如果正在流式传输，不加载历史
    if (isStreaming.value) {
        return
    }

    try {
        const history = await fetchSessionMessages(sessionId)
        if (history && Array.isArray(history)) {
            messages.value = history.map((msg: any) => ({
                role: (msg.role === 'user' || msg.sender_type === 'user') ? 'user' : 'assistant',
                content: msg.content
            }))
        }
    } catch (e) {
        console.error('Failed to load session history:', e)
    }
}

// 默认设置为暗色模式并加载历史
onMounted(async () => {
    const sessionId = currentSessionId.value

    // Check for initial message from index page
    const initialMessage = route.query.initialMessage as string
    if (initialMessage) {
        // 设置 session
        agentStore.setSession(sessionId)

        // Check if stream is already active (from index.vue using persisted state)
        if (isStreaming.value) {
            // Stream active from index.vue, attach to it
            messages.value.push({ role: 'user', content: initialMessage })
            messages.value.push({
                role: 'assistant',
                content: streamingMessage.value || '',
                isStreaming: true
            })
        } else {
            // Not streaming, start fresh
            handleSendMessage(initialMessage)
        }

        // Remove query param to clean up URL
        const router = useRouter()
        router.replace({ path: route.path, query: {} })
    } else {
        // 加载历史
        await loadSessionHistory(sessionId)
    }
})

// 监听路由参数变化（当用户从侧边栏切换会话时）
watch(currentSessionId, async (newSessionId, oldSessionId) => {
    if (newSessionId && newSessionId !== oldSessionId) {
        console.log('Session changed:', oldSessionId, '->', newSessionId)
        await loadSessionHistory(newSessionId)
    }
})

// Handle sending message
const handleSendMessage = (content: string) => {
    const sessionId = currentSessionId.value

    console.log('Sending message in session:', sessionId)

    // Add user message
    messages.value.push({
        role: 'user',
        content: content
    })

    // Add placeholder for AI response
    messages.value.push({
        role: 'assistant',
        content: '',
        isStreaming: true
    })

    // 发送消息时使用当前路由的 sessionId
    sendStreamMessage(content, sessionId)
}

// Watch streaming content update
watch(streamingMessage, (newContent) => {
    if (messages.value.length > 0) {
        const lastMsg = messages.value[messages.value.length - 1]
        if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = newContent
        }
    }
})

// Watch streaming status to turn off loading state in UI
watch(isStreaming, (streaming) => {
    if (!streaming && messages.value.length > 0) {
        const lastMsg = messages.value[messages.value.length - 1]
        if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.isStreaming = false
        }
    }
})
</script>