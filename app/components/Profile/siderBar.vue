<template>
  <div
    class="w-48 shrink-0 bg-white dark:bg-black border border-slate-100 dark:border-white/5 rounded py-4 select-none shadow-sm">

    <div v-for="(item, index) in menuItems" :key="index" class="mb-1">

      <NuxtLink v-if="!item.children" :to="item.path"
        class="flex items-center justify-between px-6 py-2.5 text-sm cursor-pointer transition-colors border-l-[3px] border-transparent hover:text-[#ff5000]"
        :class="isActive(item.path) ? 'text-[#ff5000] font-bold border-[#ff5000] bg-orange-50 dark:bg-[#ff5000]/10' : 'text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'">
        <span class="flex items-center gap-2">
          {{ item.title }}
        </span>
      </NuxtLink>

      <div v-else>
        <div @click="toggleExpand(item.title)"
          class="flex items-center justify-between px-6 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
          <span>{{ item.title }}</span>
          <Icon name="lucide:chevron-down" size="14" class="text-slate-400 transition-transform duration-200"
            :class="expandedKeys.includes(item.title) ? 'rotate-180' : ''" />
        </div>

        <div v-show="expandedKeys.includes(item.title)" class="flex flex-col gap-0.5 mt-0.5 mb-2 transition-all">
          <NuxtLink v-for="sub in item.children" :key="sub.title" :to="sub.path"
            class="pl-10 pr-4 py-2 text-[13px] text-slate-600 dark:text-slate-500 hover:text-[#ff5000] dark:hover:text-[#ff5000] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors block"
            :class="{ 'text-[#ff5000] font-bold': isActive(sub.path) }">
            {{ sub.title }}
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- 退出登录按钮 -->
    <div class="mt-4 px-4 border-t border-slate-100 dark:border-white/10 pt-4">
      <button @click="handleLogout"
        class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 hover:text-red-500 hover:bg-red-50 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-red-400 rounded transition-colors">
        <Icon name="lucide:log-out" size="16" />
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// 定义菜单结构
const menuItems = [
  { title: '关于我', path: '/profile' },
  { title: '我的购物车', path: '/service/mall/chart' },
  { title: '我的订单', path: '/service/mall/mo' },
  { title: '我的帖子', path: '/service/community/forum/post/my-posts' },

  //可展开项
  {
    title: '账户设置',
    // 默认不需要 path，只作为折叠容器
    children: [
      { title: '更新个人资料', path: '/user/info' }, // 对应地址资料/个人资料
    ]
  }
]

// 管理展开状态 (默认展开 '账户设置')
const expandedKeys = ref<string[]>(['账户设置'])

// 切换展开/收起
const toggleExpand = (title: string) => {
  const index = expandedKeys.value.indexOf(title)
  if (index > -1) {
    expandedKeys.value.splice(index, 1) // 收起
  } else {
    expandedKeys.value.push(title) // 展开
  }
}

// 判断当前路由是否激活 (支持子路由高亮)
const isActive = (path: string) => {
  return route.path === path
}

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {

    logoutUser().then(() => {
      userStore.logout();
      ElMessage.success('退出登陆成功，即将跳转到主界面')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    })
  }
}
</script>