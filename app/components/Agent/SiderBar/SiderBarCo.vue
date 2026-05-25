<template>
    <div class="fixed left-4 top-20 bottom-4 z-40 flex flex-col transition-all duration-300 ease-in-out bg-white dark:bg-[#1E1F20] shadow-xl rounded border border-gray-100 dark:border-gray-800"
        :class="[isExpanded ? 'w-64' : 'w-12']">
        <!-- Toggle Button Header -->
        <div class="p-2 flex items-center h-12" :class="[isExpanded ? 'justify-between' : 'justify-center']">
            <div v-if="isExpanded" class="pl-2 font-semibold text-gray-700 dark:text-gray-200 truncate text-sm">
                History
            </div>
            <button @click="toggleSidebar"
                class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none"
                :title="isExpanded ? 'Collapse' : 'Expand'">
                <Icon :name="isExpanded ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" size="18" />
            </button>
        </div>

        <!-- Content Area (Only visible when expanded) -->
        <div v-if="isExpanded" class="flex-1 overflow-hidden flex flex-col animate-fade-in">
            <!-- Loading State -->
            <div v-if="loading" class="flex-1 flex items-center justify-center">
                <Icon name="lucide:loader-2" class="animate-spin text-gray-400" size="20" />
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <Icon name="lucide:alert-circle" class="text-red-400 mb-2" size="20" />
                <p class="text-[10px] text-gray-500">Failed to load</p>
                <button @click="fetchHistory" class="mt-2 text-[10px] text-blue-500 hover:underline">Retry</button>
            </div>

            <!-- Empty State -->
            <div v-else-if="!historyList || historyList.length === 0"
                class="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-400">
                <Icon name="lucide:clock" size="20" class="mb-2 opacity-30" />
                <p class="text-[10px]">No history yet</p>
            </div>

            <!-- List -->
            <div v-else class="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                <div v-for="item in historyList" :key="item.id" @click="handleSessionClick(item.id)"
                    class="p-2.5 rounded hover:bg-gray-50 dark:hover:bg-[#2A2B2D] cursor-pointer group transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50 relative pr-8">
                    <div class="text-xs text-gray-700 dark:text-gray-200 truncate font-medium">
                        {{ item.title || 'New Chat' }}
                    </div>
                    <div class="text-[10px] text-gray-400 mt-1 flex justify-between items-center opacity-70">
                        <span>{{ formatDate(item.created_at) }}</span>
                    </div>

                    <!-- Session context menu -->
                    <AgentSiderBarSessionRelated :session-id="item.id" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSession } from '~/composables/agent/useSession'
import dayjs from 'dayjs'

const isExpanded = ref(false)
const { historyList, loading, error, fetchHistory } = useSession()

const handleSessionClick = (id: number) => {
    navigateTo(`/agent/${id}`)
}

const toggleSidebar = async () => {
    isExpanded.value = !isExpanded.value
    if (isExpanded.value) {
        // Fetch history when expanded, if we want to refresh or load first time
        // checking length === 0 might be good, or just fetch every time to refresh
        if (historyList.value.length === 0) {
            await fetchHistory()
        }
    }
}

const formatDate = (date: string) => {
    if (!date) return ''
    return dayjs(date).format('MM-DD HH:mm')
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Custom Scrollbar */
div::-webkit-scrollbar {
    width: 3px;
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
</style>
