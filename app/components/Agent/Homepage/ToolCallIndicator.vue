<template>
    <div 
        class="flex items-center gap-2 px-3 py-2 rounded transition-all duration-300"
        :class="[
            status === 'calling' 
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-pulse-subtle' 
                : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
        ]"
    >
        <!-- Icon -->
        <div 
            class="w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all"
            :class="[
                status === 'calling'
                    ? 'bg-blue-100 dark:bg-blue-800/40'
                    : 'bg-emerald-100 dark:bg-emerald-800/40'
            ]"
        >
            <Icon 
                :name="iconName" 
                :size="14"
                :class="[
                    status === 'calling'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                ]"
            />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
            <div 
                class="text-xs font-medium transition-colors truncate"
                :class="[
                    status === 'calling'
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-emerald-700 dark:text-emerald-300'
                ]"
            >
                {{ message }}
            </div>
        </div>

        <!-- Status Indicator -->
        <div class="shrink-0">
            <Icon 
                v-if="status === 'calling'"
                name="lucide:loader-2" 
                :size="12"
                class="animate-spin text-blue-600 dark:text-blue-400"
            />
            <Icon 
                v-else
                name="lucide:check" 
                :size="12"
                class="text-emerald-600 dark:text-emerald-400"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    displayName: string
    message: string
    icon: string
    status: 'calling' | 'completed'
}

const props = defineProps<Props>()

// 图标映射
const ICON_MAP: Record<string, string> = {
    notification: 'lucide:bell',
    message: 'lucide:mail',
    bill: 'lucide:file-text',
    parking: 'lucide:car',
    repair: 'lucide:wrench',
    complaint: 'lucide:message-square-warning',
    tool: 'lucide:tool',
    database: 'lucide:database',
    search: 'lucide:search',
    user: 'lucide:user',
    settings: 'lucide:settings',
    default: 'lucide:zap'
}

const iconName = computed(() => {
    return ICON_MAP[props.icon] || ICON_MAP.default
})
</script>

<style scoped>
@keyframes pulse-subtle {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.95;
        transform: scale(0.995);
    }
}

.animate-pulse-subtle {
    animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

