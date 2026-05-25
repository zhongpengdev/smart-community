<template>
    <div class="bg-white dark:bg-slate-900 rounded p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50 dark:border-slate-800">
            <h3 class="font-bold text-slate-800 dark:text-slate-100">我的收藏</h3>
        </div>

        <div class="space-y-4">
            <div v-for="post in collectedPosts" :key="post.postId" class="group cursor-pointer"
                @click="navigateToPost(post.postId)">
                <div class="flex gap-3">
                    <!-- Miniature Image if available -->
                    <img v-if="post.firstImage" :src="post.firstImage"
                        class="w-16 h-16 rounded object-cover shrink-0 bg-slate-100" />

                    <div class="flex-1 min-w-0">
                        <h4
                            class="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2 group-hover:text-[#ff5000] transition-colors leading-snug mb-1">
                            {{ post.title }}
                        </h4>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400">
                            <span class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{{
                                post.sectionName }}</span>
                            <span>{{ post.userName }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading Skeleton -->
            <div v-if="collectedLoading" class="space-y-3">
                <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
                    <div class="w-16 h-16 bg-slate-100 rounded shrink-0"></div>
                    <div class="flex-1 space-y-2 py-1">
                        <div class="h-3 bg-slate-100 rounded w-3/4"></div>
                        <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!collectedLoading && collectedPosts.length === 0"
                class="text-center py-8 text-slate-400 text-xs">
                <Icon name="lucide:inbox" size="24" class="mx-auto mb-2 opacity-30" />
                <p>暂无收藏</p>
            </div>

            <!-- Load More / Expand -->
            <button v-if="collectedHasMore && !collectedLoading" @click="loadNextPage"
                class="w-full py-2 text-xs font-bold text-slate-500 hover:text-[#ff5000] hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-all flex items-center justify-center gap-1">
                展开更多收藏
                <Icon name="lucide:chevron-down" size="14" />
            </button>

            <div v-if="!collectedHasMore && collectedPosts.length > 0"
                class="text-center py-2 text-[10px] text-slate-300">
                没有更多了
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePost } from '~/composables/form/usePost';

const { collectedPosts, collectedPage, collectedHasMore, collectedLoading, fetchMyCollectedPosts } = usePost();
const router = useRouter();

const loadNextPage = () => {
    fetchMyCollectedPosts(collectedPage.value + 1, 5, true);
};

const navigateToPost = (postId: number | string) => {
    router.push(`/service/community/forum/post/${postId}`);
};

onMounted(() => {
    // Initial fetch if empty
    if (collectedPosts.value.length === 0) {
        fetchMyCollectedPosts(1, 5);
    }
});
</script>
