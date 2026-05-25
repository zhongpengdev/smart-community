<template>
    <div :class="['flex items-center bg-white dark:bg-slate-800 border-2 border-[#ff5000] rounded overflow-hidden transition-all', containerClass]"
        :style="{ width: props.width, height: props.height }">
        <div class="flex-1 flex items-center pl-4 pr-2 h-full">
            <input v-model="internalQuery" type="text" :placeholder="placeholder"
                class="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 h-full"
                @keyup.enter="handleSearch" />
            <!-- Camera Icon (Mock) -->
            <button
                class="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                title="按图片搜索">
                <Icon name="lucide:camera" size="20" />
            </button>
        </div>
        <button @click="handleSearch"
            class="bg-gradient-to-r from-[#ff9000] to-[#ff5000] text-white font-bold px-6 hover:brightness-95 transition-all text-sm flex items-center justify-center shrink-0 rounded m-0.5 h-[calc(100%-4px)]">
            {{ buttonText }}
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '40px'
    },
    placeholder: {
        type: String,
        default: '宝贝搜索...'
    },
    buttonText: {
        type: String,
        default: '搜索'
    },
    containerClass: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'search'])

const internalQuery = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const handleSearch = () => {
    emit('search', internalQuery.value)
}
</script>

<style scoped>
/* No special styles needed, using Tailwind */
</style>
