<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div>
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">访客通行管理</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">审核和管理访客登记申请</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">总登记数</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.totalCount }}</p>
                    </div>
                    <Icon name="lucide:users" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">待审核</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.pendingCount }}</p>
                    </div>
                    <Icon name="lucide:clock" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">已通过</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.approvedCount }}</p>
                    </div>
                    <Icon name="lucide:check-circle" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-red-500 to-red-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">已拒绝</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.rejectedCount }}</p>
                    </div>
                    <Icon name="lucide:x-circle" size="32" class="opacity-80" />
                </div>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="审核状态" class="!mb-0">
                    <el-select
                        v-model="queryForm.status"
                        placeholder="全部状态"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="全部状态" :value="undefined" />
                        <el-option label="待审核" :value="0" />
                        <el-option label="已通过" :value="1" />
                        <el-option label="已拒绝" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="访客姓名" class="!mb-0">
                    <el-input
                        v-model="queryForm.visitorName"
                        placeholder="访客姓名"
                        clearable
                        style="width: 150px;"
                        @keyup.enter="handleSearch"
                    />
                </el-form-item>
                <el-form-item label="访客电话" class="!mb-0">
                    <el-input
                        v-model="queryForm.visitorPhone"
                        placeholder="访客电话"
                        clearable
                        style="width: 150px;"
                        @keyup.enter="handleSearch"
                    />
                </el-form-item>
                <el-form-item class="!mb-0">
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

        <!-- 访客列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <!-- 批量操作 -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4" v-if="selectedRows.length > 0">
                <span class="text-sm text-slate-600 dark:text-slate-300">已选择 {{ selectedRows.length }} 项</span>
                <el-button type="success" size="small" @click="handleBatchAudit(1)">
                    <Icon name="lucide:check" size="14" class="mr-1" />
                    批量通过
                </el-button>
                <el-button type="danger" size="small" @click="handleBatchAudit(2)">
                    <Icon name="lucide:x" size="14" class="mr-1" />
                    批量拒绝
                </el-button>
                <el-button type="danger" size="small" plain @click="handleBatchDelete">
                    <Icon name="lucide:trash-2" size="14" class="mr-1" />
                    批量删除
                </el-button>
            </div>

            <el-table
                :data="visitorList"
                v-loading="loading"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column prop="registerId" label="ID" width="70" align="center" />
                <el-table-column prop="userName" label="申请用户" width="100" />
                <el-table-column prop="visitorName" label="访客姓名" width="100" />
                <el-table-column prop="visitorPhone" label="访客电话" width="130" />
                <el-table-column prop="visitPurpose" label="来访目的" min-width="150" />
                <el-table-column prop="validDate" label="有效日期" width="110" />
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag 
                            :type="getStatusType(row.status)" 
                            size="small"
                        >
                            {{ row.statusDesc }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="申请时间" width="170" />
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.status === 0"
                            type="success"
                            size="small"
                            @click="handleAudit(row, 1)"
                        >
                            通过
                        </el-button>
                        <el-button
                            v-if="row.status === 0"
                            type="danger"
                            size="small"
                            @click="handleAudit(row, 2)"
                        >
                            拒绝
                        </el-button>
                        <el-button
                            v-if="row.status !== 0"
                            type="danger"
                            size="small"
                            plain
                            @click="handleDelete(row)"
                        >
                            删除
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
                    @size-change="fetchVisitorList"
                    @current-change="fetchVisitorList"
                />
            </div>
        </div>

        <!-- 拒绝原因弹窗 -->
        <el-dialog
            v-model="rejectDialogVisible"
            title="拒绝原因"
            width="500px"
            :close-on-click-modal="false"
        >
            <el-form>
                <el-form-item label="拒绝原因" required>
                    <el-input
                        v-model="rejectReason"
                        type="textarea"
                        :rows="4"
                        placeholder="请填写拒绝原因"
                        maxlength="200"
                        show-word-limit
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <el-button @click="rejectDialogVisible = false">取消</el-button>
                    <el-button type="danger" :loading="submitting" @click="confirmReject">
                        确认拒绝
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    queryAdminVisitorListApi, 
    getAdminVisitorStatisticsApi, 
    auditAdminVisitorApi,
    deleteAdminVisitorApi,
    batchDeleteAdminVisitorApi,
    batchAuditAdminVisitorApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface Visitor {
    registerId: number
    userId: number
    userName: string
    visitorName: string
    visitorPhone: string
    visitPurpose: string
    allowTime: string
    validDate: string
    status: number
    statusDesc: string
    createTime: string
    auditTime: string | null
    auditUserName: string | null
    rejectReason: string | null
}

// 统计数据
const statistics = reactive({
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    todayCount: 0,
    weekCount: 0
})

// 查询表单
const queryForm = reactive({
    status: undefined as number | undefined,
    visitorName: '',
    visitorPhone: '',
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
const visitorList = ref<Visitor[]>([])
const selectedRows = ref<Visitor[]>([])

// 拒绝弹窗
const rejectDialogVisible = ref(false)
const rejectReason = ref('')
const submitting = ref(false)
const pendingRejectItem = ref<{ ids: number[], isBatch: boolean } | null>(null)

// 获取统计数据
const fetchStatistics = async () => {
    try {
        const response = await getAdminVisitorStatisticsApi()
        if (response.code === 200 && response.data) {
            Object.assign(statistics, response.data)
        }
    } catch (error) {
        console.error('获取统计数据失败:', error)
    }
}

// 获取访客列表
const fetchVisitorList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryAdminVisitorListApi({
            ...queryForm,
            status: queryForm.status,
            visitorName: queryForm.visitorName || undefined,
            visitorPhone: queryForm.visitorPhone || undefined
        })

        if (response.code === 200 && response.data) {
            visitorList.value = response.data.records || []
            pagination.total = response.data.total || 0
        } else {
            ElMessage.error(response.message || '获取列表失败')
        }
    } catch (error) {
        console.error('获取访客列表失败:', error)
        ElMessage.error('获取访客列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchVisitorList()
}

// 重置
const handleReset = () => {
    queryForm.status = undefined
    queryForm.visitorName = ''
    queryForm.visitorPhone = ''
    pagination.current = 1
    fetchVisitorList()
}

// 获取状态类型
const getStatusType = (status: number) => {
    switch (status) {
        case 0:
            return 'warning'
        case 1:
            return 'success'
        case 2:
            return 'danger'
        default:
            return 'info'
    }
}

// 表格选择
const handleSelectionChange = (rows: Visitor[]) => {
    selectedRows.value = rows
}

// 审核
const handleAudit = async (row: Visitor, status: number) => {
    if (status === 2) {
        // 拒绝需要填写原因
        pendingRejectItem.value = { ids: [row.registerId], isBatch: false }
        rejectReason.value = ''
        rejectDialogVisible.value = true
        return
    }

    try {
        await ElMessageBox.confirm('确认通过该访客登记申请？', '确认审核', {
            type: 'success'
        })

        submitting.value = true
        await auditAdminVisitorApi(row.registerId, { status: 1 })
        ElMessage.success('审核通过')
        fetchVisitorList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('审核失败:', error)
            ElMessage.error(error?.data?.message || '审核失败')
        }
    } finally {
        submitting.value = false
    }
}

// 确认拒绝
const confirmReject = async () => {
    if (!rejectReason.value.trim()) {
        ElMessage.warning('请填写拒绝原因')
        return
    }

    if (!pendingRejectItem.value) return

    submitting.value = true
    try {
        if (pendingRejectItem.value.isBatch) {
            await batchAuditAdminVisitorApi(pendingRejectItem.value.ids, {
                status: 2,
                rejectReason: rejectReason.value
            })
        } else {
            await auditAdminVisitorApi(pendingRejectItem.value.ids[0], {
                status: 2,
                rejectReason: rejectReason.value
            })
        }
        ElMessage.success('已拒绝')
        rejectDialogVisible.value = false
        fetchVisitorList()
        fetchStatistics()
    } catch (error: any) {
        console.error('拒绝失败:', error)
        ElMessage.error(error?.data?.message || '操作失败')
    } finally {
        submitting.value = false
    }
}

// 删除
const handleDelete = async (row: Visitor) => {
    try {
        await ElMessageBox.confirm('确认删除该访客登记记录？', '确认删除', {
            type: 'warning'
        })

        await deleteAdminVisitorApi(row.registerId)
        ElMessage.success('删除成功')
        fetchVisitorList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error(error?.data?.message || '删除失败')
        }
    }
}

// 批量审核
const handleBatchAudit = async (status: number) => {
    const ids = selectedRows.value.filter(r => r.status === 0).map(r => r.registerId)
    if (ids.length === 0) {
        ElMessage.warning('请选择待审核的记录')
        return
    }

    if (status === 2) {
        pendingRejectItem.value = { ids, isBatch: true }
        rejectReason.value = ''
        rejectDialogVisible.value = true
        return
    }

    try {
        await ElMessageBox.confirm(`确认批量通过 ${ids.length} 条记录？`, '批量审核', {
            type: 'success'
        })

        await batchAuditAdminVisitorApi(ids, { status: 1 })
        ElMessage.success('批量审核成功')
        fetchVisitorList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('批量审核失败:', error)
            ElMessage.error(error?.data?.message || '批量审核失败')
        }
    }
}

// 批量删除
const handleBatchDelete = async () => {
    const ids = selectedRows.value.map(r => r.registerId)
    if (ids.length === 0) {
        ElMessage.warning('请选择要删除的记录')
        return
    }

    try {
        await ElMessageBox.confirm(`确认删除 ${ids.length} 条记录？`, '批量删除', {
            type: 'warning'
        })

        await batchDeleteAdminVisitorApi(ids)
        ElMessage.success('批量删除成功')
        fetchVisitorList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error)
            ElMessage.error(error?.data?.message || '批量删除失败')
        }
    }
}

// 页面加载
onMounted(() => {
    fetchStatistics()
    fetchVisitorList()
})
</script>
