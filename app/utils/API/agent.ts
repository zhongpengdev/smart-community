// 创建专门用于 Agent API 的 fetch 实例
export const $agentApi = $fetch.create({
    onRequest({ options }) {
        const config = useRuntimeConfig()
        const userStore = useUserStore()

        // 设置 Agent API 的 baseURL
        options.baseURL = config.public.agentBase

        // 如果用户已登录，添加 Authorization header
        if (userStore.isLoggedIn && userStore.token) {
            options.headers = new Headers(options.headers)
            options.headers.set('Authorization', `Bearer ${userStore.token}`)
        }
    }
})

export const agentApi = {
    chat: (payload: { user_id: string; query: string }) => {
        return $agentApi('/chat', {
            method: 'POST',
            body: payload
        })
    },
    getHistory: (payload: { page?: number, page_size?: number }) => {
        return $agentApi('/sessions', {
            method: 'GET',
        })
    },
    // 获取工具元数据
    getToolMetadata: () => {
        return $agentApi('/api/tools/metadata', {
            method: 'GET',
        })
    }
}

// 创建新会话
export const createNewSession = (content: string) => {
    return $agentApi('/create_new_session', {
        method: 'POST',
        body: { content }
    })
}
// 会话重命名
export const renameSession = (sessionId: number, newTitle: string) => {
    return $agentApi('/rename-session', {
        method: 'POST',
        body: {
            session_id: sessionId,
            rename_title: newTitle
        }
    })
}

// WebSocket 流式传输接口
export const agentStreamApi = {
    /**
     * 创建 WebSocket 连接进行流式聊天
     * @param userId 用户ID
     * @param onMessage 接收到消息时的回调函数
     * @param onError 发生错误时的回调函数
     * @param onClose 连接关闭时的回调函数
     * @returns WebSocket 实例
     */
    createChatStream: (
        userId: string,
        sessionId: string | number | undefined,
        onMessage: (data: any) => void,
        onError?: (error: Event) => void,
        onClose?: (event: CloseEvent) => void
    ): WebSocket => {
        const config = useRuntimeConfig()
        const userStore = useUserStore()

        // 将 http/https 转换为 ws/wss
        const wsBase = config.public.agentBase.replace(/^http/, 'ws')
        let wsUrl = `${wsBase}/ws/chat`

        // Add query parameters
        const params = new URLSearchParams()
        if (sessionId) {
            params.append('session_id', String(sessionId))
        }

        if (params.toString()) {
            wsUrl += `?${params.toString()}`
        }

        console.log('Connecting to WebSocket:', wsUrl)

        const ws = new WebSocket(wsUrl)

        // 连接建立时
        ws.onopen = () => {
            console.log('WebSocket connected')
            // 如果需要发送 token 进行认证，可以在这里发送
            if (userStore.token) {
                ws.send(JSON.stringify({
                    type: 'auth',
                    token: userStore.token
                }))
            }
        }

        // 接收消息时
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                onMessage(data)
            } catch (err) {
                console.error('Failed to parse WebSocket message:', err)
                onMessage(event.data) // 如果不是 JSON，直接传递原始数据
            }
        }

        // 发生错误时
        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            if (onError) {
                onError(error)
            }
        }

        // 连接关闭时
        ws.onclose = (event) => {
            console.log('WebSocket closed:', event.code, event.reason)
            if (onClose) {
                onClose(event)
            }
        }

        return ws
    },

    /**
     * 发送消息到 WebSocket
     * @param ws WebSocket 实例
     * @param query 用户查询
     */
    sendMessage: (ws: WebSocket, query: string, sessionId?: number | string) => {
        if (ws.readyState === WebSocket.OPEN) {
            const payload: any = {
                type: 'message',
                query: query
            }
            if (sessionId) {
                // 确保 session_id 是数字类型，后端可能期望数字
                payload.session_id = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId
            }
            console.log('📨 WebSocket sending payload:', JSON.stringify(payload))
            ws.send(JSON.stringify(payload))
        } else {
            console.error('WebSocket is not open. ReadyState:', ws.readyState)
            throw new Error('WebSocket connection is not open')
        }
    },

    /**
     * 关闭 WebSocket 连接
     * @param ws WebSocket 实例
     */
    closeConnection: (ws: WebSocket) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close()
        }
    }
}
