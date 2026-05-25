<script setup lang="ts">
const colorMode = useColorMode();

useHead({
    htmlAttrs: {
        class: computed(() => (colorMode.value === "dark" ? "dark" : "")),
    },
    bodyAttrs: {
        class: 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors duration-300 min-h-screen',
    },
});
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
