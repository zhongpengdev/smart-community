<template>
    <div class="space-y-4">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" 
                class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-6 animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!friends || friends.length === 0"
            class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-12 text-center">
            <div class="p-6 bg-slate-50 dark:bg-slate-800 rounded inline-block mb-4">
                <Icon name="lucide:users" size="48" class="text-slate-400" />
            </div>
            <h3 class="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">暂无好友</h3>
            <p class="text-sm text-slate-400 mb-4">快去添加新朋友吧</p>
        </div>

        <!-- Friends Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="friend in friends" :key="friend.friendId"
                class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-6 hover:shadow-lg hover:border-[#ff5000]/20 transition-all duration-300 group">
                
                <!-- Friend Info -->
                <div class="flex items-start gap-4 mb-4">
                    <div class="relative">
                        <el-avatar 
                            :size="64" 
                            :src="friend.friendAvatar"
                            class="shrink-0 border-2 border-slate-100 dark:border-slate-700 group-hover:border-[#ff5000] transition-colors"
                        >
                            {{ friend.friendUserName.charAt(0) }}
                        </el-avatar>
                        <!-- 在线状态指示器 -->
                        <div 
                            v-if="onlineStatus[friend.friendUserId]"
                            class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded"
                            title="在线"
                        ></div>
                        <div 
                            v-else
                            class="absolute bottom-0 right-0 w-4 h-4 bg-slate-400 border-2 border-white dark:border-slate-800 rounded"
                            title="离线"
                        ></div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="text-lg font-bold text-slate-800 dark:text-white truncate">
                                {{ friend.friendUserName }}
                            </h3>
                            <span 
                                v-if="onlineStatus[friend.friendUserId]"
                                class="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            >
                                在线
                            </span>
                        </div>
                        <p v-if="friend.remark" class="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">
                            备注：{{ friend.remark }}
                        </p>
                        <div class="flex items-center gap-2 text-xs text-slate-400">
                            <Icon name="lucide:clock" size="12" />
                            <span>{{ formatTime(friend.createTime) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        @click="handleSendMessage(friend)"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-[#ff5000] hover:text-white text-slate-600 dark:text-slate-300 rounded transition-all duration-200 text-sm font-medium group/btn"
                    >
                        <Icon name="lucide:message-circle" size="16" class="group-hover/btn:scale-110 transition-transform" />
                        <span>发消息</span>
                    </button>
                    
                    <button
                        @click="handleDelete(friend)"
                        class="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-600 dark:text-slate-300 rounded transition-all duration-200 text-sm font-medium group/btn"
                        title="删除好友"
                    >
                        <Icon name="lucide:user-minus" size="16" class="group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="friends && friends.length > 0 && total > pageSize" class="flex justify-center pt-6">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[12, 24, 48]"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Friend } from '~/composables/useFriends'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{
    friends: Friend[]
    loading: boolean
    total: number
}>()

const emit = defineEmits<{
    refresh: []
    pageChange: [page: number, size: number]
    sendMessage: [friend: Friend]
}>()

const { deleteFriend } = useFriends()
const { checkUserOnline } = useChat()

const currentPage = ref(1)
const pageSize = ref(12)

// 在线状态映射
const onlineStatus = ref<Record<number, boolean>>({})

// 格式化时间
const formatTime = (time: string) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN')
}

// 删除好友
const handleDelete = async (friend: Friend) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除好友 "${friend.friendUserName}" 吗？`,
            '删除好友',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        
        await deleteFriend(friend.friendUserId)
        emit('refresh')
    } catch (error) {
        // 用户取消或删除失败
        if (error !== 'cancel') {
            console.error('删除好友失败:', error)
        }
    }
}

// 分页变化
const handlePageChange = (page: number) => {
    emit('pageChange', page, pageSize.value)
}

const handleSizeChange = (size: number) => {
    currentPage.value = 1
    emit('pageChange', 1, size)
}

// 发送消息
const handleSendMessage = (friend: Friend) => {
    emit('sendMessage', friend)
}

// 检查好友在线状态
const checkFriendsOnlineStatus = async () => {
    if (!props.friends || props.friends.length === 0) return
    
    // 批量检查所有好友的在线状态
    const promises = props.friends.map(async (friend) => {
        try {
            const isOnline = await checkUserOnline(friend.friendUserId)
            onlineStatus.value[friend.friendUserId] = isOnline
        } catch (error) {
            console.error(`检查用户 ${friend.friendUserId} 在线状态失败:`, error)
            onlineStatus.value[friend.friendUserId] = false
        }
    })
    
    await Promise.all(promises)
}

// 监听好友列表变化，检查在线状态
watch(() => props.friends, () => {
    checkFriendsOnlineStatus()
}, { immediate: true })

// 定期刷新在线状态（每30秒）
let onlineStatusTimer: NodeJS.Timeout | null = null

onMounted(() => {
    checkFriendsOnlineStatus()
    
    // 定期刷新
    onlineStatusTimer = setInterval(() => {
        checkFriendsOnlineStatus()
    }, 30000)
})

onUnmounted(() => {
    if (onlineStatusTimer) {
        clearInterval(onlineStatusTimer)
        onlineStatusTimer = null
    }
})
</script>

<style scoped>
/* 自定义样式 */
</style>