<template>
    <div
        class="h-screen flex flex-col overflow-hidden">
        <TopBar class="shrink-0" />
        <div class="flex-1 relative">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAgent } from '~/composables/agent/useAgent'

const { initConnection, closeStream } = useAgent()

// 在 agent layout 挂载时建立 WebSocket 连接
onMounted(() => {
    console.log('Agent layout mounted, initializing WebSocket connection...')
    initConnection()
})

// 在 agent layout 卸载时关闭 WebSocket 连接
onUnmounted(() => {
    console.log('Agent layout unmounted, closing WebSocket connection...')
    closeStream()
})
</script>
