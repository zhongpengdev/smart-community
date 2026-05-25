<template>
  <div class="bg-white dark:bg-white/5 rounded p-4 border border-slate-100 dark:border-white/5 shadow-sm h-full">

    <div class="flex items-center justify-between mb-3 px-1">
      <div class="flex items-center gap-2">
        <span class="w-1 h-4 bg-[#ff5000] rounded"></span>
        <h2 class="text-base font-bold text-slate-800 dark:text-white">社区公告</h2>
      </div>
      <NuxtLink to="/service/community/news"
        class="flex items-center gap-1 text-xs text-slate-400 hover:text-[#ff5000] transition-colors cursor-pointer select-none">
        <span>更多公告</span>
        <Icon name="lucide:chevron-right" size="14" />
      </NuxtLink>
    </div>

    <!-- Empty State (Full Width) -->
    <div v-if="!loading && newsList.length === 0"
      class="min-h-[300px] flex flex-col items-center justify-center text-slate-400">
      <Icon name="lucide:inbox" size="48" class="mb-3 opacity-50" />
      <span class="text-sm">暂无公告</span>
    </div>

    <!-- Content Area -->
    <div v-else class="flex flex-col md:flex-row gap-6">

      <!-- Carousel (Banner) -->
      <div v-if="bannerList && bannerList.length > 0"
        class="w-full h-[180px] rounded overflow-hidden relative group shrink-0">
        <el-carousel trigger="click" height="180px" :interval="5000" arrow="hover">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <div class="relative w-full h-full cursor-pointer">
              <img :src="item.image"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
                <span
                  class="bg-[#ff5000] text-white text-[10px] px-1.5 py-0.5 rounded mb-1.5 inline-block font-medium">热点</span>
                <h3 class="text-white font-bold text-sm leading-snug line-clamp-1">
                  {{ item.title }}
                </h3>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- News List (Real Data) -->
      <div class="flex-1 min-w-0 py-1 flex flex-col justify-between">

        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 6" :key="i" class="flex justify-between items-center animate-pulse">
            <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3"></div>
            <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-12"></div>
          </div>
        </div>

        <!-- List -->
        <div v-else class="flex flex-col gap-4">

          <ul class="flex flex-col gap-2.5">
            <li v-for="(news, i) in displayedNews" :key="news.announceId"
              class="flex items-center justify-between group cursor-pointer">
              <NuxtLink :to="`/service/community/news/${news.announceId}`"
                class="flex items-center gap-2 min-w-0 pr-4 flex-1">
                <span
                  class="w-1.5 h-1.5 rounded bg-slate-200 group-hover:bg-[#1a73e8] transition-colors shrink-0 mt-0.5"></span>
                <span
                  class="text-[13px] text-slate-700 dark:text-slate-300 truncate group-hover:text-[#1a73e8] transition-colors leading-normal block">
                  {{ news.title }}
                </span>
                <span v-if="i === 0"
                  class="text-[9px] text-[#ff5000] border border-[#ff5000]/30 px-1 rounded scale-90 origin-left shrink-0">NEW</span>
              </NuxtLink>

              <span class="text-xs text-slate-400 shrink-0 tabular-nums font-medium tracking-tight">
                {{ formatDate(news.publishTime) }}
              </span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommunityNews } from '@/composables/useCommunityIssue'

// Use the existing composable
const { newsList, loading, fetchNews } = useCommunityNews()

// Define bannerList (initialize as empty or handle in template)
interface Banner {
  id: number;
  title: string;
  image: string;
}
const bannerList = ref<Banner[]>([])

// Display top 8 news items
const displayedNews = computed(() => {
  return newsList.value.slice(0, 6)
})

const formatDate = (timeStr?: string | null) => {
  if (!timeStr) return ''
  const datePart = timeStr.split(' ')[0]
  return datePart ? datePart.slice(5) : '' // Extract MM-DD
}

onMounted(() => {
  // Ensure we fetch news
  fetchNews()
})
</script>

<style scoped>
:deep(.el-carousel__container) {
  /* 确保圆角和高度一致 */
  height: 100% !important;
}

:deep(.el-carousel__button) {
  /* 优化轮播指示器 */
  width: 20px;
  height: 3px;
  border-radius: 2px;
}
</style>