<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Icon name="lucide:users" size="18" class="text-blue-500" />
                </div>
                用户统计
            </h3>
            <NuxtLink to="/superCommunity/system/user"
                class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                查看详情
                <Icon name="lucide:chevron-right" size="14" />
            </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- 用户增长 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium">用户增长</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">今日新增</span>
                        <span class="font-bold text-blue-600">+{{ props.data?.todayNewUsers || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本周新增</span>
                        <span class="font-bold text-blue-500">+{{ props.data?.weekNewUsers || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">本月新增</span>
                        <span class="font-bold text-blue-400">+{{ props.data?.monthNewUsers || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 用户状态 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium">用户状态</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">活跃用户</span>
                        <span class="font-bold text-green-600">{{ props.data?.activeUsers || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">冻结用户</span>
                        <span class="font-bold text-red-500">{{ props.data?.frozenUsers || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">用户总数</span>
                        <span class="font-bold text-slate-800 dark:text-white">{{ props.data?.totalUsers || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 用户类型 -->
            <div class="space-y-3">
                <p class="text-xs text-slate-400 font-medium">用户类型</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">普通用户</span>
                        <span class="font-bold text-slate-600">{{ props.data?.normalUsers || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">商户管理员</span>
                        <span class="font-bold text-purple-500">{{ props.data?.merchantAdmins || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-600 dark:text-slate-300">社区管理员</span>
                        <span class="font-bold text-indigo-500">{{ props.data?.communityAdmins || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 图表 -->
            <div class="flex flex-col justify-center items-center">
                <div ref="chartRef" class="w-full h-28"></div>
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

const updateChart = () => {
    if (!chartRef.value || !props.data) return
    if (!chart) {
        chart = echarts.init(chartRef.value as HTMLElement)
    }

    const total = props.data.totalUsers || 1
    const active = props.data.activeUsers || 0
    const frozen = props.data.frozenUsers || 0

    chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [{
            type: 'pie',
            radius: ['50%', '80%'],
            avoidLabelOverlap: false,
            label: { show: false },
            data: [
                { name: '活跃用户', value: active, itemStyle: { color: '#22c55e' } },
                { name: '冻结用户', value: frozen, itemStyle: { color: '#ef4444' } },
                { name: '其他', value: Math.max(0, total - active - frozen), itemStyle: { color: '#94a3b8' } }
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
