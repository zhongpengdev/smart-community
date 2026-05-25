<template>
    <div class="pt-8 pb-4 mb-6">
        <div class="max-w-[1000px] mx-auto px-4">
            <!-- Search Input Group -->
            <div class="flex max-w-[800px] mx-auto h-12 shadow-sm mb-6">
                <!-- Dropdown -->
                <div class="relative group shrink-0">
                    <button
                        class="h-full px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-r-0 rounded-md flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-[#ff5000] dark:hover:text-[#ff5000] transition-colors text-sm font-medium">
                        <span>{{ queryParams.searchScope === 'TITLE' ? '标题' : '全部' }}</span>
                        <Icon name="lucide:chevron-down" size="14" class="text-slate-400 group-hover:text-[#ff5000]" />
                    </button>
                    <!-- Dropdown Menu -->
                    <div
                        class="absolute top-full left-0 w-32 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 rounded mt-1 hidden group-hover:block z-20 py-1">
                        <div @click="updateParam('searchScope', 'ALL')"
                            class="px-4 py-2 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-[#ff5000] text-sm cursor-pointer dark:text-slate-200">
                            全部</div>
                        <div @click="updateParam('searchScope', 'TITLE')"
                            class="px-4 py-2 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-[#ff5000] text-sm cursor-pointer dark:text-slate-200">
                            标题</div>
                    </div>
                </div>

                <!-- Input -->
                <div class="flex-1 relative">
                    <input :value="queryParams.keyword" @input="(e: any) => updateParam('keyword', e.target.value)"
                        @keyup.enter="handleSearch" type="text" placeholder="请输入搜索关键词"
                        class="w-full h-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none px-4 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-[#ff5000] dark:focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] transition-all" />
                    <button v-if="queryParams.keyword" @click="updateParam('keyword', '')"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 dark:hover:text-slate-200">
                        <Icon name="lucide:x-circle" size="16" />
                    </button>
                </div>

                <!-- Search Button -->
                <button @click="handleSearch"
                    class="w-20 bg-[#1e40af] hover:bg-[#1e3a8a] text-white flex items-center justify-center rounded-md transition-colors">
                    <Icon name="lucide:search" size="20" />
                </button>
            </div>

            <!-- Filters Row -->
            <div
                class="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-slate-500 dark:text-slate-400 justify-center sm:justify-start max-w-[800px] mx-auto">
                <div class="text-slate-400">
                    相关结果: 约 <span class="text-[#ff5000] font-bold">{{ total }}</span> 个
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-slate-400">排序方式:</span>
                    <label
                        class="flex items-center gap-1 cursor-pointer hover:text-[#ff5000] dark:hover:text-[#ff5000] transition-colors">
                        <input type="radio" name="sort" :checked="queryParams.sortType === 'RELEVANCE'"
                            @change="updateParam('sortType', 'RELEVANCE')" class="accent-[#ff5000]">
                        按相关度
                    </label>
                    <label
                        class="flex items-center gap-1 cursor-pointer hover:text-[#ff5000] dark:hover:text-[#ff5000] transition-colors">
                        <input type="radio" name="sort" :checked="queryParams.sortType === 'TIME'"
                            @change="updateParam('sortType', 'TIME')" class="accent-[#ff5000]">
                        按时间
                    </label>
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-slate-400">检索方式:</span>
                    <label
                        class="flex items-center gap-1 cursor-pointer hover:text-[#ff5000] dark:hover:text-[#ff5000] transition-colors">
                        <input type="radio" name="scope" :checked="queryParams.searchScope === 'ALL'"
                            @change="updateParam('searchScope', 'ALL')" class="accent-[#ff5000]">
                        全文
                    </label>
                    <label
                        class="flex items-center gap-1 cursor-pointer hover:text-[#ff5000] dark:hover:text-[#ff5000] transition-colors">
                        <input type="radio" name="scope" :checked="queryParams.searchScope === 'TITLE'"
                            @change="updateParam('searchScope', 'TITLE')" class="accent-[#ff5000]">
                        标题
                    </label>
                </div>

                <div class="flex items-center gap-2">
                    <select :value="queryParams.timeRange"
                        @change="(e: any) => updateParam('timeRange', e.target.value)"
                        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 outline-none focus:border-[#ff5000] hover:border-[#ff5000] text-slate-600 dark:text-slate-300 transition-colors">
                        <option value="ALL">时间不限</option>
                        <option value="WEEK">最近一周</option>
                        <option value="MONTH">最近一月</option>
                        <option value="YEAR">最近一年</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    total?: number
    queryParams: {
        keyword: string
        searchScope: string
        timeRange: string
        sortType: string
    }
}>()

const emit = defineEmits(['search', 'update:queryParams'])

// Local state for immediate input feedback if needed, but here we can bind directly to props if we trust parent mutation or emit updates.
// To follow strict one-way data flow, we should emit updates.
// However, 'reactive' object passed as prop is often mutated directly in simple apps. 
// Let's use a computed with get/set or just emit events. 
// For simplicity in this context and given usage of reactive object in parent:
// I will emit 'search' when Search button is clicked or Enter pressed.
// I will emit 'update:queryParams' when filters change.

const handleSearch = () => {
    emit('search')
}

const updateParam = (key: keyof typeof props.queryParams, value: any) => {
    // Determine if we should trigger search immediately? 
    // Usually filters trigger search immediately.
    // Let's mutate and let parent handle it or emit update.
    // If we can't mutate prop directly:
    const newParams = { ...props.queryParams, [key]: value }
    // If scope changes in dropdown, we might want to sync with radio?
    // User requested "perfect copy". If dropdown changes scope, radio should too.

    emit('update:queryParams', newParams)
    // If it's a filter change (not keyword input), trigger search
    if (key !== 'keyword') {
        emit('search')
    }
}
</script>
