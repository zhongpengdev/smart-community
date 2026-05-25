<template>
    <SuperCommunitySiderBarGroup 
        title="安保管理" 
        icon="lucide:shield"
        :collapsed="collapsed"
        v-if="hasAnyPermission"
    >
        <NuxtLink v-if="hasPermission('security:view')" to="/superCommunity/security/visitor"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/security/visitor') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:users" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/security/visitor') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            访客通行
        </NuxtLink>

        <NuxtLink v-if="hasPermission('security:view')" to="/superCommunity/security/parking"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/security/parking') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:car" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/security/parking') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            车位管理
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
    return hasPermission('security:view');
});
</script>
