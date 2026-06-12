<template>
    <div class="min-h-screen bg-[#f4f4f4] dark:bg-black pb-10">
        <!-- Search Header -->
        <div class="bg-white dark:bg-slate-800 p-4 shadow-sm">
            <div class="max-w-[800px] mx-auto">
                <MallSearchBar v-model="keyword" @search="onSearch" placeholder="搜索商品..." button-text="搜索" />
            </div>
        </div>

        <!-- Search Results -->
        <div class="max-w-[1300px] mx-auto px-2 md:px-4 mt-4">
            <!-- 使用独立的搜索结果组件 -->
            <MallOrderSearchedGoodsList :list="searchResults" :loading="loading" :has-more="hasMore"
                @load-more="loadMore" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getMallGoodsListApi } from '@/utils/api'

definePageMeta({
    layout: 'mall'
})

const route = useRoute()
const router = useRouter()

// 本地独立状态 - 不使用全局useState
const searchResults = ref<any[]>([])
const loading = ref(false)
const keyword = ref('')
const categoryId = ref<number | null>(null)
const currentPage = ref(1)
const total = ref(0)
const pageSize = 20

const hasMore = computed(() => searchResults.value.length < total.value)

// 搜索商品
const searchGoods = async (page: number = 1, isLoadMore = false) => {
    if (loading.value) return
    loading.value = true

    try {
        const payload: any = {
            pageNum: page,
            pageSize: pageSize,
        }
        if (keyword.value) payload.keyword = keyword.value
        if (categoryId.value) payload.categoryId = categoryId.value

        const res = await getMallGoodsListApi(payload) as any
        const data = res.data || res

        if (data.list) {
            total.value = data.total || 0
            currentPage.value = page

            if (isLoadMore) {
                searchResults.value.push(...data.list)
            } else {
                searchResults.value = data.list
            }
        }
    } catch (error) {
        console.error('搜索商品失败', error)
    } finally {
        loading.value = false
    }
}

// 加载更多
const loadMore = () => {
    if (hasMore.value && !loading.value) {
        searchGoods(currentPage.value + 1, true)
    }
}

// 从URL初始化搜索
const initSearch = () => {
    const q = route.query.q as string || ''
    const catId = route.query.categoryId ? Number(route.query.categoryId) : null

    keyword.value = q
    categoryId.value = catId
    searchGoods(1, false)
}

// 手动搜索
const onSearch = () => {
    // 更新URL
    router.replace({ query: { q: keyword.value } })
    categoryId.value = null
    searchGoods(1, false)
}

// 监听URL变化
watch(() => [route.query.q, route.query.categoryId], ([newQ, newCatId]) => {
    const q = newQ as string || ''
    const catId = newCatId ? Number(newCatId) : null

    if (q !== keyword.value || catId !== categoryId.value) {
        keyword.value = q
        categoryId.value = catId
        searchGoods(1, false)
    }
})

onMounted(() => {
    initSearch()
})
</script>