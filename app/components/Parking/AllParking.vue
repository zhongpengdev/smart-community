<template>
    <div class="bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div v-if="loading" class="flex justify-center py-10">
            <div class="animate-spin rounded h-8 w-8 border-b-2 border-[#ff5000]"></div>
        </div>

        <div v-else>
            <!-- Zone Tabs -->
            <div class="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                <button v-for="zone in sortedZones" :key="zone" @click="currentZone = zone"
                    class="px-4 py-2 rounded text-sm font-medium transition-colors"
                    :class="currentZone === zone
                        ? 'bg-[#ff5000] text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'">
                    {{ zone }}区
                </button>
                <div v-if="sortedZones.length === 0" class="text-sm text-slate-400 py-2">
                    暂无车位区域数据
                </div>
            </div>

            <!-- Grid Display -->
            <div v-if="currentZone" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                <div v-for="i in 20" :key="i"
                    class="aspect-square relative rounded border-2 transition-all p-3 flex flex-col justify-between group cursor-pointer"
                    :class="getSpotStatusClass(i)">
                    <!-- Spot Number -->
                    <div class="text-xs font-bold opacity-50">
                        {{ getSpotLabel(i) }}
                    </div>

                    <!-- Occupied Info -->
                    <div v-if="getSpotData(i)" class="flex flex-col items-center justify-center flex-1 gap-1">
                        <Icon name="lucide:car-front" size="24" class="opacity-90" />
                        <div class="text-xs font-medium truncate w-full text-center">
                            {{ getSpotData(i).carNumber }}
                        </div>
                        <div class="text-[10px] opacity-75 truncate w-full text-center">
                            {{ getSpotData(i).userName }}
                        </div>
                        <div v-if="getSpotData(i).statusText"
                            class="mt-1 text-xs scale-90 px-2 py-0.5 rounded bg-white/60 dark:bg-black/20 font-medium whitespace-nowrap">
                            {{ getSpotData(i).statusText }}
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else
                        class="flex items-center justify-center flex-1 opacity-60 group-hover:opacity-100 transition-all relative">
                        <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">空闲</span>

                        <!-- Hover Action -->
                        <div @click="$emit('apply', getSpotLabel(i))"
                            class="hidden group-hover:flex absolute inset-0 bg-emerald-50/90 dark:bg-emerald-900/80 backdrop-blur-[1px] items-center justify-center z-10 rounded animate-in fade-in duration-200 cursor-pointer">
                            <div
                                class="bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transform scale-90 group-hover:scale-100 transition-transform">
                                <Icon name="lucide:plus-circle" size="14" />
                                <span>申请</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="sortedZones.length > 0" class="text-center py-10 text-slate-400 text-sm">
                请选择区域查看车位
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { fetchAllParking, isFetching: loading, groupedZones } = useParking()

const currentZone = ref('')
const emit = defineEmits(['apply'])

// Initialize
onMounted(async () => {
    await fetchAllParking()
    if (sortedZones.value.length > 0) {
        currentZone.value = sortedZones.value[0] || ''
    }
})

const sortedZones = computed(() => {
    return Object.keys(groupedZones.value).sort()
})

const getSpotData = (index: number) => {
    if (!currentZone.value || !groupedZones.value || !groupedZones.value[currentZone.value]) return null
    return groupedZones.value[currentZone.value].spots[index]
}

const getSpotLabel = (index: number) => {
    if (!currentZone.value || !groupedZones.value || !groupedZones.value[currentZone.value]) return ''
    const base = groupedZones.value[currentZone.value].base
    // Pad to 3 digits e.g. 1 -> 001, 101 -> 101
    const num = base + index
    return `${currentZone.value}-${String(num).padStart(3, '0')}`
}

const getSpotStatusClass = (index: number) => {
    const data = getSpotData(index)

    if (data) {
        if (data.status === 0) {
            // Pending (0) - Amber/Orange
            return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400'
        } else {
            // Occupied/Approved (1) - Red
            return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400'
        }
    } else {
        // Empty style (Light Green)
        return 'border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm'
    }
}
</script>
