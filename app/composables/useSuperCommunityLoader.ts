/**
 * 后台管理系统加载状态管理
 * 用于控制进入后台管理时的加载动画和状态
 */

export const useSuperCommunityLoader = () => {
    const isLoading = useState('superCommunityLoading', () => false)
    const isInitialized = useState('superCommunityInitialized', () => true)

    /**
     * 开始加载流程
     * @param minDuration 最小加载时长（毫秒），确保用户能看到加载动画
     */
    const startLoading = async (minDuration: number = 0) => {
        try {
            // 进行静默初始化/权限验证
            await performInitialization()
        } catch (error) {
            console.error('后台管理初始化失败:', error)
            throw error
        }
    }

    /**
     * 执行初始化逻辑
     */
    const performInitialization = async () => {
        const userStore = useUserStore()

        // 验证用户是否已登录
        if (!userStore.isLoggedIn) {
            throw new Error('用户未登录')
        }

        // 验证用户权限
        const userRole = userStore.userRole
        if (!userRole || userRole.roleId === 4) {
            throw new Error('无权限访问后台管理')
        }

        // 可以在这里添加更多初始化逻辑
        // 例如：预加载常用数据、初始化配置等
        // 直接返回，不进行人工延迟
    }

    /**
     * 重置加载状态
     */
    const resetLoader = () => {
        isLoading.value = false
        isInitialized.value = false
    }

    /**
     * 检查是否需要显示加载动画
     */
    const shouldShowLoader = computed(() => {
        return false // 直接禁用加载动画显示
    })

    return {
        isLoading: readonly(isLoading),
        isInitialized: readonly(isInitialized),
        shouldShowLoader,
        startLoading,
        resetLoader
    }
}

