<template>
  <header
    class="w-full shadow-sm sticky top-18 z-[40] transition-colors duration-300">
    <div class="max-w-[1200px] mx-auto px-4 py-4 flex flex-col items-center justify-center gap-3">

      <div class="flex w-full max-w-[850px]">
        <MallSearchBar v-model="searchQuery" width="100%" height="42px" placeholder="搜索商品..." button-text="搜索"
          @search="handleSearch" />
      </div>

      <MallBannerTopCatgoryList />

      <div class="flex items-center gap-6 mt-1">
        <div v-for="item in mallIcons" :key="item.name" class="flex items-center gap-1 cursor-pointer group">
          <img :src="`/mallIcon/${item.icon}`" class="w-4 h-4 object-contain" :alt="item.name" />
          <span
            class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#ff5000] transition-colors">
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useMallGoods } from '@/composables/mall/useMallGoods'

const { handleSearch: executeSearch, searchKeyword } = useMallGoods()

// Sync local state maybe? Or just use local ref. 
// Let's keep local ref to avoid constant fetching while typing if not debounced.
const searchQuery = ref(searchKeyword.value || '')

// Watch external changes to keyword?
watch(() => searchKeyword.value, (newVal) => {
  if (newVal !== searchQuery.value) {
    searchQuery.value = newVal
  }
})

const colorMode = useColorMode()

// 根据你提供的数据和文件名进行配置
const mallIcons = [
  { name: '天猫', icon: 'tianmao.png' },
  { name: '淘宝直播', icon: 'zhibo.png' },
  { name: '淘宝企业购', icon: 'qiyegou.png' },
  { name: '司法拍卖', icon: 'sifa.png' },
  { name: '天猫超市', icon: 'tianmaogou.png' },
  { name: '国家补贴', icon: 'guobu.png' },
  { name: '超级立减', icon: 'lijian.png' },
  { name: '全部频道', icon: 'quanbu.png' }
]

const handleSearch = () => {
  // Navigate to search page with query
  navigateTo({
    path: '/service/mall/search',
    query: { q: searchQuery.value }
  })
}
</script>