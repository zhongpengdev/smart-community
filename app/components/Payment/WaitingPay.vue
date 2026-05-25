<template>
    <div class="space-y-4">
        <div v-if="bills.length === 0" class="py-12 flex flex-col items-center justify-center text-slate-400">
            <Icon name="lucide:check-circle-2" size="48" class="text-green-500 mb-4 opacity-20" />
            <p>暂无待缴账单，生活没烦恼</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="bill in bills" :key="bill.billId"
                class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded transition-all hover:shadow-md p-6 group">

                <!-- Card Header -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50 dark:border-slate-800">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span
                                class="px-2 py-0.5 bg-orange-50 dark:bg-orange-950/30 text-[#ff5000] text-[10px] font-bold rounded">待缴</span>
                            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ bill.billingPeriod }}
                                月份物业缴费单</h3>
                        </div>
                        <p class="text-[10px] text-slate-400 font-mono tracking-wider opacity-60">NO.{{ bill.billNo }}
                        </p>
                    </div>
                    <div class="text-left sm:text-right">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">应缴总额</p>
                        <p class="text-3xl font-black text-[#ff5000] tracking-tight tabular-nums">¥{{
                            bill.totalAmount.toFixed(2) }}</p>
                    </div>
                </div>

                <!-- Fee Breakdown Grid (Minimalist & High Density) -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 mb-8">
                    <div class="flex flex-col gap-1">
                        <span class="text-sm text-slate-500 dark:text-slate-400">物业费</span>
                        <span class="text-xl font-bold text-slate-800 dark:text-slate-100">¥{{ bill.propertyFee
                            }}</span>
                    </div>
                    <div class="flex flex-col gap-1 md:border-l md:border-slate-100 md:dark:border-slate-800 md:pl-4">
                        <span class="text-sm text-slate-500 dark:text-slate-400">水费</span>
                        <span class="text-xl font-bold text-slate-800 dark:text-slate-100">¥{{ bill.waterFee }}</span>
                    </div>
                    <div class="flex flex-col gap-1 md:border-l md:border-slate-100 md:dark:border-slate-800 md:pl-4">
                        <span class="text-sm text-slate-500 dark:text-slate-400">电费</span>
                        <span class="text-xl font-bold text-slate-800 dark:text-slate-100">¥{{ bill.electricityFee
                            }}</span>
                    </div>
                    <div class="flex flex-col gap-1 md:border-l md:border-slate-100 md:dark:border-slate-800 md:pl-4">
                        <span class="text-sm text-slate-500 dark:text-slate-400">燃气费</span>
                        <span class="text-xl font-bold text-slate-800 dark:text-slate-100">¥{{ bill.gasFee }}</span>
                    </div>
                    <div class="flex flex-col gap-1 md:border-l md:border-slate-100 md:dark:border-slate-800 md:pl-4">
                        <span class="text-sm text-slate-500 dark:text-slate-400">停车费</span>
                        <span class="text-xl font-bold text-slate-800 dark:text-slate-100">¥{{ bill.parkingFee }}</span>
                    </div>
                </div>

                <!-- Card Footer Actions -->
                <div class="flex items-center justify-between">
                    <div
                        class="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded transition-colors group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
                        <Icon name="lucide:calendar-clock" size="14" class="text-[#ff5000] opacity-70" />
                        <span>截止日期: {{ bill.dueDate ? bill.dueDate.split(' ')[0] : '-' }}</span>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <select :value="selectedMethods[bill.billId] || 'WALLET'"
                                @change="(e: any) => selectedMethods[bill.billId] = e.target.value"
                                class="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#ff5000] cursor-pointer">
                                <option value="WALLET">钱包支付</option>
                                <option value="ALIPAY">支付宝</option>
                                <option value="WECHAT">微信支付</option>
                            </select>
                            <Icon name="lucide:chevron-down" size="12"
                                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <el-tooltip content="立即支付" placement="left" :show-after="200">
                            <button @click="handlePayClick(bill)"
                                class="w-10 h-10 rounded bg-[#ff5000] hover:bg-[#e64a00] text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 group/btn">
                                <Icon name="lucide:credit-card" size="18"
                                    class="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface PropertyBill {
    billId: number;
    billNo: string;
    userId: number;
    billingPeriod: string;
    propertyFee: number;
    waterFee: number;
    electricityFee: number;
    gasFee: number;
    parkingFee: number;
    otherFee: number;
    totalAmount: number;
    paidAmount: number;
    status: number;
    dueDate: string;
    paidTime: string | null;
    createTime: string;
    updateTime: string;
}

const props = defineProps<{
    bills: PropertyBill[]
}>()

const emit = defineEmits<{
    (e: 'pay', bill: PropertyBill, method: string): void
}>()

const selectedMethods = ref<Record<number, string>>({});

const handlePayClick = (bill: PropertyBill) => {
    const method = selectedMethods.value[bill.billId] || 'WALLET';
    emit('pay', bill, method);
};
</script>
