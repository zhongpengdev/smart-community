<template>
    <div @click.stop
        class="absolute right-1 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <el-popover placement="bottom-end" :width="140" trigger="click" :show-arrow="false"
            popper-class="!p-0 !min-w-[140px] !rounded !border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-[#2A2B2D] shadow-xl">
            <template #reference>
                <div
                    class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors cursor-pointer text-gray-500 dark:text-gray-400">
                    <Icon name="lucide:more-horizontal" size="16" />
                </div>
            </template>

            <!-- Menu Content -->
            <div class="flex flex-col p-1.5 gap-0.5 bg-white dark:bg-[#2A2B2D] rounded border border-transparent">
                <!-- Share (Future) -->
                <button
                    class="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors w-full text-left">
                    <Icon name="lucide:share-2" size="14" />
                    <span>Share</span>
                </button>

                <div class="h-[1px] bg-gray-100 dark:bg-gray-700 my-0.5 mx-1"></div>

                <!-- Delete -->
                <button @click="confirmDelete"
                    class="flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors w-full text-left">
                    <Icon name="lucide:trash-2" size="14" />
                    <span>Delete</span>
                </button>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import { useSession } from '~/composables/agent/useSession'

const props = defineProps<{ sessionId: number }>()

const { removeSession } = useSession()
const router = useRouter()
const route = useRoute()

const confirmDelete = () => {
    ElMessageBox.confirm(
        '确认删除该会话吗?',
        '删除会话',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            confirmButtonClass: 'el-button--danger',
            type: 'warning',
            autofocus: false
        }
    ).then(async () => {
        await handleDelete()
    }).catch(() => {
        // Cancelled
    })
}

const handleDelete = async () => {
    const success = await removeSession(props.sessionId)
    if (success) {
        const currentId = Number(route.params.sessionId)
        if (currentId && currentId === props.sessionId) {
            await navigateTo('/agent')
        }
    }
}
</script>

<style>
/* Ensure popover background matches dark mode */
.el-popover.dark-mode-popover {
    background-color: #2A2B2D !important;
    border-color: #374151 !important;
}
</style>
