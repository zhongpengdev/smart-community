<template>
    <div
        class="w-full rounded border border-blue-200/50 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/80 to-white dark:from-slate-800/50 dark:to-slate-900 p-4 shadow-sm"
    >
        <div class="flex gap-4 h-[320px]">
            <!-- 左侧内容区：搜索栏 + 轮播图 -->
            <div class="flex-1 flex flex-col gap-3 min-w-0">
                <!-- 顶部：模块标题 + 搜索框 -->
                <div
                    class="flex items-center justify-between gap-4 h-11 shrink-0"
                >
                    <div
                        class="text-lg font-bold text-slate-700 dark:text-slate-200 px-1"
                    >
                        社区服务
                    </div>
                    <div class="flex-1 max-w-sm">
                        <Search />
                    </div>
                </div>

                <!-- 轮播区域 -->
                <div class="flex-1 relative rounded overflow-hidden group">
                    <!-- 当前轮播项 -->
                    <img
                        :src="bannerList[currentIndex]?.image"
                        class="w-full h-full object-cover transition-opacity duration-500"
                        :alt="bannerList[currentIndex]?.title"
                    />

                    <!-- 遮罩层 -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-600/70 to-transparent"
                    ></div>

                    <!-- 文字内容 -->
                    <div
                        class="absolute inset-0 flex flex-col justify-center px-8 z-10"
                    >
                        <h2
                            class="text-white text-3xl font-bold leading-tight mb-4 drop-shadow-lg whitespace-pre-line"
                        >
                            {{ bannerList[currentIndex]?.title }}
                        </h2>
                        <button
                            class="w-fit px-5 py-1.5 rounded-full border-2 border-white/80 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                            {{
                                bannerList[currentIndex]?.buttonText ||
                                "重要提示"
                            }}
                        </button>
                    </div>

                    <!-- 左右箭头 -->
                    <button
                        @click="prevSlide"
                        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 z-20"
                    >
                        <Icon name="lucide:chevron-left" size="20" />
                    </button>
                    <button
                        @click="nextSlide"
                        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 z-20"
                    >
                        <Icon name="lucide:chevron-right" size="20" />
                    </button>

                    <!-- 轮播指示器 -->
                    <div
                        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20"
                    >
                        <button
                            v-for="(_, index) in bannerList"
                            :key="index"
                            @click="goToSlide(index)"
                            class="group/dot p-1"
                        >
                            <span
                                class="block h-1 rounded-full transition-all duration-300 bg-white/40 group-hover/dot:bg-white/80"
                                :class="
                                    index === currentIndex
                                        ? 'w-6 bg-white'
                                        : 'w-3'
                                "
                            >
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 右侧：搜索结果面板 -->
            <SearchResults />
        </div>
    </div>
</template>

<script setup lang="ts">
import Search from "./Search.vue";
import SearchResults from "./SearchResults.vue";

interface BannerItem {
    id: number;
    title: string;
    image: string;
    buttonText?: string;
    link?: string;
}

const bannerList = ref<BannerItem[]>([
    {
        id: 1,
        title: "近日流感传染比较严重\n出门请佩戴口罩，发热请及时就医",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80",
        buttonText: "重要提示",
    },
    {
        id: 2,
        title: "智慧社区服务\n已完成界面更新",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        buttonText: "了解详情",
    },
    {
        id: 3,
        title: "关于社区快递自提点位置变更的通知",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
        buttonText: "查看更多",
    },
]);

const currentIndex = ref(0);
let autoPlayTimer: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % bannerList.value.length;
};

const prevSlide = () => {
    currentIndex.value =
        (currentIndex.value - 1 + bannerList.value.length) %
        bannerList.value.length;
};

const goToSlide = (index: number) => {
    currentIndex.value = index;
};

const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
        nextSlide();
    }, 5000);
};

const stopAutoPlay = () => {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
};

onMounted(() => {
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay();
});
</script>
