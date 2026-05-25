<template>
    <SuperCommunitySiderBarGroup 
        title="商城管理" 
        icon="lucide:shopping-bag"
        :collapsed="collapsed"
        v-if="hasAnyPermission"
    >
        <NuxtLink v-if="hasPermission('mall:view')" to="/superCommunity/mall/goods"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/mall/goods') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:package" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/mall/goods') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            商品基础管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('mall:view')" to="/superCommunity/mall/product"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/mall/product') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:store" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/mall/product') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            门店商品管理
        </NuxtLink>

        <NuxtLink v-if="hasPermission('order:view')" to="/superCommunity/mall/order"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded transition-colors duration-200"
            :class="isActive('/superCommunity/mall/order') ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'">
            <Icon name="lucide:clipboard-list" size="18" class="mr-3 flex-shrink-0"
                :class="isActive('/superCommunity/mall/order') ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'" />
            订单管理
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
    return hasPermission('mall:view') || hasPermission('order:view');
});
</script>
