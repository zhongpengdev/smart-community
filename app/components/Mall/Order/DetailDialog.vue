<template>
    <el-dialog v-model="visible" :title="'订单详情 - ' + (orderData?.orderNo || '')" width="600px" destroy-on-close
        class="order-detail-dialog">
        <div v-if="loading" class="py-10 flex flex-col items-center justify-center">
            <el-skeleton :rows="10" animated />
        </div>

        <div v-else-if="orderData" class="space-y-6">
            <!-- Status Header -->
            <div class="bg-slate-50 dark:bg-white/5 p-4 rounded flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div :class="getStatusIconClass(orderData.status)" class="p-2 rounded">
                        <Icon :name="getStatusIcon(orderData.status)" size="20" />
                    </div>
                    <div>
                        <div class="font-bold text-slate-800 dark:text-slate-100">{{ orderData.statusDesc }}</div>
                        <div class="text-xs text-slate-400 mt-0.5">{{ orderData.createTime }}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-slate-400 mb-1">应付总额</div>
                    <div class="text-[#ff5000] text-xl font-bold font-mono">¥{{ orderData.amount.toFixed(2) }}</div>
                </div>
            </div>

            <!-- Products List -->
            <div v-if="orderData.products && orderData.products.length > 0">
                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 px-1">商品清单</h4>
                <div class="space-y-3">
                    <div v-for="product in orderData.products" :key="product.productId"
                        class="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded border border-slate-50 dark:border-white/5 shadow-sm">
                        <img :src="product.productImage" class="w-16 h-16 rounded object-cover" />
                        <div class="flex-1 min-w-0">
                            <h5 class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{{
                                product.productName }}</h5>
                            <div class="flex items-center justify-between mt-2">
                                <span class="text-xs text-slate-400 font-mono">¥{{ product.price }} × {{
                                    product.quantity }}</span>
                                <span class="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">¥{{
                                    product.subtotal }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Info Items -->
            <div class="space-y-3 pt-2">
                <div class="flex justify-between text-sm py-1">
                    <span class="text-slate-400">商户名称</span>
                    <span class="text-slate-800 dark:text-slate-100 font-medium">{{ orderData.storeName || '平台服务'
                    }}</span>
                </div>
                <div class="flex justify-between text-sm py-1">
                    <span class="text-slate-400">订单类型</span>
                    <span class="text-slate-800 dark:text-slate-100 font-medium">{{ orderData.orderTypeDesc }}</span>
                </div>
                <div class="flex justify-between text-sm py-1">
                    <span class="text-slate-400">支付方式</span>
                    <span class="text-slate-800 dark:text-slate-100 font-medium">{{ orderData.paymentMethodDesc || '未指定'
                    }}</span>
                </div>
                <div v-if="orderData.description" class="flex justify-between text-sm py-1">
                    <span class="text-slate-400">订单备注</span>
                    <span class="text-slate-800 dark:text-slate-100 font-medium italic">{{ orderData.description
                    }}</span>
                </div>
                <div v-if="orderData.expireTime && orderData.status === 0" class="flex justify-between text-sm py-1">
                    <span class="text-slate-400">过期时间</span>
                    <span class="text-red-500 font-medium">{{ orderData.expireTime }}</span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
    orderData: any
    loading?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const getStatusIcon = (status: number) => {
    switch (status) {
        case 0: return 'lucide:clock'
        case 1: return 'lucide:loader-2'
        case 2: return 'lucide:check-circle'
        case 3: return 'lucide:x-circle'
        default: return 'lucide:info'
    }
}

const getStatusIconClass = (status: number) => {
    switch (status) {
        case 0: return 'bg-orange-50 dark:bg-orange-500/20 text-orange-500'
        case 1: return 'bg-blue-50 dark:bg-blue-500/20 text-blue-500 animate-spin-slow'
        case 2: return 'bg-green-50 dark:bg-green-500/20 text-green-500'
        case 3: return 'bg-red-50 dark:bg-red-500/20 text-red-500'
        default: return 'bg-slate-50 dark:bg-slate-500/20 text-slate-500'
    }
}
</script>

<style>
/* 移除 scoped，因为 el-dialog 默认 teleport 到 body，scoped 样式无法穿透 */
.order-detail-dialog {
    border-radius: 20px !important;
    overflow: hidden;
    background-color: #ffffff;
}

.order-detail-dialog .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 20px 24px;
    margin-right: 0;
}

.order-detail-dialog .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    color: #94a3b8;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    letter-spacing: -0.025em;
}

.order-detail-dialog .el-dialog__body {
    padding: 32px !important;
}

/* Dark Mode Styles */
.dark .order-detail-dialog {
    background-color: #1e293b;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.dark .order-detail-dialog .el-dialog__header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background-color: #1e293b;
}

.dark .order-detail-dialog .el-dialog__title {
    color: #e2e8f0;
}

.dark .order-detail-dialog .el-dialog__body {
    background-color: #1e293b;
}

.dark .order-detail-dialog .el-dialog__headerbtn .el-dialog__close {
    color: #94a3b8;
}

.dark .order-detail-dialog .el-dialog__headerbtn:hover .el-dialog__close {
    color: #f1f5f9;
}

.animate-spin-slow {
    animation: spin 3s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
