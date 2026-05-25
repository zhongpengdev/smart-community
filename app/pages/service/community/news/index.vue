<template>
    <div class="min-h-screen bg-[#f5f7fa] dark:bg-slate-900 pb-12">
        <!-- New Search Header -->
        <div class="bg-white dark:bg-slate-800 shadow-sm mb-6 sticky top-10 z-40">
            <TopSearchBar :total="total" :query-params="queryParams" @update:query-params="handleUpdateParams"
                @search="handleSearch" />
        </div>

        <div class="max-w-[1000px] mx-auto px-4">

            <!-- White Card Container for Content -->
            <div class="bg-white dark:bg-slate-800 rounded shadow-sm p-6 min-h-[600px]">

                <!-- Loading Skeleton -->
                <div v-if="loading" class="max-w-[800px] mx-auto space-y-10 mt-2">
                    <div v-for="i in 4" :key="i" class="animate-pulse">
                        <div class="h-6 bg-slate-100 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
                        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full mb-2"></div>
                        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6 mb-3"></div>
                        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/4 mt-2"></div>
                    </div>
                </div>

                <!-- News List (Search Result Style) -->
                <div v-else class="max-w-[800px] mx-auto space-y-8 border-b border-current pb-5 text-blue-800">
                    <div v-for="item in newsList" :key="item.announceId"
                        class="group border-b border-dashed border-slate-100 dark:border-slate-700 pb-8 last:border-0">
                        <!-- Title -->
                        <h3 class="text-xl mb-3 font-medium">
                            <span @click="goToDetail(item.announceId)"
                                class="text-[#1a0dab] dark:text-blue-400 hover:text-[#ff5000] dark:hover:text-[#ff5000] hover:underline cursor-pointer transition-colors"
                                v-html="highlightKeyword(item.title)"></span>
                        </h3>

                        <!-- Content Summary -->
                        <div class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3 line-clamp-3 text-justify"
                            v-html="highlightKeyword(item.content)"></div>

                        <!-- Footer Info -->
                        <div class="text-xs text-slate-400 flex items-center gap-4">
                            <span>发布时间：{{ item.publishTime ? item.publishTime.split(' ')[0] : '' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="!loading && newsList.length === 0" class="py-32 text-center">
                    <div
                        class="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500">
                        <Icon name="lucide:search-x" size="40" />
                    </div>
                    <p class="text-slate-400 text-sm">暂无相关结果，换个关键词试试？</p>
                </div>

                <!-- Pagination -->
                <div class="mt-12 flex justify-center max-w-[800px] mx-auto">
                    <el-pagination v-if="total > 0" background layout="prev, pager, next" :total="total"
                        :page-size="pagination.pageSize" :current-page="pagination.pageNum"
                        @current-change="handlePageChange" class="custom-pagination" />
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TopSearchBar from '~/components/News/TopSearchBar.vue'
const { newsList, total, loading, pagination, fetchNews, handlePageChange, queryParams } = useCommunityNews()

useHead({
    title: '社区公告 - 智慧社区 Search'
})

onMounted(() => {
    fetchNews()
})

const goToDetail = (id: string | number) => {
    navigateTo(`/service/community/news/${id}`)
}

const handleUpdateParams = (newParams: any) => {
    Object.assign(queryParams, newParams)
}

const handleSearch = () => {
    // When search is triggered from TopSearchBar
    pagination.pageNum = 1
    fetchNews()
}

// Helper to highlight keyword
const highlightKeyword = (text: string) => {
    if (!text) return ''
    if (!queryParams.keyword) return text

    const regex = new RegExp(queryParams.keyword, 'gi')
    return text.replace(regex, (match) => `<span class="text-[#c00] font-bold">${match}</span>`)
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
