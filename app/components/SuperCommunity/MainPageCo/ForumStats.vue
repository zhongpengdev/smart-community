<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                    <Icon name="lucide:message-square" size="18" class="text-violet-500" />
                </div>
                论坛统计
            </h3>
            <NuxtLink to="/superCommunity/community/forum"
                class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                论坛管理
                <Icon name="lucide:chevron-right" size="14" />
            </NuxtLink>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <!-- 核心指标卡片 -->
            <div class="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded text-center">
                <p class="text-2xl font-bold text-violet-600">{{ props.data?.totalPosts || 0 }}</p>
                <p class="text-xs text-slate-500 mt-1">帖子总数</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded text-center">
                <p class="text-2xl font-bold text-blue-600">{{ props.data?.totalComments || 0 }}</p>
                <p class="text-xs text-slate-500 mt-1">评论总数</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded text-center">
                <p class="text-2xl font-bold text-pink-600">{{ formatNumber(props.data?.totalViews) }}</p>
                <p class="text-xs text-slate-500 mt-1">总浏览量</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded text-center">
                <p class="text-2xl font-bold text-amber-600">{{ formatNumber(props.data?.totalLikes) }}</p>
                <p class="text-xs text-slate-500 mt-1">总点赞数</p>
            </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 发帖统计 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 pb-2">发帖统计</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">今日发帖</span>
                        <span class="font-bold text-violet-600">+{{ props.data?.todayPosts || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本周发帖</span>
                        <span class="font-bold text-violet-500">{{ props.data?.weekPosts || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">今日评论</span>
                        <span class="font-bold text-blue-600">+{{ props.data?.todayComments || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 帖子状态 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700 pb-2">帖子状态</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-amber-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待审核</span>
                        </div>
                        <span class="font-bold text-amber-500">{{ props.data?.pendingPosts || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-yellow-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">精华帖</span>
                        </div>
                        <span class="font-bold text-yellow-500">{{ props.data?.essencePosts || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-red-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">置顶帖</span>
                        </div>
                        <span class="font-bold text-red-500">{{ props.data?.topPosts || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 互动图表 -->
            <div class="flex flex-col justify-center items-center">
                <div ref="chartRef" class="w-full h-32"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps<{
    data: any
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const formatNumber = (value: number | undefined) => {
    if (!value) return '0'
    if (value >= 10000) {
        return (value / 10000).toFixed(1) + 'w'
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'k'
    }
    return value.toString()
}

const updateChart = () => {
    if (!chartRef.value || !props.data) return
    if (!chart) {
        chart = echarts.init(chartRef.value)
    }

    chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c}' },
        series: [{
            type: 'pie',
            radius: ['45%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: { show: false },
            data: [
                { name: '普通帖', value: Math.max(0, (props.data.totalPosts || 0) - (props.data.essencePosts || 0) - (props.data.topPosts || 0)), itemStyle: { color: '#8b5cf6' } },
                { name: '精华帖', value: props.data.essencePosts || 0, itemStyle: { color: '#f59e0b' } },
                { name: '置顶帖', value: props.data.topPosts || 0, itemStyle: { color: '#ef4444' } }
            ].filter(d => d.value > 0)
        }]
    })
}

watch(() => props.data, () => {
    nextTick(() => updateChart())
}, { immediate: true })

onMounted(() => {
    nextTick(() => updateChart())
    window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
    chart?.dispose()
})
</script>
