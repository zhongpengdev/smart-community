<template>
    <el-dialog
        v-model="dialogVisible"
        title="添加好友"
        width="450px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <!-- 用户信息 -->
        <div v-if="user" class="mb-6">
            <div class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded">
                <el-avatar :size="64" :src="user.avatar" class="shrink-0">
                    {{ user.userName.charAt(0) }}
                </el-avatar>
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-lg font-bold text-slate-800 dark:text-white truncate">
                            {{ user.userName }}
                        </h4>
                        <span v-if="user.gender === 1" class="text-blue-500">
                            <Icon name="lucide:user" size="16" />
                        </span>
                        <span v-else-if="user.gender === 2" class="text-pink-500">
                            <Icon name="lucide:user" size="16" />
                        </span>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        {{ user.phone }} · {{ user.age }}岁
                    </p>
                </div>
            </div>
        </div>

        <!-- 表单 -->
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    备注名称（可选）
                </label>
                <el-input
                    v-model="form.remark"
                    placeholder="给好友设置一个备注名称"
                    size="large"
                    maxlength="20"
                    show-word-limit
                    clearable
                >
                    <template #prefix>
                        <Icon name="lucide:tag" size="18" class="text-slate-400" />
                    </template>
                </el-input>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    申请说明（可选）
                </label>
                <el-input
                    v-model="form.message"
                    type="textarea"
                    placeholder="向对方介绍一下自己吧..."
                    :rows="4"
                    maxlength="100"
                    show-word-limit
                />
            </div>
        </div>

        <template #footer>
            <div class="flex items-center justify-end gap-3">
                <el-button @click="handleClose" size="large">
                    取消
                </el-button>
                <el-button
                    type="primary"
                    @click="handleSubmit"
                    :loading="loading"
                    size="large"
                    class="!bg-[#ff5000] !border-[#ff5000] hover:!bg-[#ff6a00]"
                >
                    {{ loading ? '发送中...' : '发送申请' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { UserSearchResult } from '~/composables/useFriends'

const props = defineProps<{
    visible: boolean
    user: UserSearchResult | null
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
    success: []
}>()

const { sendFriendRequest, loading } = useFriends()

const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
})

const form = reactive({
    remark: '',
    message: ''
})

// 提交申请
const handleSubmit = async () => {
    if (!props.user) {
        ElMessage.warning('用户信息错误')
        return
    }

    try {
        await sendFriendRequest(props.user.userId, form.remark || form.message)
        emit('success')
        handleClose()
    } catch (error) {
        // 错误已在 composable 中处理
    }
}

// 关闭对话框
const handleClose = () => {
    form.remark = ''
    form.message = ''
    dialogVisible.value = false
}

// 监听用户变化，重置表单
watch(() => props.user, () => {
    form.remark = ''
    form.message = ''
})
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

