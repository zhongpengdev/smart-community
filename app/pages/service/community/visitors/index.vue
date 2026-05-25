<template>
    <div class="min-h-screen bg-[#f5f7fa] dark:bg-slate-900 pb-12">
        <!-- Header -->
        <TopBar @create="openCreateModal" />

        <div class="max-w-[1300px] mx-auto px-4">
            <!-- Loading Skeleton -->
            <div v-if="loading" class="grid gap-4">
                <div v-for="i in 4" :key="i" class="bg-white dark:bg-slate-800 p-6 rounded shadow-sm animate-pulse">
                    <div class="flex justify-between mb-4">
                        <div class="h-5 bg-slate-100 dark:bg-slate-700 rounded w-1/4"></div>
                        <div class="h-5 bg-slate-100 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                    <div class="space-y-2">
                        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
                        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <!-- List Content -->
            <div v-else class="space-y-4">
                <div v-for="item in visitorList" :key="item.registerId"
                    class="bg-white dark:bg-slate-800 rounded shadow-sm p-6 hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 group">

                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Icon name="lucide:user" size="20" />
                            </div>
                            <div>
                                <h3
                                    class="font-medium text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                                    {{ item.visitorName }}
                                    <span
                                        class="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                                        {{ item.visitorPhone }}
                                    </span>
                                </h3>
                                <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">来访目的：{{ item.visitPurpose
                                }}</p>
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <div class="px-3 py-1 rounded text-xs font-medium border"
                            :class="statusClass(item.status)">
                            {{ item.statusDesc }}
                        </div>
                    </div>

                    <div
                        class="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:clock" size="14" class="text-slate-400" />
                            <span>放行时间：{{ item.allowTime || '-' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:calendar-clock" size="14" class="text-slate-400" />
                            <span>有效日期：{{ item.validDate || '-' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:edit-3" size="14" class="text-slate-400" />
                            <span>申请时间：{{ item.createTime || '-' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="lucide:check-circle" size="14" class="text-slate-400" />
                            <span>审核时间：{{ item.auditTime || '-' }}</span>
                        </div>
                    </div>

                    <!-- Rejection Reason if any -->
                    <div v-if="item.status === 2 && item.rejectReason"
                        class="mt-4 bg-red-50 dark:bg-red-900/10 p-3 rounded text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                        <Icon name="lucide:alert-circle" size="14" class="mt-0.5 shrink-0" />
                        <span>拒绝原因：{{ item.rejectReason }}</span>
                    </div>

                    <!-- Actions -->
                    <div v-if="item.status === 0"
                        class="mt-4 flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
                        <DeleteApplication :register-id="item.registerId" @delete="handleDelete" />
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && visitorList.length === 0" class="py-20 text-center">
                <div
                    class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                    <Icon name="lucide:clipboard-list" size="40" />
                </div>
                <p class="text-slate-400">暂无访客记录</p>
            </div>

            <!-- Pagination -->
            <div class="mt-12 flex justify-center pb-12">
                <el-pagination v-if="total > 0" background layout="prev, pager, next" :total="total"
                    :page-size="pagination.pageSize" :current-page="pagination.pageNum"
                    @current-change="handlePageChange" class="custom-pagination" />
            </div>
        </div>

        <!-- Add Application Component -->
        <AddApplication ref="addApplicationRef" @success="fetchVisitorList" />
    </div>
</template>

<script setup lang="ts">
import TopBar from '~/components/Visitors/TopBar.vue'
import DeleteApplication from '~/components/Visitors/DeleteApplication.vue'
import AddApplication from '~/components/Visitors/AddApplication.vue'

const { visitorList, total, loading, pagination, fetchVisitorList, handlePageChange, cancelVisitor } = useVisitorList()

useHead({
    title: '访客登记列表 - 智慧社区'
})

const handleDelete = async (registerId: number | string) => {
    await cancelVisitor(registerId)
}

// Add Application Ref
const addApplicationRef = ref()

const openCreateModal = () => {
    addApplicationRef.value?.open()
}

onMounted(() => {
    fetchVisitorList()
})

const statusClass = (status: number) => {
    switch (status) {
        case 0: // 待审核
            return 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400'
        case 1: // 已通过
            return 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
        case 2: // 已拒绝
            return 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
        default:
            return 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
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
</style>