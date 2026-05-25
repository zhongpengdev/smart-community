<template>
    <div class="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
        <header class="w-full max-w-[1200px] mx-auto py-6 px-4 flex justify-between items-center">
            <div class="text-[#ff5000] text-3xl font-extrabold tracking-tighter">
                Neuedu<span class="text-2xl ml-2">智慧社区</span>
            </div>
            <div class="flex gap-4 text-xs text-slate-500 cursor-pointer">
                <span class="hover:text-[#ff5000]">帮助中心</span>
                <nuxt-link to="/login" class="hover:text-[#ff5000]">返回登录</nuxt-link>
            </div>
        </header>

        <main class="flex-1 flex justify-center items-center">
            <div class="bg-white w-[500px] rounded-[20px] shadow-2xl shadow-slate-200/50 p-10 relative">
                <h2 class="text-2xl font-bold text-slate-700 mb-2 text-center">重置密码</h2>
                <p class="text-center text-slate-400 text-sm mb-8">我们将发送验证码到您的邮箱</p>

                <form class="space-y-5" @submit.prevent="handleReset">

                    <!-- Email Input -->
                    <div class="relative group">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="lucide:mail" size="20" />
                        </div>
                        <input type="email" placeholder="请输入您的邮箱地址" v-model="form.email"
                            class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
                    </div>

                    <!-- Verify Code Input -->
                    <div class="flex gap-3">
                        <div class="relative group flex-1">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Icon name="lucide:shield-check" size="20" />
                            </div>
                            <input type="text" placeholder="验证码" v-model="form.verifyCode"
                                class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
                        </div>
                        <button type="button" :disabled="countdown > 0" @click="sendVerifyCode"
                            class="h-12 px-6 rounded bg-[#ff5000]/10 text-[#ff5000] text-sm font-medium hover:bg-[#ff5000]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                            {{ countdown > 0 ? `${countdown}s 后重新发送` : '获取验证码' }}
                        </button>
                    </div>

                    <!-- New Password -->
                    <div class="relative group">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="lucide:lock" size="20" />
                        </div>
                        <input type="password" placeholder="请输入新密码" v-model="form.newPassword"
                            class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
                    </div>

                    <!-- Confirm Password -->
                    <div class="relative group">
                        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Icon name="lucide:lock" size="20" />
                        </div>
                        <input type="password" placeholder="请确认新密码" v-model="form.confirmPassword"
                            class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
                    </div>

                    <el-button native-type="submit" type="primary" :loading="loading"
                        class="!w-full !bg-[#ff5000] !hover:bg-[#ff4000] text-white !font-bold !h-11 !rounded text-base !shadow-lg !shadow-orange-200 !transition-colors !mt-8">
                        {{ loading ? "提交中..." : "重置密码" }}
                    </el-button>

                </form>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { resetPasswordApi, sendResetPasswordEmailApi } from '@/utils/api'

definePageMeta({
    layout: 'auth'
})

// Auto-imports from Nuxt and Element Plus are available
// We might need a sendCodeApi as well, mocking for now or adding to api.ts if needed.

const form = reactive({
    email: "",
    verifyCode: "",
    newPassword: "",
    confirmPassword: ""
})

const loading = ref(false)
const countdown = ref(0)
let timer: any = null

const sendVerifyCode = async () => {
    if (!form.email) {
        ElMessage.warning('请先输入邮箱地址')
        return
    }

    try {
        const res = await sendResetPasswordEmailApi(form.email) as any;

        if (res.code != 200) {
            ElMessage.error(res.message || '发送失败');
            return
        }

        ElMessage.success(`验证码已发送至 ${form.email}`);

    } catch (error) {
        ElMessage.error('发送失败，请重试');
        console.log(error);
    }

    countdown.value = 60
    timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

const handleReset = async () => {
    if (!form.email || !form.verifyCode || !form.newPassword || !form.confirmPassword) {
        ElMessage.warning('请补全所有字段')
        return
    }

    if (form.newPassword !== form.confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return
    }

    loading.value = true
    try {
        const res = await resetPasswordApi(form) as any

        if (res.code === 200) {
            ElMessage.success('密码重置成功，请重新登录')
            navigateTo('/login');
        } else {
            ElMessage.error(res.message || '重置失败')
        }
    } catch (error) {
        ElMessage.error('网络请求异常，请重试');
        console.log(error);
    } finally {
        loading.value = false
    }
}
</script>