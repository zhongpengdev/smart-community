<template>
    <div class="p-6 space-y-6 bg-slate-100 dark:bg-slate-950 min-h-screen">
        <!-- Page Header -->
        <div class="flex items-center justify-between mb-2">
            <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-white">数据总览</h1>
                <p class="text-sm text-slate-500 mt-1">社区管理后台数据看板</p>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400">最后更新: {{ lastUpdate || '未加载' }}</span>
                <button @click="refreshData"
                    class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
                    <Icon name="lucide:refresh-cw" size="16" :class="{ 'animate-spin': loading }" />
                    刷新数据
                </button>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <Icon name="lucide:alert-circle" size="48" class="text-red-500 mx-auto mb-3" />
            <h3 class="text-lg font-bold text-red-600 dark:text-red-400 mb-2">数据加载失败</h3>
            <p class="text-sm text-red-500 dark:text-red-400 mb-4">{{ error }}</p>
            <button @click="refreshData"
                class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                重新加载
            </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-else-if="loading && !dashboardData" class="space-y-6">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div v-for="i in 6" :key="i"
                    class="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm animate-pulse">
                    <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-3"></div>
                    <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-12 mb-2"></div>
                    <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm animate-pulse">
                <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4"></div>
                <div class="grid grid-cols-4 gap-4">
                    <div v-for="i in 4" :key="i" class="space-y-2">
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
                <div v-for="i in 2" :key="i"
                    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm animate-pulse">
                    <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-28 mb-4"></div>
                    <div class="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        </div>

        <!-- Dashboard Content -->
        <template v-else-if="dashboardData">
            <!-- 核心指标概览 -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div v-for="stat in coreStats" :key="stat.title"
                    class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow group">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-slate-400 uppercase tracking-wider">{{ stat.title }}</p>
                            <p class="text-xl font-bold mt-1" :class="stat.color">{{ stat.value }}</p>
                            <p v-if="stat.subtext" class="text-xs text-slate-400 mt-1">{{ stat.subtext }}</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                            :class="stat.bgColor">
                            <Icon :name="stat.icon" size="20" :class="stat.iconColor" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 用户统计 -->
            <SuperCommunityMainPageCoUserStats :data="dashboardData.userStatistics" />

            <!-- 订单与物业费统计 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SuperCommunityMainPageCoOrderStats :data="dashboardData.orderStatistics" />
                <SuperCommunityMainPageCoPropertyFeeStats :data="dashboardData.propertyFeeStatistics" />
            </div>

            <!-- 报修投诉与安防统计 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SuperCommunityMainPageCoServiceStats :data="dashboardData.serviceStatistics" />
                <SuperCommunityMainPageCoSecurityStats :data="dashboardData.securityStatistics" />
            </div>

            <!-- 论坛统计 -->
            <SuperCommunityMainPageCoForumStats :data="dashboardData.forumStatistics" />

            <!-- 趋势图表 -->
            <SuperCommunityMainPageCoTrendCharts :userTrend="dashboardData.userTrend || []"
                :orderTrend="dashboardData.orderTrend || []" />
        </template>

        <!-- Empty State (No data and not loading) -->
        <div v-else class="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
            <Icon name="lucide:database" size="48" class="text-slate-300 mx-auto mb-3" />
            <h3 class="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">暂无数据</h3>
            <p class="text-sm text-slate-400 mb-4">点击刷新按钮加载数据</p>
            <button @click="refreshData"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                加载数据
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAdminDashboardApi } from '@/utils/api'

definePageMeta({
    layout: 'super-community',
    middleware: 'super-community'
})

const loading = ref(false)
const lastUpdate = ref('')
const dashboardData = ref<any>(null)
const error = ref('')

// 核心指标卡片
const coreStats = computed(() => {
    if (!dashboardData.value) return []
    const user = dashboardData.value.userStatistics || {}
    const order = dashboardData.value.orderStatistics || {}
    const service = dashboardData.value.serviceStatistics || {}
    const property = dashboardData.value.propertyFeeStatistics || {}

    return [
        {
            title: '用户总数',
            value: user.totalUsers?.toLocaleString() || 0,
            subtext: `今日 +${user.todayNewUsers || 0}`,
            icon: 'lucide:users',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-500'
        },
        {
            title: '订单总数',
            value: order.totalOrders?.toLocaleString() || 0,
            subtext: `今日 +${order.todayOrders || 0}`,
            icon: 'lucide:shopping-cart',
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-500'
        },
        {
            title: '总交易额',
            value: `¥${(order.totalAmount || 0).toLocaleString()}`,
            subtext: `今日 ¥${(order.todayAmount || 0).toLocaleString()}`,
            icon: 'lucide:wallet',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            iconColor: 'text-emerald-500'
        },
        {
            title: '待处理报修',
            value: service.pendingRepairs || 0,
            subtext: `投诉 ${service.pendingComplaints || 0}`,
            icon: 'lucide:wrench',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            iconColor: 'text-orange-500'
        },
        {
            title: '物业费缴费率',
            value: `${property.paymentRate || 0}%`,
            subtext: `已缴 ¥${(property.paidAmount || 0).toLocaleString()}`,
            icon: 'lucide:receipt',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-500'
        },
        {
            title: '活跃用户',
            value: user.activeUsers?.toLocaleString() || 0,
            subtext: `冻结 ${user.frozenUsers || 0}`,
            icon: 'lucide:activity',
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
            iconColor: 'text-cyan-500'
        }
    ]
})

// 获取数据看板
const fetchDashboard = async () => {
    loading.value = true
    error.value = ''
    try {
        console.log('[Dashboard] 正在请求数据看板...')
        const res = await getAdminDashboardApi() as any
        console.log('[Dashboard] API响应:', res)
        
        if (res.code === 200) {
            dashboardData.value = res.data
            lastUpdate.value = new Date().toLocaleTimeString()
            console.log('[Dashboard] 数据加载成功:', dashboardData.value)
        } else {
            error.value = res.message || '获取数据失败'
            console.error('[Dashboard] API返回错误:', res)
        }
    } catch (e: any) {
        console.error('[Dashboard] 请求异常:', e)
        error.value = e.message || '网络请求失败，请检查后端服务'
    } finally {
        loading.value = false
    }
}

const refreshData = () => {
    fetchDashboard()
}

onMounted(() => {
    fetchDashboard()
})

useHead({
    title: '数据总览 - 社区智管后台'
})
</script>
