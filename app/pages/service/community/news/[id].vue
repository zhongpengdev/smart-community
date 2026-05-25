<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
        <!-- Breadcrumb -->
        <div class="sticky top-10 z-10 bg-white dark:bg-slate-800 py-3 border-b border-slate-200 dark:border-slate-700">
            <div class="max-w-[1300px] mx-auto flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400">首页</NuxtLink>
                <Icon name="lucide:chevron-right" size="14" />
                <NuxtLink to="/service/community/news" class="hover:text-blue-600 dark:hover:text-blue-400">社区公告
                </NuxtLink>
                <Icon name="lucide:chevron-right" size="14" />
                <span class="text-slate-700 dark:text-slate-300">公告详情</span>
            </div>
        </div>

        <div class="max-w-[1300px] mx-auto px-6 py-5">
            <!-- Loading State -->
            <div v-if="loading" class="bg-white dark:bg-slate-800 rounded p-8 shadow-sm animate-pulse">
                <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-6"></div>
                <div class="flex justify-center gap-6 mb-8">
                    <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                    <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                </div>
                <div class="space-y-4">
                    <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
            </div>

            <!-- Content -->
            <article v-else-if="detail"
                class="min-h-[600px] bg-white dark:bg-slate-800 rounded shadow-sm overflow-hidden">
                <header class="px-8 py-6 border-b border-slate-100 dark:border-slate-700 text-center">
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-4 leading-snug">
                        {{ detail.title }}
                    </h1>

                    <div
                        class="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div class="flex items-center gap-4">
                            <span class="flex items-center gap-1.5">
                                <Icon name="lucide:calendar" size="14" />
                                {{ detail.publishTime }}
                            </span>
                        </div>

                        <!-- Tools Bar -->
                        <DetailsToolsBar :current-font-size="currentFontSize"
                            @change-font-size="handleChangeFontSize" />
                    </div>
                </header>

                <div class="px-8 py-6" :class="{
                    'text-base': currentFontSize === 'normal',
                    'text-lg': currentFontSize === 'large',
                    'text-xl': currentFontSize === 'xlarge'
                }">
                    <div class="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p v-for="(paragraph, index) in formattedContent" :key="index" class="indent-8 text-justify">
                            {{ paragraph }}
                        </p>
                    </div>
                </div>
            </article>

            <!-- Error/Empty State -->
            <div v-else class="bg-white dark:bg-slate-800 rounded p-12 text-center shadow-sm">
                <Icon name="lucide:file-x" size="48" class="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p class="text-slate-500 dark:text-slate-400 mb-4">未找到该公告信息</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DetailsToolsBar from '~/components/News/DetailsToolsBar.vue'

const route = useRoute()
const { detail, loading, fetchDetail } = useAnnouncementDetail()
const currentFontSize = ref<'normal' | 'large' | 'xlarge'>('normal')

const formattedContent = computed(() => {
    if (!detail.value?.content) return []
    return detail.value.content.split(/\r\n|\n/).filter((p: string) => p.trim() !== '')
})

onMounted(() => {
    const id = route.params.id
    if (id) {
        fetchDetail(id as string)
    }
})

const handleChangeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    currentFontSize.value = size
}

useHead({
    title: computed(() => detail.value ? `${detail.value.title} - 社区公告` : '加载中...')
})

const goBack = () => {
    navigateTo('/service/community/news')
}
</script>
