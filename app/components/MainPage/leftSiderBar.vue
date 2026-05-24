<template>
  <div
    class="sidebar-wrap flex flex-col gap-4 shrink-0 transition-[width] duration-300 overflow-hidden"
    :class="collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'"
  >

    <!-- Toggle Button — icon always centered in w-12 box -->
    <div class="flex items-center">
      <span class="w-12 flex items-center justify-center shrink-0">
        <button
          @click="collapsed = !collapsed"
          class="p-1.5 rounded-lg text-slate-400 hover:text-[#ff5000] hover:bg-orange-50 dark:hover:bg-[#ff5000]/10 transition-colors duration-200"
          :title="collapsed ? '展开侧边栏' : '折叠侧边栏'"
        >
          <Icon
            :name="collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
            size="18"
          />
        </button>
      </span>
    </div>

    <!-- Navigation Groups -->
    <div
      v-for="(group, idx) in menuGroups"
      :key="idx"
      class="bg-white dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm"
    >
      <div class="py-2 flex flex-col gap-1">
        <NuxtLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          v-show="item.show !== false"
          class="nav-item flex items-center rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-[#ff5000]/10 hover:text-[#ff5000] transition-all duration-200 group relative"
          active-class="active-nav bg-orange-50 dark:bg-[#ff5000]/10 text-[#ff5000] font-bold"
          :title="collapsed ? item.name : ''"
        >
          <!-- Icon: always in fixed w-12 centered box — position never changes -->
          <span class="w-12 py-3 flex items-center justify-center shrink-0">
            <Icon :name="item.icon" size="18" class="opacity-70 group-hover:opacity-100 transition-opacity" />
          </span>

          <!-- Label: expands to the right, icon stays put -->
          <span
            class="whitespace-nowrap overflow-hidden transition-all duration-300 pr-3"
            :style="collapsed ? 'max-width:0;opacity:0' : 'max-width:6rem;opacity:1'"
          >
            {{ item.name }}
          </span>

          <!-- Active Indicator Dot -->
          <div
            v-show="!collapsed"
            class="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#ff5000] opacity-0 scale-0 transition-all nav-dot"
          />
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

const collapsed = ref(true)

// Navigation Groups Data
const menuGroups = computed(() => [
  {
    items: [
      { name: '社区论坛', path: '/service/community/forum', icon: 'lucide:layout-grid' },
      { name: '通知公告', path: '/service/community/news', icon: 'lucide:megaphone' },
      { name: '物业缴费', path: '/service/community/payment', icon: 'lucide:credit-card' },
      { name: '报修投诉', path: '/service/community/issues', icon: 'lucide:wrench' },
      { name: '停车服务', path: '/service/community/parking', icon: 'lucide:car' },
      { name: '访客管理', path: '/service/community/visitors', icon: 'lucide:users' },
    ]
  },
  {
    items: [
      { name: '我的好友', path: '/service/community/friends', icon: 'lucide:user' },
      { name: '我的钱包', path: '/wallet', icon: 'lucide:wallet' },
      { name: '个人信息', path: '/profile', icon: 'lucide:user-circle' },
      {
        name: '管理后台',
        path: '/superCommunity',
        icon: 'lucide:shield-check',
        show: userStore.userRole?.roleId !== 4 && userStore.userRole?.roleId != null
      },
    ]
  }
])
</script>

<style scoped>
.sidebar-expanded {
  width: 9.5rem; /* icon(3rem) + text + breathing room */
}

.sidebar-collapsed {
  width: 3rem; /* just wide enough for icons */
}

.active-nav .nav-dot {
  opacity: 1;
  scale: 1;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>