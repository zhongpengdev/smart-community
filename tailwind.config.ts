import tailwindTypography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./app/**/*.{vue,js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            borderRadius: {
                DEFAULT: '10px', // 全局默认卡片圆角 (12px)
                'sm': '4px',     // 小圆角 (如标签)
                'md': '8px',     // 中圆角 (如按钮、输入框)
                'lg': '12px',    // 大圆角
                'xl': '16px',    // 特大圆角
                '2xl': '24px',
            }
        },
    },
    plugins: [
        tailwindTypography
    ],
}

