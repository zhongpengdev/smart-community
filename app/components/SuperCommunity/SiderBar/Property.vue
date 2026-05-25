<template>
    <SuperCommunitySiderBarGroup 
        title="物业管理" 
        icon="lucide:building-2"
        :collapsed="collapsed"
        v-if="hasAnyPermission"
    >
        <NuxtLink v-if="hasPermission('property:view')" to="/superCommunity/property/fee"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/property/fee') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:receipt" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/property/fee') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            物业费管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('property:view')" to="/superCommunity/property/repair"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/property/repair') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:wrench" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/property/repair') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            报事维修管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('property:view')" to="/superCommunity/property/complaint"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/property/complaint') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:message-circle-warning" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/property/complaint') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            事项投诉管理
        </NuxtLink>
    </SuperCommunitySiderBarGroup>
</template>

<script setup lang="ts">
defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

const route = useRoute()
const userStore = useUserStore()

const isActive = (path: string) => route.path.startsWith(path)

const hasPermission = (permissionCode: string) => {
    if (userStore.userRole?.roleCode === 'ROLE_SUPER_ADMIN') return true;
    return userStore.userPermissions?.some(p => p.permissionCode === permissionCode);
};

const hasAnyPermission = computed(() => {
    return hasPermission('property:view');
});
</script>
