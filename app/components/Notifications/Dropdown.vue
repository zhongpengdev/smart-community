<template>
    <el-popover :visible="visible" placement="bottom-end" :width="350" trigger="click"
        popper-class="notification-popover" @update:visible="handleVisibleChange">
        <template #reference>
            <button
                class="relative w-5 h-5 flex items-center justify-center rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#ff5000] transition-colors">
                <Icon name="lucide:bell" size="14" />
                <!-- 未读通知徽章 -->
                <span v-if="unreadCount > 0"
                    class="absolute -top-1 -right-1 min-w-[12px] h-[12px] flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded ring-2 ring-white dark:ring-slate-900">
                    {{ unreadCount }}
                </span>
            </button>
        </template>

        <!-- 通知内容 -->
        <div class="notification-content bg-white dark:bg-slate-900">
            <!-- 头部 -->
            <div
                class="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <div class="flex items-center gap-2.5">
                    <div>
                        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">
                            通知中心
                        </h3>
                        <p v-if="unreadCount > 0" class="text-xs text-slate-500 dark:text-slate-400">
                            {{ unreadCount }} 条未读消息
                        </p>
                    </div>
                </div>
                <button v-if="unreadCount > 0" @click="handleMarkAllRead"
                    class="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-[#ff5000] hover:bg-orange-50 dark:hover:bg-orange-950/20 font-medium transition-all">
                    <Icon name="lucide:check-check" size="14" />
                    全部已读
                </button>
            </div>

            <!-- 通知列表 -->
            <div class="notification-list max-h-[350px] overflow-y-auto">
                <template v-if="loading">
                    <div class="flex flex-col items-center justify-center py-16">
                        <div class="relative">
                            <div class="w-12 h-12 rounded border-4 border-orange-100 dark:border-orange-900/20">
                            </div>
                            <div
                                class="absolute inset-0 w-12 h-12 rounded border-4 border-[#ff5000] border-t-transparent animate-spin">
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">加载中...</p>
                    </div>
                </template>

                <template v-else-if="notifications.length === 0">
                    <div class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                        <div
                            class="w-20 h-20 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <Icon name="lucide:bell-off" size="40" class="opacity-40" />
                        </div>
                        <p class="text-sm font-medium dark:text-slate-400">暂无通知</p>
                        <p class="text-xs mt-1 opacity-60 dark:opacity-50">当有新消息时会显示在这里</p>
                    </div>
                </template>

                <template v-else>
                    <div v-for="notification in notifications" :key="notification.notificationId"
                        @click="handleNotificationClick(notification)"
                        class="notification-item px-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent dark:hover:from-orange-950/20 dark:hover:to-transparent cursor-pointer transition-all duration-200 relative group"
                        :class="{ 'unread': notification.isRead === 0 }">
                        <!-- 未读指示条 -->
                        <div v-if="notification.isRead === 0"
                            class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ff5000] to-orange-400">
                        </div>

                        <div class="flex items-start gap-3">
                            <!-- 图标或头像 -->
                            <template v-if="notification.type === 5 && getUserAvatar(notification)">
                                <!-- 私信通知显示发送者头像 -->
                                <el-avatar :size="44" :src="getUserAvatar(notification)"
                                    class="shrink-0 shadow-sm group-hover:shadow-md transition-all duration-200 ring-2 ring-purple-100 dark:ring-purple-900/30">
                                    <Icon name="lucide:user" size="20" />
                                </el-avatar>
                            </template>
                            <template v-else>
                                <!-- 其他类型显示图标 -->
                                <div class="w-11 h-11 shrink-0 flex items-center justify-center rounded shadow-sm group-hover:shadow-md transition-all duration-200"
                                    :class="getTypeColorClass(notification.type)">
                                    <Icon :name="getTypeIcon(notification.type)" size="20" />
                                </div>
                            </template>

                            <!-- 内容 -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between gap-2 mb-1.5">
                                    <h4
                                        class="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-[#ff5000] transition-colors">
                                        {{ notification.title }}
                                    </h4>
                                    <div class="flex items-center gap-2 shrink-0">
                                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                            :class="getTypeBadgeClass(notification.type)">
                                            {{ getTypeText(notification.type) }}
                                        </span>
                                        <span v-if="notification.isRead === 0"
                                            class="w-2 h-2 bg-[#ff5000] rounded animate-pulse"></span>
                                    </div>
                                </div>
                                <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                                    {{ notification.content }}
                                </p>
                                <div class="flex items-center gap-2">
                                    <Icon name="lucide:clock" size="12" class="text-slate-400 dark:text-slate-500" />
                                    <span class="text-xs text-slate-400 dark:text-slate-500">
                                        {{ formatTime(notification.createTime) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- 底部 -->
            <div v-if="notifications.length > 0"
                class="px-4 py-3 border-t border-slate-100 dark:border-slate-700 text-center bg-slate-50/50 dark:bg-slate-800/30">
                <button @click="handleViewAll"
                    class="flex items-center justify-center gap-2 w-full px-4 py-2 rounded text-sm text-[#ff5000] hover:bg-orange-50 dark:hover:bg-orange-950/20 font-medium transition-all group">
                    <span>查看全部通知</span>
                    <Icon name="lucide:arrow-right" size="14" class="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </el-popover>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNotifications, NotificationTypeText, NotificationTypeIcon, NotificationTypeColor, type Notification } from '~/composables/useNotifications'
import { useRouter } from 'vue-router'
import { useFriends } from '~/composables/useFriends'

const router = useRouter()
const visible = ref(false)

const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
} = useNotifications()

const { friendList, getFriendList } = useFriends()

// 获取用户头像（用于私信通知）
const getUserAvatar = (notification: Notification) => {
    if (notification.type === 5) { // 私信通知
        // 从好友列表中查找对应的好友头像
        const friend = friendList.value.find(f => f.friendUserId === notification.relatedId)
        return friend?.friendAvatar || null
    }
    return null
}

// 组件挂载时获取通知和好友列表
onMounted(async () => {
    await Promise.all([
        fetchNotifications(),
        getFriendList({ pageNum: 1, pageSize: 100 }) // 加载好友列表
    ])
})

// 处理弹窗显示状态变化
const handleVisibleChange = async (val: boolean) => {
    visible.value = val
    if (val) {
        // 打开时刷新通知列表和好友列表
        await Promise.all([
            fetchNotifications(),
            getFriendList({ pageNum: 1, pageSize: 100 })
        ])
    }
}

// 处理通知点击
const handleNotificationClick = async (notification: Notification) => {
    // 标记为已读
    if (notification.isRead === 0) {
        await markAsRead(notification.notificationId)
    }

    // 根据通知类型跳转
    switch (notification.type) {
        case 4: // 好友申请
            router.push('/service/community/friends')
            break
        case 5: // 私信通知
            // relatedId 是发送者的用户ID
            // 跳转到聊天页面并打开对应的聊天
            router.push({
                path: '/service/community/chat',
                query: {
                    openChat: notification.relatedId
                }
            })
            break
        default:
            // 其他类型暂不处理
            break
    }

    // 关闭弹窗
    visible.value = false
}

// 标记全部已读
const handleMarkAllRead = async () => {
    await markAllAsRead()
}

// 查看全部通知
const handleViewAll = () => {
    // TODO: 跳转到通知页面
    visible.value = false
}

// 获取类型文本
const getTypeText = (type: number) => {
    return NotificationTypeText[type] || '未知'
}

// 获取类型图标
const getTypeIcon = (type: number) => {
    return NotificationTypeIcon[type] || 'lucide:bell'
}

// 获取类型颜色类
const getTypeColorClass = (type: number) => {
    const color = NotificationTypeColor[type] || 'blue'
    const colorMap: Record<string, string> = {
        blue: 'bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-500/20 dark:to-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/30',
        red: 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-500/20 dark:to-red-600/10 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/30',
        green: 'bg-gradient-to-br from-green-100 to-green-50 dark:from-green-500/20 dark:to-green-600/10 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-500/30',
        orange: 'bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-600/10 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/30',
        purple: 'bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-500/20 dark:to-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/30'
    }
    return colorMap[color] || colorMap.blue
}

// 获取类型徽章类
const getTypeBadgeClass = (type: number) => {
    const color = NotificationTypeColor[type] || 'blue'
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20',
        red: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-500/20',
        green: 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-500/20',
        orange: 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-500/20',
        purple: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/20'
    }
    return colorMap[color] || colorMap.blue
}

