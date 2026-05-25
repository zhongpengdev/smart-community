<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div>
            <h1 class="text-2xl font-bold text-slate-800 dark:text-white">报事维修管理</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">处理用户提交的报事维修申请</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">总申请数</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.total }}</p>
                    </div>
                    <Icon name="lucide:clipboard-list" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">待处理</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.pending }}</p>
                    </div>
                    <Icon name="lucide:clock" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">处理中</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.processing }}</p>
                    </div>
                    <Icon name="lucide:loader-2" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">已完成</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.completed }}</p>
                    </div>
                    <Icon name="lucide:check-circle" size="32" class="opacity-80" />
                </div>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="事项类型" class="!mb-0">
                    <el-select
                        v-model="queryForm.reportType"
                        placeholder="全部类型"
                        clearable
                        style="width: 160px;"
                    >
                        <el-option label="全部类型" :value="undefined" />
                        <el-option label="水电维修" value="水电维修" />
                        <el-option label="门窗维修" value="门窗维修" />
                        <el-option label="电梯维修" value="电梯维修" />
                        <el-option label="公共设施" value="公共设施" />
                        <el-option label="其他" value="其他" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理状态" class="!mb-0">
                    <el-select
                        v-model="queryForm.status"
                        placeholder="全部状态"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="全部状态" :value="undefined" />
                        <el-option label="待处理" :value="0" />
                        <el-option label="处理中" :value="1" />
                        <el-option label="已完成" :value="2" />
                        <el-option label="已驳回" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户ID" class="!mb-0">
                    <el-input-number
                        v-model="queryForm.userId"
                        placeholder="用户ID"
                        :controls="false"
                        style="width: 120px;"
                    />
                </el-form-item>
                <el-form-item label="关键词" class="!mb-0">
                    <el-input
                        v-model="queryForm.keyword"
                        placeholder="搜索描述或地点"
                        clearable
                        style="width: 200px;"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <Icon name="lucide:search" size="16" class="text-slate-400" />
                        </template>
                    </el-input>
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

        <!-- 报事列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="repairList"
                v-loading="loading"
                style="width: 100%"
            >
                <el-table-column prop="reportId" label="ID" width="80" align="center" />
                <el-table-column prop="userId" label="用户ID" width="100" align="center" />
                <el-table-column label="事项类型" width="120">
                    <template #default="{ row }">
                        <el-tag type="info" size="small">{{ row.reportType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="描述" min-width="250">
                    <template #default="{ row }">
                        <div class="line-clamp-2">{{ row.description }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="地点" width="180" />
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag 
                            :type="getStatusType(row.status)" 
                            size="small"
                        >
                            {{ row.statusText }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="提交时间" width="180" />
                <el-table-column label="处理结果" min-width="200">
                    <template #default="{ row }">
                        <span class="text-sm text-slate-500">{{ row.handleResult || '未处理' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            size="small"
                            @click="handleProcess(row)"
                            :disabled="row.status === 2 || row.status === 3"
                        >
                            <Icon name="lucide:settings" size="14" class="mr-1" />
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
                    @size-change="fetchRepairList"
                    @current-change="fetchRepairList"
                />
            </div>
        </div>

        <!-- 处理弹窗 -->
        <el-dialog
            v-model="processDialogVisible"
            title="处理报事维修"
            width="600px"
            :close-on-click-modal="false"
        >
            <div v-if="currentRepair" class="space-y-4">
                <div class="bg-slate-50 dark:bg-slate-700 rounded p-4">
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span class="text-slate-500">用户ID：</span>
                            <span class="font-medium">{{ currentRepair.userId }}</span>
                        </div>
                        <div>
                            <span class="text-slate-500">事项类型：</span>
                            <el-tag type="info" size="small">{{ currentRepair.reportType }}</el-tag>
                        </div>
                        <div class="col-span-2">
                            <span class="text-slate-500">地点：</span>
                            <span class="font-medium">{{ currentRepair.location }}</span>
                        </div>
                        <div class="col-span-2">
                            <span class="text-slate-500">描述：</span>
                            <p class="mt-1 text-slate-700 dark:text-slate-200">{{ currentRepair.description }}</p>
                        </div>
                        <div>
                            <span class="text-slate-500">提交时间：</span>
                            <span class="font-medium">{{ currentRepair.createTime }}</span>
                        </div>
                    </div>
                </div>

                <el-form :model="processForm" label-width="100px">
                    <el-form-item label="处理状态" required>
                        <el-radio-group v-model="processForm.status">
                            <el-radio :label="1">
                                <Icon name="lucide:loader-2" size="14" class="mr-1 text-orange-500" />
                                处理中
                            </el-radio>
                            <el-radio :label="2">
                                <Icon name="lucide:check-circle" size="14" class="mr-1 text-green-500" />
                                已完成
                            </el-radio>
                            <el-radio :label="3">
                                <Icon name="lucide:x-circle" size="14" class="mr-1 text-red-500" />
                                已驳回
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="处理结果">
                        <el-input
                            v-model="processForm.handleResult"
                            type="textarea"
                            :rows="4"
                            placeholder="请填写处理结果（可选）"
                            maxlength="500"
                            show-word-limit
                        />
                    </el-form-item>
                </el-form>
            </div>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <el-button @click="processDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmitProcess">
                        提交处理
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { queryRepairListApi, handleRepairApi } from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface RepairReport {
    reportId: number
    userId: number
    reportType: string
    description: string
    location: string
    status: number
    statusText: string
    createTime: string
    handleTime: string | null
    handleUserId: number | null
    handleResult: string | null
}

// 统计数据
const statistics = reactive({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
})

// 查询表单
const queryForm = reactive({
    reportType: undefined as string | undefined,
    status: undefined as number | undefined,
    userId: undefined as number | undefined,
    keyword: '',
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
const repairList = ref<RepairReport[]>([])

// 处理弹窗
const processDialogVisible = ref(false)
const submitting = ref(false)
const currentRepair = ref<RepairReport | null>(null)
const processForm = reactive({
    status: 1,
    handleResult: ''
})

// 获取报事列表
const fetchRepairList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryRepairListApi({
            ...queryForm,
            reportType: queryForm.reportType || undefined,
            status: queryForm.status !== undefined ? queryForm.status : undefined,
            userId: queryForm.userId || undefined
        })

        if (response.code === 200 && response.data) {
            repairList.value = response.data.records || []
            pagination.total = response.data.total || 0
            
            // 计算统计数据
            statistics.total = response.data.total || 0
            statistics.pending = repairList.value.filter(r => r.status === 0).length
            statistics.processing = repairList.value.filter(r => r.status === 1).length
            statistics.completed = repairList.value.filter(r => r.status === 2).length
        } else {
            ElMessage.error(response.message || '获取报事列表失败')
        }
    } catch (error) {
        console.error('获取报事列表失败:', error)
        ElMessage.error('获取报事列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchRepairList()
}

// 重置
const handleReset = () => {
    queryForm.reportType = undefined
    queryForm.status = undefined
    queryForm.userId = undefined
    queryForm.keyword = ''
    pagination.current = 1
    fetchRepairList()
}

// 获取状态类型
const getStatusType = (status: number) => {
    switch (status) {
        case 0:
            return 'warning'
        case 1:
            return 'primary'
        case 2:
            return 'success'
        case 3:
            return 'danger'
        default:
            return 'info'
    }
}

// 处理报事
const handleProcess = (repair: RepairReport) => {
    currentRepair.value = repair
    processForm.status = repair.status === 0 ? 1 : repair.status
    processForm.handleResult = repair.handleResult || ''
    processDialogVisible.value = true
}

// 提交处理
const handleSubmitProcess = async () => {
    if (!currentRepair.value) return

    submitting.value = true
    try {
        await handleRepairApi(currentRepair.value.reportId, {
            status: processForm.status,
            handleResult: processForm.handleResult || undefined
        })
        
        ElMessage.success('处理成功')
        processDialogVisible.value = false
        fetchRepairList()
    } catch (error: any) {
        console.error('处理失败:', error)
        ElMessage.error(error?.data?.message || '处理失败')
    } finally {
        submitting.value = false
    }
}

// 页面加载
onMounted(() => {
    fetchRepairList()
})
</script>

