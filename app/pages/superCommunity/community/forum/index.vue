<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">论坛管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理社区论坛帖子</p>
            </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">总帖子数</span>
                    <Icon name="lucide:file-text" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ pagination.total }}</div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">精华帖子</span>
                    <Icon name="lucide:star" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ essenceCount }}</div>
            </div>
            <div class="bg-gradient-to-br from-red-500 to-red-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">置顶帖子</span>
                    <Icon name="lucide:pin" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ topCount }}</div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm opacity-90">今日发布</span>
                    <Icon name="lucide:trending-up" size="24" class="opacity-80" />
                </div>
                <div class="text-3xl font-bold">{{ todayCount }}</div>
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
                <el-form-item label="板块" class="!mb-0">
                    <el-select
                        v-model="queryForm.sectionId"
                        placeholder="全部板块"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="全部板块" :value="undefined" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" class="!mb-0">
                    <el-select
                        v-model="queryForm.isEssence"
                        placeholder="全部类型"
                        clearable
                        style="width: 130px;"
                    >
                        <el-option label="全部" :value="undefined">
                            <Icon name="lucide:list" size="14" class="mr-2" />
                            全部
                        </el-option>
                        <el-option label="精华" :value="1">
                            <Icon name="lucide:star" size="14" class="mr-2 text-orange-500" />
                            精华
                        </el-option>
                        <el-option label="普通" :value="0">
                            <Icon name="lucide:file-text" size="14" class="mr-2" />
                            普通
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" class="!mb-0">
                    <el-select
                        v-model="queryForm.sortBy"
                        placeholder="排序方式"
                        style="width: 130px;"
                    >
                        <el-option label="最新" value="latest">
                            <Icon name="lucide:clock" size="14" class="mr-2" />
                            最新
                        </el-option>
                        <el-option label="最热" value="hot">
                            <Icon name="lucide:flame" size="14" class="mr-2 text-red-500" />
                            最热
                        </el-option>
                        <el-option label="精华" value="essence">
                            <Icon name="lucide:star" size="14" class="mr-2 text-orange-500" />
                            精华
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

        <!-- 帖子列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="postList"
                v-loading="loading"
                style="width: 100%"
            >
                <el-table-column prop="postId" label="ID" width="80" align="center" />
                <el-table-column label="标题" min-width="300">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2 py-1">
                            <div class="flex gap-1">
                                <el-tag v-if="row.isTop === 1" type="danger" size="small" effect="dark">
                                    <Icon name="lucide:pin" size="12" />
                                </el-tag>
                                <el-tag v-if="row.isEssence === 1" type="warning" size="small" effect="dark">
                                    <Icon name="lucide:star" size="12" />
                                </el-tag>
                            </div>
                            <span class="font-medium text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" @click="handleViewDetail(row)">
                                {{ row.title }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="板块" width="130" align="center">
                    <template #default="{ row }">
                        <el-tag type="info" size="small" effect="plain">
                            <Icon name="lucide:folder" size="12" class="mr-1" />
                            {{ row.sectionName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发帖人" width="160">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            <el-avatar :src="row.userAvatar" :size="32" />
                            <div class="flex flex-col">
                                <span class="text-sm font-medium">{{ row.userName }}</span>
                                <span class="text-xs text-slate-500">ID: {{ row.userId }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="互动数据" width="180">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 text-xs">
                            <div class="flex items-center gap-1 text-blue-600">
                                <Icon name="lucide:eye" size="14" />
                                <span>{{ row.viewCount }}</span>
                            </div>
                            <div class="flex items-center gap-1 text-red-600">
                                <Icon name="lucide:heart" size="14" />
                                <span>{{ row.likeCount }}</span>
                            </div>
                            <div class="flex items-center gap-1 text-green-600">
                                <Icon name="lucide:message-circle" size="14" />
                                <span>{{ row.commentCount }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发布时间" width="180" sortable />
                <el-table-column label="操作" width="240" fixed="right">
                    <template #default="{ row }">
                        <div class="flex flex-wrap gap-2">
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleViewDetail(row)"
                            >
                                <Icon name="lucide:eye" size="14" class="mr-1" />
                                查看
                            </el-button>
                            <el-dropdown trigger="click" @command="(cmd) => handleQuickAction(cmd, row)">
                                <el-button type="success" size="small">
                                    <Icon name="lucide:zap" size="14" class="mr-1" />
                                    快捷
                                    <Icon name="lucide:chevron-down" size="14" class="ml-1" />
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item :command="'top'">
                                            <Icon :name="row.isTop === 1 ? 'lucide:pin-off' : 'lucide:pin'" size="14" class="mr-2" />
                                            {{ row.isTop === 1 ? '取消置顶' : '设为置顶' }}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="'essence'">
                                            <Icon :name="row.isEssence === 1 ? 'lucide:star-off' : 'lucide:star'" size="14" class="mr-2" />
                                            {{ row.isEssence === 1 ? '取消精华' : '设为精华' }}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="'edit'" divided>
                                            <Icon name="lucide:edit" size="14" class="mr-2" />
                                            编辑
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="'delete'">
                                            <Icon name="lucide:trash-2" size="14" class="mr-2" />
                                            删除
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
                    @size-change="fetchPostList"
                    @current-change="fetchPostList"
                />
            </div>
        </div>

        <!-- 帖子详情弹窗 -->
        <el-dialog
            v-model="detailDialogVisible"
            width="800px"
            :close-on-click-modal="false"
        >
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold">帖子详情</span>
                    <div class="flex items-center gap-2">
                        <el-button
                            :type="currentPost?.isTop === 1 ? 'danger' : 'default'"
                            size="small"
                            @click="handleQuickActionInDialog('top')"
                        >
                            <Icon :name="currentPost?.isTop === 1 ? 'lucide:pin-off' : 'lucide:pin'" size="14" class="mr-1" />
                            {{ currentPost?.isTop === 1 ? '取消置顶' : '设为置顶' }}
                        </el-button>
                        <el-button
                            :type="currentPost?.isEssence === 1 ? 'warning' : 'default'"
                            size="small"
                            @click="handleQuickActionInDialog('essence')"
                        >
                            <Icon :name="currentPost?.isEssence === 1 ? 'lucide:star-off' : 'lucide:star'" size="14" class="mr-1" />
                            {{ currentPost?.isEssence === 1 ? '取消精华' : '设为精华' }}
                        </el-button>
                    </div>
                </div>
            </template>
            <div v-if="currentPost" v-loading="detailLoading" class="space-y-6">
                <!-- 基础信息 -->
                <div>
                    <div class="flex items-center gap-2 mb-3">
                        <h3 class="text-xl font-bold text-slate-800 dark:text-white">{{ currentPost.title }}</h3>
                        <el-tag v-if="currentPost.isTop === 1" type="danger" size="small">
                            <Icon name="lucide:pin" size="12" class="mr-1" />
                            置顶
                        </el-tag>
                        <el-tag v-if="currentPost.isEssence === 1" type="warning" size="small">
                            <Icon name="lucide:star" size="12" class="mr-1" />
                            精华
                        </el-tag>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-slate-500">
                        <div class="flex items-center gap-2">
                            <el-avatar :src="currentPost.userAvatar" :size="32" />
                            <span>{{ currentPost.userName }}</span>
                        </div>
                        <el-tag type="info" size="small">{{ currentPost.sectionName }}</el-tag>
                        <span>{{ currentPost.createTime }}</span>
                    </div>
                </div>

                <!-- 帖子内容 -->
                <div class="prose dark:prose-invert max-w-none">
                    <div class="whitespace-pre-wrap">{{ currentPost.content }}</div>
                </div>

                <!-- 图片 -->
                <div v-if="currentPost.images" class="grid grid-cols-3 gap-4">
                    <el-image
                        v-for="(img, index) in currentPost.images.split(',')"
                        :key="index"
                        :src="img"
                        fit="cover"
                        class="w-full h-48 rounded"
                        :preview-src-list="currentPost.images.split(',')"
                        :initial-index="index"
                    />
                </div>

                <!-- 统计数据 -->
                <div class="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">{{ currentPost.viewCount }}</div>
                        <div class="text-sm text-slate-500">浏览</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-red-600">{{ currentPost.likeCount }}</div>
                        <div class="text-sm text-slate-500">点赞</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">{{ currentPost.commentCount }}</div>
                        <div class="text-sm text-slate-500">评论</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">{{ currentPost.collectCount }}</div>
                        <div class="text-sm text-slate-500">收藏</div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 编辑帖子弹窗 -->
        <el-dialog
            v-model="editDialogVisible"
            title="编辑帖子"
            width="700px"
            :close-on-click-modal="false"
        >
            <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
                <el-form-item label="帖子标题" prop="title">
                    <el-input v-model="editForm.title" placeholder="请输入帖子标题" />
                </el-form-item>
                <el-form-item label="帖子内容" prop="content">
                    <el-input
                        v-model="editForm.content"
                        type="textarea"
                        :rows="10"
                        placeholder="请输入帖子内容"
                    />
                </el-form-item>
                <el-form-item label="图片URL" prop="images">
                    <el-input
                        v-model="editForm.images"
                        type="textarea"
                        :rows="3"
                        placeholder="多个图片URL用逗号分隔"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitEdit" :loading="submitting">
                    保存
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { getForumPostListApi, getForumPostDetailApi, deleteForumPostApi, updateForumPostApi, setForumPostTopApi, setForumPostEssenceApi } from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: ['super-community']
})

interface Post {
    postId: number
    sectionId: number
    sectionName: string
    userId: number
    userName: string
    userAvatar: string
    title: string
    contentSummary?: string
    firstImage?: string
    viewCount: number
    likeCount: number
    commentCount: number
    isTop: number
    isEssence: number
    isLiked?: boolean
    isCollected?: boolean
    createTime: string
}

interface PostDetail extends Post {
    content: string
    images?: string
    collectCount: number
    updateTime: string
}

const config = useRuntimeConfig()
const userStore = useUserStore()

const loading = ref(false)
const detailLoading = ref(false)
const submitting = ref(false)
const postList = ref<Post[]>([])
const currentPost = ref<PostDetail | null>(null)
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const essenceCount = ref(0)
const topCount = ref(0)
const todayCount = ref(0)

const queryForm = reactive({
    pageNo: 1,
    pageSize: 10,
    sectionId: undefined as number | undefined,
    keyword: '',
    isEssence: undefined as number | undefined,
    sortBy: 'latest'
})

const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
})

const editForm = reactive({
    postId: 0,
    title: '',
    content: '',
    images: ''
})

const editRules: FormRules = {
    title: [{ required: true, message: '请输入帖子标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入帖子内容', trigger: 'blur' }]
}

// 获取帖子列表
const fetchPostList = async () => {
    loading.value = true
    try {
        queryForm.pageNo = pagination.current
        queryForm.pageSize = pagination.size

        const response = await getForumPostListApi({
            ...queryForm,
            sectionId: queryForm.sectionId || undefined,
            isEssence: queryForm.isEssence !== undefined ? queryForm.isEssence : undefined
        })

        if (response.code === 200 && response.data) {
            postList.value = response.data.records || []
            pagination.total = response.data.total || 0
            
            // 计算统计数据
            calculateStats()
        } else {
            ElMessage.error(response.message || '获取帖子列表失败')
        }
    } catch (error) {
        console.error('获取帖子列表失败:', error)
        ElMessage.error('获取帖子列表失败')
    } finally {
        loading.value = false
    }
}

// 计算统计数据
const calculateStats = () => {
    essenceCount.value = postList.value.filter(p => p.isEssence === 1).length
    topCount.value = postList.value.filter(p => p.isTop === 1).length
    
    // 计算今日发布
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    todayCount.value = postList.value.filter(p => {
        const createTime = new Date(p.createTime)
        return createTime >= today
    }).length
}

// 查看详情
const handleViewDetail = async (post: Post) => {
    currentPost.value = null
    detailDialogVisible.value = true
    detailLoading.value = true

    try {
        const response = await getForumPostDetailApi(post.postId)
        if (response.code === 200 && response.data) {
            currentPost.value = response.data
        } else {
            ElMessage.error(response.message || '获取帖子详情失败')
            detailDialogVisible.value = false
        }
    } catch (error) {
        console.error('获取帖子详情失败:', error)
        ElMessage.error('获取帖子详情失败')
        detailDialogVisible.value = false
    } finally {
        detailLoading.value = false
    }
}

// 编辑帖子
const handleEdit = async (post: Post) => {
    // 先获取详情
    try {
        const response = await getForumPostDetailApi(post.postId)
        if (response.code === 200 && response.data) {
            editForm.postId = response.data.postId
            editForm.title = response.data.title
            editForm.content = response.data.content
            editForm.images = response.data.images || ''
            editDialogVisible.value = true
        } else {
            ElMessage.error(response.message || '获取帖子详情失败')
        }
    } catch (error) {
        console.error('获取帖子详情失败:', error)
        ElMessage.error('获取帖子详情失败')
    }
}

// 提交编辑
const handleSubmitEdit = async () => {
    if (!editFormRef.value) return

    await editFormRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            const response = await updateForumPostApi(editForm.postId, {
                title: editForm.title,
                content: editForm.content,
                images: editForm.images
            })

            if (response.code === 200) {
                ElMessage.success('更新成功')
                editDialogVisible.value = false
                fetchPostList()
            } else {
                ElMessage.error(response.message || '更新失败')
            }
        } catch (error) {
            console.error('更新失败:', error)
            ElMessage.error('更新失败')
        } finally {
            submitting.value = false
        }
    })
}

