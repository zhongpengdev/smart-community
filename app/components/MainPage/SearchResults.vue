<template>
    <div
        class="h-full bg-slate-50 dark:bg-zinc-800/50 rounded overflow-hidden border border-slate-200 dark:border-zinc-700 flex flex-col relative w-[320px] shrink-0">
        <!-- 加载状态 -->
        <div v-if="searchState.loading" class="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div v-for="i in 5" :key="i" class="space-y-3 animate-pulse">
                <div class="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-1/3"></div>
                <div class="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-1/2"></div>
            </div>
        </div>

        <!-- 搜索结果 -->
        <div v-else-if="hasResults" class="flex-1 overflow-y-auto custom-scrollbar">

            <!-- 社区服务 -->
            <div v-if="searchState.results.services.length > 0" class="mb-2">
                <div
                    class="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-zinc-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-700">
                    社区服务 ({{ searchState.results.services.length }})
                </div>
                <div v-for="item in searchState.results.services" :key="item.id" @click="handleSelect(item)"
                    class="px-4 py-3 flex items-start gap-3 hover:bg-white dark:hover:bg-zinc-700/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-zinc-700/30 last:border-0">
                    <div
                        class="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                        <Icon :name="item.icon || 'lucide:grid'" class="w-4 h-4" />
                    </div>
                    <div>
                        <div class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ item.title }}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{{ item.description
                            }}</div>
                    </div>
                </div>
            </div>

            <!-- 公告新闻 -->
            <div v-if="searchState.results.news.length > 0" class="mb-2">
                <div
                    class="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-zinc-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-700">
                    公告新闻 ({{ searchState.results.news.length }})
                </div>
                <div v-for="item in searchState.results.news" :key="item.id" @click="handleSelect(item)"
                    class="px-4 py-3 flex items-start gap-3 hover:bg-white dark:hover:bg-zinc-700/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-zinc-700/30 last:border-0">
                    <div
                        class="w-8 h-8 rounded bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 shrink-0">
                        <Icon name="lucide:newspaper" class="w-4 h-4" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{{
                            item.title }}</div>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[10px] text-slate-400">{{ formatTime(item.timestamp) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 论坛帖子 -->
            <div v-if="searchState.results.forum.length > 0">
                <div
                    class="sticky top-0 z-10 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-zinc-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-700">
                    论坛帖子 ({{ searchState.results.forum.length }})
                </div>
                <div v-for="item in searchState.results.forum" :key="item.id" @click="handleSelect(item)"
                    class="px-4 py-3 flex items-start gap-3 hover:bg-white dark:hover:bg-zinc-700/50 cursor-pointer transition-colors border-b border-slate-100 dark:border-zinc-700/30 last:border-0">
                    <div
                        class="w-8 h-8 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
                        <Icon name="lucide:message-circle" class="w-4 h-4" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{{ item.title
                            }}</div>
                        <div class="flex items-center gap-2 mt-1">
                            <span v-if="item.category"
                                class="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 text-slate-500">{{
                                    item.category }}</span>
                            <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{{ item.description }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 空状态 - 未搜索 -->
        <div v-else-if="!searchState.hasSearched"
            class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div
                class="w-16 h-16 rounded bg-slate-200/50 dark:bg-zinc-700/50 flex items-center justify-center mb-4">
                <Icon name="lucide:search" class="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p class="text-sm font-medium">输入关键词搜索</p>
            <p class="text-xs mt-2 text-slate-400 text-center max-w-[200px]">
                支持搜索社区服务、公告新闻及邻里论坛内容
            </p>
        </div>

        <!-- 空状态 - 无结果 -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div class="w-16 h-16 rounded bg-slate-100 dark:bg-zinc-700/50 flex items-center justify-center mb-4">
                <Icon name="lucide:search-x" class="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p class="text-sm font-medium">未找到相关结果</p>
            <p class="text-xs mt-1 text-slate-400">换个关键词试试？</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGlobalSearch, type SearchResult } from '~/composables/useGlobalSearch'
import { useRouter } from 'vue-router'

const router = useRouter()
const { searchState } = useGlobalSearch()

// 计算是否有结果
const hasResults = computed(() => {
    const { services, news, forum } = searchState.results
    return services.length > 0 || news.length > 0 || forum.length > 0
})

const handleSelect = (item: SearchResult) => {
    if (item.path) {
        router.push(item.path)
    }
}

const formatTime = (time?: string) => {
    if (!time) return ''
    return new Date(time).toLocaleDateString()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
}
</style>
