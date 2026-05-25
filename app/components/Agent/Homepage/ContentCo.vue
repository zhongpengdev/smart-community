<template>
    <div class="flex-1 w-full max-w-3xl mx-auto overflow-y-auto p-4 space-y-6 scroll-smooth" ref="containerRef">
        <div v-for="(msg, index) in messages" :key="index" class="flex flex-col gap-2"
            :class="[msg.role === 'user' ? 'items-end' : 'items-start']">

            <!-- Avatar & Name -->
            <div class="flex items-center gap-2" :class="[msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']">
                <div class="w-8 h-8 rounded flex items-center justify-center shrink-0 border transition-colors"
                    :class="[msg.role === 'user' ? 'bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' : 'bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800']">
                    <Icon v-if="msg.role === 'user'" name="lucide:user" size="16"
                        class="text-blue-600 dark:text-blue-400" />
                    <Icon v-else name="lucide:bot" size="16" class="text-emerald-600 dark:text-emerald-400" />
                </div>
                <!-- <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {{ msg.role === 'user' ? 'You' : 'Agent' }}
                </span> -->

                <!-- Agent Status Indicator -->
                <div v-if="msg.role === 'assistant' && msg.isStreaming && agentStatus"
                    class="flex items-center gap-2 ml-2 transition-all animate-pulse">
                    <Icon name="lucide:loader-2" size="14" class="animate-spin text-emerald-500" />
                    <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{{ agentStatus }}</span>
                </div>
            </div>

            <!-- Tool Calls History (只在最新的 assistant 消息中显示) -->
            <div v-if="msg.role === 'assistant' && toolCalls && toolCalls.length > 0 && index === messages.length - 1"
                class="max-w-[85%] mb-3">
                <AgentHomepageToolCallHistory :tool-calls="toolCalls" />
            </div>

            <!-- Message Bubble -->
            <div class="max-w-[85%] rounded px-5 py-3 text-sm leading-relaxed shadow-sm transition-all" :class="[
                msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-sm'
                    : 'bg-white dark:bg-[#1E1F20] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-sm'
            ]">
                <div v-if="msg.role === 'assistant'" v-html="formatMessage(msg.content)"
                    class="prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-headings:my-0 prose-pre:my-0">
                </div>
                <div v-else class="whitespace-pre-wrap">{{ msg.content }}</div>

                <!-- 光标动画 -->
                <span v-if="msg.role === 'assistant' && msg.isStreaming && !agentStatus"
                    class="inline-block w-1.5 h-4 ml-0.5 align-middle bg-emerald-500 animate-pulse rounded"></span>
            </div>
        </div>

        <!-- 消息为空 -->
        <div v-if="messages.length === 0"
            class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 space-y-6 pb-20">
            <div
                class="w-20 h-20 rounded bg-gray-50 dark:bg-[#1E1F20] flex items-center justify-center border border-gray-100 dark:border-gray-800">
                <Icon name="lucide:sparkles" size="40" class="text-gray-300 dark:text-gray-500" />
            </div>
            <InspiraCoTextGenerateEffect words="Ready to help, ask me anything!" class="font-medium text-2xl" />
        </div>

    </div>
</template>

<script setup lang="ts">
import type { ToolCall } from '~/composables/agent/useAgent'

export interface Message {
    role: 'user' | 'assistant'
    content: string
    isStreaming?: boolean
}

const props = defineProps<{
    messages: Message[],
    agentStatus?: string,
    toolCalls?: ToolCall[]
}>()

const containerRef = ref<HTMLElement | null>(null)
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
// 引入代码高亮样式（这里以 Github 暗色风格为例，你也可以选其他的）
import 'highlight.js/styles/github-dark.css'

// // Simple formatter
// const formatMessage = (content: string) => {
//     if (!content) return ''

//     // 1. Basic HTML Escape (prevent injection)
//     let safe = content
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");

//     // 2. Bold: **text** -> <strong>text</strong>
//     safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

//     // 3. List: - item -> • item (Visual improvement)
//     safe = safe.replace(/^- /gm, '• ');

//     return safe;
// }

const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
})

const formatMessage = (content: string) => {
    if (!content) return ''
    return md.render(content)
}


// Auto scroll to bottom
const scrollToBottom = () => {
    if (containerRef.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
}

// Watch deep to catch content changes during streaming
watch(() => props.messages, () => {
    nextTick(scrollToBottom)
}, { deep: true })

watch(() => props.agentStatus, () => {
    nextTick(scrollToBottom)
})

watch(() => props.toolCalls, () => {
    nextTick(scrollToBottom)
}, { deep: true })

onMounted(scrollToBottom)
</script>

<style scoped>
/* Custom Scrollbar for Webkit */
div::-webkit-scrollbar {
    width: 6px;
}

div::-webkit-scrollbar-track {
    background: transparent;
}

div::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.2);
    border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.4);
}

/* Aggressive spacing reset for markdown content */
:deep(.prose) {
    line-height: 2;
}

:deep(.prose p) {
    margin-top: 0;
    margin-bottom: 0;
}

:deep(.prose ul),
:deep(.prose ol) {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 1.2em;
}

:deep(.prose li) {
    margin-top: 0;
    margin-bottom: 0;
}

:deep(.prose li > p) {
    margin-top: 0;
    margin-bottom: 1;
}

:deep(.prose pre) {
    margin-top: 0;
    margin-bottom: 0;
    padding: 0.75em;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.1em;
    line-height: 1.4;
}
</style>
