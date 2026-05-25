<template>
    <div
        class="h-screen overflow-hidden">
        <div class="px-5 py-2 gap-2 max-w-[1500px] mx-auto h-[calc(100vh-50px)] flex items-start">

            <!-- Main Content -->
            <main class="flex-1 min-w-0 h-full">
                <div
                    class="h-full bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 overflow-hidden flex">

                    <!-- 好友列表侧边栏 -->
                    <div class="w-80 border-r border-slate-100 dark:border-slate-700/50 flex flex-col">
                        <!-- 搜索栏 -->
                        <div class="p-4 border-b border-slate-100 dark:border-slate-700/50">
                            <div class="relative">
                                <Icon name="lucide:search" size="18"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input v-model="searchQuery" type="text" placeholder="搜索好友..."
                                    class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] transition-all" />
                            </div>
                        </div>

                        <!-- 好友列表 -->
                        <div class="flex-1 overflow-y-auto">
                            <template v-if="loading">
                                <div class="flex items-center justify-center py-12">
                                    <Icon name="lucide:loader-2" size="32" class="animate-spin text-[#ff5000]" />
                                </div>
                            </template>
                            <template v-else-if="displayFriends.length === 0">
                                <div class="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <Icon name="lucide:users" size="48" class="mb-3 opacity-30" />
                                    <p class="text-sm">暂无好友</p>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="friend in displayFriends" :key="friend.friendUserId"
                                    @click="selectFriend(friend)"
                                    class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800/30"
                                    :class="{ 'bg-orange-50 dark:bg-orange-950/20': currentFriend?.friendUserId === friend.friendUserId }">
                                    <div class="relative">
                                        <el-avatar :size="48" :src="friend.friendAvatar">
                                            {{ friend.friendUserName.charAt(0) }}
                                        </el-avatar>
                                        <!-- 在线状态 -->
                                        <div v-if="onlineStatus[friend.friendUserId]"
                                            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded">
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center justify-between mb-1">
                                            <h4 class="font-semibold text-slate-800 dark:text-white truncate">
                                                {{ friend.friendUserName }}
                                            </h4>
                                            <!-- 未读消息数 -->
                                            <span v-if="getUnreadCount(friend.friendUserId) > 0"
                                                class="px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                                                {{ getUnreadCount(friend.friendUserId) }}
                                            </span>
                                        </div>
                                        <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {{ friend.friendPhone }}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- 聊天区域 -->
                    <div class="flex-1 flex flex-col">
                        <template v-if="currentFriend">
                            <!-- 聊天头部 -->
                            <div
                                class="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <el-avatar :size="40" :src="currentFriend.friendAvatar">
                                        {{ currentFriend.friendUserName.charAt(0) }}
                                    </el-avatar>
                                    <div>
                                        <h3 class="font-bold text-slate-800 dark:text-white">
                                            {{ currentFriend.friendUserName }}
                                        </h3>
                                        <p class="text-xs text-slate-500 dark:text-slate-400">
                                            <span v-if="onlineStatus[currentFriend.friendUserId]"
                                                class="text-green-500">● 在线</span>
                                            <span v-else class="text-slate-400">○ 离线</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- 消息列表 -->
                            <div ref="messageListRef" class="flex-1 overflow-y-auto p-6 space-y-4">
                                <template v-if="chatLoading">
                                    <div class="flex items-center justify-center py-12">
                                        <Icon name="lucide:loader-2" size="32" class="animate-spin text-[#ff5000]" />
                                    </div>
                                </template>
                                <template v-else-if="messages.length === 0">
                                    <div class="flex flex-col items-center justify-center py-12 text-slate-400">
                                        <Icon name="lucide:message-circle" size="48" class="mb-3 opacity-30" />
                                        <p class="text-sm">暂无消息，开始聊天吧！</p>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-for="message in messages" :key="message.messageId" class="flex gap-3"
                                        :class="{ 'flex-row-reverse': message.fromUserId === currentUserId }">
                                        <el-avatar :size="36"
                                            :src="message.fromUserId === currentUserId ? userStore.userInfo?.avatar : currentFriend.friendAvatar">
                                            {{ message.fromUserName.charAt(0) }}
                                        </el-avatar>
                                        <div class="max-w-[60%] px-4 py-2 rounded"
                                            :class="message.fromUserId === currentUserId
                                                ? 'bg-[#ff5000] text-white rounded-none'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-none'">
                                            <p class="text-sm leading-relaxed break-words">{{ message.content }}</p>
                                            <p class="text-xs mt-1 opacity-70"
                                                :class="message.fromUserId === currentUserId ? 'text-right' : 'text-left'">
                                                {{ formatTime(message.createTime) }}
                                                <span
                                                    v-if="message.fromUserId === currentUserId && message.isRead === 1"
                                                    class="ml-1">✓✓</span>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            <!-- 输入框 -->
                            <div class="p-4 border-t border-slate-100 dark:border-slate-700/50">
                                <div class="flex gap-3">
                                    <el-input v-model="messageInput" type="textarea" :rows="3" placeholder="输入消息..."
                                        @keydown.enter.exact.prevent="handleSendMessage" class="flex-1" />
                                    <button @click="handleSendMessage" :disabled="!messageInput.trim() || sending"
                                        class="px-6 py-2 bg-[#ff5000] hover:bg-[#ff7000] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        <Icon v-if="sending" name="lucide:loader-2" size="20" class="animate-spin" />
                                        <Icon v-else name="lucide:send" size="20" />
                                    </button>
                                </div>
                                <p class="text-xs text-slate-400 mt-2">按 Enter 发送，Shift + Enter 换行</p>
                            </div>
                        </template>
                        <template v-else>
                            <!-- 未选择好友 -->
                            <div class="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <Icon name="lucide:message-square-dashed" size="64" class="mb-4 opacity-30" />
                                <p class="text-lg font-medium">选择一个好友开始聊天</p>
                            </div>
                        </template>
                    </div>

                </div>
            </main>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useFriends } from '~/composables/useFriends'
