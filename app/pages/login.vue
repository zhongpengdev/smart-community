<template>
  <div class="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
    <header class="w-full max-w-[1200px] mx-auto py-6 px-4 flex justify-between items-center">
      <div class="text-[#ff5000] text-3xl font-extrabold tracking-tighter">
        Neuedu<span class="text-2xl ml-2">智慧社区</span>
      </div>
    </header>

    <main class="flex-1 flex justify-center items-center relative">
      <div
        class="bg-white w-[950px] h-[500px] rounded-[20px] shadow-2xl shadow-slate-200/50 flex p-10 relative overflow-hidden">



        <div class="flex-1 flex flex-col items-center justify-center border-r border-slate-100 pr-10">
          <h2 class="text-lg font-bold text-slate-700 mb-8">手机扫码登录</h2>

          <div
            class="w-40 h-40 border border-slate-200 rounded-lg p-2 bg-white relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.neuedu.com"
              alt="Login QR Code"
              class="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>

          <p class="mt-6 text-sm text-slate-500 hover:text-[#ff5000] cursor-pointer">
            打开 <span class="text-[#ff5000]">移动端智慧社区</span> — 点击左上角扫一扫
          </p>
        </div>

        <div class="flex-1 pl-10 flex flex-col justify-center">
          <div class="flex items-center gap-6 mb-8 text-lg">
            <button @click="loginMethod = 'email'"
              :class="loginMethod === 'email' ? 'font-bold text-slate-800 border-b-2 border-[#ff5000] text-[#ff5000]' : 'text-slate-500 hover:text-[#ff5000] cursor-pointer transition-colors'"
              class="pb-1">
              邮箱登录
            </button>
            <button @click="loginMethod = 'phone'"
              :class="loginMethod === 'phone' ? 'font-bold text-slate-800 border-b-2 border-[#ff5000] text-[#ff5000]' : 'text-slate-500 hover:text-[#ff5000] cursor-pointer transition-colors'"
              class="pb-1">
              密码登录
            </button>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">

            <!-- 邮箱登录表单 -->
            <div v-show="loginMethod === 'email'" class="space-y-5">
              <div class="relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="lucide:mail" size="20" />
                </div>
                <input type="email" placeholder="请输入邮箱地址" v-model="form.email"
                  class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded-md outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
              </div>

              <div class="flex gap-3">
                <div class="relative group flex-1">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="lucide:shield-check" size="20" />
                  </div>
                  <input type="text" placeholder="验证码" v-model="form.verifyCode"
                    class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded-md outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
                </div>
                <button type="button" :disabled="countdown > 0" @click="handleSendCode"
                  class="h-12 px-4 rounded-md bg-[#ff5000]/10 text-[#ff5000] text-sm font-medium hover:bg-[#ff5000]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                  {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
                </button>
              </div>
            </div>

            <!-- 密码登录表单 -->
            <div v-show="loginMethod === 'phone'" class="space-y-5">
              <div class="relative group">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <input type="text" placeholder="用户手机号" v-model="form.phone"
                  class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded-md outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
              </div>

              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <input type="password" v-model="form.password" placeholder="登录密码"
                  class="w-full bg-[#e8f0fe] text-slate-700 h-12 pl-10 pr-4 rounded-md outline-none focus:ring-1 focus:ring-[#ff5000] placeholder:text-slate-400 text-sm transition-all" />
              </div>
            </div>

            <el-button native-type="submit" type="primary" :loading="authLoading"
              class="!w-full !bg-[#ff5000] !hover:bg-[#ff4000] text-white !font-bold !h-11 !rounded-md text-base !shadow-lg !shadow-orange-200 !transition-colors">
              {{ authLoading ? "登录中，请稍后..." : "登录" }}
            </el-button>

            <div class="flex justify-between text-xs text-slate-500 mt-2">
              <div class="flex gap-2">
                <a href="#" class="hover:text-[#ff5000]">支付宝登录</a>
                <span class="text-slate-300">|</span>
                <a href="#" class="hover:text-[#ff5000]">微博登录</a>
              </div>
              <div class="flex gap-4">
                <nuxt-link to="forget-password" class="hover:text-[#ff5000]">忘记密码</nuxt-link>
                <nuxt-link to="register" class="hover:text-[#ff5000]">免费注册</nuxt-link>
              </div>
            </div>

            <div class="flex items-center gap-2 mt-4">
              <input type="checkbox" class="mt-1 w-4 h-4 rounded border-gray-300 text-[#ff5000] focus:ring-[#ff5000]"
                v-model="form.agreed" />
              <p class="text-xs text-slate-400 leading-tight">
                已阅读并同意以下协议
                <a href="#" class="text-slate-500 hover:text-[#ff5000]">淘宝平台服务协议</a>、<a href="#"
                  class="text-slate-500 hover:text-[#ff5000]">隐私权政策</a>、<a href="#"
                  class="text-slate-500 hover:text-[#ff5000]">法律声明</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { sendResetPasswordEmailApi } from '@/utils/api'
import { isValidPhone, isValidEmail } from '@/utils/rules'

definePageMeta({
  layout: 'auth'
})

const loginMethod = ref<'email' | 'phone'>('email')
const countdown = ref(0)
let timer: any = null

const form = reactive({
  phone: "",
  password: "",
  email: "",
  verifyCode: "",
  agreed: false,
});

const { loginAction, loading: authLoading } = useAuth();

const handleSendCode = async () => {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱地址');
    return
  }

  if (!isValidEmail(form.email)) {
    ElMessage.warning('请输入正确的邮箱格式');
    return;
  }

  // Reuse the send verify code API (assuming it's generic)
  try {
    const res = await sendResetPasswordEmailApi(form.email) as any
    if (res.code === 200) {
      ElMessage.success('验证码发送成功')
      countdown.value = 60
      timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      ElMessage.error(res.message || '发送失败')
    }
  } catch (error) {
    ElMessage.error('发送失败')
  }
}

const handleLogin = async () => {
  if (!form.agreed) {
    ElMessage.error("请先同意服务条款");
    return;
  }

  let payload = {}

  if (loginMethod.value === 'phone') {
    if (!form.phone || !form.password) {
      ElMessage.error("请填写手机号和密码");
      return;
    }
    if (!isValidPhone(form.phone)) {
      ElMessage.error("请输入正确的手机号码格式");
      return;
    }
    payload = { phone: form.phone, password: form.password }
  } else {
    if (!form.email || !form.verifyCode) {
      ElMessage.error("请填写邮箱和验证码");
      return;
    }
    if (!isValidEmail(form.email)) {
      ElMessage.error("请输入正确的邮箱格式");
      return;
    }
    payload = { email: form.email, verifyCode: form.verifyCode }
  }

  try {
    await loginAction(payload, loginMethod.value);
    await navigateTo("/");
  } catch (err: any) {
    ElNotification({
      title: "登录失败",
      message: err.message || err,
      type: "error",
    });
  }
};

// 清理验证码的定时器
 onBeforeUnmount(() => {
  if(timer) clearInterval(timer);
 }) 
</script>

<style scoped>

</style>
