<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">板块管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理论坛板块,控制板块显示和排序</p>
            </div>
            <el-button type="primary" @click="handleCreate">
                <Icon name="lucide:plus" size="16" class="mr-1" />
                创建板块
            </el-button>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">总板块数</span>
                    <Icon name="lucide:layout-grid" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.totalSections || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">启用板块</span>
                    <Icon name="lucide:check-circle" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.activeSections || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">禁用板块</span>
                    <Icon name="lucide:x-circle" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.disabledSections || 0 }}</div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">总帖子数</span>
                    <Icon name="lucide:file-text" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ statistics.totalPosts || 0 }}</div>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="板块名称" class="!mb-0">
                    <el-input
                        v-model="queryForm.sectionName"
                        placeholder="搜索板块名称"
                        clearable
                        style="width: 220px;"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <Icon name="lucide:search" size="16" class="text-slate-400" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="状态" class="!mb-0">
                    <el-select
                        v-model="queryForm.status"
                        placeholder="全部状态"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="全部" :value="undefined" />
                        <el-option label="启用" :value="1">
                            <Icon name="lucide:check-circle" size="14" class="mr-2 text-green-500" />
                            启用
                        </el-option>
                        <el-option label="禁用" :value="0">
                            <Icon name="lucide:x-circle" size="14" class="mr-2 text-red-500" />
                            禁用
                        </el-option>
                    </el-select>
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

        <!-- 板块列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="sectionList"
                v-loading="loading"
                style="width: 100%"
            >
                <el-table-column prop="sectionId" label="ID" width="80" align="center" />
                <el-table-column label="板块信息" min-width="300">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 py-2">
                            <el-avatar :src="row.iconUrl" :size="48" shape="square">
                                <Icon name="lucide:folder" size="24" />
                            </el-avatar>
                            <div class="flex flex-col">
                                <span class="font-medium text-slate-800 dark:text-white">{{ row.sectionName }}</span>
                                <span class="text-xs text-slate-500 line-clamp-1">{{ row.sectionDesc || '暂无描述' }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag type="info" size="small">{{ row.sortOrder }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="帖子数" width="120" align="center">
                    <template #default="{ row }">
                        <div class="flex items-center justify-center gap-1 text-blue-600">
                            <Icon name="lucide:file-text" size="14" />
                            <span class="font-medium">{{ row.postCount }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.statusDesc }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="280" fixed="right">
                    <template #default="{ row }">
                        <div class="flex flex-wrap gap-2">
                            <el-button
                                :type="row.status === 1 ? 'warning' : 'success'"
                                size="small"
                                @click="handleToggleStatus(row)"
                            >
                                <Icon :name="row.status === 1 ? 'lucide:x-circle' : 'lucide:check-circle'" size="14" class="mr-1" />
                                {{ row.status === 1 ? '禁用' : '启用' }}
                            </el-button>
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleEdit(row)"
                            >
                                <Icon name="lucide:edit" size="14" class="mr-1" />
                                编辑
                            </el-button>
                            <el-button
                                type="danger"
                                size="small"
                                @click="handleDelete(row)"
                            >
                                <Icon name="lucide:trash-2" size="14" class="mr-1" />
                                删除
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
                    @size-change="fetchSectionList"
                    @current-change="fetchSectionList"
                />
            </div>
        </div>

        <!-- 创建/编辑板块弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="600px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="板块名称" prop="sectionName">
                    <el-input
                        v-model="formData.sectionName"
                        placeholder="请输入板块名称"
                        maxlength="100"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="板块描述" prop="sectionDesc">
                    <el-input
                        v-model="formData.sectionDesc"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入板块描述"
                        maxlength="500"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="板块图标" prop="iconUrl">
                    <div class="w-full space-y-3">
                        <!-- 图标预览 -->
                        <div v-if="formData.iconUrl" class="flex items-center gap-4">
                            <el-avatar :src="formData.iconUrl" :size="80" shape="square">
                                <Icon name="lucide:image" size="32" />
                            </el-avatar>
                            <el-button type="danger" size="small" @click="formData.iconUrl = ''">
                                <Icon name="lucide:trash-2" size="14" class="mr-1" />
                                删除图标
                            </el-button>
                        </div>
                        
                        <!-- 上传按钮 -->
                        <el-upload
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleIconChange"
                            accept="image/*"
                        >
                            <el-button type="primary">
                                <Icon name="lucide:upload" size="14" class="mr-1" />
                                {{ formData.iconUrl ? '更换图标' : '上传图标' }}
                            </el-button>
                        </el-upload>
                        
                        <div class="text-xs text-slate-500">
                            建议使用正方形图标,尺寸 128x128 或更大,支持 jpg、png、gif、webp 格式,大小不超过 10MB
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="排序序号" prop="sortOrder">
                    <el-input-number
                        v-model="formData.sortOrder"
                        :min="0"
                        :step="10"
                        controls-position="right"
                        style="width: 100%;"
                    />
                    <div class="text-xs text-slate-500 mt-1">
                        数值越小越靠前,建议按10的倍数递增(10, 20, 30...)
                    </div>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">
                            <Icon name="lucide:check-circle" size="14" class="mr-1 text-green-500" />
                            启用
                        </el-radio>
                        <el-radio :label="0">
                            <Icon name="lucide:x-circle" size="14" class="mr-1 text-red-500" />
                            禁用
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex items-center justify-between">
                    <div v-if="uploading" class="text-sm text-blue-600 flex items-center gap-2">
                        <el-icon class="is-loading">
                            <Icon name="lucide:loader-2" size="16" />
                        </el-icon>
                        <span>图标上传中...</span>
                    </div>
                    <div v-else></div>
                    <div class="flex gap-2">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="submitting" :disabled="uploading" @click="handleSubmit">
                            确定
                        </el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
    queryForumSectionsApi,
    createForumSectionApi,
    updateForumSectionApi,
    deleteForumSectionApi,
    toggleForumSectionStatusApi,
    getForumSectionStatisticsApi,
    uploadImageApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface Section {
    sectionId: number
    sectionName: string
    sectionDesc: string
    iconUrl: string
    sortOrder: number
    postCount: number
    status: number
    statusDesc: string
    createTime: string
    updateTime: string
}

interface Statistics {
    totalSections: number
    activeSections: number
    disabledSections: number
    totalPosts: number
    topSections: Array<{
        sectionId: number
        sectionName: string
        postCount: number
    }>
}

// 查询表单
const queryForm = reactive({
    sectionName: '',
    status: undefined as number | undefined,
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
const sectionList = ref<Section[]>([])

// 统计数据
const statistics = ref<Statistics>({
    totalSections: 0,
    activeSections: 0,
    disabledSections: 0,
    totalPosts: 0,
    topSections: []
})

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = computed(() => formData.sectionId ? '编辑板块' : '创建板块')
const submitting = ref(false)
const uploading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    sectionId: 0,
    sectionName: '',
    sectionDesc: '',
    iconUrl: '',
    sortOrder: 10,
    status: 1
})

// 表单验证规则
const formRules: FormRules = {
    sectionName: [
        { required: true, message: '请输入板块名称', trigger: 'blur' },
        { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    sortOrder: [
        { required: true, message: '请输入排序序号', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ]
}

// 获取板块列表
const fetchSectionList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryForumSectionsApi({
            ...queryForm,
            status: queryForm.status
        })

        if (response.code === 200 && response.data) {
            sectionList.value = response.data.records || []
            pagination.total = response.data.total || 0
        } else {
            ElMessage.error(response.message || '获取板块列表失败')
        }
    } catch (error) {
        console.error('获取板块列表失败:', error)
        ElMessage.error('获取板块列表失败')
    } finally {
        loading.value = false
    }
}

// 获取统计数据
const fetchStatistics = async () => {
    try {
        const response = await getForumSectionStatisticsApi()
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
    fetchSectionList()
}

// 重置
const handleReset = () => {
    queryForm.sectionName = ''
    queryForm.status = undefined
    pagination.current = 1
    fetchSectionList()
}

// 处理图标上传
const handleIconChange = async (file: any) => {
    const rawFile = file.raw
    if (!rawFile) return

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(rawFile.type)) {
        ElMessage.error('只支持 jpg、png、gif、webp 格式的图片')
        return
    }

    // 验证文件大小 (10MB)
    if (rawFile.size > 10 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过 10MB')
        return
    }

    uploading.value = true
    try {
        const response = await uploadImageApi(rawFile)
        if (response.code === 200 && response.data) {
            formData.iconUrl = response.data.url
            ElMessage.success('图标上传成功')
        } else {
            ElMessage.error(response.message || '图标上传失败')
        }
    } catch (error) {
        console.error('图标上传失败:', error)
        ElMessage.error('图标上传失败')
    } finally {
        uploading.value = false
    }
}

// 创建板块
const handleCreate = () => {
    formData.sectionId = 0
    formData.sectionName = ''
    formData.sectionDesc = ''
    formData.iconUrl = ''
    formData.sortOrder = (sectionList.value.length + 1) * 10
    formData.status = 1
    dialogVisible.value = true
}

// 编辑板块
const handleEdit = (section: Section) => {
    formData.sectionId = section.sectionId
    formData.sectionName = section.sectionName
    formData.sectionDesc = section.sectionDesc
    formData.iconUrl = section.iconUrl
    formData.sortOrder = section.sortOrder
    formData.status = section.status
    dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            const data = {
                sectionName: formData.sectionName,
                sectionDesc: formData.sectionDesc,
                iconUrl: formData.iconUrl,
                sortOrder: formData.sortOrder,
                status: formData.status
            }

            let response
            if (formData.sectionId) {
                // 更新
                response = await updateForumSectionApi(formData.sectionId, data)
            } else {
                // 创建
                response = await createForumSectionApi(data)
            }

            if (response.code === 200) {
                ElMessage.success(formData.sectionId ? '更新成功' : '创建成功')
                dialogVisible.value = false
                fetchSectionList()
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

// 切换状态
const handleToggleStatus = async (section: Section) => {
    const newStatus = section.status === 1 ? 0 : 1
    const action = newStatus === 1 ? '启用' : '禁用'

    try {
        await ElMessageBox.confirm(
            `确定要${action}板块"${section.sectionName}"吗？`,
            '确认操作',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const response = await toggleForumSectionStatusApi(section.sectionId, newStatus)
        if (response.code === 200) {
            ElMessage.success(`${action}成功`)
            fetchSectionList()
            fetchStatistics()
        } else {
            ElMessage.error(response.message || `${action}失败`)
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('操作失败:', error)
            ElMessage.error('操作失败')
        }
    }
}

// 删除板块
const handleDelete = async (section: Section) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除板块"${section.sectionName}"吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )

        const response = await deleteForumSectionApi(section.sectionId)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            fetchSectionList()
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
    fetchSectionList()
    fetchStatistics()
})
</script>

