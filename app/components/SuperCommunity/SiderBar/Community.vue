<template>
    <!-- Community Management -->
    <SuperCommunitySiderBarGroup 
        title="社区管理" 
        icon="lucide:users"
        :collapsed="collapsed"
        v-if="hasCommunityPermission"
    >
        <NuxtLink v-if="hasPermission('forum:section:view')" to="/superCommunity/community/section"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/community/section') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:layout-grid" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/community/section') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            板块管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('forum:view')" to="/superCommunity/community/forum"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/community/forum') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:messages-square" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/community/forum') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            论坛管理
        </NuxtLink>
    </SuperCommunitySiderBarGroup>

    <!-- Message Management -->
    <SuperCommunitySiderBarGroup 
        title="消息管理" 
        icon="lucide:megaphone"
        :collapsed="collapsed"
        v-if="hasMessagePermission"
    >
        <NuxtLink v-if="hasPermission('notification:view')" to="/superCommunity/message/notification"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/message/notification') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:bell" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/message/notification') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            通知管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('announcement:view')" to="/superCommunity/message/announcement"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/message/announcement') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:megaphone" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/message/announcement') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            公告管理
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

const hasCommunityPermission = computed(() => {
    return hasPermission('forum:section:view') || hasPermission('forum:view');
});

const hasMessagePermission = computed(() => {
    return hasPermission('notification:view') || hasPermission('announcement:view');
});
</script>
