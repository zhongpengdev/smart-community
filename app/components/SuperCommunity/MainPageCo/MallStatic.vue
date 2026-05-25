<template>
    <div class="space-y-6">
        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="stat in statCards" :key="stat.title"
                class="bg-white dark:bg-slate-800 rounded p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs text-slate-400 uppercase tracking-wider">{{ stat.title }}</p>
                        <p class="text-2xl font-bold mt-2" :class="stat.color">{{ stat.value }}</p>
                        <p v-if="stat.subtext" class="text-xs text-slate-400 mt-1">{{ stat.subtext }}</p>
                    </div>
                    <div class="w-12 h-12 rounded flex items-center justify-center" :class="stat.bgColor">
                        <Icon :name="stat.icon" size="24" :class="stat.iconColor" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 图表区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 订单状态分布 -->
            <div
                class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 class="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="lucide:shopping-bag" size="18" class="text-blue-500" />
                    订单状态分布
                </h3>
                <div ref="statusChartRef" class="h-64"></div>
            </div>

            <!-- 订单类型占比 -->
            <div
                class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 class="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="lucide:pie-chart" size="18" class="text-green-500" />
                    订单类型占比
                </h3>
                <div ref="typeChartRef" class="h-64"></div>
            </div>
        </div>

        <!-- 最近订单列表 -->
        <div
            class="bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Icon name="lucide:list" size="18" class="text-blue-500" />
                    最近订单
                </h3>
                <NuxtLink to="/superCommunity/mall/orders" class="text-xs text-blue-500 hover:underline">
                    查看全部
                </NuxtLink>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">订单号</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">用户ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">类型</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">金额</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">时间</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                        <tr v-if="recentOrders.length === 0">
                            <td colspan="6" class="px-4 py-8 text-center text-slate-400">暂无订单数据</td>
                        </tr>
                        <tr v-for="order in recentOrders" :key="order.orderId"
                            class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td class="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                                {{ order.orderNo?.slice(-12) }}
                            </td>
                            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ order.userId }}</td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 rounded text-xs" :class="getTypeClass(order.orderType)">
                                    {{ order.orderTypeDesc }}
                                </span>
                            </td>
                            <td class="px-4 py-3 font-bold text-[#ff5000]">¥{{ order.amount?.toFixed(2) }}</td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 rounded text-xs" :class="getStatusClass(order.status)">
                                    {{ order.statusDesc }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-xs text-slate-400">{{ order.createTime?.split(' ')[0] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { getAdminOrderStatisticsApi, getAdminOrderListApi } from '@/utils/api'

const loading = ref(false)

// Chart refs
const statusChartRef = ref<HTMLElement | null>(null)
const typeChartRef = ref<HTMLElement | null>(null)

// Chart instances
let statusChart: echarts.ECharts | null = null
let typeChart: echarts.ECharts | null = null

// Data
const orderStats = ref<any>({})
const recentOrders = ref<any[]>([])

// 统计卡片
const statCards = computed(() => [
    {
        title: '总订单数',
        value: orderStats.value.totalOrders || 0,
        subtext: `今日 +${orderStats.value.todayOrders || 0}`,
        icon: 'lucide:shopping-cart',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-500'
    },
    {
        title: '总交易额',
        value: `¥${(orderStats.value.totalAmount || 0).toLocaleString()}`,
        subtext: `今日 ¥${(orderStats.value.todayAmount || 0).toLocaleString()}`,
        icon: 'lucide:wallet',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-500'
    },
    {
        title: '待处理订单',
        value: orderStats.value.pendingOrders || 0,
        subtext: '待支付/待取货',
        icon: 'lucide:clock',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-500'
    },
    {
        title: '已完成订单',
        value: orderStats.value.completedOrders || 0,
        subtext: '已完成交易',
        icon: 'lucide:check-circle',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-500'
    }
])

// 获取统计数据
const fetchStats = async () => {
    try {
        const res = await getAdminOrderStatisticsApi() as any
        if (res.code === 200) {
            orderStats.value = res.data || {}
            updateCharts()
        }
    } catch (e) {
        console.error('获取订单统计失败', e)
    }
}

// 获取最近订单
const fetchRecentOrders = async () => {
    try {
        const res = await getAdminOrderListApi({ pageNum: 1, pageSize: 8 }) as any
        if (res.code === 200) {
            recentOrders.value = res.data?.records || res.data?.list || []
        }
    } catch (e) {
        console.error('获取订单列表失败', e)
    }
}

// 更新图表
const updateCharts = () => {
    // 订单状态分布
    if (statusChartRef.value) {
        if (!statusChart) {
            statusChart = echarts.init(statusChartRef.value)
        }
        const statusCount = orderStats.value.statusCount || {}
        const statusMap: Record<string, string> = {
            '0': '待支付',
            '1': '支付中',
            '2': '支付成功',
            '3': '已完成',
            '4': '支付失败',
            '5': '已取消',
            '6': '已退款'
        }
        const statusData = Object.entries(statusCount).map(([key, value]) => ({
            name: statusMap[key] || `状态${key}`,
            value: value as number
        })).filter(item => item.value > 0)

        statusChart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c}笔 ({d}%)' },
            legend: { bottom: '0%', left: 'center', textStyle: { fontSize: 11 } },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
                data: statusData.length > 0 ? statusData : [{ name: '暂无数据', value: 0 }],
                color: ['#f59e0b', '#3b82f6', '#22c55e', '#10b981', '#ef4444', '#94a3b8', '#8b5cf6']
            }]
        })
    }

    // 订单类型占比
    if (typeChartRef.value) {
        if (!typeChart) {
            typeChart = echarts.init(typeChartRef.value)
        }
        const typeCount = orderStats.value.typeCount || {}
        const typeMap: Record<string, string> = {
            'PRODUCT': '商品订单',
            'RECHARGE': '充值订单',
            'PROPERTY_FEE': '物业费',
            'PARKING_FEE': '停车费'
        }
        const typeData = Object.entries(typeCount).map(([key, value]) => ({
            name: typeMap[key] || key,
            value: value as number
        }))

        typeChart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: { type: 'category', data: typeData.map(d => d.name), axisLabel: { fontSize: 11 } },
            yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
            series: [{
                type: 'bar',
                data: typeData.map(d => d.value),
                itemStyle: { borderRadius: [6, 6, 0, 0] },
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#3b82f6' },
                    { offset: 1, color: '#60a5fa' }
                ])
            }],
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
        })
    }
}

// 状态样式
const getStatusClass = (status: number) => {
    switch (status) {
        case 0: return 'bg-orange-100 text-orange-600'
        case 1: return 'bg-blue-100 text-blue-600'
        case 2: return 'bg-green-100 text-green-600'
        case 3: return 'bg-red-100 text-red-600'
        default: return 'bg-slate-100 text-slate-600'
    }
}

// 类型样式
const getTypeClass = (type: string) => {
    switch (type) {
        case 'PRODUCT': return 'bg-blue-50 text-blue-600'
        case 'PROPERTY_FEE': return 'bg-purple-50 text-purple-600'
        case 'RECHARGE': return 'bg-cyan-50 text-cyan-600'
        default: return 'bg-slate-50 text-slate-600'
    }
}

// 刷新数据
const refresh = async () => {
    loading.value = true
    await Promise.all([fetchStats(), fetchRecentOrders()])
    loading.value = false
}

// 暴露给父组件
defineExpose({ refresh })

// 响应式
const handleResize = () => {
    statusChart?.resize()
    typeChart?.resize()
}

onMounted(() => {
    refresh()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    statusChart?.dispose()
    typeChart?.dispose()
})
</script>
