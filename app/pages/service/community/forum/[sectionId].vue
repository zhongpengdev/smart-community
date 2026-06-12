<!-- 论坛界面 -->
<template>
    <div class="pb-20">
        <!-- Header with Back Button (reusing some style or creating simple one) -->
        <div
            class="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
            <div class="max-w-[1300px] mx-auto px-4 h-14 flex items-center gap-4">
                <NuxtLink to="/service/community/forum"
                    class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                    <Icon name="lucide:arrow-left" size="20" />
                </NuxtLink>
                <h1 class="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    {{ currentSection?.sectionName }}
                </h1>
            </div>
        </div>

        <div class="max-w-[1240px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <!-- Left: Main Content -->
            <div class="space-y-6 min-w-0">
                <!-- Publisher -->
                <ForumInnerPostPublisher :section-id="sectionId" @success="refreshPosts" />

                <!-- Filters -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button @click="handleSortChange('latest')"
                            :class="[currentSort === 'latest' ? 'bg-[#ff5000] text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800']"
                            class="px-4 py-1.5 rounded text-xs font-bold transition-all duration-300">最新</button>
                        <button @click="handleSortChange('hot')"
                            :class="[currentSort === 'hot' ? 'bg-[#ff5000] text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800']"
                            class="px-4 py-1.5 rounded text-xs font-bold transition-all duration-300">最热</button>
                        <button @click="handleSortChange('essence')"
                            :class="[currentSort === 'essence' ? 'bg-[#ff5000] text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800']"
                            class="px-4 py-1.5 rounded text-xs font-bold transition-all duration-300">精选</button>
                    </div>
                </div>

                <!-- Post List -->
                <ForumInnerPostList :posts="postList" />

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-8">
                    <div class="w-8 h-8 border-4 border-[#ff5000]/30 border-t-[#ff5000] rounded animate-spin">
                    </div>
                </div>

                <div v-if="!loading && postList.length === 0" class="text-center py-20 text-slate-400">
                    <Icon name="lucide:message-square-dashed" size="48" class="mx-auto mb-4 opacity-20" />
                    <p>暂无帖子，快来抢沙发吧~</p>
                </div>
            </div>

            <!-- Right: Sidebar -->
            <div class="hidden lg:block space-y-6 sticky top-20">
                <!-- My Collects -->
                <ForumInnerMyCollects />

                <!-- Placeholder for ads or rules? User just asked for MyCollects. Can add more later if needed. -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useForum } from '~/composables/form/useForum';

const route = useRoute();
const sectionId = route.params.sectionId as string;
const { fetchPostList, postList, loading, sections, fetchSections } = useForum();
const currentSort = ref('latest');

// Try to find section info from cached sections, or maybe we need to fetch section detail (not implemented yet, relying on cache)
const currentSection = computed(() => sections.value.find(s => s.sectionId === Number(sectionId)));

const refreshPosts = () => {
    fetchPostList(sectionId, 1, 10, false, currentSort.value);
};

const handleSortChange = (sort: string) => {
    if (currentSort.value === sort) return;
    currentSort.value = sort;
    refreshPosts();
};

onMounted(async () => {
    if (sections.value.length === 0) {
        await fetchSections();
    }
    refreshPosts();
});
</script>
