<template>
    <div class="bg-slate-50 dark:bg-black/20 p-6 border-t border-slate-100 dark:border-slate-800" id="comments-section">
        <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2">
            评论
            <span class="text-slate-400 font-normal">({{ commentsTotal }})</span>
        </h3>

        <!-- Comment Input Area -->
        <div class="flex gap-4 mb-8">
            <el-avatar :size="40" :src="userStore.userInfo?.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                " />
            <div class="flex-1">
                <div class="relative">
                    <textarea v-model="commentContent" ref="commentInputRef"
                        class="w-full h-24 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded resize-none focus:outline-none focus:ring-1 focus:ring-[#ff5000] focus:border-[#ff5000] transition-all text-sm"
                        :placeholder="replyTarget
                            ? `回复 ${replyTarget.userName}:`
                            : '写下你的评论...'
                            "></textarea>
                    <button v-if="replyTarget" @click="cancelReply"
                        class="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        取消回复
                    </button>
                </div>
                <div class="flex justify-end mt-2">
                    <button @click="handleSubmit" :disabled="!commentContent.trim() || submitting"
                        class="px-6 py-1.5 bg-[#056de8] text-white rounded text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <span v-if="submitting"
                            class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded"></span>
                        发表评论
                    </button>
                </div>
            </div>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
            <div v-for="comment in commentsList" :key="comment.commentId" class="flex gap-3 group">
                <el-avatar :size="40" :src="comment.userAvatar" class="border border-slate-200 dark:border-slate-700" />
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ comment.userName }}</span>
                        <span class="text-xs text-slate-400">{{
                            formatDate(comment.createTime)
                        }}</span>
                    </div>

                    <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                        {{ comment.content }}
                    </p>

                    <div class="flex items-center gap-4 text-xs text-slate-400">
                        <button @click="toggleCommentLike(comment)"
                            class="flex items-center gap-1 hover:text-[#056de8] transition-colors"
                            :class="{ 'text-[#056de8]': comment.isLiked }">
                            <Icon name="lucide:thumbs-up" size="14" :class="{ 'fill-current': comment.isLiked }" />
                            <span>{{ comment.likeCount || "赞" }}</span>
                        </button>
                        <button @click="prepareReply(comment)"
                            class="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <Icon name="lucide:message-square" size="14" />
                            <span>回复</span>
                        </button>
                        <button v-if="
                            Number(userStore.userInfo?.userId) ===
                            comment.userId
                        " @click="handleDelete(comment.commentId)"
                            class="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Icon name="lucide:trash-2" size="14" />
                            <span>删除</span>
                        </button>
                    </div>

                    <!-- Replies (Nested) -->
                    <div v-if="comment.replies && comment.replies.length > 0"
                        class="mt-3 bg-slate-100 dark:bg-slate-800/50 rounded p-3 space-y-3">
                        <div v-for="reply in comment.replies" :key="reply.commentId" class="flex gap-2 text-sm">
                            <div class="flex-1">
                                <span class="font-bold text-slate-700 dark:text-slate-300">{{ reply.userName }}</span>
                                <span v-if="reply.replyToUserName" class="text-slate-500 mx-1">回复</span>
                                <span v-if="reply.replyToUserName"
                                    class="font-bold text-slate-700 dark:text-slate-300">{{ reply.replyToUserName
                                    }}</span>
                                <span class="text-slate-600 dark:text-slate-400 ml-1">: {{ reply.content }}</span>

                                <div class="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                    <span>{{
                                        formatDate(reply.createTime)
                                    }}</span>
                                    <button @click="toggleCommentLike(reply)" class="hover:text-[#056de8]" :class="{
                                        'text-[#056de8]': reply.isLiked,
                                    }">
                                        赞 ({{ reply.likeCount }})
                                    </button>
                                    <button @click="prepareReply(comment, reply)" class="hover:text-slate-600">
                                        回复
                                    </button>
                                    <button v-if="
                                        Number(
                                            userStore.userInfo?.userId,
                                        ) === reply.userId
                                    " @click="handleDelete(reply.commentId)" class="hover:text-red-500">
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading Sentinel -->
        <!-- Loading Sentinel -->
        <div ref="sentinelRef" class="py-6">
            <!-- Loading Skeleton -->
            <div v-if="commentsLoading" class="space-y-6">
                <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
                    <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded shrink-0"></div>
                    <div class="flex-1 space-y-2 py-1">
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="!commentsHasMore && commentsList.length > 0" class="text-xs text-slate-400 text-center">
                - 已加载全部评论 -
            </div>
            <div v-else-if="!commentsHasMore && commentsList.length === 0"
                class="text-xs text-slate-400 py-4 text-center w-full">
                暂无评论，快来抢沙发吧~
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useComments } from "~/composables/form/useComments";
import { useIntersectionObserver } from "~/utils/lazyLoading";
import type { Comment } from "~/utils/Post/comments";
import { checkText } from "~/utils/moderation";

