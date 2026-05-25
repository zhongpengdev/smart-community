// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  pinia: {
    storesDirs: ['./stores/**'],
  },

  elementPlus: {
    icon: 'el-icon',
  },

  colorMode: {
    preference: 'system',        
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      agentBase: ''
    }
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    optimizeDeps: {
      include: [
        // element-plus 和 echarts 移除全量预构建：
        //   - element-plus 由 @element-plus/nuxt 按需自动导入处理
        //   - echarts 待改为按需引入后再加回具体路径
        '@vueuse/core',
        'dayjs',
        'clsx',
        'tailwind-merge',
      ]
    },
    server: {
      watch: {
        usePolling: false
      }
    }
  }
})
