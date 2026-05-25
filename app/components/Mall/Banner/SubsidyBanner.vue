<!-- 百亿补贴Banner -->
<template>
    <div
        class="w-[240px] h-full bg-[#f9f9f9] dark:bg-slate-800 rounded p-4 flex flex-col border border-slate-50 dark:border-slate-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 shrink-0">
            <h3 class="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                百亿补贴
            </h3>
            <span class="text-[10px] text-slate-400">买贵必赔</span>
        </div>

        <!-- Product List (Vertical Scrollable) -->
        <div class="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-hide">
            <div v-if="loading" v-for="i in 5" :key="i"
                class="bg-gray-200 dark:bg-slate-700 rounded animate-pulse h-24 w-full shrink-0"></div>

            <div v-else v-for="item in subsidyList" :key="item.productId" @click="goToDetail(item.productId)"
                class="flex items-center gap-2 p-2 bg-white dark:bg-slate-700/50 rounded cursor-pointer hover:shadow-sm border border-transparent hover:border-orange-100 transition-all shrink-0">
                <!-- Image Area -->
                <div
                    class="w-20 h-20 shrink-0 bg-white dark:bg-slate-700 rounded p-1 overflow-hidden flex justify-center items-center">
                    <img :src="item.coverImg" class="w-full h-full object-contain" :alt="item.productName">
                </div>

                <!-- Info Area -->
                <div class="flex flex-col justify-between h-20 py-1 flex-1 min-w-0">
                    <h4
                        class="text-xs text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight font-medium mb-auto">
                        {{ item.productName }}
                    </h4>

                    <div class="flex items-end gap-1 text-[#ff5000] font-bold leading-none mt-1">
                        <span class="text-xs">¥</span>
                        <span class="text-lg">{{ String(item.price).split('.')[0] }}</span>
                        <span v-if="String(item.price).includes('.')" class="text-xs">.{{
                            String(item.price).split('.')[1] || '0' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMallGoods } from '@/composables/mall/useMallGoods'
const { subsidyList, loading, fetchGoodsList } = useMallGoods()

const goToDetail = (productId: string | number) => {
    navigateTo(`/service/mall/${productId}`)
}

onMounted(() => {
    fetchGoodsList()
})
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>