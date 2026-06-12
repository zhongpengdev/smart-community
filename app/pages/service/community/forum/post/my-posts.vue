<template>
    <div class="pb-20">
        <!-- Header -->
        <div
            class="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
            <div class="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="$router.back()"
                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
                        <Icon name="lucide:arrow-left" size="20" />
                    </button>
                    <span class="font-bold text-slate-800 dark:text-slate-100">我的帖子</span>
                </div>
                <div class="text-sm text-slate-500">
                    共 <span class="font-bold text-[#ff5000]">{{ myPostsTotal }}</span> 篇帖子
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-[1200px] mx-auto px-4 py-6">
            <!-- Loading State -->
            <div v-if="myPostsLoading && myPosts.length === 0" class="space-y-4">
                <div v-for="i in 5" :key="i"
                    class="bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-800 p-6 animate-pulse">
                    <div class="flex gap-4">
                        <div class="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded shrink-0"></div>
                        <div class="flex-1 space-y-3">
                            <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!myPostsLoading && myPosts.length === 0"
                class="bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-800 p-20 text-center">
                <div class="p-8 bg-slate-50 dark:bg-slate-800 rounded inline-block mb-4">
                    <Icon name="lucide:file-text" size="64" class="text-slate-400" />
                </div>
                <h3 class="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">暂无帖子</h3>
                <p class="text-sm text-slate-400 mb-6">快去发布你的第一篇帖子吧</p>
                <button @click="$router.push('/service/community/forum')"
                    class="px-6 py-2.5 bg-[#ff5000] hover:bg-[#ff6a00] text-white rounded transition-all shadow-lg shadow-orange-500/20">
                    前往论坛
                </button>
            </div>

            <!-- Posts List -->
            <div v-else class="space-y-4">
                <div v-for="post in myPosts" :key="post.postId"
                    class="bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-[#ff5000]/20 transition-all duration-300 overflow-hidden group">

                    <div class="p-6">
                        <div class="flex gap-4">
                            <!-- Thumbnail -->
                            <div v-if="post.firstImage" @click="navigateToPost(post.postId)"
                                class="w-32 h-24 rounded overflow-hidden shrink-0 cursor-pointer">
                                <img :src="post.firstImage"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between gap-4 mb-2">
                                    <h3 @click="navigateToPost(post.postId)"
                                        class="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-[#ff5000] transition-colors cursor-pointer">
                                        {{ post.title }}
                                    </h3>

                                    <!-- Delete Button -->
                                    <button @click="handleDelete(post.postId)"
                                        class="shrink-0 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                                        title="删除帖子">
                                        <Icon name="lucide:trash-2" size="18" />
                                    </button>
                                </div>

                                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                    {{ post.contentSummary }}
                                </p>

                                <div class="flex items-center gap-4 text-xs text-slate-400">
                                    <span
                                        class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                                        {{ post.sectionName }}
                                    </span>
                                    <div class="flex items-center gap-1">
                                        <Icon name="lucide:eye" size="14" />
                                        <span>{{ post.viewCount }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Icon name="lucide:thumbs-up" size="14" />
                                        <span>{{ post.likeCount }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Icon name="lucide:message-square" size="14" />
                                        <span>{{ post.commentCount }}</span>
                                    </div>
                                    <div class="flex items-center gap-1 ml-auto">
                                        <Icon name="lucide:clock" size="14" />
                                        <span>{{ formatDate(post.createTime) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Load More -->
                <div v-if="myPostsHasMore" class="flex justify-center pt-4">
                    <button @click="loadMore" :disabled="myPostsLoading"
                        class="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <span v-if="myPostsLoading"
                            class="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded animate-spin"></span>
                        {{ myPostsLoading ? '加载中...' : '加载更多' }}
                    </button>
                </div>

                <div v-else-if="myPosts.length > 0" class="text-center py-4 text-xs text-slate-400">
                    - 已加载全部帖子 -
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePost } from '~/composables/form/usePost';
import { ElMessageBox } from 'element-plus';

const router = useRouter();
const {
    myPosts,
    myPostsPage,
    myPostsTotal,
    myPostsHasMore,
    myPostsLoading,
    fetchMyPosts,
    deletePost
} = usePost();

// Format date
const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;

    return date.toLocaleDateString('zh-CN');
};

// Navigate to post detail
const navigateToPost = (postId: number) => {
    router.push(`/service/community/forum/post/${postId}`);
};

// Delete post
const handleDelete = async (postId: number) => {
    try {
        await ElMessageBox.confirm(
            '确定要删除这篇帖子吗？删除后将无法恢复。',
            '删除帖子',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        await deletePost(postId);
    } catch (error) {
        // User cancelled
        if (error !== 'cancel') {
            console.error('删除帖子失败:', error);
        }
    }
};

// Load more posts
const loadMore = () => {
    if (!myPostsHasMore.value || myPostsLoading.value) return;
    fetchMyPosts(myPostsPage.value + 1, 10, true);
};

// Initial load
onMounted(() => {
    fetchMyPosts(1, 10);
});
</script>