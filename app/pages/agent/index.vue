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
import type { Message } from '~/components/Agent/Homepage/ContentCo.vue'
import AgentSiderBarSiderBarCo from '~/components/Agent/SiderBar/SiderBarCo.vue'

definePageMeta({
    layout: 'agent'
})

const colorMode = useColorMode()

import { useAgentStore } from '~/stores/agent'

const agentStore = useAgentStore()
const lastUserMessage = ref('')

// 默认设置为暗色模式
onMounted(() => {
    // Clear previous session state
    agentStore.clearSession()
})

const { sendStreamMessage, streamingMessage, isStreaming, loading, agentStatus, toolCalls } = useAgent()

const messages = ref<Message[]>([])

const isProcessing = computed(() => loading.value || isStreaming.value)

// Handle sending message
const handleSendMessage = (content: string) => {
    lastUserMessage.value = content

    // Add user message for UI feedback immediately
    messages.value.push({
        role: 'user',
        content: content
    })

    // Add placeholder for AI response immediately
    messages.value.push({
        role: 'assistant',
        content: '',
        isStreaming: true
    })

    // Start streaming - 连接由 layout 管理，这里只发送消息
    sendStreamMessage(content)
}

// Watch store for session creation to navigate
watch(() => agentStore.sessionId, (newId) => {
    if (newId) {
        navigateTo({
            path: `/agent/${newId}`,
            query: { initialMessage: lastUserMessage.value }
        })
    }
})

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
