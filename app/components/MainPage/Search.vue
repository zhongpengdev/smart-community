<template>
    <div class="relative w-full z-10">
        <div
            class="flex items-center w-full h-11 pr-1 pl-4 rounded bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-zinc-700/50 shadow-sm transition-all duration-300 focus-within:bg-white dark:focus-within:bg-zinc-800 focus-within:ring-2 focus-within:ring-blue-500/20">

            <Icon name="lucide:search" class="w-4 h-4 text-slate-400 mr-2" />

            <input v-model="searchState.query" type="text" placeholder="搜索社区服务..."
                class="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 text-sm h-full"
                @keyup.enter="handleSearch" />

            <div v-if="searchState.query" @click="clearSearch"
                class="cursor-pointer p-1.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-600 transition-colors mr-1">
                <Icon name="lucide:x" class="w-3.5 h-3.5" />
            </div>

            <button @click="handleSearch" :disabled="searchState.loading || !searchState.query"
                class="px-4 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded shadow-sm transition-all duration-200 flex items-center gap-1.5">
                <span v-if="searchState.loading" class="animate-spin">
                    <Icon name="lucide:loader-2" class="w-3 h-3" />
                </span>
                <span v-else>搜索</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useGlobalSearch } from '~/composables/useGlobalSearch'

const { searchState, performSearch, clearSearch } = useGlobalSearch()

// Automatically trigger search while typing with a 300ms debounce
const debouncedSearch = useDebounceFn(() => {
    if (searchState.query.trim()) {
        performSearch()
    } else {
        searchState.results = { services: [], news: [], forum: [] }
        searchState.hasSearched = false
    }
}, 300)

watch(() => searchState.query, () => {
    searchState.isOpen = true
    debouncedSearch()
})

const handleSearch = () => {
    if (searchState.query && !searchState.loading) {
        performSearch()
    }
}
</script>
