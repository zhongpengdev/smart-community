<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">
                好友申请
                <span v-if="requestsTotal > 0" class="ml-2 text-sm font-normal text-[#ff5000]">
                    ({{ requestsTotal }})
                </span>
            </h3>
            <button
                v-if="requests.length > 0"
                @click="emit('refresh')"
                class="text-sm text-slate-500 hover:text-[#ff5000] transition-colors"
            >
                <Icon name="lucide:refresh-cw" size="16" class="inline" />
                刷新
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i"
                class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-4 animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!requests || requests.length === 0"
            class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-8 text-center">
            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded inline-block mb-3">
                <Icon name="lucide:inbox" size="32" class="text-slate-400" />
            </div>
            <p class="text-sm text-slate-400">暂无好友申请</p>
        </div>

        <!-- Requests List -->
        <div v-else class="space-y-3">
            <div v-for="request in requests" :key="request.friendId"
                class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-4 hover:shadow-md transition-all duration-200">
                
                <div class="flex items-center gap-4">
                    <!-- Avatar -->
                    <el-avatar 
                        :size="48" 
                        :src="request.friendAvatar"
                        class="shrink-0 border-2 border-slate-100 dark:border-slate-700"
                    >
                        {{ request.friendUserName.charAt(0) }}
                    </el-avatar>
                    
                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <h4 class="text-base font-bold text-slate-800 dark:text-white truncate mb-1">
                            {{ request.friendUserName }}
                        </h4>
                        <p v-if="request.remark" class="text-sm text-slate-500 dark:text-slate-400 truncate mb-1">
                            {{ request.remark }}
                        </p>
                        <div class="flex items-center gap-2 text-xs text-slate-400">
                            <Icon name="lucide:clock" size="12" />
                            <span>{{ formatTime(request.createTime) }}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2 shrink-0">
                        <button
                            @click="handleAccept(request.friendId)"
                            :disabled="actionLoading"
                            class="px-4 py-2 bg-[#ff5000] hover:bg-[#ff6a00] text-white rounded transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="lucide:check" size="16" class="inline mr-1" />
                            接受
                        </button>
                        <button
                            @click="handleReject(request.friendId)"
                            :disabled="actionLoading"
                            class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="lucide:x" size="16" class="inline mr-1" />
                            拒绝
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Friend } from '~/composables/useFriends'

const props = defineProps<{
    requests: Friend[]
    loading: boolean
    requestsTotal: number
}>()

const emit = defineEmits<{
    refresh: []
}>()

const { acceptFriendRequest, rejectFriendRequest, loading: actionLoading } = useFriends()

// 格式化时间
const formatTime = (time: string) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN')
}

// 接受申请
const handleAccept = async (friendId: number) => {
    try {
        await acceptFriendRequest(friendId)
        emit('refresh')
    } catch (error) {
        console.error('接受好友申请失败:', error)
    }
}

// 拒绝申请
const handleReject = async (friendId: number) => {
    try {
        await rejectFriendRequest(friendId)
        emit('refresh')
    } catch (error) {
        console.error('拒绝好友申请失败:', error)
    }
}
</script>

<style scoped>
/* 自定义样式 */
</style>

