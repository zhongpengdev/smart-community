<template>
  <div class="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
    <header class="w-full max-w-[1200px] mx-auto py-6 px-4 flex justify-between items-end">
      <div class="flex items-end gap-4">
        <div class="text-[#ff5000] text-4xl font-extrabold tracking-tighter leading-none">
          Neuedu<span class="text-3xl">智慧社区</span>
        </div>
        <span class="text-xl font-bold text-slate-700">用户注册</span>
      </div>
      <div class="text-sm text-slate-500">
        已有账号？
        <NuxtLink to="/login" class="text-[#ff5000] font-bold hover:underline">请登录</NuxtLink>
      </div>
    </header>

    <main class="flex-1 flex justify-center py-10">
      <div class="bg-white w-[800px] p-10 rounded-[12px] shadow-sm">
        <div class="flex justify-between mb-10 text-sm font-bold border-b pb-4">
          <span class="text-[#ff5000] border-b-2 border-[#ff5000] pb-4 -mb-4 px-2">1. 设置用户信息</span>
          <span class="text-slate-300">2. 注册成功</span>
        </div>

        <form @submit.prevent="handleRegister" class="max-w-[500px] mx-auto space-y-6">
          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">手机号码
              <span class="text-slate-400 font-normal">(身份唯一识别)</span></label>
            <div
              class="flex items-center border border-slate-300 rounded focus-within:border-[#ff5000] focus-within:ring-1 focus-within:ring-[#ff5000] transition-all overflow-hidden h-12 bg-white">
              <div
                class="w-20 bg-slate-50 h-full flex items-center justify-center text-slate-600 font-bold border-r border-slate-200">
                +86
              </div>
              <input v-model="form.phone" type="tel" placeholder="请输入您的手机号码"
                class="flex-1 px-4 h-full outline-none text-slate-700 placeholder:text-slate-400" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">登录密码</label>
            <input v-model="form.password" type="password" placeholder="设置6-20位登录密码"
              class="w-full h-12 px-4 border border-slate-300 rounded focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-none transition-all placeholder:text-slate-400" />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">确认密码</label>
            <input v-model="form.confirmPassword" type="password" placeholder="请再次输入登录密码"
              class="w-full h-12 px-4 border border-slate-300 rounded focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-none transition-all placeholder:text-slate-400" />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">
              电子邮箱
              <span class="text-slate-400 font-normal text-xs ml-1">(选填)</span>
            </label>
            <input v-model="form.email" type="email" placeholder="例如: example@email.com"
              class="w-full h-12 px-4 border border-slate-300 rounded focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-none transition-all placeholder:text-slate-400" />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">真实姓名</label>
            <input v-model="form.realName" type="text" placeholder="请输入身份证上的姓名"
              class="w-full h-12 px-4 border border-slate-300 rounded focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-none transition-all placeholder:text-slate-400" />
          </div>

          <div class="flex gap-6">
            <div class="flex-1 space-y-1">
              <label class="block text-sm font-bold text-slate-700">年龄</label>
              <input v-model="form.age" type="number" min="1" placeholder="例如: 25"
                class="w-full h-12 px-4 border border-slate-300 rounded focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-none transition-all placeholder:text-slate-400" />
            </div>

            <div class="flex-1 space-y-1">
              <label class="block text-sm font-bold text-slate-700">性别</label>
              <div class="flex h-12 gap-2">
                <button type="button" @click="form.gender = 'male'" :class="form.gender === 'male'
                  ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold'
                  : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                  " class="flex-1 border rounded transition-all flex items-center justify-center gap-1">
                  <span>♂</span> 男
                </button>
                <button type="button" @click="form.gender = 'female'" :class="form.gender === 'female'
                  ? 'bg-pink-50 border-pink-500 text-pink-600 font-bold'
                  : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                  " class="flex-1 border rounded transition-all flex items-center justify-center gap-1">
                  <span>♀</span> 女
                </button>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <label class="flex items-start gap-2 cursor-pointer select-none">
              <input v-model="form.agreed" type="checkbox"
                class="mt-1 w-4 h-4 text-[#ff5000] border-gray-300 rounded focus:ring-[#ff5000]" />

              <span class="text-xs text-slate-500 leading-tight">
                我已阅读并同意
                <a href="#" class="text-[#ff5000]">《智慧社区平台服务协议》</a>、<a href="#" class="text-[#ff5000]">《隐私权政策》</a> 和
                <a href="#" class="text-[#ff5000]">《法律声明》</a>。我是中国公民并承诺填写真实信息。
              </span>
            </label>
          </div>

          <el-button type="primary"
            class="!border-none !w-full !h-12 bg-gradient-to-r from-[#ff9000] to-[#ff5000] text-white font-bold text-lg rounded shadow-lg shadow-orange-200 hover:to-[#ff4000] transition-all transform hover:-translate-y-0.5 active:scale-[0.99]"
            :loading="loading" native-type="submit">
            {{ loading ? "正在注册..." : "同意协议并注册" }}
          </el-button>
        </form>
      </div>
    </main>

    <footer class="py-6 text-center text-xs text-slate-400">
      &copy; 2024 Neuedu.com 版权所有
    </footer>
  </div>
</template>

<script setup lang="ts">
import { isValidPhone, isValidEmail } from '@/utils/rules'

definePageMeta({
  layout: 'auth'
})

// 表单数据
const form = reactive({
  phone: "",
  password: "",
  confirmPassword: "", // 新增：确认密码
  email: "", // 新增：邮箱
  realName: "",
  age: "",
  gender: "male",
  agreed: false,
});

const { registerAction, loading } = useAuth();

// 提交注册
const handleRegister = async () => {
  // 1. 协议勾选检查
  if (!form.agreed) {
    ElMessage.error("请先同意服务条款");
    return;
  }

  // 2. 必填项检查
  if (!form.phone || !form.password || !form.realName || !form.age) {
    ElMessage.error("请填写完整必填信息");
    return;
  }

  // 3. 格式规则校验
  if (!isValidPhone(form.phone)) {
    ElMessage.error("请输入正确的手机号码格式");
    return;
  }

  if (form.email) {
    if (!isValidEmail(form.email)) {
      ElMessage.error("请输入正确的电子邮箱格式");
      return;
    }
  }

  // 4. 密码一致性检查
  if (form.password !== form.confirmPassword) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }

  // 4. 构造提交给后端的数据格式
  // 按照你的要求:
  // userName -> 对应 realName
  // gender -> 1 (男) / 0 (女)
  // confirmPassword 也要提交
  const payload = {
    phone: form.phone,
    password: form.password,
    confirmPassword: form.confirmPassword,
    userName: form.realName,
    age: Number(form.age), // 确保是数字
    gender: form.gender === 'male' ? 1 : 0,
    email: form.email || undefined // 如果没填就不传或者传空字符串，看后端需求
  };

  try {
    await registerAction(payload);
    ElMessage.success("注册成功，请登录");
    await navigateTo("/login");
  } catch (err: any) {
    ElNotification({
      title: "注册失败",
      message: err.message || err,
      type: "error",
    });
  }
};
</script>