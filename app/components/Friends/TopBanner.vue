<template>
    <div
        class="bg-white dark:bg-white/5 rounded shadow-sm border border-slate-100 dark:border-white/5 p-4 flex items-center justify-between backdrop-blur-xl">
        <!-- Left: Actions -->
        <div class="flex items-center gap-4">
            <h2 class="text-lg font-bold text-slate-800 dark:text-white hidden md:block mr-2">我的好友</h2>

            <!-- Add Friend -->
            <button @click="emit('addFriend')"
                class="flex items-center gap-2 px-4 py-2 bg-[#ff5000] hover:bg-[#ff6a00] text-white rounded transition-all shadow-lg shadow-orange-500/20 active:scale-95 duration-200 group">
                <Icon name="lucide:user-plus" size="18"
                    class="group-hover:rotate-90 transition-transform duration-300" />
                <span class="font-medium text-sm">添加好友</span>
            </button>

            <!-- Search Input -->
            <div class="relative group hidden sm:block">
                <Icon name="lucide:search" size="16"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff5000] transition-colors" />
                <input type="text" placeholder="搜索好友..." :value="searchQuery"
                    @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                    class="pl-9 pr-4 py-2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] w-64 transition-all" />
            </div>
        </div>

        <!-- Right: My Info -->
        <div class="flex items-center gap-4">
            <div class="h-8 w-px bg-slate-100 dark:bg-slate-700"></div>

            <!-- User Card -->
            <div
                class="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1.5 pr-3 rounded transition-colors group select-none">
                <el-avatar :size="36" :src="userStore.userInfo?.avatar"
                    class="border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform" />
                <div class="flex flex-col">
                    <span
                        class="text-sm font-bold text-slate-800 dark:text-white leading-tight max-w-[100px] truncate">{{
                            userStore.displayName || '我的信息' }}</span>
                    <span class="text-[10px] text-slate-400 group-hover:text-[#ff5000] transition-colors">查看名片</span>
                </div>
                <Icon name="lucide:chevron-right" size="16"
                    class="text-slate-300 group-hover:text-[#ff5000] transition-transform group-hover:translate-x-0.5" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    searchQuery: string
}>()

const emit = defineEmits<{
    'update:searchQuery': [value: string]
    addFriend: []
}>()

const userStore = useUserStore()
</script>

<style scoped>
/* Add any specific styles if essential, mostly using Tailwind */
</style>
