<template>
    <div class="p-6 space-y-6">
        <!-- 页面头部 -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">商品基础管理</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">管理商品基础信息，创建商品后可在门店商品管理中分配到各门店</p>
            </div>
            <el-button type="primary" @click="handleCreate">
                <Icon name="lucide:plus" size="16" class="mr-1" />
                添加商品
            </el-button>
        </div>

        <!-- 提示信息 -->
        <el-alert type="info" :closable="false" show-icon>
            <template #title>
                <div class="flex items-center gap-2">
                    <span class="text-sm">商品库存说明：列表中显示的"门店总库存"是该商品在所有门店的库存总和。创建商品后，请前往</span>
                    <el-button type="primary" link size="small" @click="$router.push('/superCommunity/mall/product')">
                        门店商品管理
                    </el-button>
                    <span class="text-sm">为各门店分配库存。</span>
                </div>
            </template>
        </el-alert>

        <!-- 搜索筛选区域 -->
        <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm">
            <el-form :model="queryForm" inline class="flex flex-wrap gap-4">
                <el-form-item label="商品分类" class="!mb-0">
                    <el-select
                        v-model="queryForm.categoryId"
                        placeholder="全部分类"
                        clearable
                        style="width: 180px;"
                    >
                        <el-option label="全部分类" :value="undefined" />
                        <el-option
                            v-for="category in categories"
                            :key="category.categoryId"
                            :label="category.categoryName"
                            :value="category.categoryId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词" class="!mb-0">
                    <el-input
                        v-model="queryForm.keyword"
                        placeholder="搜索商品名称"
                        clearable
                        style="width: 220px;"
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

        <!-- 商品列表 -->
        <div class="bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
            <el-table
                :data="productList"
                v-loading="loading"
                style="width: 100%"
            >
                <el-table-column prop="productId" label="ID" width="80" align="center" />
                <el-table-column label="商品信息" min-width="300">
                    <template #default="{ row }">
                        <div class="flex items-center gap-3 py-2">
                            <el-image
                                :src="row.coverImg"
                                fit="cover"
                                class="w-16 h-16 rounded"
                            >
                                <template #error>
                                    <div class="w-16 h-16 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded">
                                        <Icon name="lucide:image-off" size="24" class="text-slate-400" />
                                    </div>
                                </template>
                            </el-image>
                            <div class="flex flex-col">
                                <span class="font-medium text-slate-800 dark:text-white">{{ row.productName }}</span>
                                <span class="text-xs text-slate-500 line-clamp-1">{{ row.description || '暂无描述' }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="分类" width="120">
                    <template #default="{ row }">
                        <el-tag type="info" size="small">{{ row.categoryName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="价格" width="150">
                    <template #default="{ row }">
                        <div class="flex flex-col">
                            <span class="text-red-600 font-medium">¥{{ row.price }}</span>
                            <span v-if="row.originalPrice" class="text-xs text-slate-400 line-through">¥{{ row.originalPrice }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="门店总库存" width="120" align="center">
                    <template #default="{ row }">
                        <div class="flex flex-col items-center">
                            <span :class="{
                                'text-red-600 font-medium': (row.totalStoreStock || 0) === 0,
                                'text-orange-600 font-medium': (row.totalStoreStock || 0) > 0 && (row.totalStoreStock || 0) < 10
                            }">
                                {{ row.totalStoreStock !== undefined ? row.totalStoreStock : '计算中...' }}
                            </span>
                            <span class="text-xs text-slate-400">各门店库存和</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'ON_SALE' ? 'success' : 'danger'" size="small">
                            {{ row.status === 'ON_SALE' ? '上架' : '下架' }}
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
                                @click="handleEdit(row)"
                            >
                                <Icon name="lucide:edit" size="14" class="mr-1" />
                                编辑
                            </el-button>
                            <el-button
                                :type="row.status === 'ON_SALE' ? 'warning' : 'success'"
                                size="small"
                                @click="handleToggleStatus(row)"
                            >
                                {{ row.status === 'ON_SALE' ? '下架' : '上架' }}
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
                    @size-change="fetchProductList"
                    @current-change="fetchProductList"
                />
            </div>
        </div>

        <!-- 创建/编辑商品弹窗 -->
        <el-dialog
            v-model="formDialogVisible"
            :title="formTitle"
            width="800px"
            :close-on-click-modal="false"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="商品名称" prop="productName">
                    <el-input
                        v-model="formData.productName"
                        placeholder="请输入商品名称"
                        maxlength="100"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="商品分类" prop="categoryId">
                    <el-select
                        v-model="formData.categoryId"
                        placeholder="请选择商品分类"
                        style="width: 100%;"
                    >
                        <el-option
                            v-for="category in categories"
                            :key="category.categoryId"
                            :label="category.categoryName"
                            :value="category.categoryId"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input-number
                        v-model="formData.price"
                        :min="0"
                        :precision="2"
                        :step="0.1"
                        controls-position="right"
                        style="width: 200px;"
                    />
                    <span class="ml-2 text-sm text-slate-500">元</span>
                </el-form-item>
                <el-form-item label="原价" prop="originalPrice">
                    <el-input-number
                        v-model="formData.originalPrice"
                        :min="0"
                        :precision="2"
                        :step="0.1"
                        controls-position="right"
                        style="width: 200px;"
                    />
                    <span class="ml-2 text-sm text-slate-500">元（可选）</span>
                </el-form-item>
                <el-form-item label="初始库存" prop="stock">
                    <el-input-number
                        v-model="formData.stock"
                        :min="0"
                        :step="1"
                        controls-position="right"
                        style="width: 200px;"
                    />
                    <span class="ml-2 text-sm text-slate-500">件（此值仅作记录，实际库存以门店商品管理中的各门店库存总和为准）</span>
                </el-form-item>
                <el-form-item label="商品封面" prop="coverImg">
                    <div class="w-full space-y-3">
                        <div v-if="formData.coverImg" class="flex items-center gap-4">
                            <el-image
                                :src="formData.coverImg"
                                fit="cover"
                                class="w-32 h-32 rounded"
                            />
                            <el-button type="danger" size="small" @click="formData.coverImg = ''">
                                <Icon name="lucide:trash-2" size="14" class="mr-1" />
                                删除封面
                            </el-button>
                        </div>
                        <el-upload
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleCoverChange"
                            accept="image/*"
                        >
                            <el-button type="primary">
                                <Icon name="lucide:upload" size="14" class="mr-1" />
                                {{ formData.coverImg ? '更换封面' : '上传封面' }}
                            </el-button>
                        </el-upload>
                        <div class="text-xs text-slate-500">
                            建议尺寸 800x800,支持 jpg、png、webp 格式,大小不超过 10MB
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="商品描述" prop="description">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入商品描述"
                        maxlength="500"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="商品状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio label="ON_SALE">
                            <Icon name="lucide:check-circle" size="14" class="mr-1 text-green-500" />
                            上架
                        </el-radio>
                        <el-radio label="OFF_SALE">
                            <Icon name="lucide:x-circle" size="14" class="mr-1 text-red-500" />
                            下架
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
                        <span>图片上传中...</span>
                    </div>
                    <div v-else></div>
                    <div class="flex gap-2">
                        <el-button @click="formDialogVisible = false">取消</el-button>
                        <el-button type="primary" :loading="submitting" :disabled="uploading" @click="handleSubmit">
                            {{ formData.productId ? '更新' : '创建' }}
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
    queryAdminProductsApi,
    saveProductApi,
    getProductCategoriesApi,
    uploadImageApi,
    queryStoreProductsApi
} from '~/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

interface Product {
    productId: number
    productName: string
    categoryId: number
    categoryName: string
    description: string
    price: number
    originalPrice: number
    stock: number
    coverImg: string
    detailImgs: string[]
    status: string
    createTime: string
    updateTime: string
    totalStoreStock?: number // 各门店库存总和
}

interface Category {
    categoryId: number
    categoryName: string
}

// 查询表单
const queryForm = reactive({
    categoryId: undefined as number | undefined,
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
const productList = ref<Product[]>([])
const categories = ref<Category[]>([])

// 表单弹窗
const formDialogVisible = ref(false)
const submitting = ref(false)
const uploading = ref(false)
const formRef = ref<FormInstance>()
const formTitle = computed(() => formData.productId ? '编辑商品' : '添加商品')

const formData = reactive({
    productId: 0,
    productName: '',
    categoryId: 0,
    price: 0,
    originalPrice: 0,
    stock: 0,
    coverImg: '',
    description: '',
    status: 'ON_SALE'
})

const formRules: FormRules = {
    productName: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择商品分类', trigger: 'change' }
    ],
    price: [
        { required: true, message: '请输入商品价格', trigger: 'blur' }
    ],
    stock: [
        { required: true, message: '请输入库存数量', trigger: 'blur' }
    ],
    coverImg: [
        { required: true, message: '请上传商品封面', trigger: 'change' }
    ]
}

// 获取商品分类列表
const fetchCategories = async () => {
    try {
        const response = await getProductCategoriesApi()
        if (response && response.list) {
            categories.value = response.list || []
        }
    } catch (error) {
        console.error('获取分类列表失败:', error)
    }
}

// 获取商品列表
const fetchProductList = async () => {
    loading.value = true
    try {
        queryForm.pageNum = pagination.current
        queryForm.pageSize = pagination.size

        const response = await queryAdminProductsApi({
            ...queryForm,
            categoryId: queryForm.categoryId || undefined
        })

        if (response && response.list) {
            productList.value = response.list || []
            pagination.total = response.total || 0
            
            // 获取各商品的门店库存总和
            fetchStoreStockForProducts()
        } else {
            ElMessage.error('获取商品列表失败')
        }
    } catch (error) {
        console.error('获取商品列表失败:', error)
        ElMessage.error('获取商品列表失败')
    } finally {
        loading.value = false
    }
}

// 获取各商品的门店库存总和
const fetchStoreStockForProducts = async () => {
    try {
        // 获取所有门店商品（不分页，获取全部）
        const response = await queryStoreProductsApi({
            pageNum: 1,
            pageSize: 10000 // 获取所有门店商品
        })

        if (response.code === 200 && response.data?.records) {
            const storeProducts = response.data.records
            
            // 按商品ID分组，计算各商品的门店库存总和
            const stockMap = new Map<number, number>()
            storeProducts.forEach((sp: any) => {
                const currentStock = stockMap.get(sp.productId) || 0
                stockMap.set(sp.productId, currentStock + (sp.stock || 0))
            })
            
            // 更新商品列表中的门店总库存
            productList.value = productList.value.map(product => ({
                ...product,
                totalStoreStock: stockMap.get(product.productId) || 0
            }))
        }
    } catch (error) {
        console.error('获取门店库存失败:', error)
        // 不显示错误提示，静默失败
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchProductList()
}

// 重置
const handleReset = () => {
    queryForm.categoryId = undefined
    queryForm.keyword = ''
    pagination.current = 1
    fetchProductList()
}

// 处理封面上传
const handleCoverChange = async (file: any) => {
    const rawFile = file.raw
    if (!rawFile) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(rawFile.type)) {
        ElMessage.error('只支持 jpg、png、webp 格式的图片')
        return
    }

    if (rawFile.size > 10 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过 10MB')
        return
    }

    uploading.value = true
    try {
        const response = await uploadImageApi(rawFile)
        if (response.url) {
            formData.coverImg = response.url
            ElMessage.success('封面上传成功')
        } else if (response.data?.url) {
            formData.coverImg = response.data.url
            ElMessage.success('封面上传成功')
        } else {
            ElMessage.error('封面上传失败')
        }
    } catch (error: any) {
        console.error('封面上传失败:', error)
        ElMessage.error(error?.data?.message || '封面上传失败')
    } finally {
        uploading.value = false
    }
}

// 添加商品
const handleCreate = () => {
    formData.productId = 0
    formData.productName = ''
    formData.categoryId = 0
    formData.price = 0
    formData.originalPrice = 0
    formData.stock = 0
    formData.coverImg = ''
    formData.description = ''
    formData.status = 'ON_SALE'
    formDialogVisible.value = true
}

// 编辑商品
const handleEdit = (product: Product) => {
    formData.productId = product.productId
    formData.productName = product.productName
    formData.categoryId = product.categoryId
    formData.price = product.price
    formData.originalPrice = product.originalPrice
    formData.stock = product.stock
    formData.coverImg = product.coverImg
    formData.description = product.description
    formData.status = product.status
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
                productId: formData.productId || undefined,
                productName: formData.productName,
                categoryId: formData.categoryId,
                price: formData.price,
                originalPrice: formData.originalPrice || undefined,
                stock: formData.stock,
                coverImg: formData.coverImg,
                description: formData.description || undefined,
                status: formData.status
            }

            await saveProductApi(data)
            ElMessage.success(formData.productId ? '更新成功' : '创建成功')
            formDialogVisible.value = false
            fetchProductList()
        } catch (error: any) {
            console.error('操作失败:', error)
            ElMessage.error(error?.data?.message || '操作失败')
        } finally {
            submitting.value = false
        }
    })
}

// 切换上架/下架状态
const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === 'ON_SALE' ? 'OFF_SALE' : 'ON_SALE'
    const action = newStatus === 'ON_SALE' ? '上架' : '下架'

    try {
        await ElMessageBox.confirm(
            `确定要${action}商品"${product.productName}"吗？`,
            '确认操作',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const data = {
            productId: product.productId,
            productName: product.productName,
            categoryId: product.categoryId,
            price: product.price,
            originalPrice: product.originalPrice,
            stock: product.stock,
            coverImg: product.coverImg,
            description: product.description,
            status: newStatus
        }

        await saveProductApi(data)
        ElMessage.success(`${action}成功`)
        fetchProductList()
    } catch (error: any) {
        if (error !== 'cancel') {
            console.error('操作失败:', error)
            ElMessage.error(error?.data?.message || '操作失败')
        }
    }
}

// 页面加载
onMounted(() => {
    fetchCategories()
    fetchProductList()
})
</script>

