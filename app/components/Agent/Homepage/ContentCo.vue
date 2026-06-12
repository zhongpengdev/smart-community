<template>
    <div class="flex-1 w-full max-w-3xl mx-auto overflow-y-auto p-4 space-y-6" ref="containerRef">
        <div v-for="(msg, index) in messages" :key="index" class="flex flex-col gap-2"
            :class="[msg.role === 'user' ? 'items-end' : 'items-start']">

            <!-- Headers / Metadata (Only for assistant messages) -->
            <div v-if="msg.role === 'assistant'" class="w-full flex flex-col items-start gap-1.5 shrink-0">
                <!-- Agent Status Indicator -->
                <div v-if="msg.isStreaming && agentStatus"
                    class="flex items-center gap-2 mb-1 transition-all animate-pulse">
                    <Icon name="lucide:loader-2" size="14" class="animate-spin text-emerald-500" />
                    <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{{ agentStatus }}</span>
                </div>
                <!-- Tool Calls History (Only shown on the latest assistant message) -->
                <div v-if="toolCalls && toolCalls.length > 0 && index === messages.length - 1"
                    class="w-full max-w-[85%] mb-2">
                    <AgentHomepageToolCallHistory :tool-calls="toolCalls" />
                </div>
            </div>

            <!-- Message Body -->
            <!-- User Message: Wrapped in a nice round bubble -->
            <div v-if="msg.role === 'user'" 
                class="max-w-[85%] bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-[22px] px-5 py-3 text-[16px] leading-relaxed shadow-sm transition-all whitespace-pre-wrap"
            >
                {{ msg.content }}
            </div>
            
            <!-- Assistant Message: Direct text rendering, no bubble -->
            <div v-else 
                class="w-full max-w-[95%] py-1 text-[16px] leading-relaxed text-gray-800 dark:text-gray-200 transition-all"
            >
                <div v-html="formatMessage(msg.content)"
                    class="prose prose-base dark:prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-headings:my-0 prose-pre:my-0"
                >
                </div>

                <!-- Cursor animation -->
                <span v-if="msg.isStreaming && !agentStatus"
                    class="inline-block w-1.5 h-4 ml-0.5 align-middle bg-emerald-500 animate-pulse rounded"
                ></span>
            </div>
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
/* Hide Scrollbar for Webkit (Chrome, Safari, etc.) */
div::-webkit-scrollbar {
    display: none;
}

/* Hide Scrollbar for Firefox and IE/Edge */
div {
    -ms-overflow-style: none;
    scrollbar-width: none;
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
