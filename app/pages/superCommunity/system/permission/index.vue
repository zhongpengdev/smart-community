<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">权限管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理系统权限资源</p>
            </div>
            <el-button type="primary" @click="handleCreate">
                <Icon name="lucide:plus" size="18" class="mr-2" />
                创建权限
            </el-button>
        </div>

        <!-- 筛选 -->
        <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <div class="flex gap-4">
                <el-select v-model="filterType" placeholder="资源类型" clearable @change="filterPermissions">
                    <el-option label="全部类型" value="" />
                    <el-option label="菜单" value="menu" />
                    <el-option label="按钮" value="button" />
                    <el-option label="API" value="api" />
                </el-select>
                <el-select v-model="filterStatus" placeholder="状态" clearable @change="filterPermissions">
                    <el-option label="全部状态" :value="null" />
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                </el-select>
            </div>
        </div>

        <!-- 权限列表 -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            <el-table
                :data="filteredPermissions"
                v-loading="loading"
                style="width: 100%"
                :header-cell-style="{ background: '#f8fafc', color: '#475569' }"
            >
                <el-table-column label="权限名称" min-width="200">
                    <template #default="{ row }">
                        <div class="font-semibold text-slate-800 dark:text-white">
                            {{ row.permissionName }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="权限编码" min-width="180">
                    <template #default="{ row }">
                        <el-tag type="info" size="small">
                            {{ row.permissionCode }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="资源类型" width="120">
                    <template #default="{ row }">
                        <el-tag :type="getResourceTypeTagType(row.resourceType)" size="small">
                            {{ getResourceTypeText(row.resourceType) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="描述" min-width="250">
                    <template #default="{ row }">
                        <span class="text-sm text-slate-600 dark:text-slate-300">
                            {{ row.description || '-' }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="80">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <div class="flex gap-2">
                            <el-button
                                type="warning"
                                size="small"
                                link
                                @click="handleEdit(row)"
                            >
                                <Icon name="lucide:edit" size="16" class="mr-1" />
                                编辑
                            </el-button>
                            <el-button
                                type="danger"
                                size="small"
                                link
                                @click="handleDelete(row)"
                            >
                                <Icon name="lucide:trash-2" size="16" class="mr-1" />
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 创建/编辑权限弹窗 -->
        <el-dialog
            v-model="dialogVisible"
            :title="isEdit ? '编辑权限' : '创建权限'"
            width="600px"
        >
            <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="权限名称" prop="permissionName">
                    <el-input v-model="formData.permissionName" placeholder="请输入权限名称" />
                </el-form-item>
                <el-form-item label="权限编码" prop="permissionCode">
                    <el-input v-model="formData.permissionCode" placeholder="请输入权限编码（如：user:view）" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="资源类型" prop="resourceType">
                    <el-select v-model="formData.resourceType" placeholder="请选择资源类型">
                        <el-option label="菜单" value="menu" />
                        <el-option label="按钮" value="button" />
                        <el-option label="API" value="api" />
                    </el-select>
                </el-form-item>
                <el-form-item label="权限描述" prop="description">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入权限描述"
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { 
    getPermissionListApi, 
    createPermissionApi, 
    updatePermissionApi, 
    deletePermissionApi 
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: ['super-community']
})

interface Permission {
    permissionId: number
    permissionName: string
    permissionCode: string
    resourceType: string
    description: string
    status: number
}

const loading = ref(false)
const permissionList = ref<Permission[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const filterType = ref('')
const filterStatus = ref<number | null>(null)

const formData = reactive({
    permissionId: 0,
    permissionName: '',
    permissionCode: '',
    resourceType: '',
    description: '',
    status: 1
})

const formRules: FormRules = {
    permissionName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    permissionCode: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
    resourceType: [{ required: true, message: '请选择资源类型', trigger: 'change' }]
}

// 筛选后的权限列表
const filteredPermissions = computed(() => {
    return permissionList.value.filter(p => {
        if (filterType.value && p.resourceType !== filterType.value) return false
        if (filterStatus.value !== null && p.status !== filterStatus.value) return false
        return true
    })
})

// 获取权限列表
const fetchPermissionList = async () => {
    loading.value = true
    try {
        const res = await getPermissionListApi() as any
        if (res.code === 200) {
            permissionList.value = res.data || []
        } else {
            ElMessage.error(res.message || '获取权限列表失败')
        }
    } catch (error) {
        console.error('获取权限列表失败:', error)
        ElMessage.error('获取权限列表失败')
    } finally {
        loading.value = false
    }
}

// 创建权限
const handleCreate = () => {
    isEdit.value = false
    Object.assign(formData, {
        permissionId: 0,
        permissionName: '',
        permissionCode: '',
        resourceType: '',
        description: '',
        status: 1
    })
    dialogVisible.value = true
}

// 编辑权限
const handleEdit = (permission: Permission) => {
    isEdit.value = true
    Object.assign(formData, permission)
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
                ? await updatePermissionApi(formData.permissionId, formData) as any
                : await createPermissionApi(formData) as any
            
            if (res.code === 200) {
                ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
                dialogVisible.value = false
                fetchPermissionList()
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

// 删除权限
const handleDelete = async (permission: Permission) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除权限 ${permission.permissionName} 吗？此操作不可恢复！`,
            '警告',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'error'
            }
        )
        
        const res = await deletePermissionApi(permission.permissionId) as any
        if (res.code === 200) {
            ElMessage.success('删除成功')
            fetchPermissionList()
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

// 筛选
const filterPermissions = () => {
    // 触发计算属性更新
}

// 辅助函数
const getResourceTypeText = (type: string) => {
    const map: Record<string, string> = {
        'menu': '菜单',
        'button': '按钮',
        'api': 'API'
    }
    return map[type] || type
}

const getResourceTypeTagType = (type: string) => {
    const map: Record<string, string> = {
        'menu': 'primary',
        'button': 'warning',
        'api': 'success'
    }
    return map[type] || 'info'
}

onMounted(() => {
    fetchPermissionList()
})
</script>
