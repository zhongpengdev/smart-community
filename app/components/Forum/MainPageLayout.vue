<template>
    <div class="bg-white dark:bg-white/5 rounded p-4 border border-slate-100 dark:border-white/5 shadow-sm h-full">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <span class="w-1 h-4 bg-[#ff5000] rounded"></span>
                <h2 class="text-base font-bold text-slate-800 dark:text-white">社区论坛</h2>
            </div>
            <NuxtLink to="/service/community/forum"
                class="flex items-center gap-1 text-xs text-slate-400 hover:text-[#ff5000] transition-colors">
                <span>更多</span>
                <Icon name="lucide:chevron-right" size="14" />
            </NuxtLink>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="flex gap-3">
            <div v-for="i in 4" :key="i"
                class="w-[180px] h-[120px] bg-slate-100 dark:bg-slate-800 rounded animate-pulse shrink-0"></div>
        </div>

        <!-- Carousel Container -->
        <div v-else class="relative group/container">
            <!-- Left Arrow -->
            <button @click="scrollLeft"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover/container:opacity-100 -translate-x-2 group-hover/container:translate-x-0">
                <Icon name="lucide:chevron-left" size="18" />
            </button>

            <!-- Right Arrow -->
            <button @click="scrollRight"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover/container:opacity-100 translate-x-2 group-hover/container:translate-x-0">
                <Icon name="lucide:chevron-right" size="18" />
            </button>

            <!-- Scrollable Cards -->
            <div ref="scrollContainer" class="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth">
                <div v-for="section in sections" :key="section.sectionId" @click="navigateToSection(section.sectionId)"
                    class="relative w-[180px] h-[180px] rounded overflow-hidden shrink-0 cursor-pointer group">

                    <!-- Background Image -->
                    <img :src="section.iconUrl || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80'"
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        :alt="section.sectionName" />

                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <!-- Content -->
                    <div class="absolute inset-0 p-3 flex flex-col justify-end">
                        <h3 class="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
                            {{ section.sectionName }}
                        </h3>
                        <p class="text-white/70 text-[10px] line-clamp-1">
                            {{ section.sectionDesc || '暂无描述' }}
                        </p>
                        <div class="flex items-center gap-2 mt-2">
                            <img :src="section.iconUrl || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
                                class="w-5 h-5 rounded ring-1 ring-white/30" />
                            <span class="text-white/60 text-[10px]">r/{{ section.sectionName }} and more</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useForum } from '~/composables/form/useForum';

const router = useRouter();
const { sections, loading, fetchSections } = useForum();
const scrollContainer = ref<HTMLElement | null>(null);

const navigateToSection = (id: number) => {
    router.push(`/service/community/forum/${id}`);
};

const scrollLeft = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: -200, behavior: 'smooth' });
    }
};

const scrollRight = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: 200, behavior: 'smooth' });
    }
};

onMounted(() => {
    if (sections.value.length === 0) {
        fetchSections();
    }
});
</script>

<style scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
