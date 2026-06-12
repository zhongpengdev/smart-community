<template>
    <div class="bg-white dark:bg-black rounded shadow-sm overflow-hidden">
        <div v-for="post in posts" :key="post.postId" @click="navigateToPost(post.postId)"
            class="p-5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">

            <!-- Title with Tags -->
            <h3
                class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-[#175199] dark:group-hover:text-blue-400 transition-colors leading-snug flex items-center gap-2 flex-wrap">
                <!-- 置顶标签 -->
                <span v-if="post.isTop"
                    class="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded">
                    置顶
                </span>
                <!-- 精华标签 -->
                <span v-if="post.isEssence"
                    class="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded">
                    精华
                </span>
                <span>{{ post.title }}</span>
            </h3>

            <!-- User Info (Small, optional, maybe like "Author: Name") or Content -->
            <!-- Zhihu style often entails: User info line -> Content. But simplified: Just content is fine. 
                 User requested image, so layout: Content text + Image (if any) -->

            <div class="flex gap-4 mb-3">
                <!-- Image Thumbnail (Right side or Left? Zhihu usually right side if thumbnail, or embedded. 
                      Let's put generic thumbnail on right if exists, or just below text) 
                      Code had image block below text. Let's keep it but improve look. 
                      Actually, let's try a flex layout: Text Left, Image Right (if image exists). -->

                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2 text-sm text-slate-800 dark:text-slate-200 font-bold">
                        <img :src="post.userAvatar" class="w-5 h-5 rounded object-cover" />
                        <span>{{ post.userName }}</span>
                        <span class="text-slate-400 font-normal md:hidden">· {{ formatDate(post.createTime) }}</span>
                    </div>
                    <p
                        class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 hover:text-slate-500">
                        {{ post.contentSummary }}
                    </p>
                </div>

                <div v-if="post.firstImage" class="shrink-0">
                    <img :src="post.firstImage" class="w-40 h-21 object-cover rounded" />
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-6 mt-2">
                <!-- Zhihu Style Like Button -->
                <button @click.stop="toggleLike(post)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors"
                    :class="post.isLiked
                        ? 'bg-[#056de8] text-white'
                        : 'bg-[#ecf5ff] dark:bg-blue-900/20 text-[#056de8] dark:text-blue-400 hover:bg-[#deecff] dark:hover:bg-blue-900/30'">
                    <Icon name="lucide:triangle" size="12" class="fill-current"
                        :class="post.isLiked ? 'text-white' : 'text-[#056de8]'" />
                    <span v-if="post.likeCount > 0">赞同 {{ post.likeCount }}</span>
                    <span v-else>赞同</span>
                </button>

                <!-- Comment -->
                <button
                    class="flex items-center gap-1.5 text-[#8590a6] hover:text-[#76839b] text-sm font-medium transition-colors">
                    <Icon name="lucide:message-square" size="14" class="fill-current" />
                    <span>{{ post.commentCount > 0 ? `${post.commentCount} 条评论` : '添加评论' }}</span>
                </button>

                <!-- Collect -->
                <button @click.stop="toggleCollect(post)"
                    class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                    :class="post.isCollected ? 'text-[#ff5000]' : 'text-[#8590a6] hover:text-[#76839b]'">
                    <Icon name="lucide:star" size="14" class="fill-current" />
                    <span>{{ post.isCollected ? '已收藏' : '收藏' }}</span>
                </button>

                <!-- Share (Optional) -->
                <button
                    class="flex items-center gap-1.5 text-[#8590a6] hover:text-[#76839b] text-sm font-medium transition-colors hidden sm:flex">
                    <Icon name="lucide:send" size="14" />
                    <span>分享</span>
                </button>

                <!-- Time (Right aligned or just inline) -->
                <span class="ml-auto text-sm text-[#8590a6] hidden md:block">
                    {{ formatDate(post.createTime) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ForumPost } from '~/composables/form/useForum';
import { usePost } from '~/composables/form/usePost';

const { toggleLike, toggleCollect } = usePost();


const props = defineProps<{
    posts: ForumPost[]
}>();

const navigateToPost = (postId: number | string) => {
    navigateTo(`/service/community/forum/post/${postId}`);
}

const formatDate = (str: string) => {
    if (!str) return '';
    const d = new Date(str);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    // Less than 1 min
    if (diff < 60000) return '刚刚';
    // Less than 1 hour
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    // Less than 24 hours
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    // More
    return `${d.getMonth() + 1}月${d.getDate()}日`;
};
</script>