// 详情弹窗中的快捷操作
const handleQuickActionInDialog = async (command: string) => {
    if (!currentPost.value) return
    
    const post = {
        postId: currentPost.value.postId,
        title: currentPost.value.title,
        isTop: currentPost.value.isTop,
        isEssence: currentPost.value.isEssence
    } as Post
    
    await handleQuickAction(command, post)
    
    // 操作成功后重新加载详情
    if (command === 'top' || command === 'essence') {
        await handleViewDetail(post)
    }
}

// 快捷操作
const handleQuickAction = async (command: string, post: Post) => {
    try {
        if (command === 'top') {
            // 置顶/取消置顶
            const newTopStatus = post.isTop === 1 ? 0 : 1
            const action = post.isTop === 1 ? '取消置顶' : '设为置顶'
            
            await ElMessageBox.confirm(
                `确定要${action}帖子"${post.title}"吗？`,
                '确认操作',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
            
            const response = await setForumPostTopApi(post.postId, newTopStatus)
            if (response.code === 200) {
                ElMessage.success(`${action}成功`)
                fetchPostList()
            } else {
                ElMessage.error(response.message || `${action}失败`)
            }
            
        } else if (command === 'essence') {
            // 精华/取消精华
            const newEssenceStatus = post.isEssence === 1 ? 0 : 1
            const action = post.isEssence === 1 ? '取消精华' : '设为精华'
            
            await ElMessageBox.confirm(
                `确定要${action}帖子"${post.title}"吗？`,
                '确认操作',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
            
            const response = await setForumPostEssenceApi(post.postId, newEssenceStatus)
            if (response.code === 200) {
                ElMessage.success(`${action}成功`)
                fetchPostList()
            } else {
                ElMessage.error(response.message || `${action}失败`)
            }
            
        } else if (command === 'edit') {
            // 编辑
            handleEdit(post)
            
        } else if (command === 'delete') {
            // 删除
            handleDelete(post)
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('操作失败:', error)
            ElMessage.error('操作失败')
        }
    }
}

// 删除帖子
const handleDelete = async (post: Post) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除帖子"${post.title}"吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )

        const response = await deleteForumPostApi(post.postId)
        if (response.code === 200) {
            ElMessage.success('删除成功')
            fetchPostList()
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

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchPostList()
}

// 重置
const handleReset = () => {
    Object.assign(queryForm, {
        sectionId: undefined,
        keyword: '',
        isEssence: undefined,
        sortBy: 'latest'
    })
    pagination.current = 1
    fetchPostList()
}

onMounted(() => {
    fetchPostList()
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

.prose {
    @apply text-slate-700 dark:text-slate-300;
}
</style>

