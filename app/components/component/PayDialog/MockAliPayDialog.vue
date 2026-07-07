<template>
    <div class="min-h-screen bg-[#eff0f1] font-sans text-sm text-[#4d4d4d]">
        <!-- Header -->
        <div class="bg-white px-10 py-4 shadow-sm border-b border-gray-200">
            <div class="max-w-[1200px] mx-auto flex justify-between items-center">
                <div class="flex items-end gap-2">
                    <!-- Mock Alipay Logo Text -->
                    <div class="flex items-center gap-1">
                        <div
                            class="bg-[#02a9f1] text-white w-8 h-8 flex items-center justify-center font-bold rounded text-lg">
                            支</div>
                        <div class="text-2xl font-bold text-[#4d4d4d]">收银台</div>
                    </div>
                </div>
                <div class="text-xs text-gray-500">支付宝账户: 156***024 | 找回密码 | 唯一热线: 95188</div>
            </div>
        </div>

        <div class="max-w-[1200px] mx-auto mt-6 bg-white px-8 py-6 shadow-sm min-h-[600px] relative">
            <!-- Order Info -->
            <div class="flex justify-between items-start mb-8">
                <div>
                    <p class="mb-1 text-base">订单信息：<span class="font-bold">{{ description || '商品交易' }}</span></p>
                    <p class="text-gray-400 text-xs text-[#999]">收款方：智里治智慧社区</p>
                </div>
                <div class="text-right flex items-baseline justify-end gap-1">
                    <span class="text-xs text-[#4d4d4d]">订单金额</span>
                    <span class="text-2xl font-bold text-[#ff8200]">{{ Number(amount).toFixed(2) }}</span>
                    <span class="text-xs text-[#4d4d4d]">元</span>
                </div>
            </div>

            <div class="flex gap-8">
                <!-- Left: Payment Controls -->
                <div class="flex-1">
                    <!-- Payment Method Box -->
                    <div class="border-2 border-[#85c3ff] bg-[#eef7ff] p-5 mb-6 relative">
                        <!-- Selection Dot -->
                        <div
                            class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded border-[5px] border-[#02a9f1] bg-white">
                        </div>

                        <div class="pl-8 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-1 text-[#ff8200]">
                                    <Icon name="lucide:coins" />
                                    <span class="font-bold text-[#4d4d4d]">余额宝</span>
                                </div>
                                <span class="text-gray-400">99.00 元</span>
                            </div>
                            <div class="flex items-baseline gap-1">
                                <span class="text-gray-500 mr-1 text-xs font-bold">支付</span>
                                <span class="font-bold text-[#ff8200] text-lg">{{ Number(amount).toFixed(2) }}</span>
                                <span class="text-gray-500 text-xs font-bold">元</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2 mb-8">
                        <button
                            class="px-3 py-1 border border-transparent hover:border-[#85c3ff] text-[#02a9f1] text-xs">其他方式付款</button>
                        <button
                            class="px-3 py-1 border border-transparent hover:border-[#85c3ff] text-[#02a9f1] text-xs">海外地区方式付款</button>
                        <button
                            class="px-3 py-1 border border-transparent hover:border-[#85c3ff] text-[#02a9f1] text-xs">添加银行卡付款</button>
                    </div>

                    <!-- Password Input -->
                    <div class="pl-4">
                        <div class="flex items-center gap-2 mb-6 text-[#6cbb41] font-bold text-xs">
                            <Icon name="lucide:shield-check" size="14" class="fill-current" />
                            <span>安全设置检测成功！</span>
                        </div>

                        <div class="flex items-start gap-4 mb-8">
                            <label class="w-20 text-right pt-2 text-[#4d4d4d]">支付密码：</label>
                            <div>
                                <div class="flex border border-[#ccc]">
                                    <input v-for="(digit, index) in 6" :key="index" type="password" maxlength="1"
                                        v-model="password[index]" ref="passwordInputs"
                                        class="w-10 h-10 border-r border-[#ccc] last:border-r-0 text-center text-xl bg-white outline-none focus:bg-yellow-50"
                                        @input="handleInput(index, $event)" @keydown.delete="handleDelete(index)" />
                                </div>
                                <a href="#" class="text-[#02a9f1] text-xs mt-2 block hover:underline">忘记密码？</a>
                            </div>
                        </div>

                        <div class="pl-24">
                            <button @click="handleSubmit"
                                class="w-40 h-10 bg-[#02a9f1] text-white font-bold rounded-[3px] hover:bg-[#029de0] transition-colors shadow-sm text-base">
                                确认付款
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right: QR Code -->
                <div class="w-64 border-l border-gray-100 pl-8 pt-4 flex flex-col items-center">
                    <div class="mb-4 text-[#4d4d4d] font-bold text-xs flex items-center gap-1 self-start">
                        <Icon name="lucide:scan-line" class="text-[#02a9f1]" />
                        <span>使用支付宝APP扫码付款</span>
                    </div>
                    <div class="w-36 h-36 bg-white border border-gray-200 p-2">
                        <!-- Mock QR -->
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AlipayPayment"
                            class="w-full h-full" alt="QR Code" />
                    </div>
                    <p class="mt-4 text-xs text-center text-[#999]">
                        扫一扫快速付款<br />
                        <span class="text-[#02a9f1] cursor-pointer hover:underline">如何使用?</span>
                    </p>
                </div>
            </div>
        </div>

        <!-- Paying Modal -->
        <div v-if="isPaying" class="fixed inset-0 bg-black/30 z-[999] flex items-center justify-center">
            <div class="bg-white rounded px-8 py-6 flex flex-col items-center gap-4 shadow-xl min-w-[200px]">
                <Icon name="svg-spinners:ring-resize" class="text-[#02a9f1]" size="32" />
                <p class="font-bold text-gray-700">正在支付中...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mockCallbackApi } from '@/utils/api';

