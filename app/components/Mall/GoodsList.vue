<template>
  <div class="max-w-[1240px] mx-auto px-4 py-6">
    <!-- Section Title -->
    <div class="flex items-center gap-2 mb-6">
      <div class="w-1 h-6 bg-[#ff5000] rounded"></div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">猜你喜欢</h2>
    </div>

    <!-- Goods Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
      <!-- Skeleton Loading -->
      <div v-if="loading && list.length === 0" v-for="i in 5" :key="`skeleton-${i}`"
        class="bg-white dark:bg-slate-900 rounded overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
        <div class="aspect-square bg-slate-200 dark:bg-slate-700"></div>
        <div class="p-3 space-y-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mt-3"></div>
        </div>
      </div>

      <!-- Product Cards -->
      <div v-for="item in list" :key="item.productId" @click="goToDetail(item.productId)"
        class="group bg-white dark:bg-slate-900 rounded overflow-hidden border border-transparent cursor-pointer shadow-sm hover:shadow-md flex flex-col">

        <!-- Product Image -->
        <div class="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
          <img :src="item.coverImg" :alt="item.productName"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>

        <!-- Product Details -->
        <div class="p-3 flex-1 flex flex-col">
          <!-- Title -->
          <h3
            class="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug mb-1 min-h-[2.5rem]">
            {{ item.productName }}
          </h3>

          <!-- Description -->
          <p class="text-xs text-slate-400 line-clamp-1 mb-2">{{ item.description }}</p>

          <!-- Price -->
          <div class="mt-auto flex items-baseline text-[#ff5000]">
            <span class="text-xs font-bold font-sans">¥</span>
            <span class="text-lg font-bold">{{ String(item.price).split('.')[0] }}</span>
            <span v-if="String(item.price).includes('.')" class="text-xs font-bold">.{{ String(item.price).split('.')[1]
              || '0' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading More Skeleton -->
    <div v-if="loading && list.length > 0" class="mt-6">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        <div v-for="i in 5" :key="`loading-${i}`"
          class="bg-white dark:bg-slate-900 rounded overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
          <div class="aspect-square bg-slate-200 dark:bg-slate-700"></div>
          <div class="p-3 space-y-2">
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mt-3"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lazy Load Sentinel -->
    <div ref="sentinelRef" class="mt-12 py-6 flex justify-center">
      <span v-if="!hasMore && list.length > 0" class="text-slate-400 text-sm">
        没有更多商品了
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMallGoodsListApi } from '@/utils/api'
import { useIntersectionObserver } from '~/utils/lazyLoading'

// 本地独立状态，不使用全局useState
const list = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const pageSize = 12

const hasMore = computed(() => list.value.length < total.value)

const goToDetail = (productId: string | number) => {
  navigateTo(`/service/mall/${productId}`)
}

// 获取商品列表 - 无任何搜索条件，只获取全部商品
const fetchGoods = async (page: number = 1, isLoadMore = false) => {
  if (loading.value) return
  loading.value = true

  try {
    const res = await getMallGoodsListApi({
      pageNum: page,
      pageSize: pageSize,
      // 不传keyword和categoryId，获取全部商品
    }) as any

    const data = res.data || res
    if (data.list) {
      total.value = data.total || 0
      currentPage.value = page

      if (isLoadMore) {
        list.value.push(...data.list)
      } else {
        list.value = data.list
      }
    }
  } catch (error) {
    console.error('获取商品列表失败', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = async () => {
  if (!hasMore.value || loading.value) return
  await fetchGoods(currentPage.value + 1, true)
}

// 监听底部哨兵（用于加载更多）
const { targetRef: sentinelRef } = useIntersectionObserver(loadMore)

// 组件挂载时加载商品
onMounted(() => {
  fetchGoods(1, false)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
