<template>
    <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <!-- Loading Overlay -->
        <SuperCommunityLoader :show="shouldShowLoader" title="后台管理系统" :subtitle="loadingSubtitle" />

        <!-- Sidebar -->
        <SuperCommunityAdminSidebar class="shrink-0 transition-all duration-300" />

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">

            <!-- Top Header -->
            <header
                class="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 shadow-sm z-10">
                <div class="flex items-center gap-4">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {{ pageTitle }}
                    </h2>

                    <!-- Breadcrumb hint when collapsed -->
                    <Transition name="fade">
                        <div v-if="isCollapsed"
                            class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Icon name="lucide:chevron-right" size="14" />
                            <span>{{ breadcrumbHint }}</span>
                        </div>
                    </Transition>
                </div>

                <!-- Quick Actions -->
                <div class="flex items-center gap-3">
                    <button
                        class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        title="刷新页面">
                        <Icon name="lucide:refresh-cw" size="18" />
                    </button>
                    <button
                        class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        title="全屏">
                        <Icon name="lucide:maximize" size="18" />
                    </button>
                </div>
            </header>

            <!-- Scrollable Page Content -->
            <main class="flex-1 overflow-auto p-8">
                <slot />
            </main>

        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { shouldShowLoader, startLoading, resetLoader } = useSuperCommunityLoader()
const { isCollapsed } = useSidebarCollapse()

// Map routes to titles
const pageTitle = computed(() => {
    const path = route.path
    if (path.includes('/message/announcement')) return '公告发布'
    if (path.includes('/message/complaint')) return '投诉管理'
    if (path.includes('/security/visitor')) return '访客通行'
    if (path.includes('/security/parking')) return '车位管理'
    if (path.includes('/property/repair')) return '报事处理'
    if (path.includes('/payment/records')) return '缴费记录'
    if (path.includes('/mall/goods')) return '商品管理'
    if (path.includes('/mall/orders')) return '订单管理'
    if (path.includes('/system/user')) return '用户管理'
    if (path.includes('/system/role')) return '角色管理'
    if (path.includes('/system/permission')) return '权限管理'
    return '数据看板'
})

// Breadcrumb hint for collapsed state
const breadcrumbHint = computed(() => {
    const path = route.path
    if (path.includes('/message/')) return '消息管理'
    if (path.includes('/security/')) return '安保管理'
    if (path.includes('/property/')) return '物业管理'
    if (path.includes('/mall/')) return '商城管理'
    if (path.includes('/system/')) return '系统管理'
    return '后台首页'
})

// 动态加载提示
const loadingSubtitle = computed(() => {
    const roleName = userStore.userRole?.roleName || '管理员'
    return `欢迎回来，${roleName}`
})

// 初始化加载流程
onMounted(async () => {
    try {
        // 验证权限 (由中间件主要负责，这里作为兜底静默处理)
        if (!userStore.isLoggedIn) {
            router.push('/login')
            return
        }

        // 检查角色权限
        if (userStore.userRole?.roleId === 4) {
            router.push('/')
            return
        }

        // 开始加载流程
        await startLoading(2300)
    } catch (error: any) {
        console.error('后台管理加载失败:', error)
        // 只有非认证相关的错误才在这里提示
        if (userStore.isLoggedIn) {
            ElMessage.error(error.message || '加载失败，请重试')
        }
        router.push('/')
    }
})

// 离开后台时重置加载状态
onUnmounted(() => {
    resetLoader()
})
</script>

<style scoped>
/* Fade Transition for breadcrumb */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
