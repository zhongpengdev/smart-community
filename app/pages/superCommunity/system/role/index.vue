<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">角色管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理系统角色和权限分配</p>
            </div>
            <el-button type="primary" @click="handleCreate">
                <Icon name="lucide:plus" size="18" class="mr-2" />
                创建角色
            </el-button>
        </div>

        <!-- 角色列表 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="role in roleList"
                :key="role.roleId"
                class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-1">
                            {{ role.roleName }}
                        </h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            {{ role.roleCode }}
                        </p>
                    </div>
                    <el-tag :type="role.status === 1 ? 'success' : 'danger'" size="small">
                        {{ role.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </div>

                <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {{ role.description || '暂无描述' }}
                </p>

                <div class="flex gap-2">
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleAssignPermissions(role)"
                    >
                        <Icon name="lucide:shield-check" size="16" class="mr-1" />
                        分配权限
                    </el-button>
                    <el-button
                        type="warning"
                        size="small"
                        @click="handleEdit(role)"
                    >
                        <Icon name="lucide:edit" size="16" class="mr-1" />
                        编辑
                    </el-button>
                    <el-button
                        type="danger"
                        size="small"
                        @click="handleDelete(role)"
                        :disabled="role.roleCode === 'ROLE_SUPER_ADMIN'"
                    >
                        <Icon name="lucide:trash-2" size="16" class="mr-1" />
                        删除
                    </el-button>
                </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="col-span-full flex items-center justify-center py-12">
                <Icon name="lucide:loader-2" size="32" class="animate-spin text-[#ff5000]" />
            </div>

            <!-- 空状态 -->
            <div v-if="!loading && roleList.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                <Icon name="lucide:shield-off" size="48" class="mb-3 opacity-30" />
                <p class="text-sm">暂无角色</p>
            </div>
        </div>

        <!-- 创建/编辑角色弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            :title="isEdit ? '编辑角色' : '创建角色'"
            width="500px"
        >
            <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色编码" prop="roleCode">
                    <el-input v-model="formData.roleCode" placeholder="请输入角色编码（如：ROLE_ADMIN）" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入角色描述"
                    />
                </el-form-item>
                <el-form-item label="状态" prop="status" v-if="isEdit">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitting">
                    确定
                </el-button>
            </template>
        </el-dialog>

        <!-- 分配权限弹窗 -->
        <el-dialog
            v-model="permissionDialogVisible"
            title="分配权限"
            width="600px"
            @close="handlePermissionDialogClose"
        >
            <div v-if="currentRole" class="mb-4">
                <p class="text-sm text-slate-500">为角色 <span class="font-semibold text-slate-800 dark:text-white">{{ currentRole.roleName }}</span> 分配权限</p>
            </div>
            <div v-loading="loading" style="min-height: 300px;">
                <el-tree
                    v-if="permissionTreeData.length > 0"
                    ref="permissionTreeRef"
                    :data="permissionTreeData"
                    show-checkbox
                    node-key="permissionId"
                    :props="{ children: 'children', label: 'permissionName' }"
                    default-expand-all
                >
                    <template #default="{ node, data }">
                        <span class="flex items-center gap-2">
                            <span>{{ data.permissionName }}</span>
                            <el-tag size="small" type="info">{{ data.permissionCode }}</el-tag>
                        </span>
                    </template>
                </el-tree>
            </div>
            <template #footer>
                <el-button @click="permissionDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmitPermissions" :loading="submitting">
                    确定
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
    getRoleListApi, 
    getPermissionListApi, 
    getRolePermissionsApi, 
    createRoleApi, 
    updateRoleApi, 
    assignRolePermissionsApi, 
    deleteRoleApi 
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: ['super-community']
})

interface Role {
    roleId: number
    roleName: string
    roleCode: string
    description: string
    status: number
}

interface Permission {
    permissionId: number
    permissionName: string
    permissionCode: string
    resourceType: string
    description: string
    status: number
    children?: Permission[]
}

const loading = ref(false)
const roleList = ref<Role[]>([])
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const permissionTreeRef = ref()
const currentRole = ref<Role | null>(null)
const selectedPermissions = ref<number[]>([])
const permissionTreeData = ref<Permission[]>([])

const formData = reactive({
    roleId: 0,
    roleName: '',
    roleCode: '',
    description: '',
    status: 1
})

const formRules: FormRules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

// 获取角色列表
const fetchRoleList = async () => {
    loading.value = true
    try {
        const res = await getRoleListApi() as any
        if (res.code === 200) {
            roleList.value = res.data || []
        } else {
            ElMessage.error(res.message || '获取角色列表失败')
        }
    } catch (error) {
        console.error('获取角色列表失败:', error)
        ElMessage.error('获取角色列表失败')
    } finally {
        loading.value = false
    }
}

// 获取所有权限
const fetchAllPermissions = async () => {
    try {
        const res = await getPermissionListApi() as any
        if (res.code === 200) {
            // 将权限列表转换为树形结构
            permissionTreeData.value = buildPermissionTree(res.data || [])
        }
    } catch (error) {
        console.error('获取权限列表失败:', error)
    }
}

