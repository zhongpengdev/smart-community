<template>
    <div class="pb-20">
        <!-- Header -->
        <div
            class="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50"
        >
            <div
                class="max-w-[1300px] mx-auto px-4 h-14 flex items-center justify-between"
            >
                <div class="flex items-center gap-4">
                    <button
                        @click="$router.back()"
                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                    >
                        <Icon name="lucide:arrow-left" size="20" />
                    </button>
                    <span class="font-bold text-slate-800 dark:text-slate-100"
                        >帖子详情</span
                    >
                </div>
            </div>
        </div>

        <!-- Content -->
        <div
            class="max-w-[1300px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start"
        >
            <!-- Main Post Area -->
            <div
                class="min-w-0 bg-white dark:bg-slate-900 rounded shadow-sm overflow-hidden min-h-[400px]"
            >
                <!-- Loading -->
                <div
                    v-if="loading"
                    class="p-10 flex flex-col items-center justify-center space-y-4"
                >
                    <div
                        class="w-10 h-10 border-4 border-slate-200 border-t-[#ff5000] rounded animate-spin"
                    ></div>
                    <span class="text-slate-400">加载中...</span>
                </div>

                <div v-else-if="!post" class="p-20 text-center text-slate-400">
                    <Icon
                        name="lucide:file-question"
                        size="48"
                        class="mx-auto mb-4 opacity-50"
                    />
                    <p>帖子不存在或已被删除</p>
                </div>

                <div v-else class="p-6 md:p-10">
                    <!-- Title -->
                    <h1
                        class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight"
                    >
                        {{ post.title }}
                    </h1>

                    <!-- Author Info Row -->
                    <div class="flex items-center gap-3 mb-8">
                        <img
                            :src="
                                post.userAvatar ||
                                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                            "
                            class="w-10 h-10 rounded object-cover border border-slate-100 dark:border-slate-800"
                        />
                        <div class="flex flex-col">
                            <span
                                class="text-sm font-bold text-slate-800 dark:text-slate-200"
                                >{{ post.userName }}</span
                            >
                            <div
                                class="flex items-center gap-2 text-xs text-slate-400"
                            >
                                <span>{{ post.createTime }}</span>
                                <span v-if="post.viewCount"
                                    >· {{ post.viewCount }} 阅读</span
                                >
                            </div>
                        </div>
                        <button
                            class="ml-auto px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#056de8] dark:text-blue-400 text-xs font-bold rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                            + 关注
                        </button>
                    </div>

                    <!-- Content Body -->
                    <div
                        class="prose prose-slate dark:prose-invert max-w-none mb-10 text-slate-800 dark:text-slate-300 leading-loose"
                    >
                        <p class="whitespace-pre-wrap">{{ post.content }}</p>

                        <!-- Images -->
                        <div
                            v-if="post.images"
                            class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                        >
                            <!-- TODO: Handle image list splitting if string, or loop if array -->
                            <!-- Assuming images might be string separated by comma or array. API doc says 'images': null.
                                 If it's a string "url1,url2", we split. -->
                            <!-- <img v-for="(img, idx) in imageList" :key="idx" :src="img" class="rounded w-full object-cover shadow-sm" /> -->
                        </div>
                    </div>

                    <!-- Actions Bottom Bar (Sticky or just bottom) -->
                    <div
                        class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6"
                    >
                        <div class="flex items-center gap-6">
                            <button
                                @click="handleLike"
                                class="flex items-center gap-2 px-4 py-2 rounded transition-all group"
                                :class="
                                    post.isLiked
                                        ? 'bg-blue-50 text-[#056de8] dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                "
                            >
                                <Icon
                                    name="lucide:thumbs-up"
                                    size="18"
                                    :class="
                                        post.isLiked
                                            ? 'fill-current'
                                            : 'group-hover:scale-110 transition-transform'
                                    "
                                />
                                <span class="font-bold">{{
                                    post.likeCount > 0 ? post.likeCount : "赞"
                                }}</span>
                            </button>

                            <button
                                @click="handleCollect"
                                class="flex items-center gap-2 px-4 py-2 rounded transition-all group"
                                :class="
                                    post.isCollected
                                        ? 'bg-orange-50 text-[#ff5000] dark:bg-orange-900/20 dark:text-[#ff5000]'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                "
                            >
                                <Icon
                                    name="lucide:star"
                                    size="18"
                                    :class="
                                        post.isCollected
                                            ? 'fill-current'
                                            : 'group-hover:scale-110 transition-transform'
                                    "
                                />
                                <span class="font-bold">{{
                                    post.isCollected ? "已收藏" : "收藏"
                                }}</span>
                            </button>
                        </div>

                        <div
                            class="flex items-center gap-4 text-slate-400 text-sm font-medium"
                        >
                            <span
                                class="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                            >
                                <Icon name="lucide:alert-circle" size="16" />
                                举报
                            </span>
                            <span
                                class="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                            >
                                <Icon name="lucide:share-2" size="16" />
                                分享
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Comments Section -->
                <ForumInnerComments v-if="post" :post-id="postId" />
            </div>

            <!-- Right Sidebar -->
            <div class="hidden lg:block space-y-4">
                <div
                    class="bg-white dark:bg-slate-900 rounded shadow-sm p-4 sticky top-20"
                >
                    <h3
                        class="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase tracking-wider opacity-50"
                    >
                        关于作者
                    </h3>
                    <div class="flex items-center gap-3 mb-4">
                        <img
                            :src="post?.userAvatar"
                            class="w-12 h-12 rounded object-cover"
                        />
                        <div>
                            <div
                                class="font-bold text-slate-800 dark:text-slate-100"
                            >
                                {{ post?.userName }}
                            </div>
                            <div class="text-xs text-slate-400">社区居民</div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button
                            class="flex-1 py-1.5 bg-[#056de8] text-white rounded text-sm font-bold hover:bg-blue-600 transition-colors"
                        >
                            关注
                        </button>
                        <button
                            class="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            私信
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePost } from "~/composables/form/usePost";

const userStore = useUserStore();
const route = useRoute();
const postId = route.params.postId as string;
const { getPostDetail, toggleLike, toggleCollect } = usePost();

const post = ref<any>(null);
const loading = ref(true);

const fetchDetail = async () => {
    loading.value = true;
    try {
        const data = await getPostDetail(postId);
        post.value = data;
    } catch (e) {
        ElMessage.error("加载详情失败");
    } finally {
        loading.value = false;
    }
};

const handleLike = async () => {
    if (!post.value) return;
    await toggleLike(post.value);
};

const handleCollect = async () => {
    if (!post.value) return;
    await toggleCollect(post.value);
};

const imageList = computed(() => {
    if (!post.value?.images) return [];
    // Assuming string "url,url"
    return post.value.images.split(",");
});

onMounted(async () => {
    await fetchDetail();
});
</script>

<style scoped>
/* Optional: specific styles */
</style>
