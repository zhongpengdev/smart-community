<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <Icon name="lucide:shopping-cart" size="18" class="text-green-500" />
                </div>
                订单统计
            </h3>
            <NuxtLink to="/superCommunity/mall/order"
                class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                查看详情
                <Icon name="lucide:chevron-right" size="14" />
            </NuxtLink>
        </div>

        <!-- 交易金额概览 -->
        <div class="grid grid-cols-3 gap-4 mb-5 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded">
            <div class="text-center">
                <p class="text-xs text-slate-500 mb-1">今日交易额</p>
                <p class="text-xl font-bold text-green-600">¥{{ formatMoney(props.data?.todayAmount) }}</p>
            </div>
            <div class="text-center border-x border-green-200 dark:border-green-800">
                <p class="text-xs text-slate-500 mb-1">本月交易额</p>
                <p class="text-xl font-bold text-emerald-600">¥{{ formatMoney(props.data?.monthAmount) }}</p>
            </div>
            <div class="text-center">
                <p class="text-xs text-slate-500 mb-1">总交易额</p>
                <p class="text-xl font-bold text-teal-600">¥{{ formatMoney(props.data?.totalAmount) }}</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <!-- 订单数量 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 pb-2">订单数量</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">订单总数</span>
                        <span class="font-bold text-slate-800 dark:text-white">{{ props.data?.totalOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">今日订单</span>
                        <span class="font-bold text-green-600">+{{ props.data?.todayOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本周订单</span>
                        <span class="font-bold text-green-500">{{ props.data?.weekOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本月订单</span>
                        <span class="font-bold text-green-400">{{ props.data?.monthOrders || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 订单状态 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 pb-2">订单状态</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-orange-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待付款</span>
                        </div>
                        <span class="font-bold text-orange-500">{{ props.data?.pendingPaymentOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-blue-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已付款</span>
                        </div>
                        <span class="font-bold text-blue-500">{{ props.data?.paidOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-cyan-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待取货</span>
                        </div>
                        <span class="font-bold text-cyan-500">{{ props.data?.waitingPickupOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-green-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已完成</span>
                        </div>
                        <span class="font-bold text-green-500">{{ props.data?.completedOrders || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-slate-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已取消</span>
                        </div>
                        <span class="font-bold text-slate-500">{{ props.data?.cancelledOrders || 0 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    data: any
}>()

const formatMoney = (value: number | undefined) => {
    if (!value) return '0'
    if (value >= 10000) {
        return (value / 10000).toFixed(1) + 'w'
    }
    return value.toLocaleString()
}
</script>
