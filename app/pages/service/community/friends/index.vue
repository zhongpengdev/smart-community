<template>
    <div
        class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors duration-300">
        <div class="max-w-[1500px] mx-auto px-4 py-4 flex items-start gap-4">

            <!-- Left Sidebar -->
            <aside class="sticky top-[56px] shrink-0 w-60">
                <MainPageLeftSiderBar />
            </aside>

            <!-- Main Content -->
            <main class="flex-1 min-w-0 flex flex-col gap-6">

                <!-- Top Banner -->
                <FriendsTopBanner 
                    :search-query="searchQuery"
                    @update:search-query="searchQuery = $event"
                    @add-friend="showAddDialog = true"
                />

                <!-- Tab Navigation -->
                <div class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-2">
                    <div class="flex items-center gap-2">
                        <button
                            @click="activeTab = 'friends'"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all duration-200 font-medium"
                            :class="activeTab === 'friends' 
                                ? 'bg-[#ff5000] text-white shadow-lg shadow-orange-500/20' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        >
                            <Icon name="lucide:users" size="18" />
                            <span>我的好友</span>
                            <span v-if="total > 0" class="px-2 py-0.5 rounded text-xs"
                                :class="activeTab === 'friends' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'">
                                {{ total }}
                            </span>
                        </button>
                        <button
                            @click="activeTab = 'requests'"
                            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all duration-200 font-medium relative"
                            :class="activeTab === 'requests' 
                                ? 'bg-[#ff5000] text-white shadow-lg shadow-orange-500/20' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
                        >
                            <Icon name="lucide:user-plus" size="18" />
                            <span>好友申请</span>
                            <span v-if="requestsTotal > 0" 
                                class="px-2 py-0.5 rounded text-xs"
                                :class="activeTab === 'requests' ? 'bg-white/20' : 'bg-red-500 text-white'">
                                {{ requestsTotal }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- Content Area -->
                <div class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 p-6">
                    <!-- Friends List Tab -->
                    <FriendsList
                        v-if="activeTab === 'friends'"
                        :friends="displayFriends"
                        :loading="loading"
                        :total="total"
                        @refresh="loadFriends"
                        @page-change="handlePageChange"
                        @send-message="handleOpenChat"
                    />

                    <!-- Requests List Tab -->
                    <FriendsRequestsList
                        v-else
                        :requests="friendRequests"
                        :loading="loading"
                        :requests-total="requestsTotal"
                        @refresh="loadRequests"
                    />
                </div>

            </main>

        </div>

        <!-- Search User Dialog -->
        <FriendsAddDialog
            v-model:visible="showAddDialog"
            @select-user="handleSelectUser"
        />

        <!-- Add Friend Confirm Dialog -->
        <FriendsAddConfirmDialog
            v-model:visible="showConfirmDialog"
            :user="selectedUser"
            @success="handleAddSuccess"
        />

    </div>
</template>

<script setup lang="ts">
import type { UserSearchResult } from '~/composables/useFriends'

const { 
    loading, 
    friendList, 
    friendRequests, 
    total, 
    requestsTotal,
    getFriendList, 
    getFriendRequests,
    searchFriends 
} = useFriends()

const activeTab = ref<'friends' | 'requests'>('friends')
const showAddDialog = ref(false)
const showConfirmDialog = ref(false)
const selectedUser = ref<UserSearchResult | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 显示的好友列表（支持搜索）
const displayFriends = computed(() => {
    if (!searchQuery.value.trim()) {
        return friendList.value
    }
    return searchFriends(searchQuery.value)
})

// 加载好友列表
const loadFriends = async () => {
    try {
        await getFriendList({
            pageNum: currentPage.value,
            pageSize: pageSize.value
        })
    } catch (error) {
        console.error('加载好友列表失败:', error)
    }
}

// 加载好友申请列表
const loadRequests = async () => {
    try {
        await getFriendRequests({
            pageNum: 1,
            pageSize: 50
        })
    } catch (error) {
        console.error('加载好友申请失败:', error)
    }
}

// 分页变化
const handlePageChange = (page: number, size: number) => {
    currentPage.value = page
    pageSize.value = size
    loadFriends()
}

// 选择用户
const handleSelectUser = (user: UserSearchResult) => {
    selectedUser.value = user
    showConfirmDialog.value = true
}

// 添加好友成功
const handleAddSuccess = () => {
    ElMessage.success('好友申请已发送')
    showConfirmDialog.value = false
    selectedUser.value = null
    // 可以选择刷新列表或切换到申请列表
}

// 打开聊天页面
const handleOpenChat = (friend: any) => {
    const router = useRouter()
    router.push({
        path: '/service/community/chat',
        query: {
            openChat: friend.friendUserId
        }
    })
}

// 初始化加载
onMounted(async () => {
    await loadFriends()
    await loadRequests()
})

// 监听 tab 切换
watch(activeTab, (newTab) => {
    if (newTab === 'requests') {
        loadRequests()
    }
})
</script>

<style scoped>
/* 自定义样式 */
</style>