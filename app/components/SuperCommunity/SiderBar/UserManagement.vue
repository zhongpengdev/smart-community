<template>
    <SuperCommunitySiderBarGroup 
        title="系统管理" 
        icon="lucide:settings"
        :collapsed="collapsed"
        v-if="hasAnyPermission"
    >
        <NuxtLink v-if="hasPermission('user:view')" to="/superCommunity/system/user"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/system/user') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:users" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/system/user') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            用户管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('role:view')" to="/superCommunity/system/role"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/system/role') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:shield-check" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/system/role') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            角色管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('permission:view')" to="/superCommunity/system/permission"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/system/permission') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:lock" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/system/permission') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            权限管理
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
    // Super admin check
    if (userStore.userRole?.roleCode === 'ROLE_SUPER_ADMIN') return true;
    return userStore.userPermissions?.some(p => p.permissionCode === permissionCode);
};

const hasAnyPermission = computed(() => {
    return hasPermission('user:view') || hasPermission('role:view') || hasPermission('permission:view');
});
</script>
