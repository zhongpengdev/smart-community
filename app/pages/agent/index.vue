<template>
    <div class="h-[calc(100vh-3rem)] flex flex-row overflow-clip">
        <AgentSiderBarSiderBarCo />
        <div class="flex-1 h-full flex flex-col relative overflow-hidden">
            <!-- Main Content Container -->
            <div class="flex-1 overflow-hidden relative flex flex-col">
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
