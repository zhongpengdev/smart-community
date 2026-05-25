<template>
    <div class="pt-8 pb-4 mb-6">
        <div class="max-w-[1300px] mx-auto px-4 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">访客登记</h1>

            <button @click="$emit('create')"
                class="bg-[#ff5000] hover:bg-[#ff3d00] text-white px-6 py-2 rounded shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm font-medium">
                <Icon name="lucide:plus" size="16" />
                新建访客登记
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits(['create'])
</script>
