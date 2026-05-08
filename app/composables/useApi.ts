export const $api = $fetch.create({
    onRequest({ request, options }) {
        const config = useRuntimeConfig()
        console.log('Check Config:', {
            apiBase: config.public.apiBase,
        })
        // 优先使用运行时配置，如果没有则回退
        const baseUrl = config.public.apiBase

        if (baseUrl) {
            options.baseURL = baseUrl
        }

        const userStore = useUserStore()

        // 不需要 Token 的接口白名单
        const publicEndpoints = [
            'api/user/login',
            'api/user/register',
            'api/user/send-verify-code',
            'api/user/password/reset'
        ];

        // 如果请求地址包含白名单中的路径，直接跳过 Token 注入
        const isPublic = publicEndpoints.some(endpoint => request.toString().includes(endpoint));

        if (isPublic) {
            return;
        }

        if (userStore.isLoggedIn && userStore.token) {
            options.headers = new Headers(options.headers);
            options.headers.set('Authorization', `Bearer ${userStore.token}`)
        }
    },
    onResponseError({ response }) {
        if (import.meta.client && response.status === 401) {
            // 使用全局变量或 useState 记录消息显示状态，防止重复弹出
            const isShowingMessage = useState('is-auth-message-showing', () => false)
            
            if (!isShowingMessage.value) {
                isShowingMessage.value = true
                ElMessage.error("请先登录")
                
                // 2秒后重置状态
                setTimeout(() => {
                    isShowingMessage.value = false
                }, 2000)
                
                // 只有在非登录页且非首页时才考虑跳转
                const route = useRoute()
                if (route.path !== '/login' && route.path !== '/') {
                    navigateTo('/login')
                }
            }
        }
    }
})