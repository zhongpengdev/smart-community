<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')"></div>

            <!-- Dialog Content -->
            <Transition name="scale">
                <div v-if="show"
                    class="relative w-full max-w-3xl bg-white dark:bg-black rounded shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">

                    <!-- Header -->
                    <div class="px-8 pt-8 pb-4 flex justify-between items-center">
                        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">余额充值</h2>
                        <button @click="$emit('close')"
                            class="w-10 h-10 rounded flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                            <Icon name="lucide:x" size="20" />
                        </button>
                    </div>

                    <div class="px-8 pb-8 grid md:grid-cols-2 gap-8">
                        <!-- Amount Selection -->
                        <div>
                            <label
                                class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 block uppercase tracking-wider text-[10px]">选择充值金额</label>
                            <div class="grid grid-cols-2 gap-3">
                                <button v-for="amt in amounts" :key="amt" @click="selectedAmount = amt" :class="[
                                    'py-6 rounded border-2 font-black transition-all duration-200 text-lg',
                                    selectedAmount === amt
                                        ? 'border-[#ff5000] bg-orange-50 text-[#ff5000] dark:bg-orange-500/10'
                                        : 'border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                                ]">
                                    <span class="text-xs">¥</span>{{ amt }}
                                </button>
                                <!-- Custom input placeholder or more options -->
                            </div>
                        </div>

                        <!-- Payment Method -->
                        <div class="flex flex-col h-full justify-between gap-6">
                            <div>
                                <label
                                    class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 block uppercase tracking-wider text-[10px]">支付方式</label>
                                <div class="space-y-3">
                                    <button v-for="method in paymentMethods" :key="method.id"
                                        @click="selectedMethod = method.id" :class="[
                                            'w-full flex items-center justify-between p-4 rounded border-2 transition-all',
                                            selectedMethod === method.id
                                                ? 'border-[#ff5000] bg-orange-50 dark:bg-orange-500/10'
                                                : 'border-slate-50 dark:border-slate-800'
                                        ]">
                                        <div class="flex items-center gap-3">
                                            <div
                                                :class="['w-10 h-10 rounded flex items-center justify-center text-white', method.color]">
                                                <Icon :name="method.icon" size="20" />
                                            </div>
                                            <span class="font-bold text-slate-700 dark:text-slate-200">{{ method.name
                                                }}</span>
                                        </div>
                                        <div v-if="selectedMethod === method.id"
                                            class="w-6 h-6 rounded bg-[#ff5000] flex items-center justify-center text-white">
                                            <Icon name="lucide:check" size="14" />
                                        </div>
                                        <div v-else
                                            class="w-6 h-6 rounded border-2 border-slate-100 dark:border-slate-800">
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- Action Button -->
                            <button @click="handleRecharge" :disabled="loading"
                                class="group relative w-full bg-gradient-to-r from-[#ff5000] to-[#ff8c00] text-white py-5 rounded font-bold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none">
                                <div class="flex items-center justify-center gap-2">
                                    <Icon v-if="loading" name="lucide:loader-2" class="animate-spin" size="20" />
                                    <span>创建订单 ¥{{ selectedAmount.toFixed(2) }}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>

    <!-- Order Details Dialog -->
    <ComponentPayDialogDetials :show="showDetails" :orderData="orderDetails" @close="showDetails = false"
        @success="handlePaymentSuccess" />
</template>

<script setup lang="ts">
const props = defineProps({
    show: Boolean
});

const emit = defineEmits(['close', 'success']);

const { createRechargeOrder, loading } = useWallet();

const amounts = [50, 100, 200, 500, 1000, 2000];
const selectedAmount = ref(100);

const paymentMethods = [
    { id: 'ALIPAY', name: '支付宝支付', icon: 'simple-icons:alipay', color: 'bg-blue-500' },
    { id: 'WECHAT', name: '微信支付', icon: 'simple-icons:wechat', color: 'bg-green-500' }
];
const selectedMethod = ref('ALIPAY');

const showDetails = ref(false);
const orderDetails = ref({});

const handleRecharge = async () => {
    try {
        const res = await createRechargeOrder(
            selectedAmount.value,
            selectedMethod.value
        );

        if (res) {
            orderDetails.value = res;
            showDetails.value = true;
            // The logic finishes here for this step, user continues in the details dialog
        }
    } catch (error: any) {
        ElMessage.error(error.message || '创建订单失败，请稍后重试');
    }
};

const handlePaymentSuccess = () => {
    emit('success');
    emit('close');
    showDetails.value = false;
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
</style>