import { useChat } from '~/composables/useChat'
import type { Friend } from '~/composables/useFriends'

definePageMeta({
    layout: 'default'
})

const route = useRoute()
const userStore = useUserStore()
const currentUserId = computed(() => userStore.userInfo?.userId ? Number(userStore.userInfo.userId) : 0)

const { friendList, loading, getFriendList } = useFriends()
const {
    messages,
    loading: chatLoading,
    sending,
    getChatHistory,
    sendMessage,
    checkUserOnline,
    openChat
} = useChat()

const searchQuery = ref('')
const currentFriend = ref<Friend | null>(null)
const messageInput = ref('')
const messageListRef = ref<HTMLElement | null>(null)
const onlineStatus = ref<Record<number, boolean>>({})

// 显示的好友列表（支持搜索）
const displayFriends = computed(() => {
    if (!searchQuery.value.trim()) {
        return friendList.value
    }
    return friendList.value.filter(f =>
        f.friendUserName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        f.friendPhone.includes(searchQuery.value)
    )
})

// 获取未读消息数（TODO: 需要后端支持）
const getUnreadCount = (friendUserId: number) => {
    return 0 // 暂时返回0，需要后端API支持
}

// 选择好友
const selectFriend = async (friend: Friend) => {
    currentFriend.value = friend
    messageInput.value = ''

    // 使用 openChat 方法，它会设置 currentChatUser 并加载聊天记录
    await openChat({
        userId: friend.friendUserId,
        userName: friend.friendUserName,
        avatar: friend.friendAvatar
    })

    // 滚动到底部
    nextTick(() => {
        scrollToBottom()
    })
}

// 发送消息
const handleSendMessage = async () => {
    if (!messageInput.value.trim() || !currentFriend.value) return

    try {
        await sendMessage(currentFriend.value.friendUserId, messageInput.value)
        messageInput.value = ''

        // 滚动到底部
        nextTick(() => {
            scrollToBottom()
        })
    } catch (error) {
        console.error('发送消息失败:', error)
    }
}

// 滚动到底部
const scrollToBottom = () => {
    if (messageListRef.value) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
}

// 格式化时间
const formatTime = (time: string) => {
    const now = new Date()
    const date = new Date(time)
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`

    return date.toLocaleDateString('zh-CN')
}

// 检查好友在线状态
const checkFriendsOnlineStatus = async () => {
    for (const friend of friendList.value) {
        try {
            const isOnline = await checkUserOnline(friend.friendUserId)
            onlineStatus.value[friend.friendUserId] = isOnline
        } catch (error) {
            onlineStatus.value[friend.friendUserId] = false
        }
    }
}

// 初始化
onMounted(async () => {
    await getFriendList({ pageNum: 1, pageSize: 100 })
    await checkFriendsOnlineStatus()

    // 定期刷新在线状态
    setInterval(checkFriendsOnlineStatus, 30000)

    // 检查是否有通过路由参数指定的好友
    const openChatUserId = route.query.openChat
    if (openChatUserId) {
        const friend = friendList.value.find(f => f.friendUserId === Number(openChatUserId))
        if (friend) {
            selectFriend(friend)
        }
    }
})

// 监听消息变化，自动滚动到底部
watch(() => messages.value.length, () => {
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    @apply bg-slate-100 dark:bg-slate-800 rounded;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600 rounded hover:bg-slate-400 dark:hover:bg-slate-500;
}
</style>
