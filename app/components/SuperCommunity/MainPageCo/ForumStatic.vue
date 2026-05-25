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
            <!-- 板块帖子统计 -->
            <div
                class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 class="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="lucide:bar-chart-2" size="18" class="text-purple-500" />
                    板块帖子分布
                </h3>
                <div ref="sectionChartRef" class="h-64"></div>
            </div>

            <!-- 热门板块排行 -->
            <div
                class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 class="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="lucide:trending-up" size="18" class="text-orange-500" />
                    热门板块排行
                </h3>
                <div ref="engagementChartRef" class="h-64"></div>
            </div>
        </div>

        <!-- 板块列表 -->
        <div
            class="bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Icon name="lucide:layout-grid" size="18" class="text-indigo-500" />
                    论坛板块管理
                </h3>
                <NuxtLink to="/superCommunity/forum/sections" class="text-xs text-blue-500 hover:underline">
                    管理板块
                </NuxtLink>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">板块名称</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">描述</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">帖子数</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">创建时间</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                        <tr v-if="sectionList.length === 0">
                            <td colspan="5" class="px-4 py-8 text-center text-slate-400">暂无板块数据</td>
                        </tr>
                        <tr v-for="section in sectionList" :key="section.sectionId"
                            class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-8 h-8 rounded bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                        <Icon name="lucide:message-square" size="16" class="text-purple-500" />
                                    </div>
                                    <span class="font-medium text-slate-800 dark:text-white">{{ section.sectionName
                                    }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-slate-500 max-w-[200px] truncate">{{ section.sectionDesc || '-' }}
                            </td>
                            <td class="px-4 py-3">
                                <span class="font-bold text-purple-600">{{ section.postCount || 0 }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 rounded text-xs"
                                    :class="section.status === 1 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'">
                                    {{ section.status === 1 ? '启用' : '禁用' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-xs text-slate-400">{{ section.createTime?.split(' ')[0] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { getForumSectionStatisticsApi, queryForumSectionsApi, getForumSectionListApi } from '@/utils/api'

const loading = ref(false)

// Chart refs
const sectionChartRef = ref<HTMLElement | null>(null)
const engagementChartRef = ref<HTMLElement | null>(null)

// Chart instances
let sectionChart: echarts.ECharts | null = null
let engagementChart: echarts.ECharts | null = null

// Data
const forumStats = ref<any>({})
const sectionList = ref<any[]>([])

// 统计卡片
const statCards = computed(() => [
    {
        title: '总板块数',
        value: forumStats.value.totalSections || 0,
        subtext: '',
        icon: 'lucide:layout-grid',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-500'
    },
    {
        title: '启用板块',
        value: forumStats.value.activeSections || 0,
        subtext: '',
        icon: 'lucide:check-circle',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-500'
    },
    {
        title: '禁用板块',
        value: forumStats.value.disabledSections || 0,
        subtext: '',
        icon: 'lucide:x-circle',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-500'
    },
    {
        title: '总帖子数',
        value: forumStats.value.totalPosts || 0,
        subtext: '',
        icon: 'lucide:file-text',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        iconColor: 'text-purple-500'
    }
])

// 获取统计数据
const fetchStats = async () => {
    try {
        const res = await getForumSectionStatisticsApi() as any
        if (res.code === 200) {
            forumStats.value = res.data || {}
        }
    } catch (e) {
        console.error('获取论坛统计失败', e)
    }
}

// 获取板块列表
const fetchSections = async () => {
    try {
        // 尝试使用管理员接口
        const res = await queryForumSectionsApi({ pageNum: 1, pageSize: 20 }) as any
        if (res.code === 200) {
            sectionList.value = res.data?.records || res.data?.list || res.data || []
        }
    } catch (e) {
        // 降级使用普通接口
        try {
            const res = await getForumSectionListApi() as any
            if (res.code === 200) {
                sectionList.value = res.data || []
            }
        } catch (e2) {
            console.error('获取板块列表失败', e2)
        }
    }
}

// 更新图表
const updateCharts = () => {
    // 板块帖子分布
    if (sectionChartRef.value && sectionList.value.length > 0) {
        if (!sectionChart) {
            sectionChart = echarts.init(sectionChartRef.value)
        }
        sectionChart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            xAxis: {
                type: 'category',
                data: sectionList.value.map(s => s.sectionName),
                axisLabel: { fontSize: 10, rotate: 15 }
            },
            yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
            series: [{
                type: 'bar',
                data: sectionList.value.map(s => s.postCount || 0),
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#a855f7' },
                        { offset: 1, color: '#c084fc' }
                    ])
                }
            }],
            grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true }
        })
    }

    // 热门板块帖子分布
    if (engagementChartRef.value) {
        if (!engagementChart) {
            engagementChart = echarts.init(engagementChartRef.value)
        }
        const topSections = forumStats.value.topSections || []
        if (topSections.length > 0) {
            engagementChart.setOption({
                tooltip: { trigger: 'item', formatter: '{b}: {c}个帖子 ({d}%)' },
                legend: { bottom: '0%', left: 'center', textStyle: { fontSize: 11 } },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                    label: { show: false },
                    emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
                    data: topSections.map((s: any) => ({
                        name: s.sectionName,
                        value: s.postCount || 0
                    })),
                    color: ['#06b6d4', '#f59e0b', '#3b82f6', '#ec4899', '#a855f7']
                }]
            })
        }
    }
}

// 刷新数据
const refresh = async () => {
    loading.value = true
    await Promise.all([fetchStats(), fetchSections()])
    loading.value = false
    updateCharts()
}

// 暴露给父组件
defineExpose({ refresh })

// 响应式
const handleResize = () => {
    sectionChart?.resize()
    engagementChart?.resize()
}

onMounted(() => {
    refresh()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    sectionChart?.dispose()
    engagementChart?.dispose()
})
</script>
