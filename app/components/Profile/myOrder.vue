<template>
  <div class="flex gap-3 h-48 select-none">

    <div
      class="flex-[2] bg-white dark:bg-black rounded p-4 flex flex-col justify-between border border-slate-100 dark:border-white/5 shadow-sm">
      <div class="flex items-center justify-between cursor-pointer hover:text-[#ff5000] transition-colors group">
        <span class="font-bold text-slate-800 dark:text-slate-200">我的订单</span>
        <NuxtLink to="/service/mall/mo" class="hover:text-[#ff5000] transition-colors flex items-center gap-0.5">
          <Icon name="lucide:chevron-right" size="16" class="text-slate-400 group-hover:text-[#ff5000]" />
        </NuxtLink>

      </div>

      <div class="flex justify-between items-center px-2 mt-2">
        <div v-for="item in orderStats" :key="item.label" class="flex flex-col items-center gap-1 cursor-pointer group"
          @click="handleStatClick(item.status)">
          <span class="text-xl font-medium transition-colors"
            :class="item.count > 0 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500'">
            {{ item.count }}
          </span>
          <span class="text-xs text-slate-500 group-hover:text-[#ff5000]">{{ item.label }}</span>
        </div>
      </div>

      <!-- 动态/Loading 状态 -->
      <div v-if="loading"
        class="bg-slate-50 dark:bg-white/5 rounded p-3 flex flex-col items-center justify-center gap-1 mt-1 animate-pulse">
        <div class="h-3 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-1"></div>
        <div class="h-2 bg-slate-200 dark:bg-white/10 rounded w-1/2"></div>
      </div>

      <div v-else-if="latestOrder" @click="router.push('/service/mall/mo')"
        class="bg-slate-50 dark:bg-white/5 rounded p-3 flex flex-col items-start justify-center gap-1 mt-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
        <div class="flex items-center justify-between w-full">
          <span class="text-xs text-slate-800 dark:text-slate-200 font-bold truncate max-w-[120px]">
            最新: {{ latestOrder.statusDesc }}
          </span>
          <span class="text-[10px] text-slate-400">{{ latestOrder.createTime.split(' ')[0] }}</span>
        </div>
        <span class="text-[10px] text-slate-400 truncate w-full">
          {{ latestOrder.storeName || '商品订单' }} - ￥{{ latestOrder.amount.toFixed(2) }}
        </span>
      </div>

      <div v-else
        class="bg-slate-50 dark:bg-white/5 rounded p-3 flex flex-col items-center justify-center gap-1 mt-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
        <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">当前暂无订单</span>
        <span class="text-[10px] text-slate-400 scale-90">去商城逛逛 ></span>
      </div>
    </div>

    <!-- 钱包组件 -->
    <div class="flex-1">
      <WalletMyWallet />
    </div>

  </div>
</template>

<script setup lang="ts">
import { getOrdersListByStatusApi, getOrdersListApi } from '@/utils/api'

// 1. 订单状态数据接口
const orderStats = ref([
  { label: '待付款', count: 0, status: 0 },
  { label: '已支付', count: 0, status: 2 },
  { label: '支付失败', count: 0, status: 3 },
  { label: '全部订单', count: 0, status: -1 } // -1 代表特殊处理
])

const latestOrder = ref<any>(null)
const loading = ref(true)

// 获取各状态统计
const fetchStats = async () => {
  try {
    // 并发请求各状态数量
    const promises = orderStats.value.map(async (item) => {
      if (item.status === -1) {
        // 全部订单
        const res = await getOrdersListApi({ pageNum: 1, pageSize: 1 }) as any
        if (res.code === 200) item.count = res.data.total
      } else {
        // 特定状态
        const res = await getOrdersListByStatusApi({ pageNum: 1, pageSize: 1, status: item.status }) as any
        if (res.code === 200) item.count = res.data.total
      }
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Failed to fetch order stats:', error)
  }
}

// 获取最新一条订单作为动态
const fetchLatestOrder = async () => {
  try {
    const res = await getOrdersListApi({ pageNum: 1, pageSize: 1 }) as any
    if (res.code === 200 && res.data.records.length > 0) {
      latestOrder.value = res.data.records[0]
    }
  } catch (error) {
    console.error('Failed to fetch latest order:', error)
  }
}

const router = useRouter()
const handleStatClick = (status: number) => {
  if (status === -1) {
    router.push('/service/mall/mo')
  } else {
    // 这里简单跳转到列表页，如果列表页支持通过 query 参数筛选状态会更好
    // 目前 mo/index.vue 主要靠内部 state，可以通过 modify URL query 来支持
    router.push('/service/mall/mo')
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchStats(), fetchLatestOrder()])
  loading.value = false
})
</script>