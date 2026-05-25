<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">门店商品管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理各门店的商品库存和上下架状态</p>
            </div>
            <el-button type="primary" @click="handleAdd">
                <Icon name="lucide:plus" size="16" class="mr-1" />
                添加门店商品
            </el-button>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">门店商品总数</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.totalCount }}</p>
                    </div>
                    <Icon name="lucide:package" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">上架商品</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.onlineCount }}</p>
                    </div>
                    <Icon name="lucide:check-circle" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-red-500 to-red-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">下架商品</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.offlineCount }}</p>
                    </div>
                    <Icon name="lucide:x-circle" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">库存不足</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.lowStockCount }}</p>
                    </div>
                    <Icon name="lucide:alert-triangle" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">零库存</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.zeroStockCount }}</p>
                    </div>
                    <Icon name="lucide:package-x" size="32" class="opacity-80" />
                </div>
            </div>
            <div class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded p-5 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm opacity-90">总库存</p>
                        <p class="text-2xl font-bold mt-1">{{ statistics.totalStock }}</p>
                    </div>
                    <Icon name="lucide:warehouse" size="32" class="opacity-80" />
                </div>
            </div>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="门店" class="!mb-0">
                    <el-select
                        v-model="queryForm.storeId"
                        placeholder="全部门店"
                        clearable
                        filterable
                        style="width: 200px;"
                    >
                        <el-option label="全部门店" :value="undefined" />
                        <el-option
                            v-for="store in stores"
                            :key="store.storeId"
                            :label="store.storeName"
                            :value="store.storeId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品" class="!mb-0">
                    <el-select
                        v-model="queryForm.productId"
                        placeholder="全部商品"
                        clearable
                        filterable
                        style="width: 200px;"
                    >
                        <el-option label="全部商品" :value="undefined" />
                        <el-option
                            v-for="product in products"
                            :key="product.productId"
                            :label="product.productName"
                            :value="product.productId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" class="!mb-0">
                    <el-select
                        v-model="queryForm.status"
                        placeholder="全部状态"
                        clearable
                        style="width: 150px;"
                    >
                        <el-option label="全部状态" :value="undefined" />
                        <el-option label="上架" :value="1" />
                        <el-option label="下架" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" class="!mb-0">
                    <el-input
                        v-model="queryForm.productName"
                        placeholder="搜索商品名称"
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

        <!-- 门店商品列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <!-- 操作栏 -->
            <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <el-button
                        type="success"
                        size="small"
                        :disabled="selectedIds.length === 0"
                        @click="handleBatchUpdateStatus(1)"
                    >
                        <Icon name="lucide:check-circle" size="14" class="mr-1" />
                        批量上架
                    </el-button>
                    <el-button
                        type="warning"
                        size="small"
                        :disabled="selectedIds.length === 0"
                        @click="handleBatchUpdateStatus(0)"
                    >
                        <Icon name="lucide:x-circle" size="14" class="mr-1" />
                        批量下架
                    </el-button>
                    <el-button
                        type="danger"
                        size="small"
                        :disabled="selectedIds.length === 0"
                        @click="handleBatchDelete"
                    >
                        <Icon name="lucide:trash-2" size="14" class="mr-1" />
                        批量删除
                    </el-button>
                </div>
                <div class="text-sm text-slate-500">
                    已选择 <span class="text-blue-600 font-medium">{{ selectedIds.length }}</span> 项
                </div>
            </div>

            <el-table
                :data="storeProductList"
                v-loading="loading"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column label="商品信息" min-width="250">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 py-2">
                            <el-image
                                :src="row.productCoverImg"
                                fit="cover"
                                class="w-14 h-14 rounded"
                            >
                                <template #error>
                                    <div class="w-14 h-14 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                                        <Icon name="lucide:image-off" size="20" class="text-slate-400" />
                                    </div>
                                </template>
                            </el-image>
                            <div class="flex flex-col">
                                <span class="font-medium text-slate-800 dark:text-white">{{ row.productName }}</span>
                                <span class="text-xs text-red-600">¥{{ row.productPrice }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="门店信息" min-width="200">
                    <template #default="{ row }">
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                                <Icon name="lucide:store" size="14" class="text-slate-400" />
                                <span class="font-medium">{{ row.storeName }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-500">
                                <Icon name="lucide:map-pin" size="12" />
                                <span class="line-clamp-1">{{ row.storeAddress }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="门店状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.storeStatus === 1 ? 'success' : 'danger'" size="small">
                            {{ row.storeStatus === 1 ? '营业中' : '已关闭' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="库存" width="100" align="center">
                    <template #default="{ row }">
                        <span :class="{
                            'text-red-600 font-medium': row.stock === 0,
                            'text-orange-600 font-medium': row.stock > 0 && row.stock < 10
                        }">
                            {{ row.stock }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="商品状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 1 ? '上架' : '下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <div class="flex items-center gap-2">
                            <el-button
                                type="primary"
                                size="small"
                                @click="handleEdit(row)"
                            >
                                <Icon name="lucide:edit" size="14" class="mr-1" />
                                编辑
                            </el-button>
                            <el-button
                                :type="row.status === 1 ? 'warning' : 'success'"
                                size="small"
                                @click="handleToggleStatus(row)"
                            >
                                {{ row.status === 1 ? '下架' : '上架' }}
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
                    @size-change="fetchStoreProductList"
                    @current-change="fetchStoreProductList"
                />
            </div>
        </div>

        <!-- 添加/编辑门店商品弹窗 -->
        <el-dialog
            v-model="formDialogVisible"
            :title="formTitle"
            width="600px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="门店" prop="storeId">
                    <el-select
                        v-model="formData.storeId"
                        placeholder="请选择门店"
                        filterable
                        style="width: 100%;"
                        :disabled="!!formData.id"
                    >
                        <el-option
                            v-for="store in stores"
                            :key="store.storeId"
                            :label="`${store.storeName} - ${store.address}`"
                            :value="store.storeId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品" prop="productId">
                    <el-select
                        v-model="formData.productId"
                        placeholder="请选择商品"
                        filterable
                        style="width: 100%;"
                        :disabled="!!formData.id"
                    >
                        <el-option
                            v-for="product in products"
                            :key="product.productId"
                            :label="`${product.productName} - ¥${product.price}`"
                            :value="product.productId"
                        >
                            <div class="flex items-center justify-between">
                                <span>{{ product.productName }}</span>
                                <span class="text-red-600">¥{{ product.price }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库存数量" prop="stock">
                    <el-input-number
                        v-model="formData.stock"
                        :min="0"
                        :step="1"
                        controls-position="right"
                        style="width: 200px;"
                    />
                    <span class="ml-2 text-sm text-slate-500">件</span>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">
                            <Icon name="lucide:check-circle" size="14" class="mr-1 text-green-500" />
                            上架
                        </el-radio>
                        <el-radio :label="0">
                            <Icon name="lucide:x-circle" size="14" class="mr-1 text-red-500" />
                            下架
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex gap-2 justify-end">
                    <el-button @click="formDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmit">
                        {{ formData.id ? '更新' : '添加' }}
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
    queryStoreProductsApi,
    getStoreProductStatisticsApi,
    addStoreProductApi,
    updateStoreProductApi,
    deleteStoreProductApi,
    batchDeleteStoreProductsApi,
    batchUpdateStoreProductStatusApi,
    queryAdminStoresApi,
    queryAdminProductsApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface StoreProduct {
    id: number
    storeId: number
    storeName: string
    storeAddress: string
    storeContactPhone: string
    storeStatus: number
    productId: number
    productName: string
    productPrice: string
    productCoverImg: string
    productStatus: number
    stock: number
    status: number
    createTime: string
    updateTime: string
}

interface Store {
    storeId: number
    storeName: string
    address: string
    businessHours: string
    contactPhone: string
    status: number
}

interface Product {
    productId: number
    productName: string
    price: number
    coverImg: string
}

interface Statistics {
    totalCount: number
    onlineCount: number
    offlineCount: number
    lowStockCount: number
    zeroStockCount: number
    totalStock: number
}

// 统计数据
const statistics = reactive<Statistics>({
    totalCount: 0,
    onlineCount: 0,
    offlineCount: 0,
    lowStockCount: 0,
    zeroStockCount: 0,
    totalStock: 0
})

// 查询表单
const queryForm = reactive({
    storeId: undefined as number | undefined,
    productId: undefined as number | undefined,
    productName: '',
    storeName: '',
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
const storeProductList = ref<StoreProduct[]>([])
const stores = ref<Store[]>([])
const products = ref<Product[]>([])
const selectedIds = ref<number[]>([])

// 表单弹窗
const formDialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const formTitle = computed(() => formData.id ? '编辑门店商品' : '添加门店商品')

const formData = reactive({
    id: 0,
    storeId: 0,
    productId: 0,
    stock: 0,
    status: 1
})

const formRules: FormRules = {
    storeId: [
        { required: true, message: '请选择门店', trigger: 'change' }
    ],
    productId: [
        { required: true, message: '请选择商品', trigger: 'change' }
    ],
    stock: [
        { required: true, message: '请输入库存数量', trigger: 'blur' }
    ]
}

// 获取统计数据
const fetchStatistics = async () => {
    try {
        const response = await getStoreProductStatisticsApi()
        if (response.code === 200 && response.data) {
            Object.assign(statistics, response.data)
        }
    } catch (error) {
        console.error('获取统计数据失败:', error)
    }
}

// 获取门店列表
const fetchStores = async () => {
    try {
        const response = await queryAdminStoresApi({
            pageNum: 1,
            pageSize: 1000,
            status: 1 // 只获取营业中的门店
        })
        if (response.code === 200 && response.data?.list) {
            stores.value = response.data.list
        }
    } catch (error) {
        console.error('获取门店列表失败:', error)
    }
}

// 获取商品列表
const fetchProducts = async () => {
    try {
        const response = await queryAdminProductsApi({
            pageNum: 1,
            pageSize: 1000
        })
        if (response && response.list) {
            products.value = response.list
        }
    } catch (error) {
        console.error('获取商品列表失败:', error)
    }
}

// 获取门店商品列表
const fetchStoreProductList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryStoreProductsApi({
            ...queryForm,
            storeId: queryForm.storeId || undefined,
            productId: queryForm.productId || undefined,
            status: queryForm.status !== undefined ? queryForm.status : undefined
        })

        if (response.code === 200 && response.data) {
            storeProductList.value = response.data.records || []
            pagination.total = response.data.total || 0
        } else {
            ElMessage.error(response.message || '获取门店商品列表失败')
        }
    } catch (error) {
        console.error('获取门店商品列表失败:', error)
        ElMessage.error('获取门店商品列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchStoreProductList()
}

// 重置
const handleReset = () => {
    queryForm.storeId = undefined
    queryForm.productId = undefined
    queryForm.productName = ''
    queryForm.storeName = ''
    queryForm.status = undefined
    pagination.current = 1
    fetchStoreProductList()
}

// 选择变化
const handleSelectionChange = (selection: StoreProduct[]) => {
    selectedIds.value = selection.map(item => item.id)
}

// 添加门店商品
const handleAdd = () => {
    formData.id = 0
    formData.storeId = 0
    formData.productId = 0
    formData.stock = 0
    formData.status = 1
    formDialogVisible.value = true
}

// 编辑门店商品
const handleEdit = (row: StoreProduct) => {
    formData.id = row.id
    formData.storeId = row.storeId
    formData.productId = row.productId
    formData.stock = row.stock
    formData.status = row.status
    formDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            if (formData.id) {
                // 更新
                await updateStoreProductApi({
                    id: formData.id,
                    stock: formData.stock,
                    status: formData.status
                })
                ElMessage.success('更新成功')
            } else {
                // 添加
                await addStoreProductApi({
                    storeId: formData.storeId,
                    productId: formData.productId,
                    stock: formData.stock,
                    status: formData.status
                })
                ElMessage.success('添加成功')
            }
            formDialogVisible.value = false
            fetchStoreProductList()
            fetchStatistics()
        } catch (error: any) {
            console.error('操作失败:', error)
            ElMessage.error(error?.data?.message || '操作失败')
        } finally {
            submitting.value = false
        }
    })
}

// 切换上架/下架状态
const handleToggleStatus = async (row: StoreProduct) => {
    const newStatus = row.status === 1 ? 0 : 1
    const action = newStatus === 1 ? '上架' : '下架'

    try {
        await ElMessageBox.confirm(
            `确定要${action}该门店商品吗？`,
            '确认操作',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await updateStoreProductApi({
            id: row.id,
            status: newStatus
        })
        ElMessage.success(`${action}成功`)
        fetchStoreProductList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('操作失败:', error)
            ElMessage.error(error?.data?.message || '操作失败')
        }
    }
}

// 删除门店商品
const handleDelete = async (row: StoreProduct) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除门店"${row.storeName}"的商品"${row.productName}"吗？`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await deleteStoreProductApi(row.id)
        ElMessage.success('删除成功')
        fetchStoreProductList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error(error?.data?.message || '删除失败')
        }
    }
}

// 批量更新状态
const handleBatchUpdateStatus = async (status: number) => {
    const action = status === 1 ? '上架' : '下架'
    try {
        await ElMessageBox.confirm(
            `确定要批量${action}选中的 ${selectedIds.value.length} 个门店商品吗？`,
            '确认操作',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await batchUpdateStoreProductStatusApi(selectedIds.value, status)
        ElMessage.success(`批量${action}成功`)
        fetchStoreProductList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('操作失败:', error)
            ElMessage.error(error?.data?.message || '操作失败')
        }
    }
}

// 批量删除
const handleBatchDelete = async () => {
    try {
        await ElMessageBox.confirm(
            `确定要删除选中的 ${selectedIds.value.length} 个门店商品吗？`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await batchDeleteStoreProductsApi(selectedIds.value)
        ElMessage.success('批量删除成功')
        fetchStoreProductList()
        fetchStatistics()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('删除失败:', error)
            ElMessage.error(error?.data?.message || '删除失败')
        }
    }
}

// 页面加载
onMounted(() => {
    fetchStatistics()
    fetchStores()
    fetchProducts()
    fetchStoreProductList()
})
</script>
