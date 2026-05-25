<template>
    <el-dialog
        v-model="dialogVisible"
        title="添加好友"
        width="600px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <div class="space-y-4">
            <!-- 搜索用户 -->
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    搜索用户
                </label>
                <div class="flex gap-2">
                    <el-input
                        v-model="searchKeyword"
                        placeholder="输入手机号或姓名搜索"
                        size="large"
                        clearable
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <Icon name="lucide:search" size="18" class="text-slate-400" />
                        </template>
                    </el-input>
                    <el-button
                        type="primary"
                        size="large"
                        @click="handleSearch"
                        :loading="searchLoading"
                        class="!bg-[#ff5000] !border-[#ff5000] hover:!bg-[#ff6a00]"
                    >
                        搜索
                    </el-button>
                </div>
                <p class="text-xs text-slate-400 mt-1">
                    提示：输入对方的手机号或姓名进行搜索
                </p>
            </div>

            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0" class="max-h-[400px] overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded p-3">
                <div
                    v-for="user in searchResults"
                    :key="user.userId"
                    class="flex items-center gap-3 p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent group"
                    :class="user.friendStatus === 0 ? 'cursor-pointer hover:border-[#ff5000]/20' : 'cursor-not-allowed opacity-60'"
                    @click="handleSelectUser(user)"
                >
                    <el-avatar :size="48" :src="user.avatar" class="shrink-0">
                        {{ user.userName.charAt(0) }}
                    </el-avatar>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <h4 class="text-base font-bold text-slate-800 dark:text-white truncate">
                                {{ user.userName }}
                            </h4>
                            <span v-if="user.gender === 1" class="text-blue-500">
                                <Icon name="lucide:user" size="14" />
                            </span>
                            <span v-else-if="user.gender === 2" class="text-pink-500">
                                <Icon name="lucide:user" size="14" />
                            </span>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {{ user.phone }} · {{ user.age }}岁
                        </p>
                    </div>

                    <!-- 好友状态标签和操作按钮 -->
                    <div class="shrink-0 flex items-center gap-2">
                        <span v-if="user.friendStatus === 0" class="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            可添加
                        </span>
                        <span v-else-if="user.friendStatus === 1" class="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                            待审核
                        </span>
                        <span v-else-if="user.friendStatus === 2" class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                            已是好友
                        </span>
                        
                        <Icon 
                            v-if="user.friendStatus === 0"
                            name="lucide:user-plus" 
                            size="18" 
                            class="text-[#ff5000] opacity-0 group-hover:opacity-100 transition-opacity" 
                        />
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-else-if="hasSearched && !searchLoading" class="text-center py-8 text-slate-400">
                <Icon name="lucide:search-x" size="48" class="mx-auto mb-2 opacity-50" />
                <p class="text-sm">未找到相关用户</p>
            </div>

        </div>

        <template #footer>
            <div class="flex items-center justify-end">
                <el-button @click="handleClose" size="large">
                    关闭
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { UserSearchResult } from '~/composables/useFriends'

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
    'select-user': [user: UserSearchResult]
}>()

const { searchUsers, searchLoading, searchResults } = useFriends()

const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
})

const searchKeyword = ref('')
const hasSearched = ref(false)

// 搜索用户
const handleSearch = async () => {
    if (!searchKeyword.value.trim()) {
        ElMessage.warning('请输入搜索关键词')
        return
    }

    hasSearched.value = true
    
    try {
        await searchUsers(searchKeyword.value)
    } catch (error) {
        // 错误已在 composable 中处理
    }
}

// 选择用户
const handleSelectUser = (user: UserSearchResult) => {
    if (user.friendStatus === 2) {
        ElMessage.info('该用户已是你的好友')
        return
    }
    if (user.friendStatus === 1) {
        ElMessage.info('已向该用户发送过好友申请')
        return
    }
    
    // 触发选择用户事件，打开确认对话框
    emit('select-user', user)
}

// 关闭对话框
const handleClose = () => {
    searchKeyword.value = ''
    hasSearched.value = false
    dialogVisible.value = false
}
</script>

<style scoped>
:deep(.el-dialog__header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
}

:deep(.el-dialog__body) {
    padding: 24px;
}

:deep(.el-dialog__footer) {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
}
</style>

