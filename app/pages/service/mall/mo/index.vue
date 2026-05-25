<template>
    <div class="min-h-screen bg-[#f5f7fa] dark:bg-slate-900 pb-24 transition-colors duration-300">
        <!-- Header -->
        <div
            class="sticky top-10 z-[40] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
            <div class="max-w-[1300px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
                <!-- Left: Title Section -->
                <div class="flex items-center gap-4 shrink-0">
                    <h1 class="text-xl font-bold text-slate-900 dark:text-white">全部订单</h1>
                </div>

                <!-- Right: Clean Filters -->
                <div class="flex items-center gap-6">
                    <!-- Type Filter -->
                    <div class="flex items-center gap-1">
                        <button v-for="t in typeOptions" :key="t.value" @click="setFilter('orderType', t.value)" :class="[
                            filters.orderType === t.value
                                ? 'text-[#ff5000] font-bold bg-orange-50 dark:bg-orange-900/20'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        ]" class="px-3 py-1.5 rounded text-[13px] transition-all duration-200 whitespace-nowrap">
                            {{ t.label }}
                        </button>
                    </div>

                    <!-- Divider -->
                    <div class="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>

                    <!-- Status Filter -->
                    <div class="flex items-center gap-1">
                        <button v-for="s in statusOptions" :key="s.value" @click="setFilter('status', s.value)" :class="[
                            filters.status === s.value
                                ? 'text-[#ff5000] font-bold bg-orange-50 dark:bg-orange-900/20'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        ]" class="px-3 py-1.5 rounded text-[13px] transition-all duration-200 whitespace-nowrap">
                            {{ s.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-[1000px] mx-auto px-4 mt-8">


            <!-- Loading State -->
            <div v-if="loading && orderList.length === 0" class="space-y-6">
                <div v-for="i in 3" :key="i"
                    class="bg-white dark:bg-slate-800 rounded p-6 animate-pulse h-48 shadow-sm"></div>
            </div>

            <!-- Order List -->
            <div v-else-if="orderList.length > 0" class="space-y-4">
                <div v-for="order in orderList" :key="order.orderId"
                    class="bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">

                    <!-- Compact Header -->
                    <div
                        class="px-5 py-3 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/5">
                        <div class="flex items-center gap-3">
                            <span class="text-[11px] font-mono text-slate-400">#{{ order.orderNo }}</span>
                            <span class="h-1 w-1 rounded bg-slate-300"></span>
                            <span class="text-[11px] text-slate-500 font-medium">{{ order.orderTypeDesc }}</span>
                        </div>
                        <span :class="getStatusClass(order.status)"
                            class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {{ order.statusDesc }}
                        </span>
                    </div>

                    <!-- Content Section -->
                    <div class="p-5">
                        <div class="flex items-center justify-between gap-4">
                            <div class="flex items-center gap-4 flex-1 min-w-0">
                                <div class="min-w-0">
                                    <h3
                                        class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-2">
                                        <span>{{ order.storeName || '智慧社区服务' }}<span
                                                v-if="order.orderTypeDesc === '商品订单'">的商品</span></span>
                                        <Icon v-if="order.storeName" name="lucide:chevron-right" size="17"
                                            class="text-slate-300 cursor-pointer"
                                            @click="handleViewDetail(order.orderId)" />
                                    </h3>
                                    <p class="text-[12px] text-slate-400 truncate mt-0.5">{{ order.description }}</p>
                                </div>
                            </div>

                            <div class="text-right">
                                <div class="text-[18px] font-black text-slate-800 dark:text-slate-200 font-mono">
                                    <span class="text-xs mr-0.5 font-normal">¥</span>{{ order.amount.toFixed(2) }}
                                </div>
                                <div class="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
                                    {{ order.createTime.split(' ')[0] }}
                                </div>
                            </div>
                        </div>

                        <!-- Footer info & Actions -->
                        <div
                            class="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div v-if="order.status === 0"
                                    class="flex items-center gap-1 text-[11px] text-red-500 font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">
                                    <Icon name="lucide:timer" size="13" />
                                    <span>{{ getCountdown(order) }}</span>
                                </div>
                                <span v-if="order.productCount" class="text-[11px] text-slate-400">
                                    <Icon name="lucide:package-2" size="12" class="inline mb-0.5 mr-1" />
                                    {{ order.productCount }} 件商品
                                </span>
                            </div>

                            <div class="flex gap-2">
                                <button @click="handleViewDetail(order.orderId)"
                                    class="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700/50 rounded transition-colors">
                                    详情
                                </button>
                                <button v-if="order.status === 0" @click="handleCancelOrder(order.orderId)"
                                    class="px-4 py-1.5 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded transition-colors">
                                    取消
                                </button>
                                <button v-if="order.status === 0" @click="handleGoPay(order)"
                                    class="px-5 py-1.5 bg-[#ff5000] text-white text-xs font-bold rounded hover:bg-[#ff6a22] transition-all shadow-md shadow-orange-500/10 active:scale-95">
                                    去支付
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="py-10 flex justify-center">
                    <el-pagination background layout="prev, pager, next" hide-on-single-page :total="total"
                        :page-size="pagination.pageSize" :current-page="pagination.pageNum"
                        @current-change="handlePageChange" />
                </div>
            </div>

            <!-- Empty State -->
            <div v-else
                class="py-24 text-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-800 shadow-sm">
                <div
                    class="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                    <Icon name="lucide:inbox" size="32" />
                </div>
                <p class="text-slate-400 font-medium mb-6">暂无订单数据</p>
                <NuxtLink to="/service/mall"
                    class="inline-flex items-center justify-center px-8 py-2.5 bg-[#ff5000] text-white rounded hover:bg-[#e64a00] transition-all font-bold shadow-lg shadow-orange-500/10">
                    前往商城
                </NuxtLink>
            </div>
        </div>

        <!-- Order Detail Dialog -->
        <MallOrderDetailDialog v-model="detailVisible" :orderData="orderDetail" :loading="detailLoading" />

        <!-- Payment Dialog -->
        <ComponentPayDialogDetials :show="showPay" :orderData="payingOrder" @close="showPay = false"
            @success="handlePaymentSuccess" />
    </div>
</template>

<script setup lang="ts">
import { useGoodsOrder } from '@/composables/mall/useGoodsOrder'
import MallOrderDetailDialog from '@/components/Mall/Order/DetailDialog.vue'

const {
    orderList,
    total,
    loading,
    detailLoading,
    orderDetail,
    pagination,
    filters,
    fetchOrderList,
    fetchOrderDetail,
    cancelOrder,
    setFilter,
    handlePageChange
} = useGoodsOrder()

const detailVisible = ref(false)
const showPay = ref(false)
const payingOrder = ref<any>(null)

const handleViewDetail = async (orderId: number) => {
    detailVisible.value = true
    await fetchOrderDetail(orderId)
}

const handleGoPay = (order: any) => {
    payingOrder.value = order
    showPay.value = true
}

const handleCancelOrder = async (orderId: number) => {
    try {
        await ElMessageBox.confirm('确定要取消该订单吗？', '操作确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        await cancelOrder(orderId)
    } catch (error) {
        // user cancelled
    }
}

const handlePaymentSuccess = () => {
    showPay.value = false
    fetchOrderList() // Refresh list to see updated status
}

const typeOptions = [
    { label: '全部类型', value: 'ALL' },
    { label: '商品订单', value: 'PRODUCT' },
    { label: '物业缴费', value: 'PROPERTY_FEE' },
    { label: '钱包充值', value: 'RECHARGE' },
]

const statusOptions = [
    { label: '全部状态', value: 'ALL' },
    { label: '待支付', value: '0' },
    { label: '支付中', value: '1' },
    { label: '支付成功', value: '2' },
    { label: '支付失败', value: '3' },
]

// Real-time countdown management
const now = ref(Date.now())
let timer: any = null

onMounted(() => {
    fetchOrderList()
    timer = setInterval(() => {
        now.value = Date.now()
    }, 1000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})

const getCountdown = (order: any) => {
    const timeStr = order.expireTime
    if (!timeStr) return '00:00'

    let expire = new Date(timeStr.replace(/-/g, '/')).getTime()

    const diff = expire - now.value

    if (diff <= 0) return '已过期'

    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const getStatusClass = (status: number) => {
    switch (status) {
        case 0: return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
        case 1: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        case 2: return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
        case 3: return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
        default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    }
}

useHead({
    title: '我的订单 - 智慧社区'
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>