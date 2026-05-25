<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="handleClose"></div>

            <!-- Dialog Content -->
            <Transition name="scale">
                <div v-if="show"
                    class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">

                    <!-- Header (Order Status) -->
                    <div
                        class="pt-10 pb-6 text-center bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/10 dark:to-slate-900">
                        <div
                            class="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-500/20 rounded flex items-center justify-center text-[#ff5000] mb-4">
                            <Icon name="lucide:shopping-bag" size="32" />
                        </div>
                        <h2 class="text-2xl font-black text-slate-800 dark:text-slate-100">{{
                            orderData.amount.toFixed(2) }}</h2>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{{
                            orderData.description || '交易详情' }}</p>
                    </div>

                    <div class="px-8 pb-8 space-y-6">
                        <!-- Order Info Grid -->
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded p-6 space-y-4">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">订单编号</span>
                                <span class="font-mono font-medium text-slate-700 dark:text-slate-300 text-xs">{{
                                    orderData.orderNo }}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">创建时间</span>
                                <span class="font-medium text-slate-700 dark:text-slate-300">{{
                                    formatTime(orderData.createTime) }}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">失效时间</span>
                                <span class="font-medium text-[#ff5000]">{{ formatTime(orderData.expireTime) }}</span>
                            </div>
                            <div class="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-slate-500">支付方式</span>
                                <el-select v-model="orderData.paymentMethod" @change="onPaymentMethodChange"
                                    class="payment-select" placeholder="请选择支付方式">
                                    <el-option label="支付宝" value="ALIPAY">
                                        <div class="flex items-center gap-2">
                                            <Icon name="simple-icons:alipay" class="text-[#00A1E9]" size="14" />
                                            <span>支付宝</span>
                                        </div>
                                    </el-option>
                                    <el-option label="微信支付" value="WECHAT">
                                        <div class="flex items-center gap-2">
                                            <Icon name="simple-icons:wechat" class="text-[#07C160]" size="14" />
                                            <span>微信支付</span>
                                        </div>
                                    </el-option>
                                    <el-option label="钱包支付" value="WALLET">
                                        <div class="flex items-center gap-2">
                                            <Icon name="lucide:wallet" class="text-orange-500" size="14" />
                                            <span>钱包支付</span>
                                        </div>
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid grid-cols-2 gap-4">
                            <button @click="handleClose"
                                class="w-full py-4 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                稍后支付
                            </button>
                            <button @click="handlePay"
                                class="w-full bg-[#ff5000] text-white py-4 rounded font-bold shadow-lg shadow-orange-500/30 hover:bg-[#eb4b00] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                :disabled="paying">
                                <Icon v-if="paying" name="lucide:loader-2" class="animate-spin" />
                                <span>立即支付</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">

const props = defineProps({
    show: Boolean,
    orderData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['close', 'success']);
const paying = ref(false);

const handleClose = () => {
    emit('close');
};

const { initiatePayment, pollOrderStatus, changePayMethod } = useWallet();

const onPaymentMethodChange = async (val: string) => {
    await changePayMethod(props.orderData.orderNo, val);
};

const handlePay = async () => {
    paying.value = true;
    try {
        // 更新订单状态（调用发起支付接口）
        await initiatePayment(props.orderData.orderNo);

        // Navigate to mock payment page
        await navigateTo({
            path: '/payment/gateway',
            query: {
                orderNo: props.orderData.orderNo,
                amount: props.orderData.amount,
                description: props.orderData.description
            }
        });
        // Close dialog after navigation (optional, as page will change)
        emit('close');
    } catch (e: any) {
        ElMessage.error(e.message || '系统错误');
    } finally {
        paying.value = false;
    }
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return '--';
    return new Date(timeStr).toLocaleString();
};

const getPaymentIcon = (method: string) => {
    if (method === 'ALIPAY') return 'simple-icons:alipay';
    if (method === 'WECHAT') return 'simple-icons:wechat';
    return 'lucide:credit-card';
};

const getPaymentLabel = (method: string) => {
    if (method === 'ALIPAY') return '支付宝';
    if (method === 'WECHAT') return '微信支付';
    return method;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}

:deep(.payment-select) {
    width: 120px;
}

:deep(.payment-select .el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none !important;
    padding-right: 0;
}

:deep(.payment-select .el-input__inner) {
    text-align: right;
    font-weight: 700;
    color: #1e293b;
    font-size: 13px;
}

.dark :deep(.payment-select .el-input__inner) {
    color: #f1f5f9;
}
</style>
