<template>
    <div class="space-y-4">
        <div v-if="records.length === 0" class="py-12 flex flex-col items-center justify-center text-slate-400">
            <Icon name="lucide:history" size="48" class="text-slate-200 dark:text-slate-800 mb-4" />
            <p>近期的缴费记录空空如也</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="record in records" :key="record.paymentId"
                class="p-5 bg-white dark:bg-black rounded flex flex-col sm:flex-row sm:items-center justify-between border border-slate-100 dark:border-slate-800 hover:border-orange-100 dark:hover:border-orange-900/50 transition-all shadow-sm group">

                <div class="flex items-center gap-4">
                    <!-- Icon based on status -->
                    <div class="w-12 h-12 rounded flex items-center justify-center transition-colors shadow-inner"
                        :class="record.status === 1 ? 'bg-green-50 dark:bg-green-500/10 text-green-500' : 'bg-red-50 dark:bg-red-500/10 text-red-500'">
                        <Icon :name="record.status === 1 ? 'lucide:check-circle-2' : 'lucide:x-circle'" size="24" />
                    </div>

                    <div class="flex flex-col">
                        <div class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <span>账单缴费</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded font-medium tracking-wide uppercase"
                                :class="record.status === 1 ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'">
                                {{ record.status === 1 ? '支付成功' : '支付失败' }}
                            </span>
                        </div>
                        <div
                            class="text-[10px] text-slate-400 font-mono mt-0.5 group-hover:text-slate-500 transition-colors">
                            {{ record.paymentNo }}
                        </div>
                        <div class="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Icon name="lucide:calendar" size="12" />
                            {{ record.createTime }}
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-slate-800">
                    <div class="text-right">
                        <div class="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                            - ¥{{ (record.amount || 0).toFixed(2) }}
                        </div>
                        <div class="text-[10px] text-slate-400 font-medium">
                            {{ formatPaymentMethod(record.paymentMethod) }}
                        </div>
                    </div>

                    <button
                        class="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-[#ff5000]">
                        <Icon name="lucide:chevron-right" size="20" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface PaymentRecord {
    paymentId: number;
    paymentNo: string;
    billId: number;
    userId: number;
    amount: number;
    paymentMethod: string;
    transactionId: number;
    status: number;
    createTime: string;
}

const props = defineProps<{
    records: PaymentRecord[]
}>()

const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
        'WALLET': '系统钱包',
        'ALIPAY': '支付宝',
        'WECHAT': '微信支付',
    }
    return methods[method.toUpperCase()] || method
}
</script>
