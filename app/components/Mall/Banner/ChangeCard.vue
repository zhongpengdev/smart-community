<template>
    <div class="relative w-full h-full group cursor-pointer">
        <el-carousel height="100%" :interval="5000" arrow="hover" indicator-position="none" ref="carouselRef"
            @change="handleChange" class="h-full">
            <el-carousel-item v-for="(item, index) in bannerData" :key="index" class="h-full">
                <!-- Banner Content -->
                <div class="w-full h-full flex flex-col justify-center px-8 py-6 transition-transform duration-500 hover:scale-105 bg-cover bg-center bg-no-repeat"
                    :style="{ backgroundImage: `url(${item.bgImage})` }">
                    <!-- Left Text Content -->
                    <div class="flex flex-col z-10 text-white gap-2">
                        <div v-if="item.badge"
                            class="inline-block bg-black/20 backdrop-blur-sm rounded px-2 py-0.5 text-xs w-fit mb-2">
                            {{ item.badge }}
                        </div>

                        <h2 class="text-3xl font-bold leading-tight shadow-sm text-shadow">
                            <span class="block">{{ item.titleLine1 }}</span>
                            <span class="block">{{ item.titleLine2 }}</span>
                        </h2>

                        <p class="text-sm opacity-90 font-medium mt-1 text-shadow">{{ item.subtitle }}</p>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>

        <!-- Custom Indicators (Bottom Left) -->
        <!-- 底部小圆点 -->
        <div class="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
            <div v-for="(item, index) in bannerData" :key="index" @click="setActiveItem(index)"
                class="h-1.5 rounded transition-all duration-300 cursor-pointer shadow-sm" :class="[
                    currentIndex === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                ]"></div>
        </div>

        <!-- Custom Navigation Arrows (Only visible on hover) -->
        <div class="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 rounded bg-black/10 hover:bg-black/30 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer transition-all opacity-0 group-hover:opacity-100 group-hover:left-4 z-20"
            @click.stop="prev">
            <Icon name="lucide:chevron-left" size="18" />
        </div>
        <div class="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 rounded bg-black/10 hover:bg-black/30 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer transition-all opacity-0 group-hover:opacity-100 group-hover:right-4 z-20"
            @click.stop="next">
            <Icon name="lucide:chevron-right" size="18" />
        </div>

    </div>
</template>

<script setup lang="ts">
const carouselRef = ref()
const currentIndex = ref(0)

const bannerData = [
    {
        badge: '超级立减',
        titleLine1: '新年焕新',
        titleLine2: '不只5折',
        subtitle: '叠加惊喜消费券',
        bgImage: '/banner/banner01.png'
    },
    {
        badge: '限时特惠',
        titleLine1: '智能家电',
        titleLine2: '狂欢盛典',
        subtitle: '至高24期免息',
        bgImage: '/banner/banner02.png'
    },
    {
        badge: '新品首发',
        titleLine1: '未来生活',
        titleLine2: '触手可及',
        subtitle: '预约领百元红包',
        bgImage: '/banner/banner03.png'
    }
]

const handleChange = (index: number) => {
    currentIndex.value = index
}

const setActiveItem = (index: number) => {
    carouselRef.value?.setActiveItem(index)
}

const prev = () => {
    carouselRef.value?.prev()
}

const next = () => {
    carouselRef.value?.next()
}
</script>

<style scoped>
:deep(.el-carousel__arrow) {
    display: none;
}
</style>
