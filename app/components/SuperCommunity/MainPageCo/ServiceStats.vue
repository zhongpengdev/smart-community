<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <Icon name="lucide:wrench" size="18" class="text-orange-500" />
                </div>
                报修投诉统计
            </h3>
            <div class="flex gap-3">
                <NuxtLink to="/superCommunity/property/repair"
                    class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    报修管理
                    <Icon name="lucide:chevron-right" size="14" />
                </NuxtLink>
                <NuxtLink to="/superCommunity/property/complaint"
                    class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    投诉管理
                    <Icon name="lucide:chevron-right" size="14" />
                </NuxtLink>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <!-- 报修统计 -->
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <Icon name="lucide:tool" size="16" class="text-orange-500" />
                    <span class="text-xs text-slate-400 font-medium">报修工单</span>
                </div>
                
                <!-- 数值概览 -->
                <div class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/10 rounded">
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-orange-600">{{ props.data?.totalRepairs || 0 }}</p>
                        <p class="text-xs text-slate-500">总工单</p>
                    </div>
                    <div class="w-px h-10 bg-orange-200 dark:bg-orange-800"></div>
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-orange-500">+{{ props.data?.todayRepairs || 0 }}</p>
                        <p class="text-xs text-slate-500">今日新增</p>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-amber-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待处理</span>
                        </div>
                        <span class="font-bold text-amber-500">{{ props.data?.pendingRepairs || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-blue-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">处理中</span>
                        </div>
                        <span class="font-bold text-blue-500">{{ props.data?.processingRepairs || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-green-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已完成</span>
                        </div>
                        <span class="font-bold text-green-500">{{ props.data?.completedRepairs || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-red-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已驳回</span>
                        </div>
                        <span class="font-bold text-red-500">{{ props.data?.rejectedRepairs || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- 投诉统计 -->
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <Icon name="lucide:message-circle-warning" size="16" class="text-rose-500" />
                    <span class="text-xs text-slate-400 font-medium">投诉工单</span>
                </div>
                
                <!-- 数值概览 -->
                <div class="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/10 rounded">
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-rose-600">{{ props.data?.totalComplaints || 0 }}</p>
                        <p class="text-xs text-slate-500">总投诉</p>
                    </div>
                    <div class="w-px h-10 bg-rose-200 dark:bg-rose-800"></div>
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-rose-500">+{{ props.data?.todayComplaints || 0 }}</p>
                        <p class="text-xs text-slate-500">今日新增</p>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-amber-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待处理</span>
                        </div>
                        <span class="font-bold text-amber-500">{{ props.data?.pendingComplaints || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-blue-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">处理中</span>
                        </div>
                        <span class="font-bold text-blue-500">{{ props.data?.processingComplaints || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-green-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已完成</span>
                        </div>
                        <span class="font-bold text-green-500">{{ props.data?.completedComplaints || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-red-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已驳回</span>
                        </div>
                        <span class="font-bold text-red-500">{{ props.data?.rejectedComplaints || 0 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    data: any
}>()
</script>
