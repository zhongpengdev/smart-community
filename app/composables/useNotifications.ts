import { ref, computed } from 'vue'
import { getNotificationListApi, markNotificationReadApi } from '~/utils/api'
import { ElMessage } from 'element-plus'

// 通知类型枚举
export enum NotificationType {
    SYSTEM = 1,      // 系统通知
    LIKE = 2,        // 点赞通知
    COMMENT = 3,     // 评论通知
    FRIEND_REQUEST = 4, // 好友申请
    PRIVATE_MESSAGE = 5 // 私信通知
}

// 通知类型文本映射
export const NotificationTypeText: Record<number, string> = {
    [NotificationType.SYSTEM]: '系统通知',
    [NotificationType.LIKE]: '点赞通知',
    [NotificationType.COMMENT]: '评论通知',
    [NotificationType.FRIEND_REQUEST]: '好友申请',
    [NotificationType.PRIVATE_MESSAGE]: '私信通知'
}

// 通知类型图标映射
export const NotificationTypeIcon: Record<number, string> = {
    [NotificationType.SYSTEM]: 'lucide:bell',
    [NotificationType.LIKE]: 'lucide:heart',
    [NotificationType.COMMENT]: 'lucide:message-circle',
    [NotificationType.FRIEND_REQUEST]: 'lucide:user-plus',
    [NotificationType.PRIVATE_MESSAGE]: 'lucide:mail'
}

// 通知类型颜色映射
export const NotificationTypeColor: Record<number, string> = {
    [NotificationType.SYSTEM]: 'blue',
    [NotificationType.LIKE]: 'red',
    [NotificationType.COMMENT]: 'green',
    [NotificationType.FRIEND_REQUEST]: 'orange',
    [NotificationType.PRIVATE_MESSAGE]: 'purple'
}

// 通知接口
export interface Notification {
    notificationId: number
    type: number
    title: string
    content: string
    relatedId: number
    isRead: number // 0-未读 1-已读
    createTime: string
}

// 通知列表响应
export interface NotificationListResponse {
    records: Notification[]
    total: number
    size: number
    current: number
    pages: number
}

// 全局状态（单例模式）
const notifications = ref<Notification[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
let isWebSocketListenerRegistered = false

export const useNotifications = () => {
    // 未读通知数量
    const unreadCount = computed(() => {
        return notifications.value.filter(n => n.isRead === 0).length
    })
    
    // WebSocket 实例
    const { onMessage } = useWebSocket()

    // 获取通知列表
    const fetchNotifications = async (page: number = 1, size: number = 10) => {
        loading.value = true
        try {
            const res = await getNotificationListApi({
                pageNum: page,
                pageSize: size
            })

            if (res.code === 200 && res.data) {
                notifications.value = res.data.records || []
                total.value = res.data.total || 0
                currentPage.value = res.data.current || 1
                pageSize.value = res.data.size || 10
            }
        } catch (error: any) {
            console.error('获取通知列表失败:', error)
            ElMessage.error(error.message || '获取通知列表失败')
        } finally {
            loading.value = false
        }
    }

    // 标记通知已读
    const markAsRead = async (notificationId: number) => {
        try {
            const res = await markNotificationReadApi(notificationId)
            
            if (res.code === 200) {
                // 更新本地状态
                const notification = notifications.value.find(n => n.notificationId === notificationId)
                if (notification) {
                    notification.isRead = 1
                }
                ElMessage.success('已标记为已读')
            }
        } catch (error: any) {
            console.error('标记已读失败:', error)
            ElMessage.error(error.message || '标记已读失败')
        }
    }

    // 标记所有通知已读
    const markAllAsRead = async () => {
        const unreadNotifications = notifications.value.filter(n => n.isRead === 0)
        
        if (unreadNotifications.length === 0) {
            ElMessage.info('没有未读通知')
            return
        }

        try {
            // 批量标记已读
            await Promise.all(
                unreadNotifications.map(n => markNotificationReadApi(n.notificationId))
            )

            // 更新本地状态
            notifications.value.forEach(n => {
                if (n.isRead === 0) {
                    n.isRead = 1
                }
            })

            ElMessage.success('已全部标记为已读')
        } catch (error: any) {
            console.error('批量标记已读失败:', error)
            ElMessage.error(error.message || '批量标记已读失败')
        }
    }

    // 根据类型筛选通知
    const filterByType = (type: NotificationType) => {
        return notifications.value.filter(n => n.type === type)
    }

    // 获取未读通知
    const getUnreadNotifications = () => {
        return notifications.value.filter(n => n.isRead === 0)
    }

    // 获取已读通知
    const getReadNotifications = () => {
        return notifications.value.filter(n => n.isRead === 1)
    }
    
    /**
     * 处理 WebSocket 消息 - 监听新通知
     */
    const handleWebSocketMessage = (wsMessage: any) => {
        // 当收到聊天消息时，刷新通知列表（后端会自动创建通知）
        if (wsMessage.type === 'CHAT') {
            const userStore = useUserStore()
            const currentUserId = userStore.userInfo?.userId ? Number(userStore.userInfo.userId) : 0
            
            // 如果是收到的消息（不是自己发的）
            if (wsMessage.toUserId === currentUserId && wsMessage.fromUserId !== currentUserId) {
                console.log('收到新消息，刷新通知列表')
                
                // 显示美观的通知提示
                ElNotification({
                    title: '新消息',
                    message: h('div', { class: 'flex items-center gap-3' }, [
                        h('img', {
                            src: wsMessage.fromUserAvatar || '/default-avatar.png',
                            class: 'w-10 h-10 rounded object-cover',
                            style: 'flex-shrink: 0;'
                        }),
                        h('div', { class: 'flex-1 min-w-0' }, [
                            h('div', { class: 'font-semibold text-slate-800 dark:text-white mb-1' }, wsMessage.fromUserName),
                            h('div', { class: 'text-sm text-slate-600 dark:text-slate-400 truncate' }, wsMessage.content)
                        ])
                    ]),
                    type: 'info',
                    duration: 4000,
                    position: 'top-right',
                    customClass: 'message-notification',
                    offset: 60
                })
                
                // 延迟一下再刷新，确保后端已经创建了通知
                setTimeout(() => {
                    fetchNotifications(currentPage.value, pageSize.value)
                }, 500)
            }
        }
    }
    
    // 注册 WebSocket 消息监听（只注册一次）
    if (!isWebSocketListenerRegistered) {
        onMessage(handleWebSocketMessage)
        isWebSocketListenerRegistered = true
        console.log('已注册通知 WebSocket 监听器')
    }

    return {
        notifications,
        loading,
        total,
        currentPage,
        pageSize,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        filterByType,
        getUnreadNotifications,
        getReadNotifications
    }
}

