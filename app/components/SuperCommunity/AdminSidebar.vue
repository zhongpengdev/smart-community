<template>
    <div class="bg-white dark:bg-black min-h-screen flex flex-col text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out relative border-r border-slate-200 dark:border-slate-800"
        :class="isCollapsed ? 'w-20' : 'w-64'">
        <!-- Logo / Title -->
        <NuxtLink to="/superCommunity">
            <div class="h-16 flex items-center border-b border-slate-200 dark:border-slate-800 px-4">
                <div class="flex items-center flex-1 min-w-0">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
                        <Icon name="lucide:layout-dashboard" class="text-white" size="20" />
                    </div>
                    <Transition name="fade-slide">
                        <span v-if="!isCollapsed" class="text-slate-800 dark:text-white font-bold text-lg tracking-wide ml-3 truncate">
                            社区智管后台
                        </span>
                    </Transition>
                </div>
            </div>
        </NuxtLink>


        <!-- Navigation -->
        <nav
            class="flex-1 overflow-y-auto py-6 px-3 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            
            <!-- 数据看板入口 -->
            <NuxtLink to="/superCommunity"
                class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-all duration-200 mb-3"
                :class="[
                    isCollapsed ? 'justify-center' : '',
                    isExactActive('/superCommunity') 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                ]">
                <Icon name="lucide:bar-chart-3" size="18" class="shrink-0"
                    :class="isExactActive('/superCommunity') ? 'text-white' : 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300'" />
                <Transition name="fade-slide">
                    <span v-if="!isCollapsed" class="ml-3">数据看板</span>
                </Transition>
            </NuxtLink>

            <div v-if="!isCollapsed" class="border-t border-slate-200 dark:border-slate-700/50 my-3"></div>

            <SuperCommunitySiderBarCommunity :collapsed="isCollapsed" />
            <SuperCommunitySiderBarMall :collapsed="isCollapsed" />
            <SuperCommunitySiderBarProperty :collapsed="isCollapsed" />
            <SuperCommunitySiderBarSecurity :collapsed="isCollapsed" />
            <SuperCommunitySiderBarUserManagement :collapsed="isCollapsed" />
        </nav>

        <!-- User Profile / Bottom Actions -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <!-- 返回用户端按钮 -->
            <NuxtLink to="/"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-600/20 dark:to-teal-600/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-600/30 dark:hover:to-teal-600/30 border border-emerald-200 dark:border-emerald-500/30 transition-all duration-200 group"
                :class="isCollapsed ? 'justify-center' : ''" title="返回用户端首页">
                <Icon name="lucide:home" class="text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors shrink-0" size="18" />
                <Transition name="fade-slide">
                    <span v-if="!isCollapsed" class="text-sm font-medium text-emerald-600 dark:text-emerald-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 transition-colors">
                        返回用户端
                    </span>
                </Transition>
            </NuxtLink>

            <!-- Theme Toggle Button -->
            <button @click="toggleTheme"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 group"
                :class="isCollapsed ? 'justify-center' : ''" :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
                <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'"
                    class="text-amber-500 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors shrink-0" size="18" />
                <Transition name="fade-slide">
                    <span v-if="!isCollapsed"
                        class="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {{ isDark ? '浅色模式' : '深色模式' }}
                    </span>
                </Transition>
            </button>

            <!-- Toggle Sidebar Button -->
            <button @click="toggleSidebar"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 group"
                :class="isCollapsed ? 'justify-center' : ''" :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'">
                <Icon name="lucide:panel-left-close"
                    class="text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0"
                    :class="isCollapsed ? 'rotate-180' : ''" size="18" />
                <Transition name="fade-slide">
                    <span v-if="!isCollapsed"
                        class="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        收起侧边栏
                    </span>
                </Transition>
            </button>

            <!-- User Profile -->
            <div class="flex items-center gap-3 rounded bg-slate-100 dark:bg-slate-800/50 transition-all duration-300"
                :class="isCollapsed ? 'px-2 py-2 justify-center' : 'px-3 py-2'">
                <div class="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md"
                    :title="userStore.userRole?.roleName || '管理员'">
                    {{ userStore.userRole?.roleName?.charAt(0) || 'A' }}
                </div>

                <Transition name="fade-slide">
                    <div v-if="!isCollapsed" class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-slate-800 dark:text-white truncate">
                            {{ userStore.userRole?.roleName || '管理员' }}
                        </p>
                        <p class="text-xs text-slate-500 dark:text-slate-500 truncate">
                            {{ userStore.userInfo?.email || 'admin@community.com' }}
                        </p>
                    </div>
                </Transition>

                <button @click="handleLogout" class="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
                    :class="isCollapsed && 'hidden'" title="退出登录">
                    <Icon name="lucide:log-out" size="16" />
                </button>
            </div>

            <!-- Collapsed Logout Button -->
            <Transition name="fade">
                <button v-if="isCollapsed" @click="handleLogout"
                    class="w-full flex items-center justify-center p-2 rounded text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="退出登录">
                    <Icon name="lucide:log-out" size="16" />
                </button>
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const colorMode = useColorMode()
const { isCollapsed, toggleSidebar } = useSidebarCollapse()

// 判断当前是否是深色模式
const isDark = computed(() => colorMode.value === 'dark')

// 切换主题
const toggleTheme = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
}

// 精确匹配路由（用于数据看板）
const isExactActive = (path: string) => route.path === path

const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}
</script>

<style scoped>
/* Fade Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>