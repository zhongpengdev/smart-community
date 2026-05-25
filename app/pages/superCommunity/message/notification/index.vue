<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">通知管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理系统通知,发送消息给用户</p>
            </div>
            <el-button type="primary" @click="handleSend">
                <Icon name="lucide:send" size="16" class="mr-1" />
                发送通知
            </el-button>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">总通知数</span>
                    <Icon name="lucide:bell" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.totalNotifications || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">未读通知</span>
                    <Icon name="lucide:bell-ring" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.unreadNotifications || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">已读通知</span>
                    <Icon name="lucide:bell-off" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.readNotifications || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">今日新增</span>
                    <Icon name="lucide:trending-up" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.todayNotifications || 0 }}</div>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="用户ID" class="!mb-0">
                    <el-input
                        v-model.number="queryForm.userId"
                        placeholder="输入用户ID"
                        clearable
                        style="width: 150px;"
                    />
                </el-form-item>
                <el-form-item label="通知类型" class="!mb-0">
                    <el-select
                        v-model="queryForm.type"
                        placeholder="全部类型"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="全部" :value="undefined" />
                        <el-option label="系统通知" :value="1" />
                        <el-option label="点赞通知" :value="2" />
                        <el-option label="评论通知" :value="3" />
                        <el-option label="好友申请" :value="4" />
                        <el-option label="私信通知" :value="5" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" class="!mb-0">
                    <el-select
                        v-model="queryForm.isRead"
                        placeholder="全部状态"
                        clearable
                        style="width: 130px;"
                    >
                        <el-option label="全部" :value="undefined" />
                        <el-option label="未读" :value="0" />
                        <el-option label="已读" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词" class="!mb-0">
                    <el-input
                        v-model="queryForm.keyword"
                        placeholder="搜索标题或内容"
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
                    <el-button
                        type="danger"
                        :disabled="selectedIds.length === 0"
                        @click="handleBatchDelete"
                    >
                        <Icon name="lucide:trash-2" size="16" class="mr-1" />
                        批量删除 ({{ selectedIds.length }})
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 通知列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="notificationList"
                v-loading="loading"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="notificationId" label="ID" width="80" align="center" />
                <el-table-column label="用户信息" width="180">
                    <template #default="{ row }">
                        <div class="flex flex-col">
                            <span class="text-sm font-medium">{{ row.userName }}</span>
                            <span class="text-xs text-slate-500">{{ row.userPhone }}</span>
                            <span class="text-xs text-slate-400">ID: {{ row.userId }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getTypeTagType(row.type)" size="small">
                            {{ row.typeDesc }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="通知内容" min-width="300">
                    <template #default="{ row }">
                        <div class="flex flex-col gap-1">
                            <span class="font-medium text-slate-800 dark:text-white">{{ row.title }}</span>
                            <span class="text-sm text-slate-500 line-clamp-2">{{ row.content }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.isRead === 1 ? 'success' : 'warning'" size="small">
                            {{ row.isReadDesc }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleViewDetail(row)"
                            >
                                <Icon name="lucide:eye" size="14" class="mr-1" />
                                查看
                            </el-button>
                            <el-button
                                type="danger"
                                size="small"
                                @click="handleDelete(row)"
                            >
                                <Icon name="lucide:trash-2" size="14" />
                            </el-button>
                        </div>
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
                    @size-change="fetchNotificationList"
                    @current-change="fetchNotificationList"
                />
            </div>
        </div>

        <!-- 通知详情弹窗 -->
        <el-dialog
            v-model="detailDialogVisible"
            title="通知详情"
            width="600px"
            :close-on-click-modal="false"
        >
            <div v-if="currentNotification" v-loading="detailLoading" class="space-y-4">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="通知ID">
                        {{ currentNotification.notificationId }}
                    </el-descriptions-item>
                    <el-descriptions-item label="用户">
                        {{ currentNotification.userName }} ({{ currentNotification.userPhone }})
                    </el-descriptions-item>
                    <el-descriptions-item label="类型">
                        <el-tag :type="getTypeTagType(currentNotification.type)" size="small">
                            {{ currentNotification.typeDesc }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="currentNotification.isRead === 1 ? 'success' : 'warning'" size="small">
                            {{ currentNotification.isReadDesc }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="标题" :span="2">
                        {{ currentNotification.title }}
                    </el-descriptions-item>
                    <el-descriptions-item label="内容" :span="2">
                        <div class="whitespace-pre-wrap">{{ currentNotification.content }}</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="关联ID" v-if="currentNotification.relatedId">
                        {{ currentNotification.relatedId }}
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间" :span="2">
                        {{ currentNotification.createTime }}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>

        <!-- 发送通知弹窗 -->
        <el-dialog
            v-model="sendDialogVisible"
            title="发送通知"
            width="600px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="sendFormRef"
                :model="sendFormData"
                :rules="sendFormRules"
                label-width="100px"
            >
                <el-form-item label="接收用户" prop="userId">
                    <el-input
                        v-model.number="sendFormData.userId"
                        placeholder="留空则发送给所有用户(群发)"
                        type="number"
                    >
                        <template #prepend>
                            <Icon name="lucide:user" size="16" />
                        </template>
                    </el-input>
                    <div class="text-xs text-slate-500 mt-1">
                        输入用户ID发送给指定用户,留空则群发给所有用户
                    </div>
                </el-form-item>
                <el-form-item label="通知类型" prop="type">
                    <el-select
                        v-model="sendFormData.type"
                        placeholder="请选择通知类型"
                        style="width: 100%;"
                    >
                        <el-option label="系统通知" :value="1" />
                        <el-option label="点赞通知" :value="2" />
                        <el-option label="评论通知" :value="3" />
                        <el-option label="好友申请" :value="4" />
                        <el-option label="私信通知" :value="5" />
                    </el-select>
                </el-form-item>
                <el-form-item label="通知标题" prop="title">
                    <el-input
                        v-model="sendFormData.title"
                        placeholder="请输入通知标题"
                        maxlength="200"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="通知内容" prop="content">
                    <el-input
                        v-model="sendFormData.content"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入通知内容"
                        maxlength="1000"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="关联ID" prop="relatedId">
                    <el-input
                        v-model.number="sendFormData.relatedId"
                        placeholder="可选,如帖子ID、评论ID等"
                        type="number"
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <el-button @click="sendDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="sending" @click="handleSubmitSend">
                        {{ sendFormData.userId ? '发送' : '群发' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
    queryNotificationsApi,
    getNotificationDetailApi,
    sendNotificationApi,
    deleteNotificationApi,
    batchDeleteNotificationsApi,
    getNotificationStatisticsApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface Notification {
    notificationId: number
    userId: number
    userName: string
    userPhone: string
    type: number
    typeDesc: string
    title: string
    content: string
    relatedId: number | null
    isRead: number
    isReadDesc: string
    createTime: string
}

interface Statistics {
    totalNotifications: number
    unreadNotifications: number
    readNotifications: number
    todayNotifications: number
    typeCount: Record<string, number>
}

// 查询表单
const queryForm = reactive({
    userId: undefined as number | undefined,
    type: undefined as number | undefined,
    isRead: undefined as number | undefined,
    keyword: '',
    startTime: '',
    endTime: '',
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
const notificationList = ref<Notification[]>([])
const selectedIds = ref<number[]>([])

// 统计数据
const statistics = ref<Statistics>({
    totalNotifications: 0,
    unreadNotifications: 0,
    readNotifications: 0,
    todayNotifications: 0,
    typeCount: {}
})

// 详情弹窗
const detailDialogVisible = ref(false)
const detailLoading = ref(false)
const currentNotification = ref<Notification | null>(null)

// 发送弹窗
const sendDialogVisible = ref(false)
const sending = ref(false)
const sendFormRef = ref<FormInstance>()

const sendFormData = reactive({
    userId: undefined as number | undefined,
    type: 1,
    title: '',
    content: '',
    relatedId: undefined as number | undefined
})

const sendFormRules: FormRules = {
    type: [
        { required: true, message: '请选择通知类型', trigger: 'change' }
    ],
    title: [
        { required: true, message: '请输入通知标题', trigger: 'blur' },
        { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入通知内容', trigger: 'blur' },
        { min: 2, max: 1000, message: '长度在 2 到 1000 个字符', trigger: 'blur' }
    ]
}

// 获取类型标签颜色
const getTypeTagType = (type: number) => {
    const typeMap: Record<number, string> = {
        1: 'primary',
        2: 'success',
        3: 'warning',
        4: 'info',
        5: 'danger'
    }
    return typeMap[type] || 'info'
}

// 获取通知列表
const fetchNotificationList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryNotificationsApi({
            ...queryForm,
            userId: queryForm.userId || undefined,
            type: queryForm.type,
            isRead: queryForm.isRead
        })

        if (response.code === 200 && response.data) {
            notificationList.value = response.data.records || []
            pagination.total = response.data.total || 0
        } else {
            ElMessage.error(response.message || '获取通知列表失败')
        }
    } catch (error) {
        console.error('获取通知列表失败:', error)
        ElMessage.error('获取通知列表失败')
    } finally {
        loading.value = false
    }
}

// 获取统计数据
const fetchStatistics = async () => {
    try {
        const response = await getNotificationStatisticsApi()
        if (response.code === 200 && response.data) {
            statistics.value = response.data
        }
    } catch (error) {
        console.error('获取统计数据失败:', error)
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchNotificationList()
}

// 重置
const handleReset = () => {
    queryForm.userId = undefined
    queryForm.type = undefined
    queryForm.isRead = undefined
    queryForm.keyword = ''
    queryForm.startTime = ''
    queryForm.endTime = ''
    pagination.current = 1
    fetchNotificationList()
}

// 查看详情
const handleViewDetail = async (notification: Notification) => {
    detailLoading.value = true
    detailDialogVisible.value = true
    try {
        const response = await getNotificationDetailApi(notification.notificationId)
        if (response.code === 200 && response.data) {
            currentNotification.value = response.data
        } else {
            ElMessage.error(response.message || '获取通知详情失败')
        }
    } catch (error) {
        console.error('获取通知详情失败:', error)
        ElMessage.error('获取通知详情失败')
    } finally {
        detailLoading.value = false
    }
}

// 发送通知
const handleSend = () => {
    sendFormData.userId = undefined
    sendFormData.type = 1
    sendFormData.title = ''
    sendFormData.content = ''
    sendFormData.relatedId = undefined
    sendDialogVisible.value = true
}

// 提交发送
const handleSubmitSend = async () => {
    if (!sendFormRef.value) return

    await sendFormRef.value.validate(async (valid) => {
        if (!valid) return

        sending.value = true
        try {
            const data = {
                userId: sendFormData.userId || undefined,
                type: sendFormData.type,
                title: sendFormData.title,
                content: sendFormData.content,
                relatedId: sendFormData.relatedId || undefined
            }

            const response = await sendNotificationApi(data)
            if (response.code === 200) {
                ElMessage.success(response.message || '发送成功')
                sendDialogVisible.value = false
                fetchNotificationList()
                fetchStatistics()
            } else {
                ElMessage.error(response.message || '发送失败')
            }
        } catch (error) {
            console.error('发送失败:', error)
            ElMessage.error('发送失败')
        } finally {
            sending.value = false
        }
    })
}

// 删除通知
const handleDelete = async (notification: Notification) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除通知"${notification.title}"吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )

        const response = await deleteNotificationApi(notification.notificationId)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            fetchNotificationList()
            fetchStatistics()
        } else {
            ElMessage.error(response.message || '删除失败')
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 选择变化
const handleSelectionChange = (selection: Notification[]) => {
    selectedIds.value = selection.map(item => item.notificationId)
}

// 批量删除
const handleBatchDelete = async () => {
    if (selectedIds.value.length === 0) {
        ElMessage.warning('请选择要删除的通知')
        return
    }

    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedIds.value.length} 条通知吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )

        const response = await batchDeleteNotificationsApi(selectedIds.value)
        if (response.code === 200) {
            ElMessage.success(`成功删除 ${response.data} 条通知`)
            selectedIds.value = []
            fetchNotificationList()
            fetchStatistics()
        } else {
            ElMessage.error(response.message || '批量删除失败')
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error)
            ElMessage.error('批量删除失败')
        }
    }
}

// 页面加载
onMounted(() => {
    fetchNotificationList()
    fetchStatistics()
})
</script>