// 构建权限树
const buildPermissionTree = (permissions: Permission[]) => {
    const tree: Permission[] = []
    const typeMap: Record<string, Permission[]> = {}
    
    // 按资源类型分组
    permissions.forEach(p => {
        const type = p.resourceType || 'other'
        if (!typeMap[type]) {
            typeMap[type] = []
        }
        typeMap[type].push(p)
    })
    
    // 创建树形结构
    Object.keys(typeMap).forEach(type => {
        tree.push({
            permissionId: -Date.now() - Math.random(),
            permissionName: getResourceTypeName(type),
            permissionCode: type,
            resourceType: type,
            description: '',
            status: 1,
            children: typeMap[type]
        })
    })
    
    return tree
}

const getResourceTypeName = (type: string) => {
    const map: Record<string, string> = {
        'menu': '菜单权限',
        'button': '按钮权限',
        'api': 'API权限',
        'other': '其他权限'
    }
    return map[type] || type
}

// 获取角色的权限
const fetchRolePermissions = async (roleId: number) => {
    try {
        const res = await getRolePermissionsApi(roleId) as any
        if (res.code === 200) {
            const permissions = (res.data || []).map((p: Permission) => p.permissionId)
            selectedPermissions.value = permissions
            
            // 更新树形控件的选中状态
            await nextTick()
            if (permissionTreeRef.value) {
                permissionTreeRef.value.setCheckedKeys(permissions)
            }
        } else {
            selectedPermissions.value = []
            if (permissionTreeRef.value) {
                permissionTreeRef.value.setCheckedKeys([])
            }
        }
    } catch (error) {
        console.error('获取角色权限失败:', error)
        selectedPermissions.value = []
        if (permissionTreeRef.value) {
            permissionTreeRef.value.setCheckedKeys([])
        }
    }
}

// 创建角色
const handleCreate = () => {
    isEdit.value = false
    Object.assign(formData, {
        roleId: 0,
        roleName: '',
        roleCode: '',
        description: '',
        status: 1
    })
    dialogVisible.value = true
}

// 编辑角色
const handleEdit = (role: Role) => {
    isEdit.value = true
    Object.assign(formData, role)
    dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        submitting.value = true
        try {
            const res = isEdit.value
                ? await updateRoleApi(formData.roleId, formData) as any
                : await createRoleApi(formData) as any
            
            if (res.code === 200) {
                ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
                dialogVisible.value = false
                fetchRoleList()
            } else {
                ElMessage.error(res.message || '操作失败')
            }
        } catch (error) {
            console.error('操作失败:', error)
            ElMessage.error('操作失败')
        } finally {
            submitting.value = false
        }
    })
}

// 分配权限
const handleAssignPermissions = async (role: Role) => {
    currentRole.value = role
    selectedPermissions.value = [] // 先清空选中状态
    
    // 等待弹窗打开和树形控件渲染
    permissionDialogVisible.value = true
    
    await nextTick() // 等待DOM更新
    
    // 清空树形控件的选中状态
    if (permissionTreeRef.value) {
        permissionTreeRef.value.setCheckedKeys([])
    }
    
    // 加载权限列表和角色权限
    await fetchAllPermissions()
    await fetchRolePermissions(role.roleId)
    
    // 再次等待，确保数据已更新
    await nextTick()
    
    // 设置选中状态
    if (permissionTreeRef.value && selectedPermissions.value.length > 0) {
        permissionTreeRef.value.setCheckedKeys(selectedPermissions.value)
    }
}

// 提交权限分配
const handleSubmitPermissions = async () => {
    if (!currentRole.value || !permissionTreeRef.value) return
    
    submitting.value = true
    try {
        const checkedKeys = permissionTreeRef.value.getCheckedKeys()
        const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
        const permissionIds = [...checkedKeys, ...halfCheckedKeys].filter((id: number) => id > 0)
        
        const res = await assignRolePermissionsApi({
            roleId: currentRole.value.roleId,
            permissionIds
        }) as any
        
        if (res.code === 200) {
            ElMessage.success('权限分配成功')
            permissionDialogVisible.value = false
            handlePermissionDialogClose() // 关闭时清理状态
        } else {
            ElMessage.error(res.message || '权限分配失败')
        }
    } catch (error) {
        console.error('权限分配失败:', error)
        ElMessage.error('权限分配失败')
    } finally {
        submitting.value = false
    }
}

// 关闭权限分配弹窗时清理状态
const handlePermissionDialogClose = () => {
    currentRole.value = null
    selectedPermissions.value = []
    permissionTreeData.value = []
    if (permissionTreeRef.value) {
        permissionTreeRef.value.setCheckedKeys([])
    }
}

// 删除角色
const handleDelete = async (role: Role) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除角色 ${role.roleName} 吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )
        
        const res = await deleteRoleApi(role.roleId) as any
        if (res.code === 200) {
            ElMessage.success('删除成功')
            fetchRoleList()
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

onMounted(() => {
    fetchRoleList()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
