<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <NuxtLink to="/superCommunity/property/fee" class="text-slate-400 hover:text-slate-600">
                        <Icon name="lucide:arrow-left" size="20" />
                    </NuxtLink>
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white">缴费记录</h1>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-7">查看用户物业费缴费记录</p>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="用户ID" class="!mb-0">
                    <el-input-number v-model="queryForm.userId" placeholder="用户ID" :controls="false"
                        style="width: 120px;" />
                </el-form-item>
                <el-form-item label="支付方式" class="!mb-0">
                    <el-select v-model="queryForm.paymentMethod" placeholder="全部" clearable style="width: 130px;">
                        <el-option label="钱包" value="WALLET" />
                        <el-option label="支付宝" value="ALIPAY" />
                        <el-option label="微信" value="WECHAT" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" class="!mb-0">
                    <el-select v-model="queryForm.status" placeholder="全部" clearable style="width: 100px;">
                        <el-option label="失败" :value="0" />
                        <el-option label="成功" :value="1" />
                        <el-option label="退款" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="日期范围" class="!mb-0">
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 240px;" />
                </el-form-item>
                <el-form-item class="!mb-0">
                    <el-button type="primary" @click="handleSearch">
                        <Icon name="lucide:search" size="14" class="mr-1" />搜索
                    </el-button>
                    <el-button @click="handleReset">
                        <Icon name="lucide:rotate-ccw" size="14" class="mr-1" />重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 缴费记录列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table :data="paymentList" v-loading="loading" style="width: 100%">
                <el-table-column prop="paymentNo" label="缴费编号" width="180">
                    <template #default="{ row }">
                        <span class="text-xs font-mono text-slate-500">{{ row.paymentNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="billId" label="关联账单ID" width="100" align="center" />
                <el-table-column prop="userId" label="用户ID" width="90" align="center" />
                <el-table-column label="缴费金额" width="130">
                    <template #default="{ row }">
                        <span class="font-bold text-green-600">¥{{ row.amount?.toFixed(2) || '0.00' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付方式" width="120">
                    <template #default="{ row }">
                        <div class="flex items-center gap-1">
                            <Icon :name="getPaymentIcon(row.paymentMethod)" size="16"
                                :class="getPaymentColor(row.paymentMethod)" />
                            <span>{{ getPaymentMethodText(row.paymentMethod) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="transactionId" label="交易ID" width="120">
                    <template #default="{ row }">
                        <span class="text-xs text-slate-400">{{ row.transactionId || '-' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="缴费时间" min-width="170" />
            </el-table>

            <!-- 分页 -->
            <div class="p-4 flex justify-end border-t border-slate-200 dark:border-slate-700">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="fetchPaymentList"
                    @current-change="fetchPaymentList" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAdminPropertyFeePaymentsApi } from '@/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

// 查询表单
const queryForm = reactive({
    userId: undefined as number | undefined,
    paymentMethod: undefined as string | undefined,
    status: undefined as number | undefined,
    pageNum: 1,
    pageSize: 10
})

const dateRange = ref<[string, string] | null>(null)

// 分页
const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
})

// 列表数据
const loading = ref(false)
const paymentList = ref<any[]>([])

// 获取支付方式图标
const getPaymentIcon = (method: string) => {
    switch (method) {
        case 'WALLET': return 'lucide:wallet'
        case 'ALIPAY': return 'simple-icons:alipay'
        case 'WECHAT': return 'simple-icons:wechat'
        default: return 'lucide:credit-card'
    }
}

// 获取支付方式颜色
const getPaymentColor = (method: string) => {
    switch (method) {
        case 'WALLET': return 'text-purple-500'
        case 'ALIPAY': return 'text-blue-500'
        case 'WECHAT': return 'text-green-500'
        default: return 'text-slate-500'
    }
}

// 获取支付方式文本
const getPaymentMethodText = (method: string) => {
    switch (method) {
        case 'WALLET': return '钱包'
        case 'ALIPAY': return '支付宝'
        case 'WECHAT': return '微信'
        default: return method || '-'
    }
}

// 获取状态类型
const getStatusType = (status: number) => {
    switch (status) {
        case 0: return 'danger'
        case 1: return 'success'
        case 2: return 'warning'
        default: return 'info'
    }
}

// 获取状态文本
const getStatusText = (status: number) => {
    switch (status) {
        case 0: return '失败'
        case 1: return '成功'
        case 2: return '退款'
        default: return '未知'
    }
}

// 获取缴费记录列表
const fetchPaymentList = async () => {
    loading.value = true
    try {
        const params = {
            pageNum: pagination.current,
            pageSize: pagination.size,
            userId: queryForm.userId || undefined,
            paymentMethod: queryForm.paymentMethod || undefined,
            status: queryForm.status,
            startDate: dateRange.value?.[0] || undefined,
            endDate: dateRange.value?.[1] || undefined
        }

        const res = await getAdminPropertyFeePaymentsApi(params) as any
        if (res.code === 200 && res.data) {
            paymentList.value = res.data.records || []
            pagination.total = res.data.total || 0
        }
    } catch (e) {
        console.error('获取缴费记录失败', e)
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchPaymentList()
}

// 重置
const handleReset = () => {
    queryForm.userId = undefined
    queryForm.paymentMethod = undefined
    queryForm.status = undefined
    dateRange.value = null
    pagination.current = 1
    fetchPaymentList()
}

// 页面加载
onMounted(() => {
    fetchPaymentList()
})
</script>
