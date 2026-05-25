<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">公告管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">发布和管理社区公告</p>
            </div>
            <el-button type="primary" @click="handlePublish">
                <Icon name="lucide:megaphone" size="16" class="mr-1" />
                发布公告
            </el-button>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">总公告数</span>
                    <Icon name="lucide:megaphone" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.totalAnnouncements || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">今日发布</span>
                    <Icon name="lucide:calendar" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.todayAnnouncements || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">总阅读数</span>
                    <Icon name="lucide:eye" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.totalReadCount || 0 }}</div>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="关键词" class="!mb-0">
                    <el-input
                        v-model="queryForm.keyword"
                        placeholder="搜索标题或内容"
                        clearable
                        style="width: 220px;"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <Icon name="lucide:search" size="16" class="text-slate-400" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发布人ID" class="!mb-0">
                    <el-input
                        v-model.number="queryForm.publishUserId"
                        placeholder="输入发布人ID"
                        clearable
                        style="width: 150px;"
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

        <!-- 公告列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="announcementList"
                v-loading="loading"
                style="width: 100%"
            >
                <el-table-column prop="announceId" label="ID" width="80" align="center" />
                <el-table-column label="公告内容" min-width="350">
                    <template #default="{ row }">
                        <div class="flex flex-col gap-1 py-2">
                            <span class="font-medium text-slate-800 dark:text-white text-base">{{ row.title }}</span>
                            <span class="text-sm text-slate-500 line-clamp-2">{{ row.content }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="发布人" width="150">
                    <template #default="{ row }">
                        <div class="flex flex-col">
                            <span class="text-sm font-medium">{{ row.publishUserName }}</span>
                            <span class="text-xs text-slate-400">ID: {{ row.publishUserId }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="阅读数" width="120" align="center">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center gap-1 text-blue-600">
                            <Icon name="lucide:eye" size="14" />
                            <span class="font-medium">{{ row.readCount }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" width="180" sortable />
                <el-table-column label="操作" width="200" fixed="right">
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
                            <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, row)">
                                <el-button type="success" size="small">
                                    <Icon name="lucide:more-horizontal" size="14" class="mr-1" />
                                    更多
                                    <Icon name="lucide:chevron-down" size="14" class="ml-1" />
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item command="edit">
                                            <Icon name="lucide:edit" size="14" class="mr-2" />
                                            编辑
                                        </el-dropdown-item>
                                        <el-dropdown-item command="delete" divided>
                                            <Icon name="lucide:trash-2" size="14" class="mr-2 text-red-500" />
                                            <span class="text-red-500">删除</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
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
                    @size-change="fetchAnnouncementList"
                    @current-change="fetchAnnouncementList"
                />
            </div>
        </div>

        <!-- 公告详情弹窗 -->
        <el-dialog
            v-model="detailDialogVisible"
            title="公告详情"
            width="700px"
            :close-on-click-modal="false"
        >
            <div v-if="currentAnnouncement" v-loading="detailLoading" class="space-y-4">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="公告ID">
                        {{ currentAnnouncement.announceId }}
                    </el-descriptions-item>
                    <el-descriptions-item label="阅读次数">
                        <div class="flex items-center gap-1 text-blue-600">
                            <Icon name="lucide:eye" size="16" />
                            <span class="font-medium">{{ currentAnnouncement.readCount }}</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="发布人">
                        {{ currentAnnouncement.publishUserName }} (ID: {{ currentAnnouncement.publishUserId }})
                    </el-descriptions-item>
                    <el-descriptions-item label="发布时间">
                        {{ currentAnnouncement.publishTime }}
                    </el-descriptions-item>
                    <el-descriptions-item label="标题" :span="2">
                        <span class="font-medium text-lg">{{ currentAnnouncement.title }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="内容" :span="2">
                        <div class="whitespace-pre-wrap max-h-96 overflow-y-auto">{{ currentAnnouncement.content }}</div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>

        <!-- 发布/编辑公告弹窗 -->
        <el-dialog
            v-model="formDialogVisible"
            :title="formTitle"
            width="700px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="公告标题" prop="title">
                    <el-input
                        v-model="formData.title"
                        placeholder="请输入公告标题"
                        maxlength="200"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input
                        v-model="formData.content"
                        type="textarea"
                        :rows="12"
                        placeholder="请输入公告内容"
                        maxlength="2000"
                        show-word-limit
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <el-button @click="formDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmit">
                        {{ formData.announceId ? '更新' : '发布' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
    queryAnnouncementsApi,
    getAdminAnnouncementDetailApi,
    publishAnnouncementApi,
    updateAnnouncementApi,
    deleteAnnouncementApi,
    getAnnouncementStatisticsApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface Announcement {
    announceId: number
    title: string
    content: string
    publishUserId: number
    publishUserName: string
    publishTime: string
    readCount: number
}

interface Statistics {
    totalAnnouncements: number
    todayAnnouncements: number
    totalReadCount: number
}

// 查询表单
const queryForm = reactive({
    keyword: '',
    publishUserId: undefined as number | undefined,
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
const announcementList = ref<Announcement[]>([])

// 统计数据
const statistics = ref<Statistics>({
    totalAnnouncements: 0,
    todayAnnouncements: 0,
    totalReadCount: 0
})

// 详情弹窗
const detailDialogVisible = ref(false)
const detailLoading = ref(false)
const currentAnnouncement = ref<Announcement | null>(null)

// 表单弹窗
const formDialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const formTitle = computed(() => formData.announceId ? '编辑公告' : '发布公告')

const formData = reactive({
    announceId: 0,
    title: '',
    content: ''
})

const formRules: FormRules = {
    title: [
        { required: true, message: '请输入公告标题', trigger: 'blur' },
        { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入公告内容', trigger: 'blur' },
        { min: 10, max: 2000, message: '长度在 10 到 2000 个字符', trigger: 'blur' }
    ]
}

// 获取公告列表
const fetchAnnouncementList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryAnnouncementsApi({
            ...queryForm,
            publishUserId: queryForm.publishUserId || undefined
        })

        if (response.code === 200 && response.data) {
            announcementList.value = response.data.records || []
            pagination.total = response.data.total || 0
        } else {
            ElMessage.error(response.message || '获取公告列表失败')
        }
    } catch (error) {
        console.error('获取公告列表失败:', error)
        ElMessage.error('获取公告列表失败')
    } finally {
        loading.value = false
    }
}

// 获取统计数据
const fetchStatistics = async () => {
    try {
        const response = await getAnnouncementStatisticsApi()
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
    fetchAnnouncementList()
}

// 重置
const handleReset = () => {
    queryForm.keyword = ''
    queryForm.publishUserId = undefined
    queryForm.startTime = ''
    queryForm.endTime = ''
    pagination.current = 1
    fetchAnnouncementList()
}

// 查看详情
const handleViewDetail = async (announcement: Announcement) => {
    detailLoading.value = true
    detailDialogVisible.value = true
    try {
        const response = await getAdminAnnouncementDetailApi(announcement.announceId)
        if (response.code === 200 && response.data) {
            currentAnnouncement.value = response.data
        } else {
            ElMessage.error(response.message || '获取公告详情失败')
        }
    } catch (error) {
        console.error('获取公告详情失败:', error)
        ElMessage.error('获取公告详情失败')
    } finally {
        detailLoading.value = false
    }
}

// 发布公告
const handlePublish = () => {
    formData.announceId = 0
    formData.title = ''
    formData.content = ''
    formDialogVisible.value = true
}

// 处理下拉菜单操作
const handleAction = (command: string, announcement: Announcement) => {
    if (command === 'edit') {
        handleEdit(announcement)
    } else if (command === 'delete') {
        handleDelete(announcement)
    }
}

// 编辑公告
const handleEdit = (announcement: Announcement) => {
    formData.announceId = announcement.announceId
    formData.title = announcement.title
    formData.content = announcement.content
    formDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            const data = {
                title: formData.title,
                content: formData.content
            }

            let response
            if (formData.announceId) {
                // 更新
                response = await updateAnnouncementApi(formData.announceId, data)
            } else {
                // 发布
                response = await publishAnnouncementApi(data)
            }

            if (response.code === 200) {
                ElMessage.success(formData.announceId ? '更新成功' : '发布成功')
                formDialogVisible.value = false
                fetchAnnouncementList()
                fetchStatistics()
            } else {
                ElMessage.error(response.message || '操作失败')
            }
        } catch (error) {
            console.error('操作失败:', error)
            ElMessage.error('操作失败')
        } finally {
            submitting.value = false
        }
    })
}

// 删除公告
const handleDelete = async (announcement: Announcement) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除公告"${announcement.title}"吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )

        const response = await deleteAnnouncementApi(announcement.announceId)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            fetchAnnouncementList()
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

// 页面加载
onMounted(() => {
    fetchAnnouncementList()
    fetchStatistics()
})
</script>

