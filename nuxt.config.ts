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
        'element-plus',
        'echarts',
        '@vueuse/core',
        'dayjs',
        'clsx',
        'tailwind-merge',
        'element-plus/es/components/index'
      ]
    },
    server: {
      watch: {
        usePolling: false
      }
    }
  }
})
