<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <Icon name="lucide:trending-up" size="18" class="text-blue-500" />
                </div>
                数据趋势
            </h3>
            <div class="flex gap-2">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                    class="px-3 py-1.5 text-xs rounded transition-all"
                    :class="activeTab === tab.key
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'">
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 用户增长趋势 -->
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Icon name="lucide:users" size="16" class="text-blue-500" />
                        用户增长趋势
                    </p>
                    <span class="text-xs text-slate-400">最近7天</span>
                </div>
                <div ref="userChartRef" class="h-64"></div>
            </div>

            <!-- 订单趋势 -->
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Icon name="lucide:shopping-cart" size="16" class="text-green-500" />
                        订单趋势
                    </p>
                    <span class="text-xs text-slate-400">最近7天</span>
                </div>
                <div ref="orderChartRef" class="h-64"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps<{
    userTrend: any[]
    orderTrend: any[]
}>()

const tabs = [
    { key: 'count', label: '数量' },
    { key: 'amount', label: '金额' }
]
const activeTab = ref('count')

const userChartRef = ref<HTMLElement | null>(null)
const orderChartRef = ref<HTMLElement | null>(null)
let userChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null

const updateCharts = () => {
    updateUserChart()
    updateOrderChart()
}

const updateUserChart = () => {
    if (!userChartRef.value) return
    if (!userChart) {
        userChart = echarts.init(userChartRef.value)
    }

    const data = props.userTrend || []
    const dates = data.map(d => d.date?.slice(5) || '')
    const counts = data.map(d => d.count || 0)

    userChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { fontSize: 11, color: '#94a3b8' },
            axisLine: { lineStyle: { color: '#e2e8f0' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: { fontSize: 11, color: '#94a3b8' },
            splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }
        },
        series: [{
            type: 'line',
            data: counts,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: { width: 3, color: '#3b82f6' },
            itemStyle: { color: '#3b82f6', borderWidth: 2, borderColor: '#fff' },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                    { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                ])
            }
        }]
    })
}

const updateOrderChart = () => {
    if (!orderChartRef.value) return
    if (!orderChart) {
        orderChart = echarts.init(orderChartRef.value)
    }

    const data = props.orderTrend || []
    const dates = data.map(d => d.date?.slice(5) || '')
    const values = activeTab.value === 'count'
        ? data.map(d => d.count || 0)
        : data.map(d => d.amount || 0)

    const color = activeTab.value === 'count' ? '#22c55e' : '#f59e0b'

    orderChart.setOption({
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const p = params[0]
                const suffix = activeTab.value === 'amount' ? ' 元' : ' 笔'
                return `${p.name}<br/>${p.seriesName}: ${p.value}${suffix}`
            }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { fontSize: 11, color: '#94a3b8' },
            axisLine: { lineStyle: { color: '#e2e8f0' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 11,
                color: '#94a3b8',
                formatter: (v: number) => activeTab.value === 'amount' && v >= 1000 ? (v / 1000) + 'k' : v
            },
            splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }
        },
        series: [{
            name: activeTab.value === 'count' ? '订单数' : '交易额',
            type: 'bar',
            data: values,
            barWidth: '50%',
            itemStyle: {
                borderRadius: [6, 6, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: color },
                    { offset: 1, color: color + '80' }
                ])
            }
        }]
    })
}

watch(activeTab, () => {
    nextTick(() => updateOrderChart())
})

watch(() => [props.userTrend, props.orderTrend], () => {
    nextTick(() => updateCharts())
}, { immediate: true, deep: true })

const handleResize = () => {
    userChart?.resize()
    orderChart?.resize()
}

onMounted(() => {
    nextTick(() => updateCharts())
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    userChart?.dispose()
    orderChart?.dispose()
})
</script>
