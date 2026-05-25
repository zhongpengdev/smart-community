<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <Icon name="lucide:receipt" size="18" class="text-purple-500" />
                </div>
                物业费统计
            </h3>
            <NuxtLink to="/superCommunity/property/fee"
                class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                查看详情
                <Icon name="lucide:chevron-right" size="14" />
            </NuxtLink>
        </div>

        <!-- 缴费率进度条 -->
        <div class="mb-5 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-600 dark:text-slate-300">缴费率</span>
                <span class="text-2xl font-bold text-purple-600">{{ props.data?.paymentRate || 0 }}%</span>
            </div>
            <div class="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                <div class="h-full rounded bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                    :style="{ width: `${props.data?.paymentRate || 0}%` }"></div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <!-- 账单统计 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 pb-2">账单统计</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">账单总数</span>
                        <span class="font-bold text-slate-800 dark:text-white">{{ props.data?.totalBills || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-green-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已缴账单</span>
                        </div>
                        <span class="font-bold text-green-500">{{ props.data?.paidBills || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-orange-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">未缴账单</span>
                        </div>
                        <span class="font-bold text-orange-500">{{ props.data?.unpaidBills || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-yellow-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">部分缴纳</span>
                        </div>
                        <span class="font-bold text-yellow-500">{{ props.data?.partialPaidBills || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 金额统计 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 pb-2">金额统计</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">已缴金额</span>
                        <span class="font-bold text-green-600">¥{{ formatMoney(props.data?.paidAmount) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">未缴金额</span>
                        <span class="font-bold text-orange-600">¥{{ formatMoney(props.data?.unpaidAmount) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本月应收</span>
                        <span class="font-bold text-purple-600">¥{{ formatMoney(props.data?.monthReceivableAmount) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本月实收</span>
                        <span class="font-bold text-indigo-600">¥{{ formatMoney(props.data?.monthReceivedAmount) }}</span>
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
