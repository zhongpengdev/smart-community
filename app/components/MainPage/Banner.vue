<template>
    <div class="w-full flex flex-col gap-4">
        <!-- 顶部：模块标题 + 搜索框 -->
        <div
            ref="searchContainer"
            class="flex items-center justify-between gap-4 h-11 shrink-0 relative"
        >
            <div
                class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
            >
                <span class="w-1.5 h-5 bg-[#ff5000] rounded"></span>
                <span>社区服务与公告</span>
            </div>
            
            <!-- 搜索框容器 -->
            <div class="relative w-80">
                <Search />
                
                <!-- 浮动搜索结果面板 (下拉菜单式) -->
                <transition name="fade-in">
                    <div
                        v-if="searchState.query && (searchState.isOpen || searchState.loading)"
                        class="absolute right-0 top-13 w-[380px] max-h-[480px] h-[400px] z-50 shadow-2xl border border-slate-200/80 dark:border-zinc-800/80 rounded bg-white dark:bg-zinc-900 overflow-hidden flex flex-col"
                    >
                        <SearchResults />
                    </div>
                </transition>
            </div>
        </div>

        <!-- 轮播区域 (黑白自适应和谐主题 + 网络图片背景) -->
        <div 
            class="h-[280px] relative rounded overflow-hidden group border border-slate-200/50 dark:border-zinc-800/40 shadow-md bg-slate-100 dark:bg-zinc-950 transition-all duration-300"
        >
            <!-- Background Image with Gradient Mask -->
            <div class="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop"
                    class="w-full h-full object-cover object-center transition-transform duration-700 scale-100 group-hover:scale-105 opacity-[0.9] dark:opacity-80"
                    alt="Community Background"
                />
                <!-- Smooth gradient overlay to ensure text contrast and readability -->
                <div class="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/85 to-slate-50/20 dark:from-zinc-950/95 dark:via-zinc-950/85 dark:to-zinc-950/20"></div>
            </div>

            <!-- Loading state indicator overlay -->
            <div v-if="newsLoading && bannerList.length === 0" class="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 z-10">
                <Icon name="lucide:loader-2" class="animate-spin mr-2" size="22" />
                <span class="text-sm font-medium">正在加载最新公告...</span>
            </div>

            <template v-else>
                <!-- 文字与操作区 -->
                <div
                    class="absolute inset-0 flex flex-col justify-center px-10 md:px-12 z-10 pointer-events-none"
                >
                    <div class="pointer-events-auto flex flex-col items-start">
                        <span class="text-xs font-bold text-[#ff5000] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 bg-[#ff5000]/10 px-2.5 py-0.5 rounded-full select-none">
                            <Icon name="lucide:megaphone" size="13" class="animate-bounce" />
                            <span>最新公告 · {{ currentIndex + 1 }}/{{ bannerList.length }}</span>
                        </span>
                        
                        <h2
                            class="text-slate-800 dark:text-white text-2xl md:text-[28px] font-black leading-snug mb-3 whitespace-pre-line line-clamp-2 max-w-[70%]"
                        >
                            {{ bannerList[currentIndex]?.title }}
                        </h2>
                        
                        <p
                            class="text-slate-600 dark:text-zinc-300 text-sm md:text-[15px] leading-relaxed mb-6 line-clamp-2 max-w-[65%]"
                        >
                            {{ bannerList[currentIndex]?.description }}
                        </p>
                        
                        <NuxtLink
                            v-if="bannerList[currentIndex]?.id"
                            :to="`/service/community/news/${bannerList[currentIndex]?.id}`"
                            class="px-6 py-2 rounded-lg bg-[#ff5000] text-white hover:bg-[#ff6a28] text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 flex items-center gap-1.5"
                        >
                            <span>{{ bannerList[currentIndex]?.buttonText || "点击阅读" }}</span>
                            <Icon name="lucide:arrow-right" size="14" />
                        </NuxtLink>
                        
                        <button
                            v-else
                            class="px-6 py-2 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-sm font-semibold cursor-not-allowed border border-slate-300/30 dark:border-zinc-700/30"
                            disabled
                        >
                            暂无公告
                        </button>
                    </div>
                </div>

                <!-- 左右悬浮翻页按钮 -->
                <button
                    v-if="bannerList.length > 1"
                    @click="prevSlide"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-800 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-lg border border-slate-200/50 dark:border-zinc-850/50 hover:scale-105 active:scale-95"
                >
                    <Icon name="lucide:chevron-left" size="22" />
                </button>
                <button
                    v-if="bannerList.length > 1"
                    @click="nextSlide"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-800 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-lg border border-slate-200/50 dark:border-zinc-850/50 hover:scale-105 active:scale-95"
                >
                    <Icon name="lucide:chevron-right" size="22" />
                </button>

                <!-- 底部轮播小圆点 -->
                <div
                    v-if="bannerList.length > 1"
                    class="absolute bottom-4 left-10 md:left-12 flex items-center gap-1.5 z-20"
                >
                    <button
                        v-for="(_, index) in bannerList"
                        :key="index"
                        @click="goToSlide(index)"
                        class="py-1"
                    >
                        <span
                            class="block h-1.5 rounded-full transition-all duration-300 bg-slate-400/50 dark:bg-zinc-700/50"
                            :class="
                                index === currentIndex
                                    ? 'w-6 bg-[#ff5000]'
                                    : 'w-1.5 hover:bg-slate-500 dark:hover:bg-zinc-500'
                            "
                        >
                        </span>
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Search from "./Search.vue";
import SearchResults from "./SearchResults.vue";
import { useCommunityNews } from '@/composables/useCommunityIssue';
import { useGlobalSearch } from '~/composables/useGlobalSearch';