const props = defineProps<{
    postId: string | number;
}>();

const userStore = useUserStore();
const {
    commentsList,
    commentsLoading,
    commentsTotal,
    commentsPage,
    commentsHasMore,
    submitting,
    fetchComments,
    publishComment,
    toggleCommentLike,
    removeComment,
} = useComments();

const commentContent = ref("");
const commentInputRef = ref<HTMLTextAreaElement | null>(null);

// State for reply
const replyTarget = ref<{
    commentId: number; // parentId
    userId: number; // replyToUserId
    userName: string;
} | null>(null);

const formatDate = (str: string) => {
    if (!str) return "";
    const d = new Date(str);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return Math.floor(diff / 60000) + "分钟前";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "小时前";
    return `${d.getMonth() + 1}月${d.getDate()}日`;
};

// Initial Load
// Lazy Loading


const loadMore = async () => {
    if (!commentsHasMore.value || commentsLoading.value) return;

    // Artificial delay for skeleton demonstration (500ms)
    //骨架屏延迟

    //渲染骨架屏
    commentsLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));

    const nextPage =
        commentsList.value.length === 0 ? 1 : commentsPage.value + 1;
    await fetchComments(props.postId, nextPage, 5, true);
};

//回调函数是：loadMore
const { targetRef: sentinelRef } = useIntersectionObserver(loadMore);

// Initial Load handled by Observer if sentinel is visible
// But we should reset state on mount to be sure
onMounted(() => {
    commentsList.value = [];
    commentsPage.value = 1;
    commentsHasMore.value = true;
    commentsTotal.value = 0;
});

// Reply Logic
const prepareReply = (parent: Comment, replyTo?: Comment) => {
    const targetUser = replyTo || parent;
    replyTarget.value = {
        commentId: parent.commentId, // Always use top-level comment as parentId for 2-level nesting?
        // Wait, API has parentId. If I reply to a reply, is parentId the main comment or the reply?
        // Usually 2-level systems: parentId is the root comment. replyToUserId is the specific user.
        // Let's assume 2-level based on typical designs.
        userId: targetUser.userId,
        userName: targetUser.userName,
    };

    // Focus input
    commentInputRef.value?.focus();
    // Scroll to input?
    // document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
};

const cancelReply = () => {
    replyTarget.value = null;
    commentContent.value = "";
};

const handleSubmit = async () => {
    if (!commentContent.value.trim()) return;

    if (!(await checkText(commentContent.value))) return;

    const params = {
        postId: props.postId,
        content: commentContent.value,
        parentId: replyTarget.value?.commentId,
        replyToUserId: replyTarget.value?.userId,
    };

    const success = await publishComment(params);
    if (success) {
        commentContent.value = "";
        replyTarget.value = null;
        // Simplest is to reload page 1 to see the new comment at top (if sorted by time desc)
        // Or if sorted by time asc (typical for forums), it might be at bottom.
        // Let's re-fetch.
        commentsList.value = [];
        commentsPage.value = 1;
        fetchComments(props.postId);
    }
};

const handleDelete = async (commentId: number) => {
    await removeComment(commentId);
};
</script>
