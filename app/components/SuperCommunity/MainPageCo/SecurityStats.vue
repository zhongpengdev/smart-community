<template>
    <div class="bg-white dark:bg-slate-800 rounded p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-5">
            <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
                    <Icon name="lucide:shield-check" size="18" class="text-cyan-500" />
                </div>
                车位访客统计
            </h3>
            <div class="flex gap-3">
                <NuxtLink to="/superCommunity/security/parking"
                    class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    车位管理
                </NuxtLink>
                <NuxtLink to="/superCommunity/security/visitor"
                    class="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                    访客管理
                </NuxtLink>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <!-- 车位统计 -->
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <Icon name="lucide:car" size="16" class="text-cyan-500" />
                    <span class="text-xs text-slate-400 font-medium">车位登记</span>
                </div>
                
                <!-- 数值概览 -->
                <div class="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/10 rounded">
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-cyan-600">{{ props.data?.totalParkingSpaces || 0 }}</p>
                        <p class="text-xs text-slate-500">登记总数</p>
                    </div>
                    <div class="w-px h-10 bg-cyan-200 dark:bg-cyan-800"></div>
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-cyan-500">+{{ props.data?.todayParkingSpaces || 0 }}</p>
                        <p class="text-xs text-slate-500">今日新增</p>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-amber-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待审核</span>
                        </div>
                        <span class="font-bold text-amber-500">{{ props.data?.pendingParkingSpaces || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-green-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已通过</span>
                        </div>
                        <span class="font-bold text-green-500">{{ props.data?.approvedParkingSpaces || 0 }}</span>
                    </div>
                </div>

                <!-- 审核通过率 -->
                <div class="mt-2">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs text-slate-400">审核通过率</span>
                        <span class="text-xs font-medium text-cyan-600">{{ parkingApprovalRate }}%</span>
                    </div>
                    <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <div class="h-full rounded bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500"
                            :style="{ width: `${parkingApprovalRate}%` }"></div>
                    </div>
                </div>
            </div>

            <!-- 访客统计 -->
            <div class="space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <Icon name="lucide:user-check" size="16" class="text-indigo-500" />
                    <span class="text-xs text-slate-400 font-medium">访客登记</span>
                </div>
                
                <!-- 数值概览 -->
                <div class="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded">
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-indigo-600">{{ props.data?.totalVisitors || 0 }}</p>
                        <p class="text-xs text-slate-500">登记总数</p>
                    </div>
                    <div class="w-px h-10 bg-indigo-200 dark:bg-indigo-800"></div>
                    <div class="text-center flex-1">
                        <p class="text-xl font-bold text-indigo-500">+{{ props.data?.todayVisitors || 0 }}</p>
                        <p class="text-xs text-slate-500">今日来访</p>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-amber-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">待审核</span>
                        </div>
                        <span class="font-bold text-amber-500">{{ props.data?.pendingVisitors || 0 }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded bg-green-400"></span>
                            <span class="text-sm text-slate-600 dark:text-slate-300">已通过</span>
                        </div>
                        <span class="font-bold text-green-500">{{ props.data?.approvedVisitors || 0 }}</span>
                    </div>
                </div>

                <!-- 审核通过率 -->
                <div class="mt-2">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs text-slate-400">审核通过率</span>
                        <span class="text-xs font-medium text-indigo-600">{{ visitorApprovalRate }}%</span>
                    </div>
                    <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        <div class="h-full rounded bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-500"
                            :style="{ width: `${visitorApprovalRate}%` }"></div>
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

const parkingApprovalRate = computed(() => {
    const total = props.data?.totalParkingSpaces || 0
    const approved = props.data?.approvedParkingSpaces || 0
    if (total === 0) return 0
    return Math.round((approved / total) * 100)
})

const visitorApprovalRate = computed(() => {
    const total = props.data?.totalVisitors || 0
    const approved = props.data?.approvedVisitors || 0
    if (total === 0) return 0
    return Math.round((approved / total) * 100)
})
</script>
