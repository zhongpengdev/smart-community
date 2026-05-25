<template>
    <div ref="cardRef"
        class="group bg-white dark:bg-slate-900 rounded overflow-hidden border border-transparent cursor-pointer shadow-sm hover:shadow-md flex flex-col">
        <!-- Product Image with Lazy Loading -->
        <div class="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
            <!-- Skeleton while loading -->
            <div v-if="!imageLoaded" class="w-full h-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>

            <!-- Actual Image (only load when in viewport) -->
            <img v-if="isVisible" :src="mainImage || product.coverImg" :alt="product.productName"
                @load="imageLoaded = true"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }" />

            <!-- Hover Overlay -->
            <div
                class="absolute inset-x-0 bottom-0 bg-black/5 py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-[10px] text-white">查看详情</span>
            </div>
        </div>

        <!-- Product Details -->
        <div class="p-3 flex-1 flex flex-col">
            <!-- Title -->
            <h3
                class="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug mb-1 min-h-[2.5rem]">
                {{ product.productName }}
            </h3>

            <!-- Description -->
            <p class="text-xs text-slate-400 line-clamp-1 mb-2">{{ product.description }}</p>

            <!-- Price -->
            <div class="mt-auto flex items-baseline justify-between gap-1 flex-wrap">
                <div class="flex items-baseline text-[#ff5000]">
                    <span class="text-xs font-bold font-sans">¥</span>
                    <span class="text-lg font-bold">{{ String(product.price).split('.')[0] }}</span>
                    <span v-if="String(product.price).includes('.')" class="text-xs font-bold">.{{
                        String(product.price).split('.')[1] || '0'
                        }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    product: any
    mainImage?: string
}>()

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const imageLoaded = ref(false)

onMounted(() => {
    if (!cardRef.value) return

    // Create intersection observer for this card
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isVisible.value) {
                    // Card is visible, start loading
                    isVisible.value = true
                    // Add delay for skeleton effect
                    setTimeout(() => {
                        // Image will start loading now
                    }, 500)
                }
            })
        },
        {
            threshold: 0.1, // Trigger when 10% of card is visible
            rootMargin: '50px' // Start loading slightly before entering viewport
        }
    )

    observer.observe(cardRef.value)

    onUnmounted(() => {
        if (cardRef.value) {
            observer.unobserve(cardRef.value)
        }
    })
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

img {
    transition: opacity 0.3s ease-in-out;
}
</style>
