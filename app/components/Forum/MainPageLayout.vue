<template>
    <div class="bg-white dark:bg-white/5 rounded p-4 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 shrink-0">
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
        <div v-if="loading" class="flex gap-3 flex-1 min-h-0 overflow-hidden">
            <div v-for="i in 4" :key="i"
                class="w-[180px] h-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse shrink-0"></div>
        </div>

        <!-- Carousel Container (Restored scroll buttons and layout) -->
        <div v-else class="relative group/container flex-1 min-h-0">
            <!-- Left Arrow -->
            <button @click="scrollLeft"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover/container:opacity-100 -translate-x-2 group-hover/container:translate-x-0">
                <Icon name="lucide:chevron-left" size="18" />
            </button>

            <!-- Right Arrow -->
            <button @click="scrollRight"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all opacity-0 group-hover/container:opacity-100 translate-x-2 group-hover/container:translate-x-0">
                <Icon name="lucide:chevron-right" size="18" />
            </button>

            <!-- Scrollable Cards (Stretches vertically to fill container height) -->
            <div ref="scrollContainer" class="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth h-full">
                <div v-for="section in sections" :key="section.sectionId" @click="navigateToSection(section.sectionId)"
                    class="relative w-[180px] h-full rounded overflow-hidden shrink-0 cursor-pointer group shadow-sm transition-all duration-300 bg-gradient-to-br from-orange-50/50 via-slate-50 to-slate-100 dark:from-[#ff5000]/5 dark:via-zinc-900 dark:to-zinc-950 border border-slate-100/60 dark:border-zinc-800/50 hover:shadow-md">

                    <!-- Background Image (Show only if section.iconUrl is not empty) -->
                    <img v-if="section.iconUrl" :src="section.iconUrl"
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        :alt="section.sectionName" />

                    <!-- Gradient Overlay (Only if section.iconUrl exists) -->
                    <div v-if="section.iconUrl" class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>

                    <!-- Content -->
                    <div class="absolute inset-0 p-3 flex flex-col justify-end">
                        <h3 class="font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[#ff5000] transition-colors"
                            :class="section.iconUrl ? 'text-white' : 'text-slate-800 dark:text-slate-200'">
                            {{ section.sectionName }}
                        </h3>
                        <p class="text-[10px] line-clamp-1"
                            :class="section.iconUrl ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'">
                            {{ section.sectionDesc || '暂无描述' }}
                        </p>
                        <div class="flex items-center gap-2 mt-2">
                            <img :src="section.iconUrl || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
                                class="w-5 h-5 rounded-full ring-1"
                                :class="section.iconUrl ? 'ring-white/30' : 'ring-slate-200 dark:ring-zinc-800/80'" />
                            <span class="text-[10px]"
                                :class="section.iconUrl ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'">
                                r/{{ section.sectionName }}
                            </span>
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
