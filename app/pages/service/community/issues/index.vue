<template>
    <div class="min-h-screen bg-[#f5f7fa] dark:bg-black pb-12 transition-colors duration-300">
        <!-- Header / Top Bar -->
        <div
            class="pt-4 pb-4 mb-6 bg-white dark:bg-black border-b border-slate-100 dark:border-slate-800 shadow-sm sticky top-10 z-10">
            <div class="max-w-[1300px] mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div>
                        <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">物业服务中心</h1>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Tabs -->
                    <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded">
                        <button @click="activeTab = 'repair'"
                            class="px-4 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2"
                            :class="activeTab === 'repair' ? 'bg-white dark:bg-slate-700 text-[#ff5000] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                            <Icon name="lucide:wrench" size="14" />
                            报事维修
                        </button>
                        <button @click="activeTab = 'complaint'"
                            class="px-4 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-2"
                            :class="activeTab === 'complaint' ? 'bg-white dark:bg-slate-700 text-[#ff5000] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                            <Icon name="lucide:message-square-warning" size="14" />
                            事项投诉
                        </button>
                    </div>

                    <button @click="openCreateModal"
                        class="bg-[#ff5000] hover:bg-[#ff3d00] text-white px-4 h-10 rounded shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium">
                        <Icon name="lucide:plus-square" size="14" />
                    </button>
                </div>
            </div>
        </div>

        <div class="max-w-[1000px] mx-auto px-4 mt-8">

            <!-- Repair List -->
            <div v-if="activeTab === 'repair'" class="space-y-4">
                <div v-if="repairLoading && repairList.length === 0" class="grid gap-4">
                    <div v-for="i in 3" :key="i"
                        class="bg-white dark:bg-slate-800 p-6 rounded animate-pulse h-32 border border-slate-100 dark:border-slate-700">
                    </div>
                </div>

                <div v-else-if="repairList.length > 0" class="grid grid-cols-1 gap-4">
                    <div v-for="item in repairList" :key="item.reportId"
                        class="bg-white dark:bg-slate-800 rounded shadow-sm hover:shadow transition-all border-y border-r border-slate-100 dark:border-y-slate-700 dark:border-r-slate-700 p-5 group flex flex-col md:flex-row gap-2">

                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="bg-[#ff5000]/10 text-[#ff5000] text-[10px] px-1.5 py-0.5 rounded font-bold border border-[#ff5000]/20">报修</span>
                                    <h3
                                        class="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-1 group-hover:text-[#ff5000] transition-colors">
                                        {{ item.reportType }}</h3>
                                </div>
                            </div>
                            <p
                                class="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2 bg-slate-50 dark:bg-black/50 p-2 rounded border border-slate-100 dark:border-slate-700/50">
                                {{ item.description }}
                            </p>
                            <div class="flex items-center gap-4 text-xs text-slate-400">
                                <span class="flex items-center gap-1">
                                    <Icon name="lucide:hash" size="12" /> {{ item.location }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <Icon name="lucide:clock" size="12" /> {{ item.createTime }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:pl-4 min-w-[100px]">
                            <div class="px-3 py-1 rounded text-xs font-bold border flex items-center gap-1"
                                :class="getStatusClass(Number(item.status))">
                                <Icon v-if="Number(item.status) === 2" name="lucide:check-circle-2" size="12" />
                                <Icon v-else-if="Number(item.status) === 1" name="lucide:loader-2" size="12" />
                                <Icon v-else name="lucide:hourglass" size="12" />
                                {{ item.statusText }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else
                    class="py-20 text-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                    <div
                        class="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-500 border border-slate-100 dark:border-slate-600">
                        <Icon name="lucide:clipboard-x" size="32" />
                    </div>
                    <p class="text-slate-400 text-sm">暂无报修记录</p>
                </div>

                <!-- Pagination -->
                <div class="flex justify-center mt-6">
                    <el-pagination v-if="repairTotal > 0" background layout="prev, pager, next" :total="repairTotal"
                        :page-size="repairPagination.pageSize" :current-page="repairPagination.pageNum"
                        @current-change="handleRepairPageChange" class="custom-pagination" />
                </div>
            </div>








            <!-- Complaint List -->
            <div v-else class="space-y-4">
                <div v-if="complaintLoading && complaintList.length === 0" class="grid gap-4">
                    <div v-for="i in 3" :key="i"
                        class="bg-white dark:bg-slate-800 p-6 rounded animate-pulse h-32 border border-slate-100 dark:border-slate-700">
                    </div>
                </div>

                <div v-else-if="complaintList.length > 0" class="grid grid-cols-1 gap-4">
                    <div v-for="item in complaintList" :key="item.id"
                        class="bg-white dark:bg-slate-800 rounded shadow-sm hover:shadow transition-all border-y border-r border-slate-100 dark:border-y-slate-700 dark:border-r-slate-700 p-5 group flex flex-col md:flex-row gap-2">

                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="bg-red-50 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/40">投诉</span>
                                    <h3
                                        class="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-1 group-hover:text-[#ff5000] transition-colors">
                                        {{ item.complaintType }}</h3>
                                </div>
                            </div>
                            <p
                                class="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2 bg-slate-50 dark:bg-black/50 p-2 rounded border border-slate-100 dark:border-slate-700/50">
                                {{ item.description }}
                            </p>
                            <div class="flex items-center gap-4 text-xs text-slate-400">

                                <span class="flex items-center gap-1">
                                    <Icon name="lucide:hash" size="12" /> {{ item.location }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <Icon name="lucide:clock" size="12" /> {{ item.createTime }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:pl-4 min-w-[100px]">
                            <div class="px-3 py-1 rounded text-xs font-bold border flex items-center gap-1"
                                :class="getStatusClass(Number(item.status))">
                                <Icon v-if="Number(item.status) === 2" name="lucide:check-circle-2" size="12" />
                                <Icon v-else-if="Number(item.status) === 1" name="lucide:loader-2" size="12" />
                                <Icon v-else name="lucide:hourglass" size="12" />
                                {{ item.statusText }}
                            </div>
                            <button
                                class="text-slate-400 hover:text-[#ff5000] transition-colors text-xs flex items-center gap-1">
                                查看详情
                                <Icon name="lucide:chevron-right" size="12" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else
                    class="py-20 text-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                    <div
                        class="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-500 border border-slate-100 dark:border-slate-600">
                        <Icon name="lucide:inbox" size="32" />
                    </div>
                    <p class="text-slate-400 text-sm">暂无投诉记录</p>
                </div>

                <!-- Pagination -->
                <div class="flex justify-center mt-6">
                    <el-pagination v-if="complaintTotal > 0" background layout="prev, pager, next"
                        :total="complaintTotal" :page-size="complaintPagination.pageSize"
                        :current-page="complaintPagination.pageNum" @current-change="handleComplaintPageChange"
                        class="custom-pagination" />
                </div>
            </div>
        </div>

        <!-- Create Modal -->
        <el-dialog v-model="modalVisible" :title="activeTab === 'repair' ? '提交报事维修' : '发起事项投诉'" width="600px"
            :close-on-click-modal="false" class="custom-dialog">
            <el-form label-position="top" :model="form" :rules="rules" ref="formRef">
                <el-form-item :label="activeTab === 'repair' ? '报修类型' : '投诉类型'" prop="type">
                    <el-radio-group v-model="form.type">
                        <template v-if="activeTab === 'repair'">
                            <el-radio label="水电维修">水电维修</el-radio>
                            <el-radio label="电梯故障">电梯故障</el-radio>
                            <el-radio label="门窗维修">门窗维修</el-radio>
                            <el-radio label="网络故障">网络故障</el-radio>
                            <el-radio label="供暖问题">供暖问题</el-radio>
                            <el-radio label="环境卫生">环境卫生</el-radio>
                            <el-radio label="其他">其他</el-radio>
                        </template>
                        <template v-else>
                            <el-radio label="噪音扰民">噪音扰民</el-radio>
                            <el-radio label="违规停车">违规停车</el-radio>
                            <el-radio label="垃圾处理">垃圾处理</el-radio>
                            <el-radio label="物业服务">物业服务</el-radio>
                            <el-radio label="安全问题">安全问题</el-radio>
                            <el-radio label="设施损坏">设施损坏</el-radio>
                            <el-radio label="其他">其他</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="activeTab === 'repair' ? '所在位置/房号' : '发生地点'" prop="location">
                    <el-input v-model="form.location" :placeholder="activeTab === 'repair' ? '请输入维修位置' : '请输入事件发生地点'" />
                </el-form-item>

                <el-form-item :label="activeTab === 'repair' ? '事项描述' : '投诉描述'" prop="description">
                    <el-input v-model="form.description" type="textarea" rows="5"
                        :placeholder="activeTab === 'repair' ? '请详细描述问题的具体情况' : '请详细描述投诉内容和诉求'" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="modalVisible = false">取消</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
                        {{ activeTab === 'repair' ? '提交报修' : '提交投诉' }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
// Removed as phone is no longer in the form

useHead({
    title: '物业服务 - 智慧社区'
})

const {
    repairList, repairTotal, repairLoading, repairPagination, fetchRepairList, createRepair, handleRepairPageChange,
    complaintList, complaintTotal, complaintLoading, complaintPagination, fetchComplaintList, createComplaint, handleComplaintPageChange
} = useCommunityIssues()

const activeTab = ref<'repair' | 'complaint'>('repair')

// Sync data fetch on tab change
watch(activeTab, (newVal) => {
    if (newVal === 'repair') {
        if (repairList.value.length === 0) fetchRepairList()
    } else {
        if (complaintList.value.length === 0) fetchComplaintList()
    }
}, { immediate: true })

// Modal
const modalVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()

const form = reactive({
    type: '',
    location: '',
    description: ''
})

const rules = {
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    location: [{ required: true, message: '请输入所在位置/地址', trigger: 'blur' }],
    description: [{ required: true, message: '请输入详细描述', trigger: 'blur' }]
}

const openCreateModal = () => {
    form.type = ''
    form.location = ''
    form.description = ''
    modalVisible.value = true
}

const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            submitLoading.value = true
            let success = false

            const payload = {
                location: form.location,
                description: form.description,
                [activeTab.value === 'repair' ? 'reportType' : 'complaintType']: form.type
            }

            if (activeTab.value === 'repair') {
                success = await createRepair(payload)
            } else {
                success = await createComplaint(payload)
            }

            submitLoading.value = false

            if (success) {
                modalVisible.value = false
            }
        }
    })
}

const getStatusClass = (status: number | string) => {
    // 假设: 0-待处理, 1-处理中, 2-已完成, 3-已驳回
    // Ensure we compare as numbers if possible or loose equality
    const s = Number(status)
    switch (s) {
        case 0: return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
        case 1: return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
        case 2: return 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        case 3: return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}
</script>

<style scoped>
:deep(.custom-pagination .el-pager li.is-active) {
    background-color: #ff5000 !important;
}

:deep(.custom-pagination .el-pager li:hover) {
    color: #ff5000 !important;
}

:deep(.el-button--primary) {
    background-color: #ff5000;
    border-color: #ff5000;
}

:deep(.el-button--primary:hover) {
    background-color: #ff3d00;
    border-color: #ff3d00;
}
</style>
