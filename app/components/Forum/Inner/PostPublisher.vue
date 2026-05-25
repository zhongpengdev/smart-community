<template>
    <div class="bg-white dark:bg-slate-900 rounded p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div class="flex gap-4">
            <img :src="userAvatar" class="w-10 h-10 rounded object-cover bg-slate-100" />
            <div class="flex-1">
                <div class="mb-3">
                    <input v-model="title" type="text" placeholder="请输入标题 (必填)"
                        class="w-full bg-slate-50 dark:bg-slate-800/50 rounded px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 border-none outline-none focus:ring-2 ring-orange-100 dark:ring-orange-900/20 transition-all" />
                </div>
                <div
                    class="w-full bg-slate-50 dark:bg-slate-800/50 rounded p-3 mb-3 focus-within:ring-2 ring-orange-100 dark:ring-orange-900/20 transition-all">
                    <textarea v-model="content" placeholder="分享此刻的想法..."
                        class="w-full bg-transparent border-none outline-none resize-none text-sm min-h-[60px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400"></textarea>

                    <!-- Image Preview Area -->
                    <div v-if="images.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <div v-for="(img, idx) in images" :key="idx" class="relative group w-20 h-20">
                            <img :src="img"
                                class="w-full h-full object-cover rounded border border-slate-200 dark:border-slate-700" />
                            <button @click="removeImage(idx)"
                                class="absolute -top-1 -right-1 bg-red-500 text-white rounded p-0.5 hover:bg-red-600 transition-colors shadow-sm">
                                <Icon name="lucide:x" size="12" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <button
                            class="text-slate-400 hover:text-[#ff5000] transition-colors p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/10">
                            <Icon name="lucide:hash" size="18" />
                        </button>
                        <button
                            class="text-slate-400 hover:text-[#ff5000] transition-colors p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/10">
                            <Icon name="lucide:smile" size="18" />
                        </button>
                        <button @click="triggerFileUpload"
                            class="text-slate-400 hover:text-[#ff5000] transition-colors p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/10">
                            <Icon name="lucide:image" size="18" />
                        </button>
                        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
                        <button
                            class="text-slate-400 hover:text-[#ff5000] transition-colors p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/10">
                            <Icon name="lucide:video" size="18" />
                        </button>
                    </div>

                    <div class="flex items-center gap-3">
                        <button @click="handleSubmit" :disabled="!isFormValid || creating"
                            class="bg-[#ff5000] hover:bg-[#ff6a00] disabled:bg-slate-200 disabled:text-slate-400 text-white px-5 py-1.5 rounded text-sm font-bold transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center gap-2">
                            <span v-if="creating"
                                class="w-3 h-3 border-2 border-white/30 border-t-white rounded animate-spin"></span>
                            发想法
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePost } from '~/composables/form/usePost';
import { uploadImageApi } from '~/utils/commonApi';
import { checkText } from '~/utils/moderation';

const props = defineProps<{
    sectionId: string | number;
}>();

const emit = defineEmits(['success']);

const userStore = useUserStore();
const { creating, createPost } = usePost();
const content = ref('');
const title = ref('');
const images = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const userAvatar = computed(() => userStore.userInfo?.avatar);
const isFormValid = computed(() => title.value.trim() && content.value.trim());

const triggerFileUpload = () => {
    fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
            const res = await uploadImageApi(file as any) as any;
            if (res.code === 200) {
                images.value.push(res.data.url);
            } else {
                ElMessage.error(res.message || '图片上传失败');
            }
        } catch (e: any) {
            ElMessage.error('图片上传出错');
        } finally {
            // Reset input so same file can be selected again if needed (though typically not needed if successful)
            input.value = '';
        }
    }
};

const removeImage = (index: number) => {
    images.value.splice(index, 1);
};

const handleSubmit = async () => {
    if (!isFormValid.value) return;

    try {

        const titleIsSafe = await checkText(title.value + content.value);

        if (!titleIsSafe) return;

        await createPost({
            sectionId: props.sectionId,
            title: title.value,
            content: content.value,
            images: images.value.length > 0 ? images.value.join(',') : undefined
        });

        content.value = '';
        title.value = '';
        images.value = [];
        ElMessage.success('发布成功');
        emit('success');
    } catch (e: any) {
        ElMessage.error(e.message || '发布失败');
    }
};
</script>
