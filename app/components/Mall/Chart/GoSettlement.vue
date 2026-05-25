<template>
    <div
        class="bg-white dark:bg-slate-800 p-6 rounded border border-slate-100 dark:border-slate-700 sticky top-28 shadow-sm">
        <h2
            class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            订单结算
        </h2>

        <!-- Selected Items Grid -->
        <div class="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-if="selectedList.length === 0" class="text-center py-8 text-slate-400 text-sm">
                请勾选左侧商品进行结算
            </div>
            <div v-else v-for="item in selectedList" :key="item.cartId"
                class="flex justify-between items-start text-sm">
                <div class="flex-1 pr-4">
                    <div class="text-slate-700 dark:text-slate-200 line-clamp-1" :title="item.productName">
                        {{ item.productName }}
                    </div>
                    <div class="text-xs text-slate-400 mt-0.5">
                        x{{ item.quantity }}
                    </div>
                </div>
                <div class="font-bold text-slate-800 dark:text-slate-100 shrink-0">
                    ¥{{ (item.price * item.quantity).toFixed(2) }}
                </div>
            </div>
        </div>

        <!-- Summary Totals -->
        <div class="space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div class="flex justify-between text-slate-500 text-sm">
                <span>商品总数</span>
                <span>{{ selectedCount }} 件</span>
            </div>
            <div class="flex justify-between items-end">
                <span class="text-slate-800 dark:text-slate-200 font-bold">合计金额</span>
                <span class="text-2xl font-black text-[#ff5000]">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
        </div>

        <button @click="$emit('checkout')"
            class="w-full mt-6 bg-[#ff5000] hover:bg-[#e64a00] text-white py-3 rounded font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="selectedList.length === 0">
            加入订单
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    selectedList: any[]
}>()

defineEmits(['checkout'])

const selectedCount = computed(() => {
    return props.selectedList.reduce((sum, item) => sum + (item.quantity || 0), 0)
})

const totalPrice = computed(() => {
    return props.selectedList.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
