<template>
    <div class="min-h-screen bg-[#f5f7fa] dark:bg-slate-900 pb-12 transition-colors duration-300">
        <!-- Header / Top Bar -->
        <div class="pt-8 pb-4 mb-6 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm z-10">
            <div class="max-w-[1300px] mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">物业缴费</h1>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Tabs -->
                    <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded">
                        <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name"
                            class="px-4 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2"
                            :class="activeTab === tab.name ? 'bg-white dark:bg-slate-700 text-[#ff5000] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                            <Icon :name="tab.icon" size="14" />
                            {{ tab.name }}
                            <span v-if="tab.name === '待缴账单' && pendingBills.length > 0"
                                class="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded flex items-center justify-center min-w-[16px] h-[16px]">
                                {{ pendingBills.length }}
                            </span>
                        </button>
                    </div>

                    <button @click="loadData"
                        class="bg-white dark:bg-slate-800 hover:bg-[#ff5000] hover:text-white px-3 h-9 rounded shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <Icon name="lucide:rotate-cw" size="16" :class="{ 'animate-spin': loading }" />
                    </button>
                </div>
            </div>
        </div>

        <div class="max-w-[1000px] mx-auto px-4 mt-8">
            <!-- Content -->
            <div v-if="loading && pendingBills.length === 0 && historyRecords.length === 0" class="space-y-4">
                <div v-for="i in 3" :key="i"
                    class="h-32 bg-white dark:bg-slate-800 rounded animate-pulse border border-slate-100 dark:border-slate-700">
                </div>
            </div>

            <div v-else class="space-y-4">
                <!-- Pending Bills Tab -->
                <div v-if="activeTab === '待缴账单'">
                    <PaymentWaitingPay :bills="pendingBills" @pay="handlePay" />
                </div>

                <!-- History Records Tab -->
                <div v-if="activeTab === '缴费记录'">
                    <PaymentRecords :records="historyRecords" />
                </div>
            </div>

            <!-- Pay Dialog -->
            <ComponentPayDialogDetials :show="showPayDetails" :orderData="currentOrder" @close="showPayDetails = false"
                @success="handlePaymentSuccess" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePayment } from '@/composables/usePayment'

const {
    loading,
    pendingBills,
    historyRecords,
    fetchMyBills,
    fetchPaymentHistory,
    createPaymentOrder
} = usePayment()

const activeTab = ref('待缴账单')
const showPayDetails = ref(false)
const currentOrder = ref<any>(null)

const tabs = [
    { name: '待缴账单', icon: 'lucide:wallet' },
    { name: '缴费记录', icon: 'lucide:history' }
]

const loadData = async () => {
    try {
        await Promise.all([
            fetchMyBills(0), // 0 represents unpaid
            fetchPaymentHistory()
        ])
    } catch (e) {
        ElMessage.error('加载账单数据失败')
    }
}

const handlePay = async (bill: any, method: string) => {
    // 创建订单
    const order = await createPaymentOrder(bill.billId, bill.totalAmount, method);

    if (order) {
        currentOrder.value = order;
        showPayDetails.value = true;
    }
}

const handlePaymentSuccess = async () => {
    showPayDetails.value = false;
    ElMessage.success('支付成功');
    await loadData();
}

onMounted(() => {
    loadData()
})

useHead({
    title: '物业缴费 - 智慧社区'
})
</script>

<style scoped>
:deep(.payment-confirm-box) {
    border-radius: 12px;
}
</style>
