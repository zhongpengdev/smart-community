<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">物业费管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理用户物业费账单、生成账单和催缴通知</p>
            </div>
            <div class="flex gap-2">
                <NuxtLink to="/superCommunity/property/fee/payments">
                    <el-button>
                        <Icon name="lucide:receipt" size="16" class="mr-1" />
                        缴费记录
                    </el-button>
                </NuxtLink>
                <el-button type="primary" @click="showBatchGenerateDialog">
                    <Icon name="lucide:file-plus" size="16" class="mr-1" />
                    批量生成账单
                </el-button>
                <el-button @click="showGenerateDialog">
                    <Icon name="lucide:plus" size="16" class="mr-1" />
                    生成单个账单
                </el-button>
            </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">账单总数</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.totalBills || 0 }}</p>
                    </div>
                    <Icon name="lucide:file-text" size="28" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">未缴账单</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.unpaidBills || 0 }}</p>
                    </div>
                    <Icon name="lucide:clock" size="28" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">已缴账单</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.paidBills || 0 }}</p>
                    </div>
                    <Icon name="lucide:check-circle" size="28" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">逾期账单</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.overdueBills || 0 }}</p>
                    </div>
                    <Icon name="lucide:alert-triangle" size="28" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">总收缴率</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.overallPaymentRate || 0 }}%</p>
                    </div>
                    <Icon name="lucide:percent" size="28" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">已收金额</p>
                        <p class="text-xl font-bold mt-1">¥{{ formatMoney(statistics.totalReceivedAmount) }}</p>
                    </div>
                    <Icon name="lucide:wallet" size="28" class="opacity-80" />
                </div>
            </div>
        </div>

        <!-- Tab 切换 -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <div class="border-b border-slate-200 dark:border-slate-700">
                <nav class="flex gap-6 px-6" aria-label="Tabs">
                    <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                        class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                        :class="activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'">
                        {{ tab.label }}
                        <span v-if="tab.count !== undefined"
                            class="ml-2 px-2 py-0.5 rounded-full text-xs"
                            :class="activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'">
                            {{ tab.count }}
                        </span>
                    </button>
                </nav>
            </div>

            <!-- 筛选栏 -->
            <div class="p-6 border-b border-slate-100 dark:border-slate-700">
                <div class="flex flex-wrap gap-4">
                    <el-input v-model="queryForm.userName" placeholder="搜索用户名" style="width: 200px;" clearable>
                        <template #prefix><Icon name="lucide:search" size="14" /></template>
                    </el-input>
                    <el-date-picker v-model="queryForm.billingPeriod" type="month" placeholder="选择账期"
                        value-format="YYYY-MM" style="width: 160px;" />
                    <el-select v-model="queryForm.status" placeholder="状态" style="width: 120px;" clearable>
                        <el-option label="待缴费" :value="0" />
                        <el-option label="已缴费" :value="1" />
                        <el-option label="部分缴纳" :value="2" />
                    </el-select>
                    <el-select v-model="queryForm.overdue" placeholder="是否逾期" style="width: 120px;" clearable>
                        <el-option label="是" :value="true" />
                        <el-option label="否" :value="false" />
                    </el-select>
                    <div class="flex gap-2">
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </div>
                </div>
            </div>

            <!-- 操作工具栏 -->
            <div v-if="selectedBills.length > 0" class="px-6 py-3 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between">
                <span class="text-sm text-blue-600">已选中 {{ selectedBills.length }} 条账单</span>
                <div class="flex gap-2">
                    <el-button type="primary" size="small" @click="handleBatchReminder">批量发送催缴</el-button>
                    <el-button type="danger" size="small" @click="handleBatchDelete">批量删除</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="p-6">
                <el-table :data="billList" v-loading="loading" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="账单编号" prop="billNo" min-width="180" font-mono>
                        <template #default="{ row }">
                            <span class="text-xs font-mono">{{ row.billNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户信息" min-width="150">
                        <template #default="{ row }">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-slate-800 dark:text-white">{{ row.userName }}</span>
                                <span class="text-xs text-slate-500">{{ row.userPhone }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="账期" prop="billingPeriod" width="100" />
                    <el-table-column label="总金额" width="120">
                        <template #default="{ row }">
                            <span class="font-bold text-orange-600">¥{{ row.totalAmount?.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="已缴金额" width="120">
                        <template #default="{ row }">
                            <span :class="row.paidAmount > 0 ? 'text-green-600' : 'text-slate-400'">
                                ¥{{ row.paidAmount?.toFixed(2) || '0.00' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="截止日期" width="120">
                        <template #default="{ row }">
                            <span :class="row.overdue ? 'text-red-500 font-medium' : ''">
                                {{ row.dueDate?.split(' ')[0] }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag :type="getStatusType(row.status)" size="small">
                                {{ row.statusText }}
                                <span v-if="row.overdue" class="ml-1 text-[10px]">(逾期)</span>
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="220" fixed="right">
                        <template #default="{ row }">
                            <div class="flex gap-2">
                                <el-button size="small" link @click="handleViewDetail(row)">详情</el-button>
                                <el-button size="small" link @click="handleEditBill(row)">编辑</el-button>
                                <el-button v-if="row.status === 0" size="small" link type="primary" @click="handleBatchReminder">催缴</el-button>
                                <el-button size="small" link type="danger" @click="handleDeleteBill(row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="mt-6 flex justify-end">
                    <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                        :total="pagination.total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next"
                        @current-change="handleSearch" @size-change="handleSearch" />
                </div>
            </div>
        </div>

        <!-- 生成单个账单弹窗 -->
        <el-dialog v-model="generateDialogVisible" title="生成单个账单" width="550px">
            <el-form :model="generateForm" label-width="100px" class="space-y-2">
                <el-form-item label="搜索用户">
                    <el-select v-model="generateForm.userId" filterable remote reserve-keyword placeholder="请输入手机号或姓名搜索"
                        :remote-method="searchUsers" :loading="userSearchLoading" style="width: 100%;">
                        <el-option v-for="user in userSearchResults" :key="user.userId"
                            :label="`${user.userName} (${user.phone})`" :value="user.userId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="账期">
                    <el-date-picker v-model="generateForm.billingPeriod" type="month" placeholder="选择账期"
                        value-format="YYYY-MM" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="截止日期">
                    <el-date-picker v-model="generateForm.dueDate" type="date" placeholder="选择截止日期"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
                <el-divider content-position="left">费用项</el-divider>
                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="物业费" class="!mb-2">
                        <el-input-number v-model="generateForm.propertyFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="水费" class="!mb-2">
                        <el-input-number v-model="generateForm.waterFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="电费" class="!mb-2">
                        <el-input-number v-model="generateForm.electricityFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="燃气费" class="!mb-2">
                        <el-input-number v-model="generateForm.gasFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="停车费" class="!mb-2">
                        <el-input-number v-model="generateForm.parkingFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="其他费用" class="!mb-2">
                        <el-input-number v-model="generateForm.otherFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <el-button @click="generateDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" @click="handleGenerateBill">生成并保存</el-button>
            </template>
        </el-dialog>

        <!-- 批量生成账单弹窗 -->
        <el-dialog v-model="batchGenerateDialogVisible" title="批量生成账单" width="550px">
            <div class="mb-4 p-4 bg-orange-50 text-orange-600 rounded-lg text-sm">
                提示：批量生成将为系统中所有活跃业主生成指定账期的账单。
            </div>
            <el-form :model="batchGenerateForm" label-width="100px" class="space-y-2">
                <el-form-item label="账期">
                    <el-date-picker v-model="batchGenerateForm.billingPeriod" type="month" placeholder="选择账期"
                        value-format="YYYY-MM" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="截止日期">
                    <el-date-picker v-model="batchGenerateForm.dueDate" type="date" placeholder="选择截止日期"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
                <el-divider content-position="left">基础费用（默认值）</el-divider>
                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="物业费" class="!mb-2">
                        <el-input-number v-model="batchGenerateForm.propertyFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="水费" class="!mb-2">
                        <el-input-number v-model="batchGenerateForm.waterFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="电费" class="!mb-2">
                        <el-input-number v-model="batchGenerateForm.electricityFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="燃气费" class="!mb-2">
                        <el-input-number v-model="batchGenerateForm.gasFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="停车费" class="!mb-2">
                        <el-input-number v-model="batchGenerateForm.parkingFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="其他费用" class="!mb-2">
                        <el-input-number v-model="batchGenerateForm.otherFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                </div>
                <el-form-item label="跳过已有账单">
                    <el-switch v-model="batchGenerateForm.skipExistingBill" />
                    <span class="ml-2 text-xs text-slate-400">跳过同账期已有账单的用户</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="batchGenerateDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" @click="handleBatchGenerateBill">批量生成</el-button>
            </template>
        </el-dialog>

        <!-- 编辑账单弹窗 -->
        <el-dialog v-model="editDialogVisible" title="编辑账单" width="550px" :close-on-click-modal="false">
            <el-form v-if="currentBill" :model="editForm" label-width="100px" class="space-y-2">
                <el-form-item label="账单编号">
                    <el-input :value="currentBill.billNo" disabled />
                </el-form-item>
                <el-divider content-position="left">费用项</el-divider>
                <div class="grid grid-cols-2 gap-4">
                    <el-form-item label="物业费" class="!mb-2">
                        <el-input-number v-model="editForm.propertyFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="水费" class="!mb-2">
                        <el-input-number v-model="editForm.waterFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="电费" class="!mb-2">
                        <el-input-number v-model="editForm.electricityFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="燃气费" class="!mb-2">
                        <el-input-number v-model="editForm.gasFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="停车费" class="!mb-2">
                        <el-input-number v-model="editForm.parkingFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="其他费用" class="!mb-2">
                        <el-input-number v-model="editForm.otherFee" :min="0" :precision="2" style="width: 100%;" />
                    </el-form-item>
                </div>
                <el-form-item label="截止日期">
                    <el-date-picker v-model="editForm.dueDate" type="date" placeholder="选择截止日期"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="submitting" @click="handleUpdateBill">保存修改</el-button>
            </template>
        </el-dialog>

        <!-- 账单详情弹窗 -->
        <el-dialog v-model="detailDialogVisible" title="账单详情" width="600px">
            <div v-if="currentBill" class="space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-slate-400">账单编号：</span>
                        <span class="font-mono">{{ currentBill.billNo }}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">账期：</span>
                        <span class="font-medium">{{ currentBill.billingPeriod }}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">用户：</span>
                        <span>{{ currentBill.userName }} ({{ currentBill.userPhone }})</span>
                    </div>
                    <div>
                        <span class="text-slate-400">状态：</span>
                        <el-tag :type="getStatusType(currentBill.status)" size="small">{{ currentBill.statusText }}</el-tag>
                    </div>
                </div>
                <el-divider />
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div class="p-3 bg-blue-50 rounded-lg">
                        <p class="text-slate-500">物业费</p>
                        <p class="text-lg font-bold text-blue-600">¥{{ currentBill.propertyFee?.toFixed(2) || '0.00' }}</p>
                    </div>
                    <div class="p-3 bg-cyan-50 rounded-lg">
                        <p class="text-slate-500">水费</p>
                        <p class="text-lg font-bold text-cyan-600">¥{{ currentBill.waterFee?.toFixed(2) || '0.00' }}</p>
                    </div>
                    <div class="p-3 bg-yellow-50 rounded-lg">
                        <p class="text-slate-500">电费</p>
                        <p class="text-lg font-bold text-yellow-600">¥{{ currentBill.electricityFee?.toFixed(2) || '0.00' }}</p>
                    </div>
                    <div class="p-3 bg-orange-50 rounded-lg">
                        <p class="text-slate-500">燃气费</p>
                        <p class="text-lg font-bold text-orange-600">¥{{ currentBill.gasFee?.toFixed(2) || '0.00' }}</p>
                    </div>
                    <div class="p-3 bg-purple-50 rounded-lg">
                        <p class="text-slate-500">停车费</p>
                        <p class="text-lg font-bold text-purple-600">¥{{ currentBill.parkingFee?.toFixed(2) || '0.00' }}</p>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg">
                        <p class="text-slate-500">其他费用</p>
                        <p class="text-lg font-bold text-slate-600">¥{{ currentBill.otherFee?.toFixed(2) || '0.00' }}</p>
                    </div>
                </div>
                <el-divider />
                <div class="flex justify-between items-center text-sm">
                    <div>
                        <span class="text-slate-400">截止日期：</span>
                        <span :class="currentBill.overdue ? 'text-red-500 font-medium' : ''">
                            {{ currentBill.dueDate?.split(' ')[0] || '-' }}
                            <span v-if="currentBill.overdue" class="ml-1">(逾期{{ currentBill.overdueDays }}天)</span>
                        </span>
                    </div>
                    <div class="text-right">
                        <p class="text-slate-400">总金额</p>
                        <p class="text-2xl font-bold text-orange-600">¥{{ currentBill.totalAmount?.toFixed(2) }}</p>
                        <p v-if="currentBill.paidAmount > 0" class="text-green-500">已缴 ¥{{ currentBill.paidAmount?.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="detailDialogVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    getAdminPropertyFeeStatisticsApi,
    getAdminPropertyFeeBillsApi,
    generateAdminPropertyFeeBillApi,
    batchGenerateAdminPropertyFeeBillApi,
    updateAdminPropertyFeeBillApi,
    deleteAdminPropertyFeeBillApi,
    batchDeleteAdminPropertyFeeBillApi,
    sendPropertyFeeReminderApi,
    getAdminUsersApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

// Tab 配置
const tabs = computed(() => [
    { key: 'all', label: '全部账单', count: statistics.value.totalBills },
    { key: 'unpaid', label: '未缴账单', count: statistics.value.unpaidBills },
    { key: 'overdue', label: '逾期账单', count: statistics.value.overdueBills }
])
const activeTab = ref('all')

// 统计数据
const statistics = ref<any>({})

// 查询表单
const queryForm = reactive({
    userName: '',
    billingPeriod: '',
    status: undefined as number | undefined,
    overdue: undefined as boolean | undefined,
    pageNum: 1,
    pageSize: 10
})

// 分页
const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
})

// 列表数据
const loading = ref(false)
const billList = ref<any[]>([])
const selectedBills = ref<any[]>([])

// 生成账单表单
const generateDialogVisible = ref(false)
const generateForm = reactive({
    userId: undefined as number | undefined,
    billingPeriod: '',
    propertyFee: 0,
    waterFee: 0,
    electricityFee: 0,
    gasFee: 0,
    parkingFee: 0,
    otherFee: 0,
    dueDate: ''
})

// 用户搜索相关
interface SearchUser {
    userId: number
    userName: string
    phone: string
    email: string
    avatar: string
}
const userSearchLoading = ref(false)
const userSearchResults = ref<SearchUser[]>([])

// 远程搜索用户
const searchUsers = async (query: string) => {
    if (!query || query.length < 1) {
        userSearchResults.value = []
        return
    }
    
    userSearchLoading.value = true
    try {
        const res = await getAdminUsersApi({
            page: 1,
            size: 20,
            keyword: query
        }) as any
        
        if (res.code === 200 && res.data?.records) {
            userSearchResults.value = res.data.records.map((u: any) => ({
                userId: u.userId,
                userName: u.userName,
                phone: u.phone,
                email: u.email,
                avatar: u.avatar
            }))
        } else {
            userSearchResults.value = []
        }
    } catch (error) {
        console.error('搜索用户失败:', error)
        userSearchResults.value = []
    } finally {
        userSearchLoading.value = false
    }
}

// 批量生成账单表单
const batchGenerateDialogVisible = ref(false)
const batchGenerateForm = reactive({
    billingPeriod: '',
    propertyFee: 0,
    waterFee: 0,
    electricityFee: 0,
    gasFee: 0,
    parkingFee: 0,
    otherFee: 0,
    dueDate: '',
    skipExistingBill: true
})

// 编辑账单
const editDialogVisible = ref(false)
const currentBill = ref<any>(null)
const editForm = reactive({
    propertyFee: 0,
    waterFee: 0,
    electricityFee: 0,
    gasFee: 0,
    parkingFee: 0,
    otherFee: 0,
    dueDate: ''
})

// 详情弹窗
const detailDialogVisible = ref(false)

const submitting = ref(false)

// 格式化金额
const formatMoney = (value: number | undefined) => {
    if (!value) return '0'
    if (value >= 10000) {
        return (value / 10000).toFixed(1) + 'w'
    }
    return value.toLocaleString()
}

// 获取状态类型
const getStatusType = (status: number) => {
    switch (status) {
        case 0: return 'warning'
        case 1: return 'success'
        case 2: return 'info'
        default: return 'info'
    }
}

// 获取统计数据
const fetchStatistics = async () => {
    try {
        const res = await getAdminPropertyFeeStatisticsApi() as any
        if (res.code === 200) {
            statistics.value = res.data || {}
        }
    } catch (e) {
        console.error('获取统计失败', e)
    }
}

// 获取账单列表
const fetchBillList = async () => {
    loading.value = true
    try {
        const params: any = {
            pageNum: pagination.current,
            pageSize: pagination.size,
            userName: queryForm.userName || undefined,
            billingPeriod: queryForm.billingPeriod || undefined,
            status: queryForm.status,
            overdue: queryForm.overdue
        }

        // 根据 Tab 筛选
        if (activeTab.value === 'unpaid') {
            params.status = 0
        } else if (activeTab.value === 'overdue') {
            params.overdue = true
        }

        const res = await getAdminPropertyFeeBillsApi(params) as any
        if (res.code === 200 && res.data) {
            billList.value = res.data.records || []
            pagination.total = res.data.total || 0
        }
    } catch (e) {
        console.error('获取账单列表失败', e)
    } finally {
        loading.value = false
    }
}

// 监听 Tab 变化
watch(activeTab, () => {
    pagination.current = 1
    fetchBillList()
})

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchBillList()
}

// 重置
const handleReset = () => {
    queryForm.userName = ''
    queryForm.billingPeriod = ''
    queryForm.status = undefined
    queryForm.overdue = undefined
    pagination.current = 1
    fetchBillList()
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
    selectedBills.value = selection
}

// 显示生成弹窗
const showGenerateDialog = () => {
    Object.assign(generateForm, {
        userId: undefined,
        billingPeriod: '',
        propertyFee: 0,
        waterFee: 0,
        electricityFee: 0,
        gasFee: 0,
        parkingFee: 0,
        otherFee: 0,
        dueDate: ''
    })
    userSearchResults.value = []
    generateDialogVisible.value = true
}

// 显示批量生成弹窗
const showBatchGenerateDialog = () => {
    Object.assign(batchGenerateForm, {
        billingPeriod: '',
        propertyFee: 0,
        waterFee: 0,
        electricityFee: 0,
        gasFee: 0,
        parkingFee: 0,
        otherFee: 0,
        dueDate: '',
        skipExistingBill: true
    })
    batchGenerateDialogVisible.value = true
}

// 生成账单
const handleGenerateBill = async () => {
    if (!generateForm.userId || !generateForm.billingPeriod) {
        ElMessage.warning('请填写用户ID和账期')
        return
    }
    submitting.value = true
    try {
        const res = await generateAdminPropertyFeeBillApi(generateForm as any) as any
        if (res.code === 200) {
            ElMessage.success('账单生成成功')
            generateDialogVisible.value = false
            fetchBillList()
            fetchStatistics()
        } else {
            ElMessage.error(res.message || '生成失败')
        }
    } catch (e: any) {
        ElMessage.error(e?.data?.message || '生成失败')
    } finally {
        submitting.value = false
    }
}

// 批量生成账单
const handleBatchGenerateBill = async () => {
    if (!batchGenerateForm.billingPeriod || !batchGenerateForm.dueDate) {
        ElMessage.warning('请填写账期和截止日期')
        return
    }
    submitting.value = true
    try {
        const res = await batchGenerateAdminPropertyFeeBillApi(batchGenerateForm as any) as any
        if (res.code === 200) {
            const data = res.data
            ElMessage.success(data?.message || `批量生成完成：成功${data?.successCount || 0}条`)
            batchGenerateDialogVisible.value = false
            fetchBillList()
            fetchStatistics()
        } else {
            ElMessage.error(res.message || '生成失败')
        }
    } catch (e: any) {
        ElMessage.error(e?.data?.message || '生成失败')
    } finally {
        submitting.value = false
    }
}

// 查看详情
const handleViewDetail = (row: any) => {
    currentBill.value = row
    detailDialogVisible.value = true
}

// 编辑账单
const handleEditBill = (row: any) => {
    currentBill.value = row
    Object.assign(editForm, {
        propertyFee: row.propertyFee || 0,
        waterFee: row.waterFee || 0,
        electricityFee: row.electricityFee || 0,
        gasFee: row.gasFee || 0,
        parkingFee: row.parkingFee || 0,
        otherFee: row.otherFee || 0,
        dueDate: row.dueDate?.split(' ')[0] || ''
    })
    editDialogVisible.value = true
}

// 更新账单
const handleUpdateBill = async () => {
    if (!currentBill.value) return
    submitting.value = true
    try {
        const res = await updateAdminPropertyFeeBillApi(currentBill.value.billId, editForm) as any
        if (res.code === 200) {
            ElMessage.success('更新成功')
            editDialogVisible.value = false
            fetchBillList()
        } else {
            ElMessage.error(res.message || '更新失败')
        }
    } catch (e: any) {
        ElMessage.error(e?.data?.message || '更新失败')
    } finally {
        submitting.value = false
    }
}

// 删除账单
const handleDeleteBill = async (row: any) => {
    try {
        await ElMessageBox.confirm('确定要删除这条账单吗？', '删除确认', { type: 'warning' })
        const res = await deleteAdminPropertyFeeBillApi(row.billId) as any
        if (res.code === 200) {
            ElMessage.success('删除成功')
            fetchBillList()
            fetchStatistics()
        } else {
            ElMessage.error(res.message || '删除失败')
        }
    } catch (e) {
        // 用户取消
    }
}

// 批量删除
const handleBatchDelete = async () => {
    if (selectedBills.value.length === 0) return
    try {
        await ElMessageBox.confirm(`确定要删除选中的 ${selectedBills.value.length} 条账单吗？`, '批量删除确认', { type: 'warning' })
        const ids = selectedBills.value.map(b => b.billId)
        const res = await batchDeleteAdminPropertyFeeBillApi(ids) as any
        if (res.code === 200) {
            ElMessage.success(`成功删除 ${res.data || ids.length} 条账单`)
            selectedBills.value = []
            fetchBillList()
            fetchStatistics()
        } else {
            ElMessage.error(res.message || '删除失败')
        }
    } catch (e) {
        // 用户取消
    }
}

// 批量发送催缴通知
const handleBatchReminder = async () => {
    if (selectedBills.value.length === 0) return
    try {
        await ElMessageBox.confirm(`确定要向 ${selectedBills.value.length} 位用户发送催缴通知吗？`, '发送确认', { type: 'warning' })
        const ids = selectedBills.value.map(b => b.billId)
        const res = await sendPropertyFeeReminderApi(ids) as any
        if (res.code === 200) {
            ElMessage.success(`成功发送 ${res.data || ids.length} 条催缴通知`)
            selectedBills.value = []
        } else {
            ElMessage.error(res.message || '发送失败')
        }
    } catch (e) {
        // 用户取消
    }
}

// 页面加载
onMounted(() => {
    fetchStatistics()
    fetchBillList()
})
</script>
