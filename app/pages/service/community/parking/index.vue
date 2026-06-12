<template>
    <div class="min-h-screen bg-[#f5f7fa] dark:bg-black pb-12">
        <!-- Header -->
        <div class="pt-8 pb-4 mb-6">
            <div class="max-w-[1300px] mx-auto px-4 flex items-center justify-between">
                <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">车位管理</h1>
            </div>
        </div>

        <div class="max-w-[1300px] mx-auto px-4">
            <AllParking @apply="handleApply" />
        </div>

        <Application ref="applicationRef" @success="handleSuccess" />
    </div>
</template>

<script setup lang="ts">
import AllParking from '~/components/Parking/AllParking.vue'
import Application from '~/components/Parking/Application.vue'

useHead({
    title: '车位管理 - 智慧社区'
})

const applicationRef = ref()

const handleApply = (spaceNo: string) => {
    applicationRef.value?.open(spaceNo)
}

const handleSuccess = async () => {
    // Optionally refresh the parking grid. To do this properly, AllParking should expose a refresh method or we just force reload.
    // However, AllParking fetches on mount. Let's make it easy: force re-mounting by key or just accept that AllParking refreshes itself?
    // AllParking doesn't expose refresh. 
    // Ideally, pass a trigger or call a method on AllParking via ref.
    // For now, let's just let it be. The user can refresh.
    // Or better: reload the page or use a key.
    location.reload() // Simplest way to ensure latest state for now
}
</script>
