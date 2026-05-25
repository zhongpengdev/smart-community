<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏（PC端固定顶部） -->
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        <!-- 社区Logo + 名称 -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">东软</div>
          <h1 class="text-xl font-bold text-gray-800">东软智慧社区论坛</h1>
        </div>

        <!-- 搜索框 -->
        <div class="w-1/3 relative">
          <input
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="搜索帖子/关键词..."
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button @click="handleSearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- 功能按钮 -->
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            发布新帖
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gray-300 rounded"></div>
            <span class="text-gray-700">住户123</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容（侧边栏 + 帖子列表） -->
    <main class="container mx-auto px-6 py-8 flex gap-8">
      <!-- 左侧分类侧边栏（PC端固定宽度） -->
      <aside class="w-64 shrink-0">
        <div class="bg-white rounded shadow-sm border border-gray-200 p-4">
          <h2 class="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">论坛分类</h2>
          <ul>
            <li v-for="category in categories" :key="category.id" class="mb-2">
              <button
                @click="activeCategoryId = category.id"
                class="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                :class="{ 'bg-blue-50 text-blue-600 font-medium': activeCategoryId === category.id }"
              >
                {{ category.name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- 社区统计（PC端补充信息） -->
        <div class="mt-4 bg-white rounded shadow-sm border border-gray-200 p-4">
          <h2 class="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">社区统计</h2>
          <div class="space-y-2 text-gray-600">
            <p>总帖子数：{{ totalPosts }}</p>
            <p>今日新增：{{ todayNewPosts }}</p>
            <p>活跃用户：{{ activeUsers }}</p>
          </div>
        </div>
      </aside>

      <!-- 右侧帖子列表（PC端自适应宽度） -->
      <section class="flex-1">
        <!-- 筛选结果提示 -->
        <div class="mb-6 flex items-center justify-between">
          <h2 class="font-bold text-gray-800">
            {{ activeCategoryId === 'all' ? '全部帖子' : categories.find(c => c.id === activeCategoryId)?.name }}
            <span class="text-gray-500 text-sm font-normal ml-2">共 {{ filteredPosts.length }} 条</span>
          </h2>
          <select class="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>最新发布</option>
            <option>最多回复</option>
            <option>最多阅读</option>
          </select>
        </div>

        <!-- 帖子卡片列表 -->
        <div class="space-y-4">
          <div
            v-for="post in paginatedPosts"
            :key="post.id"
            class="bg-white rounded shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <!-- 帖子头部（分类 + 标题） -->
            <div class="mb-3">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded mb-2">
                {{ categories.find(c => c.id === post.categoryId)?.name }}
              </span>
              <h3 class="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
                {{ post.title }}
              </h3>
            </div>

            <!-- 帖子摘要 -->
            <p class="text-gray-600 mb-4 line-clamp-2">{{ post.content }}</p>

            <!-- 帖子底部（作者 + 时间 + 互动数） -->
            <div class="flex items-center justify-between text-gray-500 text-sm">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gray-300 rounded"></div>
                  <span>{{ post.author }}</span>
                </div>
                <span>{{ post.createTime }}</span>
              </div>
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ post.readCount }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z" />
                  </svg>
                  <span>{{ post.replyCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页控件（PC端底部分页） -->
        <div class="mt-8 flex justify-center">
          <nav class="flex items-center gap-2">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              首页
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              :class="{ 'bg-blue-600 text-white border-blue-600': currentPage === page }"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              尾页
            </button>
          </nav>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// 导入Nuxt3的响应式API（自动导入，可省略）
import { ref, computed } from 'vue'

// 1. 搜索关键词
const searchKeyword = ref('')

// 2. 论坛分类数据（模拟）
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'notice', name: '物业公告' },
  { id: 'neighbor', name: '邻里交流' },
  { id: 'service', name: '便民服务' },
  { id: 'feedback', name: '意见反馈' },
  { id: 'activity', name: '社区活动' }
])

// 3. 选中的分类ID
const activeCategoryId = ref('all')

// 4. 帖子原始数据（模拟，可替换为接口请求）
const posts = ref([
  {
    id: 1,
    categoryId: 'notice',
    title: '【重要通知】2026年1月社区供暖检修安排',
    content: '为保障冬季供暖质量，物业将于2026年1月10日-1月12日对小区供暖管道进行全面检修，期间部分楼栋可能临时停暖，敬请谅解。',
    author: '东软物业',
    createTime: '2026-01-05',
    readCount: 1258,
    replyCount: 36
  },
  {
    id: 2,
    categoryId: 'neighbor',
    title: '求推荐小区附近靠谱的家政服务',
    content: '家里需要定期打扫，想找小区附近口碑好的家政阿姨，有邻居推荐吗？最好是有过合作的，谢谢！',
    author: '住户007',
    createTime: '2026-01-04',
    readCount: 892,
    replyCount: 48
  },
  {
    id: 3,
    categoryId: 'service',
    title: '小区快递柜新增24小时取件提醒功能',
    content: '为方便住户取件，物业已为所有快递柜开通24小时取件提醒服务，绑定手机号后可收到取件通知，具体绑定方式见物业大厅公告。',
    author: '物业小李',
    createTime: '2026-01-03',
    readCount: 756,
    replyCount: 12
  },
  {
    id: 4,
    categoryId: 'activity',
    title: '【报名】1月15日社区迎新春包饺子活动',
    content: '为增进邻里感情，社区将于1月15日下午2点在社区活动中心举办迎新春包饺子活动，欢迎各位住户报名参加，报名截止1月10日。',
    author: '社区居委会',
    createTime: '2026-01-02',
    readCount: 987,
    replyCount: 65
  },
  {
    id: 5,
    categoryId: 'feedback',
    title: '建议增设小区电动车充电桩',
    content: '小区电动车数量越来越多，但充电桩不足，经常出现排队充电的情况，建议物业增设充电桩数量，方便住户使用。',
    author: '住户123',
    createTime: '2026-01-01',
    readCount: 1024,
    replyCount: 89
  },
  {
    id: 6,
    categoryId: 'neighbor',
    title: '转让全新未拆封的婴儿车，有意者私聊',
    content: '家里宝宝用不上的婴儿车，全新未拆封，品牌是好孩子，适合0-3岁宝宝，价格可议，有意者私信我。',
    author: '宝妈888',
    createTime: '2025-12-31',
    readCount: 632,
    replyCount: 23
  }
])

// 5. 社区统计数据（模拟）
const totalPosts = ref(1258)
const todayNewPosts = ref(18)
const activeUsers = ref(368)

// 6. 分页相关
const currentPage = ref(1)
const pageSize = ref(3) // 每页显示3条

// 7. 筛选后的帖子（分类 + 搜索）
const filteredPosts = computed(() => {
  let result = posts.value
  // 分类筛选
  if (activeCategoryId.value !== 'all') {
    result = result.filter(post => post.categoryId === activeCategoryId.value)
  }
  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(
      post => post.title.toLowerCase().includes(keyword) || post.content.toLowerCase().includes(keyword)
    )
  }
  return result
})

// 8. 分页后的帖子
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPosts.value.slice(start, end)
})

// 9. 总页数
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize.value) || 1)

// 10. 搜索方法
const handleSearch = () => {
  currentPage.value = 1 // 搜索后重置到第一页
}
</script>

<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>