const { newsList, loading: newsLoading, fetchNews } = useCommunityNews();
const { searchState } = useGlobalSearch();

interface BannerItem {
    id: number;
    title: string;
    description: string;
    buttonText?: string;
}

// 动态获取前5个社区公告渲染轮播图
const bannerList = computed<BannerItem[]>(() => {
    if (!newsList.value || newsList.value.length === 0) {
        return [];
    }
    return newsList.value.slice(0, 5).map((item) => {
        // Strip HTML tags for display
        const plainContent = (item.summary || item.content || "")
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim();
        return {
            id: item.announceId,
            title: item.title,
            description: plainContent || "点击阅读查看完整的社区公告详情与重要通知说明。",
            buttonText: "查看详情",
        };
    });
});

const currentIndex = ref(0);
const searchContainer = ref<HTMLElement | null>(null);
let autoPlayTimer: ReturnType<typeof setInterval> | null = null;

// 点击外部关闭搜索下拉面板
onClickOutside(searchContainer, () => {
    searchState.isOpen = false;
});

// 当公告列表加载完成后，重置索引，确保安全
watch(bannerList, () => {
    currentIndex.value = 0;
});

const nextSlide = () => {
    if (bannerList.value.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % bannerList.value.length;
};

const prevSlide = () => {
    if (bannerList.value.length === 0) return;
    currentIndex.value =
        (currentIndex.value - 1 + bannerList.value.length) %
        bannerList.value.length;
};

const goToSlide = (index: number) => {
    currentIndex.value = index;
};

const startAutoPlay = () => {
    stopAutoPlay();
    if (bannerList.value.length <= 1) return;
    autoPlayTimer = setInterval(() => {
        nextSlide();
    }, 6000); // 间隔为 6 秒切换一次，适合阅读公告
};

const stopAutoPlay = () => {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
};

// 监听列表，如果有多个公告，自动开始播放
watch(() => bannerList.value.length, (len) => {
    if (len > 1) {
        startAutoPlay();
    } else {
        stopAutoPlay();
    }
});

onMounted(async () => {
    await fetchNews();
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});
</script>

<style scoped>
.fade-in-enter-active,
.fade-in-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
