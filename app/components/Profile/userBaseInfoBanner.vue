<template>
  <div
    class="bg-gradient-to-r from-[#FFF9F5] to-white dark:from-slate-800 dark:to-black border border-transparent dark:border-white/5 rounded p-6 shadow-sm">
    <div class="flex items-start gap-6">
      <!-- 头像区域 -->
      <el-upload class="avatar-uploader shrink-0" :show-file-list="false" :auto-upload="true"
        :http-request="uploadAvatar">
        <div class="relative group cursor-pointer">
          <el-avatar :size="80" :src="userInfo?.avatar"
            class="text-xl bg-white border-4 border-white dark:border-white/10 dark:bg-slate-700 shadow-sm">
            <Icon name="lucide:user" size="36" class="text-slate-400" />
          </el-avatar>

          <div
            class="absolute inset-0 rounded bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs backdrop-blur-sm">
            <Icon name="lucide:camera" size="18" class="mb-0.5" />
            <span>更换</span>
          </div>
        </div>
      </el-upload>

      <!-- 信息区域 -->
      <div class="flex-1 min-w-0 pt-1">
        <!-- 名字和角色 -->
        <div class="flex items-center gap-3 mb-3">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white leading-none truncate">
            {{ userInfo?.userName || "未登录用户" }}
          </h2>
          <!-- 角色标签 -->
          <div v-if="userRoles && userRoles.length > 0" class="flex gap-2">
            <span v-for="role in userRoles" :key="role.roleId"
              class="px-2 py-0.5 text-xs font-medium rounded bg-[#ff5000]/10 text-[#ff5000] border border-[#ff5000]/20">
              {{ role.roleName }}
            </span>
          </div>
          <span v-else
            class="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            普通用户
          </span>
        </div>

        <!-- ID和基本信息 -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-slate-400">
          <!-- ID -->
          <div class="flex items-center gap-2">
            <Icon name="lucide:id-card" size="14" class="shrink-0 opacity-70" />
            <span class="font-mono">ID: sc{{ userInfo?.userId || "000000" }}</span>
          </div>

          <!-- 手机号 -->
          <div class="flex items-center gap-2">
            <Icon name="lucide:smartphone" size="14" class="shrink-0 opacity-70" />
            <span>{{ userInfo?.phone || '未绑定手机' }}</span>
          </div>

          <!-- 邮箱 -->
          <div class="flex items-center gap-2">
            <Icon name="lucide:mail" size="14" class="shrink-0 opacity-70" />
            <span class="truncate">{{ userInfo?.email || '未绑定邮箱' }}</span>
          </div>

          <!-- 性别/年龄 -->
          <div class="flex items-center gap-2" v-if="userInfo?.gender || userInfo?.age">
            <div class="flex items-center gap-1">
              <Icon v-if="userInfo?.gender === '1'" name="lucide:user" size="14" class="text-blue-500" />
              <Icon v-else-if="userInfo?.gender === '0'" name="lucide:user" size="14" class="text-pink-500" />
              <Icon v-else name="lucide:user" size="14" class="opacity-70" />
              <span>{{ getGenderText(userInfo?.gender) }}</span>
            </div>
            <span v-if="userInfo?.age" class="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1"></span>
            <span v-if="userInfo?.age">{{ userInfo?.age }}岁</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const userRoles = computed(() => userStore.userRoles)

const getGenderText = (gender?: string) => {
  switch (gender) {
    case '1': return '男'
    case '0': return '女'
    default: return '未知'
  }
}

import { uploadAvatarApi } from '@/utils/api'



const uploadAvatar = async (options: any) => {
  const file = options.file
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await uploadAvatarApi(formData) as any

    if (res.code == 200) {
      const newAvatarUrl = res.data.url;

      if (userStore.userInfo) {
        userStore.userInfo.avatar = newAvatarUrl;
      }

      ElMessage.success('头像上传成功');

    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('头像上传失败');
  }
}
</script>

<style scoped>
:deep(.el-upload) {
  display: block;
}
</style>