<template>
  <div class="bg-white dark:bg-white/5 rounded p-4 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col justify-between">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4 px-1 shrink-0">
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

    <!-- Empty State -->
    <div v-if="!loading && newsList.length === 0"
      class="flex-1 min-h-[220px] flex flex-col items-center justify-center text-slate-400">
      <Icon name="lucide:inbox" size="48" class="mb-3 opacity-50" />
      <span class="text-sm">暂无公告</span>
    </div>

    <!-- Content Area -->
    <div v-else class="flex-1 min-h-0 flex flex-col justify-center">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4 py-2">
        <div v-for="i in 6" :key="i" class="flex justify-between items-center animate-pulse py-1">
          <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
          <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-10"></div>
        </div>
      </div>

      <!-- List -->
      <ul v-else class="flex flex-col gap-1 py-1">
        <li v-for="(news, i) in displayedNews" :key="news.announceId"
          class="group transition-all duration-200">
          <NuxtLink :to="`/service/community/news/${news.announceId}`"
            class="flex items-center justify-between gap-4 px-2 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200">
            
            <!-- Left: Title & Icon -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <!-- Megaphone Icon -->
              <Icon 
                name="lucide:megaphone" 
                size="15" 
                class="text-slate-400 dark:text-slate-500 group-hover:text-[#ff5000] group-hover:scale-110 transition-all duration-200 shrink-0" 
              />
              <!-- Title -->
              <span
                class="text-sm md:text-[14.5px] font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-[#ff5000] transition-colors leading-normal block">
                {{ news.title }}
              </span>
              <!-- Badge -->
              <span v-if="i === 0"
                class="text-[9px] text-[#ff5000] border border-[#ff5000]/30 px-1.5 py-0.2 rounded scale-90 origin-left shrink-0 font-bold bg-orange-500/5">NEW</span>
            </div>

            <!-- Right: Date -->
            <span class="text-xs text-slate-400 dark:text-slate-500 shrink-0 tabular-nums font-medium tracking-tight group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
              {{ formatDate(news.publishTime) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useCommunityNews } from '@/composables/useCommunityIssue'

// Use the existing composable
const { newsList, loading, fetchNews } = useCommunityNews()

// Display top 5 news items in list
const displayedNews = computed(() => {
  if (!newsList.value) return []
  return newsList.value.slice(0, 5)
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
/* No deep carousel styling needed anymore */
</style>