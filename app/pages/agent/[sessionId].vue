<template>
    <div class="h-[calc(100vh-3rem)] flex flex-row overflow-clip">
        <AgentSiderBarSiderBarCo />
        <div class="flex-1 h-full flex flex-col relative overflow-hidden">
            <!-- Main Content Container -->
            <div class="flex-1 overflow-hidden relative flex flex-col">
                <!-- Loading State Spinner -->
                <div v-if="historyLoading" class="flex-1 flex flex-col items-center justify-center pb-12">
                    <Icon name="lucide:loader-2" size="32" class="animate-spin text-gray-400 dark:text-gray-600" />
                </div>
                
                <template v-else>
                    <!-- Centered input box when there are no messages -->
                    <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center px-4 space-y-8 pb-12 w-full max-w-3xl mx-auto">
                        <InspiraCoTextGenerateEffect words="Ready to help, ask me anything!" class="font-medium text-3xl text-gray-800 dark:text-gray-100 text-center" />
                        <AgentHomepageInputCo :loading="isProcessing" @send="handleSendMessage" />
                    </div>
                    
                    <!-- Standard chat history and bottom input layout -->
                    <template v-else>
                        <AgentHomepageContentCo :messages="messages" :agent-status="agentStatus" :tool-calls="toolCalls"
                            class="flex-1 z-10" />
                        <div
                            class="w-full flex justify-center px-4 pb-2 pt-2 z-10 shrink-0 bg-gradient-to-t to-transparent from-slate-100 dark:from-black via-slate-100 dark:via-black"
                        >
                            <AgentHomepageInputCo :loading="isProcessing" @send="handleSendMessage" />
                        </div>
                    </template>
                </template>
            </div>
            
            <!-- Bottom Disclaimer (Fixed at the absolute bottom of the viewport) -->
            <div class="w-full shrink-0 text-center pb-3 pt-1 text-[11px] text-gray-400 dark:text-gray-500 bg-slate-100/70 dark:bg-black z-20">
                Agent can make mistakes. Verify important info.
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
const historyLoading = ref(false)
const isProcessing = computed(() => loading.value || isStreaming.value)

// 加载会话历史
const loadSessionHistory = async (sessionId: string) => {
    historyLoading.value = true
    // 清空当前消息
    messages.value = []

    // 更新 store
    agentStore.setSession(sessionId)

    // 如果正在流式传输，不加载历史
    if (isStreaming.value) {
        historyLoading.value = false
        return
    }

    try {
        // Run network request and a minimum 250ms delay in parallel
        const [history] = await Promise.all([
            fetchSessionMessages(sessionId),
            new Promise(resolve => setTimeout(resolve, 250))
        ])
        if (history && Array.isArray(history)) {
            messages.value = history.map((msg: any) => ({
                role: (msg.role === 'user' || msg.sender_type === 'user') ? 'user' : 'assistant',
                content: msg.content
            }))
        }
    } catch (e) {
        console.error('Failed to load session history:', e)
    } finally {
        historyLoading.value = false
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
            // Not streaming, load history (which already has the message we sent)
            await loadSessionHistory(sessionId)
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