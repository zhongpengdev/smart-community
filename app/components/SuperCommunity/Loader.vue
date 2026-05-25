<template>
    <Transition name="loader-fade">
        <div v-if="show"
            class="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center">
            
            <!-- Animated Background Particles -->
            <div class="absolute inset-0 overflow-hidden opacity-30">
                <div v-for="i in 20" :key="i" 
                    class="absolute w-1 h-1 bg-blue-400 rounded animate-float"
                    :style="{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 4}s`
                    }">
                </div>
            </div>

            <!-- Main Content -->
            <div class="relative z-10 flex flex-col items-center">
                
                <!-- Logo with Glow Effect -->
                <div class="relative mb-8">
                    <!-- Outer Glow Rings -->
                    <div class="absolute inset-0 rounded bg-blue-500/20 animate-ping scale-150"></div>
                    <div class="absolute inset-0 rounded bg-blue-500/30 animate-pulse"></div>
                    
                    <!-- Main Icon Container -->
                    <div class="relative w-24 h-24 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                        <Icon name="lucide:shield-check" size="48" class="text-white animate-pulse" />
                    </div>
                    
                    <!-- Rotating Border -->
                    <div class="absolute inset-0 rounded border-4 border-transparent border-t-blue-400 border-r-blue-400 animate-spin-slow"></div>
                </div>

                <!-- Title with Gradient -->
                <h2 class="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent tracking-tight">
                    {{ title }}
                </h2>
                
                <!-- Subtitle -->
                <p class="text-blue-200 text-lg mb-8 font-medium tracking-wide">
                    {{ subtitle }}
                </p>

                <!-- Loading Progress Bar -->
                <div class="w-64 h-1.5 bg-slate-800 rounded overflow-hidden mb-6 shadow-inner">
                    <div class="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded transition-all duration-300 shadow-lg shadow-blue-500/50"
                        :style="{ width: `${progress}%` }">
                    </div>
                </div>

                <!-- Loading Steps -->
                <div class="flex flex-col items-center gap-2 min-h-[60px]">
                    <div class="flex items-center gap-2 text-blue-300">
                        <div class="flex gap-1">
                            <div class="w-2 h-2 rounded bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
                            <div class="w-2 h-2 rounded bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
                            <div class="w-2 h-2 rounded bg-blue-400 animate-bounce"></div>
                        </div>
                        <span class="text-sm font-medium tracking-wider">{{ currentStep }}</span>
                    </div>
                    
                    <!-- Progress Percentage -->
                    <div class="text-xs text-blue-400/60 font-mono">
                        {{ Math.round(progress) }}%
                    </div>
                </div>

                <!-- Security Badge -->
                <!-- <div class="mt-8 flex items-center gap-2 px-4 py-2 rounded bg-slate-800/50 border border-blue-500/30">
                    <Icon name="lucide:lock" size="14" class="text-blue-400" />
                    <span class="text-xs text-blue-300 font-medium tracking-wider uppercase">安全加密连接</span>
                </div> -->

            </div>

            <!-- Bottom Info -->
            <div class="absolute bottom-8 text-center">
                <p class="text-xs text-slate-500 tracking-widest uppercase">
                    Powered by Neuedu Smart Community Platform
                </p>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
interface Props {
    show: boolean
    title?: string
    subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: '后台管理系统',
    subtitle: '正在加载管理面板'
})

const progress = ref(0)
const currentStep = ref('初始化系统...')

const steps = [
    { text: '验证用户权限...', duration: 400 },
    { text: '加载用户配置...', duration: 500 },
    { text: '初始化管理模块...', duration: 600 },
    { text: '准备数据面板...', duration: 500 },
    { text: '完成加载', duration: 300 }
]

let stepTimer: NodeJS.Timeout | null = null

const startLoadingSequence = () => {
    // 只在客户端执行
    if (!import.meta.client) return
    
    progress.value = 0
    let stepIndex = 0
    let currentProgress = 0

    const executeStep = () => {
        if (stepIndex >= steps.length || !props.show) {
            if (stepTimer) clearTimeout(stepTimer)
            return
        }

        const step = steps[stepIndex]
        currentStep.value = step.text
        
        const progressIncrement = 100 / steps.length
        const targetProgress = (stepIndex + 1) * progressIncrement

        // Smooth progress animation
        const animateProgress = () => {
            if (currentProgress < targetProgress && props.show) {
                currentProgress += 2
                progress.value = Math.min(currentProgress, targetProgress)
                if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(animateProgress)
                }
            }
        }
        animateProgress()

        stepIndex++
        stepTimer = setTimeout(executeStep, step.duration)
    }

    executeStep()
}

watch(() => props.show, (newVal) => {
    // 只在客户端执行
    if (!import.meta.client) return
    
    if (newVal) {
        startLoadingSequence()
    } else {
        if (stepTimer) {
            clearTimeout(stepTimer)
            stepTimer = null
        }
    }
}, { immediate: true })

onUnmounted(() => {
    if (stepTimer) {
        clearTimeout(stepTimer)
        stepTimer = null
    }
})
</script>

<style scoped>
/* Loader Fade Transition */
.loader-fade-enter-active {
    transition: opacity 0.3s ease;
}

.loader-fade-leave-active {
    transition: opacity 0.5s ease 0.2s;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
    opacity: 0;
}

/* Float Animation for Particles */
@keyframes float {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(50px);
        opacity: 0;
    }
}

.animate-float {
    animation: float linear infinite;
}

/* Slow Spin Animation */
@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 3s linear infinite;
}

/* Custom Bounce with Delays */
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
}

.animate-bounce {
    animation: bounce 1s ease-in-out infinite;
}
</style>

