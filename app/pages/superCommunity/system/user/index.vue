<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">用户管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理系统用户信息、角色和状态</p>
            </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <el-input v-model="queryParams.keyword" placeholder="搜索用户名/手机号/邮箱" clearable @clear="handleSearch"
                    @keyup.enter="handleSearch">
                    <template #prefix>
                        <Icon name="lucide:search" size="18" class="text-slate-400" />
                    </template>
                </el-input>

                <el-select v-model="queryParams.status" placeholder="用户状态" clearable @change="handleSearch">
                    <el-option label="全部状态" :value="null" />
                    <el-option label="正常" :value="1" />
                    <el-option label="冻结" :value="0" />
                </el-select>

                <el-select v-model="queryParams.userType" placeholder="用户类型" clearable @change="handleSearch">
                    <el-option label="全部类型" :value="null" />
                    <el-option label="业主" :value="1" />
                    <el-option label="租户" :value="2" />
                    <el-option label="访客" :value="3" />
                </el-select>

                <el-button type="primary" @click="handleSearch">
                    <Icon name="lucide:search" size="18" class="mr-2" />
                    搜索
                </el-button>
            </div>
        </div>

        <!-- 用户列表 -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <el-table :data="userList" v-loading="loading" style="width: 100%"
                :header-cell-style="{ background: '#f8fafc', color: '#475569' }">
                <el-table-column label="用户信息" min-width="250">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3">
                            <el-avatar :size="40" :src="row.avatar">
                                {{ row.userName?.charAt(0) }}
                            </el-avatar>
                            <div class="flex-1 min-w-0">
                                <div class="font-semibold text-slate-800 dark:text-white truncate">
                                    {{ row.userName }}
                                </div>
                                <div class="text-xs text-slate-500 dark:text-slate-400">
                                    ID: {{ row.userId }}
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="联系方式" min-width="180">
                    <template #default="{ row }">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2 text-sm">
                                <Icon name="lucide:phone" size="14" class="text-slate-400" />
                                <span>{{ row.phone || '-' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-slate-500">
                                <Icon name="lucide:mail" size="14" class="text-slate-400" />
                                <span class="truncate">{{ row.email || '-' }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="基本信息" min-width="120">
                    <template #default="{ row }">
                        <div class="space-y-1 text-sm">
                            <div>
                                <span class="text-slate-500">性别：</span>
                                <span>{{ getGenderText(row.gender) }}</span>
                            </div>
                            <div>
                                <span class="text-slate-500">年龄：</span>
                                <span>{{ row.age || '-' }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="用户类型" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getUserTypeTagType(row.userType)" size="small">
                            {{ getUserTypeText(row.userType) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="角色" min-width="150">
                    <template #default="{ row }">
                        <div class="flex flex-wrap gap-1">
                            <el-tag v-for="role in row.roles" :key="role" size="small" type="info">
                                {{ role }}
                            </el-tag>
                            <span v-if="!row.roles || row.roles.length === 0" class="text-slate-400 text-sm">-</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="80">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 1 ? '正常' : '冻结' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="注册时间" width="160">
                    <template #default="{ row }">
                        <div class="text-sm text-slate-500">
                            {{ formatDate(row.createTime) }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="280" fixed="right">
                    <template #default="{ row }">
                        <div class="flex gap-2">
                            <el-button type="primary" size="small" link @click="handleView(row)">
                                <Icon name="lucide:eye" size="16" class="mr-1" />
                                查看
                            </el-button>
                            <el-button type="success" size="small" link @click="handleAssignRole(row)">
                                <Icon name="lucide:shield-check" size="16" class="mr-1" />
                                分配角色
                            </el-button>
                            <el-button type="warning" size="small" link @click="handleToggleStatus(row)">
                                <Icon :name="row.status === 1 ? 'lucide:lock' : 'lucide:unlock'" size="16"
                                    class="mr-1" />
                                {{ row.status === 1 ? '冻结' : '解冻' }}
                            </el-button>
                            <el-button type="danger" size="small" link @click="handleDelete(row)">
                                <Icon name="lucide:trash-2" size="16" class="mr-1" />
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="p-4 border-t border-slate-100 dark:border-slate-700">
                <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.size"
                    :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSearch" @current-change="handleSearch" />
            </div>
        </div>

        <!-- 用户详情弹窗 -->
        <el-dialog v-model="detailDialogVisible" title="用户详情" width="800px">
            <div v-if="currentUser" class="space-y-6">
                <!-- 基本信息 -->
                <div>
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="lucide:user" size="20" class="text-[#ff5000]" />
                        基本信息
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center gap-3">
                            <el-avatar :size="60" :src="currentUser.avatar">
                                {{ currentUser.userName?.charAt(0) }}
                            </el-avatar>
                            <div>
                                <div class="font-semibold text-lg">{{ currentUser.userName }}</div>
                                <div class="text-sm text-slate-500">ID: {{ currentUser.userId }}</div>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div><span class="text-slate-500">手机号：</span>{{ currentUser.phone }}</div>
                            <div><span class="text-slate-500">邮箱：</span>{{ currentUser.email || '-' }}</div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div><span class="text-slate-500">性别：</span>{{ getGenderText(currentUser.gender) }}</div>
                            <div><span class="text-slate-500">年龄：</span>{{ currentUser.age || '-' }}</div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div><span class="text-slate-500">用户类型：</span>{{ getUserTypeText(currentUser.userType) }}
                            </div>
                            <div><span class="text-slate-500">状态：</span>
                                <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'" size="small">
                                    {{ currentUser.status === 1 ? '正常' : '冻结' }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 角色信息 -->
                <div v-if="currentUser.roles && currentUser.roles.length > 0">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="lucide:shield-check" size="20" class="text-[#ff5000]" />
                        角色信息
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        <el-tag v-for="role in currentUser.roles" :key="role.roleId" size="large" type="info">
                            {{ role.roleName }}
                        </el-tag>
                    </div>
                </div>

                <!-- 钱包信息 -->
                <div v-if="currentUser.wallet">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="lucide:wallet" size="20" class="text-[#ff5000]" />
                        钱包信息
                    </h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div class="text-slate-500 mb-1">余额</div>
                            <div class="text-2xl font-bold text-green-600">¥{{ currentUser.wallet.balance }}</div>
                        </div>
                        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div class="text-slate-500 mb-1">积分</div>
                            <div class="text-2xl font-bold text-blue-600">{{ currentUser.wallet.points }}</div>
                        </div>
                    </div>
                </div>

                <!-- 时间信息 -->
                <div>
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icon name="lucide:clock" size="20" class="text-[#ff5000]" />
                        时间信息
                    </h3>
                    <div class="space-y-2 text-sm">
                        <div><span class="text-slate-500">注册时间：</span>{{ formatDate(currentUser.createTime) }}</div>
                        <div><span class="text-slate-500">更新时间：</span>{{ formatDate(currentUser.updateTime) }}</div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 分配角色弹窗 -->
        <el-dialog v-model="roleDialogVisible" title="分配角色" width="500px" @close="handleRoleDialogClose">
            <div v-if="selectedUser" class="mb-4">
                <div class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <el-avatar :size="48" :src="selectedUser.avatar">
                        {{ selectedUser.userName?.charAt(0) }}
                    </el-avatar>
                    <div>
                        <div class="font-semibold text-slate-800 dark:text-white">{{ selectedUser.userName }}</div>
                        <div class="text-sm text-slate-500">ID: {{ selectedUser.userId }}</div>
                    </div>
                </div>
            </div>

            <div v-loading="roleLoading" style="min-height: 200px;">
                <div class="mb-3 text-sm text-slate-500">请选择要分配给该用户的角色：</div>
                <el-checkbox-group v-model="selectedRoleIds" class="flex flex-col gap-3">
                    <el-checkbox v-for="role in allRoles" :key="role.roleId" :label="role.roleId"
                        :disabled="role.roleCode === 'ROLE_SUPER_ADMIN'"
                        class="!flex items-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-400 transition-colors">
                        <div class="flex flex-col ml-2">
                            <span class="font-medium">{{ role.roleName }}</span>
                            <span class="text-xs text-slate-400">{{ role.roleCode }}</span>
                        </div>
                    </el-checkbox>
                </el-checkbox-group>

                <div v-if="!roleLoading && allRoles.length === 0"
                    class="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Icon name="lucide:shield-off" size="40" class="mb-2 opacity-30" />
                    <span class="text-sm">暂无可分配的角色</span>
                </div>
            </div>

            <template #footer>
                <el-button @click="roleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitRoles" :loading="roleSubmitting">
                    确定分配
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    getAdminUsersApi, 
    getAdminUserDetailsApi, 
    updateAdminUserStatusApi, 
    deleteAdminUserApi,
    getRoleListApi,
    assignUserRolesApi 
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: ['super-community']
})

interface User {
    userId: number
    userName: string
    phone: string
    email: string
    avatar: string
    gender: number
    age: number
    userType: number
    status: number
    roles: any[]
    createTime: string
    updateTime: string
    wallet?: {
        balance: number
        points: number
    }
}

const loading = ref(false)
const userList = ref<User[]>([])
const total = ref(0)
const detailDialogVisible = ref(false)
const currentUser = ref<User | null>(null)

// 分配角色相关
interface Role {
    roleId: number
    roleName: string
    roleCode: string
    description: string
    status: number
}

const roleDialogVisible = ref(false)
const roleLoading = ref(false)
const roleSubmitting = ref(false)
const selectedUser = ref<User | null>(null)
const allRoles = ref<Role[]>([])
const selectedRoleIds = ref<number[]>([])

const queryParams = reactive({
    page: 1,
    size: 10,
    keyword: '',
    status: null as number | null,
    userType: null as number | null
})

// 获取用户列表
const fetchUserList = async () => {
    loading.value = true
    try {
        const res = await getAdminUsersApi({
            page: queryParams.page,
            size: queryParams.size,
            keyword: queryParams.keyword || undefined,
            status: queryParams.status !== null ? queryParams.status : undefined,
            userType: queryParams.userType !== null ? queryParams.userType : undefined
        }) as any

        if (res.code === 200) {
            userList.value = res.data.records || []
            total.value = res.data.total || 0
        } else {
            ElMessage.error(res.message || '获取用户列表失败')
        }
    } catch (error: any) {
        console.error('获取用户列表失败:', error)
        // 注意：全局拦截器已经处理了 401，这里只处理网络或其他业务错误
        if (error.response?.status !== 401) {
            ElMessage.error('获取用户列表失败')
        }
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    queryParams.page = 1
    fetchUserList()
}

// 查看详情
const handleView = async (user: User) => {
    try {
        const res = await getAdminUserDetailsApi(user.userId) as any

        if (res.code === 200) {
            currentUser.value = res.data
            detailDialogVisible.value = true
        } else {
            ElMessage.error(res.message || '获取用户详情失败')
        }
    } catch (error) {
        console.error('获取用户详情失败:', error)
        ElMessage.error('获取用户详情失败')
    }
}

// 切换状态
const handleToggleStatus = async (user: User) => {
    const action = user.status === 1 ? '冻结' : '解冻'

    try {
        await ElMessageBox.confirm(
            `确定要${action}用户 ${user.userName} 吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const res = await updateAdminUserStatusApi(user.userId, user.status === 1 ? 0 : 1) as any

        if (res.code === 200) {
            ElMessage.success(`${action}成功`)
            fetchUserList()
        } else {
            ElMessage.error(res.message || `${action}失败`)
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error(`${action}失败:`, error)
            ElMessage.error(`${action}失败`)
        }
    }
}

// 删除用户
const handleDelete = async (user: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 ${user.userName} 吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )

        const res = await deleteAdminUserApi(user.userId) as any

        if (res.code === 200) {
            ElMessage.success('删除成功')
            fetchUserList()
        } else {
            ElMessage.error(res.message || '删除失败')
        }
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }
}

// 获取所有角色
const fetchAllRoles = async () => {
    roleLoading.value = true
    try {
        const res = await getRoleListApi() as any

        if (res.code === 200) {
            allRoles.value = (res.data || []).filter((r: Role) => r.status === 1)
        } else {
            ElMessage.error(res.message || '获取角色列表失败')
        }
    } catch (error) {
        console.error('获取角色列表失败:', error)
        ElMessage.error('获取角色列表失败')
    } finally {
        roleLoading.value = false
    }
}

// 打开分配角色弹窗
const handleAssignRole = async (user: User) => {
    selectedUser.value = user
    selectedRoleIds.value = []
    roleDialogVisible.value = true

    await fetchAllRoles()

    // 设置用户当前的角色
    if (user.roles && user.roles.length > 0) {
        // roles 可能是字符串数组 or 对象数组，需要处理
        selectedRoleIds.value = allRoles.value
            .filter((r: Role) => {
                if (typeof user.roles[0] === 'string') {
                    return user.roles.includes(r.roleName)
                } else {
                    return user.roles.some((ur: any) => ur.roleId === r.roleId)
                }
            })
            .map((r: Role) => r.roleId)
    }
}

// 提交角色分配
const handleSubmitRoles = async () => {
    if (!selectedUser.value) return

    roleSubmitting.value = true
    try {
        const res = await assignUserRolesApi({
            userId: selectedUser.value.userId,
            roleIds: selectedRoleIds.value
        }) as any

        if (res.code === 200) {
            ElMessage.success('角色分配成功')
            roleDialogVisible.value = false
            fetchUserList()
        } else {
            ElMessage.error(res.message || '角色分配失败')
        }
    } catch (error) {
        console.error('角色分配失败:', error)
        ElMessage.error('角色分配失败')
    } finally {
        roleSubmitting.value = false
    }
}

// 关闭分配角色弹窗
const handleRoleDialogClose = () => {
    selectedUser.value = null
    selectedRoleIds.value = []
    allRoles.value = []
}

// 辅助函数
const getGenderText = (gender: number) => {
    const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' }
    return map[gender] || '未知'
}

const getUserTypeText = (userType: number) => {
    const map: Record<number, string> = { 1: '业主', 2: '租户', 3: '访客' }
    return map[userType] || '未知'
}

const getUserTypeTagType = (userType: number) => {
    const map: Record<number, string> = { 1: 'success', 2: 'warning', 3: 'info' }
    return map[userType] || ''
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
}

onMounted(() => {
    fetchUserList()
})
</script>