// 格式化时间 - 相对时间
const formatTime = (time: string) => {
    const now = new Date()
    const date = new Date(time)
    const diff = now.getTime() - date.getTime()

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) {
        return '刚刚'
    } else if (minutes < 60) {
        return `${minutes}分钟前`
    } else if (hours < 24) {
        return `${hours}小时前`
    } else if (days < 30) {
        return `${days}天前`
    } else if (months < 12) {
        return `${months}个月前`
    } else {
        return `${years}年前`
    }
}
</script>

<style scoped>
.notification-content {
    @apply bg-white dark:bg-slate-900;
}

.notification-list::-webkit-scrollbar {
    width: 6px;
}

.notification-list::-webkit-scrollbar-track {
    @apply bg-slate-100 dark:bg-slate-800/50 rounded;
}

.notification-list::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600/70 rounded hover:bg-slate-400 dark:hover:bg-slate-500;
}

.notification-item.unread {
    @apply bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-500/5 dark:to-transparent;
}

.notification-item {
    @apply relative;
}

.notification-item::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-r from-[#ff5000]/0 to-[#ff5000]/0 transition-all duration-300 pointer-events-none;
}

.notification-item:hover::before {
    @apply from-[#ff5000]/5 to-transparent dark:from-orange-500/10 dark:to-transparent;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

<style>
.notification-popover {
    padding: 0 !important;
    border-radius: 16px !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05) !important;
    overflow: hidden !important;
}

/* 黑夜模式下的弹窗样式 */
html.dark .notification-popover {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
    background: rgb(15 23 42) !important;
}

/* 消息通知样式 */
:deep(.message-notification) {
    border-radius: 12px !important;
    box-shadow: 0 10px 30px rgba(255, 80, 0, 0.15) !important;
    border-left: 4px solid #ff5000 !important;
}

html.dark :deep(.message-notification) {
    box-shadow: 0 10px 30px rgba(255, 80, 0, 0.3) !important;
    border-left: 4px solid #fb923c !important;
    background: rgb(15 23 42) !important;
}

:deep(.message-notification .el-notification__content) {
    margin: 0 !important;
}
</style>
