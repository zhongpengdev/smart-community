<template>
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <!-- Header -->
        <div class="px-6 py-4 dark:border-slate-800">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">探索社区</h2>
        </div>

        <!-- Category Tabs -->
        <div class="px-6 py-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
            <div class="flex items-center gap-2">
                <button v-for="(tab, index) in tabs" :key="tab" @click="activeTab = index"
                    class="px-4 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-colors"
                    :class="activeTab === index
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'">
                    {{ tab }}
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && sections.length === 0" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="i in 6" :key="i" class="h-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>
        </div>

        <!-- Sections Grid -->
        <div v-else class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <NuxtLink v-for="section in sections" :key="section.sectionId"
                    :to="`/service/community/forum/${section.sectionId}`"
                    class="group flex items-start gap-3 p-4 rounded border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">

                    <!-- Avatar -->
                    <img :src="section.iconUrl || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
                        :alt="section.sectionName"
                        class="w-10 h-10 rounded object-cover bg-slate-100 dark:bg-slate-700 shrink-0" />

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                            <div>
                                <h3
                                    class="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                    {{ section.sectionName }}
                                </h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {{ formatCount(section.postCount * 13 + 520) }} weekly visitors
                                </p>
                            </div>
                            <button
                                class="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shrink-0">
                                进入
                            </button>
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                            {{ section.sectionDesc || '暂无描述' }}
                        </p>
                    </div>
                </NuxtLink>
            </div>

            <!-- Show More Button -->
            <div class="flex justify-center mt-6">
                <button
                    class="px-6 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    展示更多
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useForum } from '~/composables/form/useForum';

const { sections, loading, fetchSections } = useForum();
const activeTab = ref(0);

const tabs = ['All', 'Most Visited', 'Internet Culture', 'Games', 'Q&As & Stories', 'Movies & TV', 'Technology'];

const formatCount = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return Math.floor(num / 1000) + 'K';
    }
    return num.toString();
};

onMounted(() => {
    fetchSections();
});
</script>
