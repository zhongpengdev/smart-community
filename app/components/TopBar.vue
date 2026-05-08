<template>
  <nav
    class="h-10 px-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors z-[1000] sticky top-0">
    <div class="flex items-center">
      <nuxt-link to="/">
        <div class="text-sm font-bold text-[#ff5000] flex items-center gap-2">
          <Icon name="lucide:layout-grid" size="14" class="shrink-0" />
          <div class="flex items-center w-[190px]">
            <span>{{ titleParts.base }}</span>
            <Transition name="title-slide" mode="out-in">
              <span :key="titleParts.sub" class="whitespace-nowrap block">{{ titleParts.sub }}</span>
            </Transition>
          </div>
        </div>
      </nuxt-link>
      <!-- New Navigation Links -->
      <div class="flex items-center gap-1 ml-5">

        <NuxtLink to="/agent"
          class="h-7 px-3 flex items-center gap-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-[#ff5000] transition-all text-xs font-semibold"
          active-class="bg-orange-50 dark:bg-orange-950/30 !text-[#ff5000]">
          <Icon name="lucide:bot" size="14" />
          智能体
        </NuxtLink>

        <NuxtLink to="/service/mall"
          class="h-7 px-3 flex items-center gap-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-[#ff5000] transition-all text-xs font-semibold"
          active-class="bg-orange-50 dark:bg-orange-950/30 !text-[#ff5000]">
          <Icon name="lucide:shopping-cart" size="14" />
          商城
        </NuxtLink>

        <div class="relative group h-7">
          <div
            class="h-full px-3 flex items-center gap-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-[#ff5000] transition-all text-xs font-semibold cursor-pointer">
            <Icon name="lucide:grid" size="14" />
            社区服务
            <Icon name="lucide:chevron-down" size="12" class="transition-transform group-hover:rotate-180 opacity-50" />
          </div>

          <div
            class="absolute top-full left-0 pt-1.5 w-[440px] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100 z-[1001]">
            <div
              class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-5 grid grid-cols-2 gap-6 ring-1 ring-slate-200/50 dark:ring-white/5">
              <div v-for="category in communityServices" :key="category.title" class="flex flex-col gap-3">
                <div
                  class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] pb-1.5 border-b border-slate-50 dark:border-white/5">
                  <Icon :name="category.icon" size="12" />
                  {{ category.title }}
                </div>
                <div class="flex flex-col gap-0.5">
                  <NuxtLink v-for="item in category.items" :key="item.name" :to="item.path"
                    class="px-2.5 py-2 rounded-xl text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#ff5000] transition-all flex items-center justify-between group/item">
                    {{ item.name }}
                    <Icon name="lucide:arrow-right" size="12"
                      class="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#ff5000]" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3 text-xs font-medium">
      <!-- Remaining Right Part -->

      <NuxtLink to="/wallet" class="text-slate-600 dark:text-slate-300 hover:text-[#ff5000] transition-colors">
        钱包
      </NuxtLink>

      <NuxtLink to="/service/mall/mo" class="text-slate-600 dark:text-slate-300 hover:text-[#ff5000] transition-colors">
        订单
      </NuxtLink>

      <NuxtLink to="/superCommunity" v-show="canVisitSc"
        class="text-slate-600 dark:text-slate-300 hover:text-[#ff5000] transition-colors">
        {{ roleType }}
      </NuxtLink>

      <div class="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>

      <!-- 通知铃铛 -->
      <NotificationsDropdown v-if="userStore.isLoggedIn" />

      <button @click="toggleTheme"
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#ff5000] transition-all">
        <Icon v-if="colorMode.value === 'dark'" name="lucide:moon" size="14" />
        <Icon v-else name="lucide:sun" size="14" />
      </button>
      <template v-if="userStore.isLoggedIn">
        <NuxtLink to="/profile"
          class="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-[#ff5000] transition-colors group">
          <div>
            <span class="font-medium whitespace-nowrap">{{ userStore.displayName }}</span>
          </div>
        </NuxtLink>

        <el-avatar :size="28" :src="userStore.userInfo?.avatar"
          class="shrink-0 border border-orange-100 dark:border-orange-900/30">
          {{ userStore.displayName ? userStore.displayName.charAt(0).toUpperCase() : 'U' }}
        </el-avatar>

      </template>

      <NuxtLink v-else to="/login" class="text-slate-600 dark:text-slate-300 hover:text-[#ff5000] transition-colors">
        登录
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const route = useRoute();
const userStore = useUserStore();

// 定义社区服务的菜单数据
const communityServices = [
  {
    title: '消息管理',
    icon: 'lucide:bell',
    items: [
      { name: '公告列表查询', path: '/service/community/news' }
    ]
  },
  {
    title: '安保管理',
    icon: 'lucide:shield-check',
    items: [
      { name: '访客登记', path: '/service/community/visitors' },
      { name: '车位管理', path: '/service/community/parking' }
    ]
  },
  {
    title: '物业管理',
    icon: 'lucide:wrench',
    items: [
      { name: '报修与投诉', path: '/service/community/issues' },
    ]
  },
  {
    title: '生活缴费',
    icon: 'lucide:wallet',
    items: [
      { name: '物业费缴纳', path: '/service/community/payment' }
    ]
  }
]


//canVisitSc
const canVisitSc = computed(() => {

  const roleTypeId = userStore.userRole?.roleId;

  // 未登录或角色ID为4（普通用户）时不显示后台管理入口
  if (!roleTypeId || roleTypeId === 4) return false;
  return true;
})

//RoleType
const roleType = computed(() => {
  return userStore.userRole?.roleName;
})

const titleParts = computed(() => {
  const path = route.path || "";
  const communityPrefix = "Neuedu智慧社区";

  if (path.startsWith("/service/mall/chart")) {
    return { base: "Neuedu智慧商城", sub: " - 购物车" };
  }

  if (path.startsWith("/service/mall")) {
    return { base: "Neuedu智慧商城", sub: "" };
  }

  if (path.startsWith("/service/community/news"))
    return { base: communityPrefix, sub: " - 公告" };
  if (path.startsWith("/service/community/payment"))
    return { base: communityPrefix, sub: " - 缴费" };
  if (path.startsWith("/service/community/issues"))
    return { base: communityPrefix, sub: " - 报修投诉" };
  if (path.startsWith("/service/community/parking"))
    return { base: communityPrefix, sub: " - 停车服务" };
  if (path.startsWith("/service/community/visitors"))
    return { base: communityPrefix, sub: " - 访客" };
  if (path.startsWith("/wallet"))
    return { base: communityPrefix, sub: " - 钱包" };
  if (path.startsWith("/profile"))
    return { base: communityPrefix, sub: " - 我的" };

  return { base: communityPrefix, sub: "" };
});

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
.title-slide-enter-active,
.title-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.title-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.title-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
