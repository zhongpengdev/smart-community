<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">订单管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理所有商城订单</p>
            </div>
            <el-button @click="fetchOrderStatistics">
                <Icon name="lucide:bar-chart-3" size="18" class="mr-2" />
                查看统计
            </el-button>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline>
                <el-form-item label="订单号">
                    <el-input
                        v-model="queryForm.orderNo"
                        placeholder="请输入订单号"
                        clearable
                        style="width: 200px;"
                    />
                </el-form-item>
                <el-form-item label="订单类型">
                    <el-select
                        v-model="queryForm.orderType"
                        placeholder="全部类型"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="商品订单" value="PRODUCT" />
                        <el-option label="充值订单" value="RECHARGE" />
                        <el-option label="物业费" value="PROPERTY_FEE" />
                        <el-option label="停车费" value="PARKING_FEE" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select
                        v-model="queryForm.status"
                        placeholder="全部状态"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="待支付" :value="0" />
                        <el-option label="支付中" :value="1" />
                        <el-option label="支付成功" :value="2" />
                        <el-option label="已完成" :value="3" />
                        <el-option label="支付失败" :value="4" />
                        <el-option label="已取消" :value="5" />
                        <el-option label="已退款" :value="6" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input
                        v-model.number="queryForm.userId"
                        placeholder="请输入用户ID"
                        clearable
                        style="width: 150px;"
                    />
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 360px;"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">
                        <Icon name="lucide:search" size="16" class="mr-1" />
                        搜索
                    </el-button>
                    <el-button @click="handleReset">
                        <Icon name="lucide:rotate-ccw" size="16" class="mr-1" />
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 订单列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="orderList"
                v-loading="loading"
                style="width: 100%"
                :default-sort="{ prop: 'createTime', order: 'descending' }"
            >
                <el-table-column prop="orderNo" label="订单号" width="220" fixed />
                <el-table-column label="用户信息" width="180">
                    <template #default="{ row }">
                        <div class="flex flex-col gap-1">
                            <span class="text-sm font-medium text-slate-800 dark:text-white">{{ row.userName || '-' }}</span>
                            <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.userPhone || '-' }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderTypeDesc" label="订单类型" width="120" />
                <el-table-column prop="amount" label="订单金额" width="120">
                    <template #default="{ row }">
                        <span class="font-semibold text-[#ff5000]">¥{{ row.amount?.toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="statusDesc" label="订单状态" width="120">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)" size="small">
                            {{ row.statusDesc }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="paymentMethodDesc" label="支付方式" width="120" />
                <el-table-column prop="storeName" label="取货门店" width="150" show-overflow-tooltip />
                <el-table-column prop="description" label="订单描述" min-width="180" show-overflow-tooltip />
                <el-table-column prop="productCount" label="商品数量" width="100" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable />
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleViewDetail(row)"
                        >
                            <Icon name="lucide:eye" size="14" class="mr-1" />
                            查看
                        </el-button>
                        <el-button
                            v-if="canHandle(row.status)"
                            type="success"
                            size="small"
                            @click="handleOrder(row)"
                        >
                            <Icon name="lucide:package-check" size="14" class="mr-1" />
                            处理
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="p-4 flex justify-end border-t border-slate-200 dark:border-slate-700">
                <el-pagination
                    v-model:current-page="pagination.current"
                    v-model:page-size="pagination.size"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="fetchOrderList"
                    @current-change="fetchOrderList"
                />
            </div>
        </div>

        <!-- 订单详情弹窗 -->
        <el-dialog
            v-model="detailDialogVisible"
            title="订单详情"
            width="800px"
            :close-on-click-modal="false"
        >
            <div v-if="currentOrder" v-loading="detailLoading">
                <!-- 基础信息 -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">基础信息</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm text-slate-500">订单号</label>
                            <p class="text-sm font-mono">{{ currentOrder.orderNo }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-slate-500">用户名</label>
                            <p class="text-sm font-medium">{{ currentOrder.userName || '-' }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-slate-500">用户手机号</label>
                            <p class="text-sm">{{ currentOrder.userPhone || '-' }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-slate-500">订单类型</label>
                            <p class="text-sm">{{ currentOrder.orderTypeDesc }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-slate-500">订单状态</label>
                            <p>
                                <el-tag :type="getStatusType(currentOrder.status)" size="small">
                                    {{ currentOrder.statusDesc }}
                                </el-tag>
                            </p>
                        </div>
                        <div>
                            <label class="text-sm text-slate-500">订单金额</label>
                            <p class="text-lg font-semibold text-[#ff5000]">¥{{ currentOrder.amount?.toFixed(2) }}</p>
                        </div>
                        <div>
                            <label class="text-sm text-slate-500">支付方式</label>
                            <p class="text-sm">{{ currentOrder.paymentMethodDesc }}</p>
                        </div>
                        <div v-if="currentOrder.storeName">
                            <label class="text-sm text-slate-500">取货门店</label>
                            <p class="text-sm">{{ currentOrder.storeName }}</p>
                        </div>
                        <div v-if="currentOrder.description" class="col-span-2">
                            <label class="text-sm text-slate-500">订单描述</label>
                            <p class="text-sm">{{ currentOrder.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- 时间信息 -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">时间信息</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm text-slate-500">创建时间</label>
                            <p class="text-sm">{{ currentOrder.createTime }}</p>
                        </div>
                        <div v-if="currentOrder.callbackTime">
                            <label class="text-sm text-slate-500">支付时间</label>
                            <p class="text-sm">{{ currentOrder.callbackTime }}</p>
                        </div>
                        <div v-if="currentOrder.pickUpTime">
                            <label class="text-sm text-slate-500">取货时间</label>
                            <p class="text-sm">{{ currentOrder.pickUpTime }}</p>
                        </div>
                        <div v-if="currentOrder.finishTime">
                            <label class="text-sm text-slate-500">完成时间</label>
                            <p class="text-sm">{{ currentOrder.finishTime }}</p>
                        </div>
                        <div v-if="currentOrder.expireTime">
                            <label class="text-sm text-slate-500">过期时间</label>
                            <p class="text-sm">{{ currentOrder.expireTime }}</p>
                        </div>
                    </div>
                </div>

                <!-- 商品信息 -->
                <div v-if="currentOrder.products && currentOrder.products.length > 0">
                    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">商品信息</h3>
                    <el-table :data="currentOrder.products" border>
                        <el-table-column label="商品图片" width="100">
                            <template #default="{ row }">
                                <el-image
                                    v-if="row.productImage"
                                    :src="row.productImage"
                                    fit="cover"
                                    style="width: 60px; height: 60px; border-radius: 4px;"
                                    :preview-src-list="[row.productImage]"
                                />
                            </template>
                        </el-table-column>
                        <el-table-column prop="productName" label="商品名称" min-width="150" />
                        <el-table-column prop="quantity" label="数量" width="80" />
                        <el-table-column prop="price" label="单价" width="100">
                            <template #default="{ row }">
                                ¥{{ row.price?.toFixed(2) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="subtotal" label="小计" width="100">
                            <template #default="{ row }">
                                <span class="font-semibold text-[#ff5000]">¥{{ row.subtotal?.toFixed(2) }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>

        <!-- 处理订单弹窗 -->
        <el-dialog
            v-model="handleDialogVisible"
            title="处理订单"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form :model="handleForm" label-width="100px">
                <el-form-item label="订单号">
                    <span class="text-sm font-mono">{{ currentOrder?.orderNo }}</span>
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-tag :type="getStatusType(currentOrder?.status)" size="small">
                        {{ currentOrder?.statusDesc }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="处理操作" required>
                    <el-select v-model="handleForm.action" placeholder="请选择操作" style="width: 100%;">
                        <el-option label="发货" value="deliver" />
                        <el-option label="完成订单" value="complete" />
                        <el-option label="退款" value="refund" />
                        <el-option label="取消订单" value="cancel" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="handleForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入处理备注（可选）"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitOrder" :loading="submitting">
                    确定处理
                </el-button>
            </template>
        </el-dialog>

        <!-- 订单统计弹窗 -->
        <el-dialog
            v-model="statisticsDialogVisible"
            title="订单统计"
            width="800px"
            :close-on-click-modal="false"
        >
            <div v-if="statisticsData" class="space-y-6">
                <!-- 概览统计 -->
                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-6 text-white shadow-lg">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm opacity-90">总订单数</span>
                            <Icon name="lucide:shopping-cart" size="24" class="opacity-80" />
                        </div>
                        <div class="text-3xl font-bold">{{ statisticsData.totalOrders || 0 }}</div>
                    </div>
                    <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-6 text-white shadow-lg">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm opacity-90">已完成</span>
                            <Icon name="lucide:check-circle" size="24" class="opacity-80" />
                        </div>
                        <div class="text-3xl font-bold">{{ statisticsData.completedOrders || 0 }}</div>
                    </div>
                    <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-6 text-white shadow-lg">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm opacity-90">待处理</span>
                            <Icon name="lucide:clock" size="24" class="opacity-80" />
                        </div>
                        <div class="text-3xl font-bold">{{ statisticsData.pendingOrders || 0 }}</div>
                    </div>
                    <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-6 text-white shadow-lg">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm opacity-90">总金额</span>
                            <Icon name="lucide:currency-yen" size="24" class="opacity-80" />
                        </div>
                        <div class="text-3xl font-bold">¥{{ (statisticsData.totalAmount || 0).toFixed(2) }}</div>
                    </div>
                </div>

                <!-- 按状态统计 -->
                <div v-if="statisticsData.statusCount" class="bg-slate-50 dark:bg-slate-700 rounded p-6">
                    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">按状态统计</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div v-for="(count, status) in statisticsData.statusCount" :key="status" 
                            class="bg-white dark:bg-slate-800 rounded p-4 border border-slate-200 dark:border-slate-600">
                            <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">{{ getStatusName(status) }}</div>
                            <div class="text-2xl font-bold text-slate-800 dark:text-white">{{ count }}</div>
                        </div>
                    </div>
                </div>

                <!-- 按类型统计 -->
                <div v-if="statisticsData.typeCount" class="bg-slate-50 dark:bg-slate-700 rounded p-6">
                    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">按类型统计</h3>
                    <div class="grid grid-cols-4 gap-4">
                        <div v-for="(count, type) in statisticsData.typeCount" :key="type"
                            class="bg-white dark:bg-slate-800 rounded p-4 border border-slate-200 dark:border-slate-600">
                            <div class="text-sm text-slate-500 dark:text-slate-400 mb-1">{{ getTypeName(type) }}</div>
                            <div class="text-2xl font-bold text-slate-800 dark:text-white">{{ count }}</div>
                        </div>
                    </div>
                </div>

                <!-- 其他统计数据 -->
                <div class="bg-slate-50 dark:bg-slate-700 rounded p-6">
                    <h3 class="text-lg font-bold mb-4 text-slate-800 dark:text-white">其他统计</h3>
                    <div class="space-y-2 text-sm">
                        <div v-for="(value, key) in getOtherStats()" :key="key" 
                            class="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600 last:border-0">
                            <span class="text-slate-600 dark:text-slate-300">{{ formatKey(key) }}</span>
                            <span class="font-semibold text-slate-800 dark:text-white">{{ value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminOrderListApi, getAdminOrderDetailApi, handleAdminOrderApi, getAdminOrderStatisticsApi } from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: ['super-community']
})

interface Order {
    orderId: number
    orderNo: string
    userId: number
    userName: string
    userPhone: string
    orderType: string
    orderTypeDesc: string
    amount: number
    status: number
    statusDesc: string
    paymentMethod: string
    paymentMethodDesc: string
    storeName?: string
    description?: string
    productCount?: number
    createTime: string
    expireTime?: string
}

interface OrderDetail extends Order {
    storeId?: number
    relatedId?: number
    callbackTime?: string
    pickUpTime?: string
    finishTime?: string
    products?: Array<{
        productId: number
        productName: string
        productImage: string
        quantity: number
        price: number
        subtotal: number
    }>
}

const config = useRuntimeConfig()
const userStore = useUserStore()

const loading = ref(false)
const detailLoading = ref(false)
const submitting = ref(false)
const orderList = ref<Order[]>([])
const currentOrder = ref<OrderDetail | null>(null)
const detailDialogVisible = ref(false)
const handleDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)
const statisticsData = ref<any>(null)
const dateRange = ref<[string, string] | null>(null)

const queryForm = reactive({
    orderType: '',
    status: undefined as number | undefined,
    orderNo: '',
    userId: undefined as number | undefined,
    startTime: '',
    endTime: '',
    pageNum: 1,
    pageSize: 10
})

const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
})

const handleForm = reactive({
    action: '',
    remark: ''
})

// 获取订单列表
const fetchOrderList = async () => {
    loading.value = true
    try {
        // 处理时间范围
        if (dateRange.value) {
            queryForm.startTime = dateRange.value[0]
            queryForm.endTime = dateRange.value[1]
        } else {
            queryForm.startTime = ''
            queryForm.endTime = ''
        }

        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await getAdminOrderListApi({
            ...queryForm,
            status: queryForm.status !== undefined ? queryForm.status : undefined
        })

        if (response.code === 200 && response.data) {
            orderList.value = response.data.records || []
            pagination.total = response.data.total || 0
        } else {
            ElMessage.error(response.message || '获取订单列表失败')
        }
    } catch (error) {
        console.error('获取订单列表失败:', error)
        ElMessage.error('获取订单列表失败')
    } finally {
        loading.value = false
    }
}

// 查看订单详情
const handleViewDetail = async (order: Order) => {
    currentOrder.value = null
    detailDialogVisible.value = true
    detailLoading.value = true

    try {
        const response = await getAdminOrderDetailApi(order.orderId)
        if (response.code === 200 && response.data) {
            currentOrder.value = response.data
        } else {
            ElMessage.error(response.message || '获取订单详情失败')
            detailDialogVisible.value = false
        }
    } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('获取订单详情失败')
        detailDialogVisible.value = false
    } finally {
        detailLoading.value = false
    }
}

// 处理订单
const handleOrder = (order: Order) => {
    currentOrder.value = order as OrderDetail
    handleForm.action = ''
    handleForm.remark = ''
    handleDialogVisible.value = true
}

// 提交处理
const handleSubmitOrder = async () => {
    if (!currentOrder.value || !handleForm.action) {
        ElMessage.warning('请选择处理操作')
        return
    }

    const actionMap: Record<string, string> = {
        'deliver': '发货',
        'complete': '完成订单',
        'refund': '退款',
        'cancel': '取消订单'
    }

    try {
        await ElMessageBox.confirm(
            `确定要${actionMap[handleForm.action]}吗？`,
            '确认操作',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        submitting.value = true
        const response = await handleAdminOrderApi(currentOrder.value.orderId, {
            action: handleForm.action,
            remark: handleForm.remark
        })

        if (response.code === 200) {
            ElMessage.success('操作成功')
            handleDialogVisible.value = false
            fetchOrderList()
        } else {
            ElMessage.error(response.message || '操作失败')
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('处理订单失败:', error)
            ElMessage.error('处理订单失败')
        }
    } finally {
        submitting.value = false
    }
}

// 获取订单统计
const fetchOrderStatistics = async () => {
    try {
        const response = await getAdminOrderStatisticsApi()
        if (response.code === 200 && response.data) {
            statisticsData.value = response.data
            statisticsDialogVisible.value = true
        } else {
            ElMessage.error(response.message || '获取统计失败')
        }
    } catch (error) {
        console.error('获取统计失败:', error)
        ElMessage.error('获取统计失败')
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchOrderList()
}

// 重置
const handleReset = () => {
    Object.assign(queryForm, {
        orderType: '',
        status: undefined,
        orderNo: '',
        userId: undefined,
        startTime: '',
        endTime: ''
    })
    dateRange.value = null
    pagination.current = 1
    fetchOrderList()
}

// 获取状态类型
const getStatusType = (status?: number): '' | 'success' | 'warning' | 'danger' | 'info' => {
    const typeMap: Record<number, '' | 'success' | 'warning' | 'danger' | 'info'> = {
        0: 'warning',  // 待支付
        1: 'info',     // 支付中
        2: 'success',  // 支付成功
        3: 'success',  // 已完成
        4: 'danger',   // 支付失败
        5: 'info',     // 已取消
        6: 'warning'   // 已退款
    }
    return status !== undefined ? typeMap[status] : 'info'
}

// 判断是否可以处理
const canHandle = (status: number) => {
    // 支付成功(待取货)状态可以处理
    return status === 2
}

// 获取状态名称
const getStatusName = (status: string | number) => {
    const statusMap: Record<string, string> = {
        '0': '待支付',
        '1': '支付中',
        '2': '支付成功',
        '3': '已完成',
        '4': '支付失败',
        '5': '已取消',
        '6': '已退款'
    }
    return statusMap[status.toString()] || status.toString()
}

// 获取类型名称
const getTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
        'PRODUCT': '商品订单',
        'RECHARGE': '充值订单',
        'PROPERTY_FEE': '物业费',
        'PARKING_FEE': '停车费'
    }
    return typeMap[type] || type
}

// 获取其他统计数据
const getOtherStats = () => {
    if (!statisticsData.value) return {}
    const result: Record<string, any> = {}
    const excludeKeys = ['totalOrders', 'completedOrders', 'pendingOrders', 'totalAmount', 'statusCount', 'typeCount']
    
    for (const key in statisticsData.value) {
        if (!excludeKeys.includes(key)) {
            result[key] = statisticsData.value[key]
        }
    }
    return result
}

// 格式化键名
const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
        'avgAmount': '平均订单金额',
        'todayOrders': '今日订单数',
        'todayAmount': '今日订单金额',
        'weekOrders': '本周订单数',
        'weekAmount': '本周订单金额',
        'monthOrders': '本月订单数',
        'monthAmount': '本月订单金额'
    }
    return keyMap[key] || key
}

onMounted(() => {
    fetchOrderList()
})
</script>

<style scoped>
:deep(.el-table) {
    @apply text-slate-700 dark:text-slate-300;
}

:deep(.el-table th) {
    @apply bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300;
}

:deep(.el-table tr) {
    @apply bg-white dark:bg-slate-800;
}

:deep(.el-table tr:hover > td) {
    @apply bg-slate-50 dark:bg-slate-700;
}

:deep(.el-pagination) {
    @apply text-slate-700 dark:text-slate-300;
}
</style>

