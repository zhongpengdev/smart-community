<!-- 搜索结果商品列表组件 - 完全独立，不复用主页状态 -->
<template>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <!-- Skeleton Loading -->
        <div v-if="loading && list.length === 0" v-for="i in 10" :key="`skeleton-${i}`"
            class="bg-white dark:bg-slate-800 rounded overflow-hidden aspect-[2/3] animate-pulse border border-slate-100 dark:border-slate-800">
            <div class="h-1/2 bg-slate-200 dark:bg-slate-700"></div>
            <div class="p-3 space-y-2">
                <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
        </div>

        <!-- Product Cards -->
        <div v-for="item in list" :key="item.productId"
            class="group bg-white dark:bg-slate-800 rounded overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-transparent dark:border-slate-800 pb-2 shadow-sm"
            @click="goToDetail(item.productId)">

            <!-- Image -->
            <div class="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img :src="item.coverImg"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    :alt="item.productName" />
            </div>

            <!-- Info -->
            <div class="p-2.5 flex flex-col gap-1">
                <!-- Title -->
                <div class="h-10 mb-1">
                    <div
                        class="line-clamp-2 text-[13px] md:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        <span
                            class="inline-block bg-[#ff5000] text-white text-[9px] px-1 rounded-[2px] mr-1 align-text-top leading-tight py-[1px]">自营</span>
                        {{ item.productName }}
                    </div>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1 mb-1 h-4 overflow-hidden">
                    <span
                        class="text-[9px] text-[#ff5000] border border-[#ff5000] px-1 rounded-[3px] scale-90 origin-left">包邮</span>
                    <span v-if="item.sales > 100"
                        class="text-[9px] text-[#ff5000] border border-[#ff5000] px-1 rounded-[3px] scale-90 origin-left">热销</span>
                </div>

                <!-- Price -->
                <div class="flex items-baseline text-[#ff5000] mt-auto">
                    <span class="text-xs font-bold leading-none">¥</span>
                    <span class="text-lg md:text-xl font-black leading-none mx-0.5">{{ String(item.price).split('.')[0]
                        }}</span>
                    <span v-if="String(item.price).split('.')[1]" class="text-xs font-bold">.{{
                        String(item.price).split('.')[1] }}</span>
                </div>

                <!-- Footer Info -->
                <div class="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>{{ item.sales || 0 }}+人付款</span>
                    <span class="bg-gray-100 dark:bg-slate-700 px-1 rounded text-gray-400">智慧社区</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && list.length === 0" class="py-32 flex flex-col items-center justify-center text-slate-400">
        <Icon name="lucide:search-x" size="48" class="mb-4 opacity-50" />
        <p>未找到相关商品，换个词试试吧</p>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && list.length > 0" class="mt-6 flex justify-center">
        <button @click="$emit('loadMore')" :disabled="loading"
            class="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
            {{ loading ? '加载中...' : '加载更多' }}
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    list: any[]
    loading: boolean
    hasMore: boolean
}>()

defineEmits(['loadMore'])

const goToDetail = (productId: string | number) => {
    navigateTo(`/service/mall/${productId}`)
}
</script>
