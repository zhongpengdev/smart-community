<template>
    <div v-if="toolCalls && toolCalls.length > 0" class="w-full">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-2 px-2 py-1.5 rounded bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            <button
                @click="isExpanded = !isExpanded"
                class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
                <Icon 
                    :name="isExpanded ? 'lucide:chevron-down' : 'lucide:chevron-right'" 
                    :size="14"
                    class="transition-transform duration-200"
                />
                <Icon name="lucide:zap" :size="14" class="text-amber-500" />
                <span class="font-medium">工具调用</span>
            </button>
            
            <div class="flex items-center gap-3 text-xs">
                <!-- 统计信息 -->
                <div class="flex items-center gap-1.5">
                    <span class="text-gray-500 dark:text-gray-500">总计</span>
                    <span class="font-semibold text-gray-700 dark:text-gray-300">{{ toolCalls.length }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:loader-2" :size="12" class="text-blue-500" />
                    <span class="font-semibold text-blue-600 dark:text-blue-400">{{ callingCount }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    <Icon name="lucide:check" :size="12" class="text-emerald-500" />
                    <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ completedCount }}</span>
                </div>
            </div>
        </div>

        <!-- 工具调用列表 -->
        <Transition name="expand">
            <div v-if="isExpanded" class="space-y-1.5 pl-3 border-l-2 border-gray-200 dark:border-gray-700 ml-2 py-1">
                <AgentHomepageToolCallIndicator
                    v-for="toolCall in toolCalls"
                    :key="toolCall.id"
                    :display-name="toolCall.displayName"
                    :message="toolCall.message"
                    :icon="toolCall.icon"
                    :status="toolCall.status"
                />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { ToolCall } from '~/composables/agent/useAgent'

const props = defineProps<{
    toolCalls?: ToolCall[]
}>()

const isExpanded = ref(true) // 默认展开

// 计算统计信息
const callingCount = computed(() => {
    return props.toolCalls?.filter(call => call.status === 'calling').length || 0
})

const completedCount = computed(() => {
    return props.toolCalls?.filter(call => call.status === 'completed').length || 0
})
</script>

<style scoped>
/* 展开/收起动画 */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0.8);
}

.expand-enter-to,
.expand-leave-from {
    opacity: 1;
    max-height: 500px;
    transform: scaleY(1);
}
</style>