const route = useRoute();
const router = useRouter();

const orderNo = route.query.orderNo as string;
const amount = ref(Number(route.query.amount) || 0);
const description = route.query.description as string;

const password = ref(['', '', '', '', '', '']);
const passwordInputs = ref<HTMLInputElement[]>([]);
const isPaying = ref(false);


const handleInput = (index: number, event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.value) {
        if (index < 5) {
            const nextInput = passwordInputs.value[index + 1];
            if (nextInput) nextInput.focus();
        }
    }
};

const handleDelete = (index: number) => {
    if (!password.value[index] && index > 0) {
        const prevInput = passwordInputs.value[index - 1];
        if (prevInput) prevInput.focus();
    }
};

const { pollOrderStatus } = useWallet();

// 进入页面即开始轮询（用于支持扫码支付等场景）
const isSuccess = ref(false);

onMounted(async () => {
    // 后台轮询：60次，每隔2秒一次，共2分钟
    const success = await pollOrderStatus(orderNo, 60, 2000);
    if (success) {
        isSuccess.value = true;
        ElMessage.success('支付成功');
    }
});

onUnmounted(() => {
    if (!isSuccess.value) {
        mockCallbackApi(orderNo, false); // Notify failure/cancel if leaving without success
    }
});

const handleSubmit = async () => {
    // 简单的校验
    if (password.value.some(p => !p)) {
        ElMessage.warning('请输入6位支付密码');
        return;
    }

    // Simulate payment success callback
    await mockCallbackApi(orderNo) as any;

    // Mark as potentially successful so onUnmounted doesn't fail it (or let Wallet page handle validation)
    // Actually, if we redirect, onUnmounted runs.
    // If we just called mockCallbackApi(true), backend is transitioning to success.
    // If we let onUnmounted call mockCallbackApi(false), it might race or overwrite.
    // So we should set isSuccess = true here assuming the user "committed" to pay.
    isSuccess.value = true;

    // router.push({ path: '/wallet', query: { orderNo } });
    router.back();
};
</script>

<style scoped>
/* Scoped styles */
</style>
