<template>
    <div class="w-full max-w-3xl">
        <div 
            class="relative flex flex-col w-full bg-[#f4f4f4] dark:bg-[#2f2f2f] rounded-[26px] border border-gray-200/30 dark:border-gray-700/30 transition-all duration-200 shadow-sm focus-within:shadow-md"
        >
            <!-- Textarea for ChatGPT-like multi-line input -->
            <textarea
                ref="textareaRef"
                v-model="inputValue"
                rows="1"
                placeholder="Ask me anything..."
                :disabled="loading"
                class="w-full pl-6 pr-14 py-4 bg-transparent border-0 outline-none resize-none max-h-52 text-[15px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 leading-relaxed"
                @keydown="handleKeyDown"
                @input="adjustHeight"
            />
            
            <!-- Action Button -->
            <div class="absolute right-3 bottom-3 flex items-center">
                <button
                    :disabled="!inputValue.trim() || loading"
                    class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200"
                    :class="[
                        inputValue.trim() && !loading
                            ? 'bg-black text-white dark:bg-white dark:text-black hover:opacity-90'
                            : 'bg-gray-200 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'
                    ]"
                    @click="handleSend"
                >
                    <Icon v-if="loading" name="lucide:loader-2" size="16" class="animate-spin" />
                    <Icon v-else name="lucide:arrow-up" size="18" class="stroke-[2.5]" />
                </button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'send', message: string): void
}>()

const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
    }
}

const adjustHeight = () => {
    const textarea = textareaRef.value
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
}

const handleSend = () => {
    const message = inputValue.value.trim()
    if (!message || props.loading) return

    emit('send', message)
    inputValue.value = ''
    nextTick(adjustHeight)
}

// Watch inputs to adjust height when cleared programmatically
watch(inputValue, (newVal) => {
    if (!newVal) {
        nextTick(adjustHeight)
    }
})

onMounted(() => {
    nextTick(adjustHeight)
})
</script>

<style scoped>
/* Reset scrollbar for textarea */
textarea::-webkit-scrollbar {
    display: none;
}
textarea {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
