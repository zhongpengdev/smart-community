<template>
    <div class="max-w-[1500px] mx-auto px-4 py-6 flex items-start gap-4 text-slate-900 dark:text-slate-100">
        <!-- Reuse Sidebar -->
        <ProfileSiderBar class="shrink-0" />

        <div class="flex-1 min-w-0">
            <div
                class="bg-white dark:bg-black rounded p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <h2 class="text-xl font-bold mb-8 flex items-center gap-2">
                    <div class="w-1 h-6 bg-[#ff5000] rounded"></div>
                    编辑个人信息
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <!-- LEFT COLUMN: Basic Info -->
                    <div>
                        <h3 class="text-lg font-bold mb-6 text-slate-800 dark:text-slate-200 border-b pb-2">基本信息</h3>

                        <el-form ref="infoFormRef" :model="infoForm" :rules="infoRules" label-position="top"
                            size="large" class="custom-form">
                            <el-form-item label="用户名" prop="userName">
                                <el-input v-model="infoForm.userName" placeholder="请输入用户名" />
                            </el-form-item>

                            <div class="grid grid-cols-2 gap-4">
                                <el-form-item label="手机号" prop="phone">
                                    <el-input :value="userStore.userInfo?.phone" disabled placeholder="不可修改">
                                        <template #suffix>
                                            <Icon name="lucide:lock" size="14" class="text-slate-400" />
                                        </template>
                                    </el-input>
                                </el-form-item>

                                <el-form-item label="邮箱" prop="email">
                                    <el-input v-model="infoForm.email" placeholder="请输入邮箱" />
                                </el-form-item>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <el-form-item label="年龄" prop="age">
                                    <el-input-number v-model="infoForm.age" :min="1" :max="120" class="!w-full"
                                        controls-position="right" />
                                </el-form-item>

                                <el-form-item label="性别" prop="gender">
                                    <el-radio-group v-model="infoForm.gender" class="w-full flex">
                                        <el-radio label="1" border class="!mr-2 !flex-1">男</el-radio>
                                        <el-radio label="0" border class="!mr-0 !flex-1">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>

                            <el-form-item class="pt-4">
                                <el-button type="primary" color="#ff5000" :loading="infoLoading"
                                    class="!w-full !rounded !h-10 !text-base" @click="submitInfoForm">
                                    保存基本信息
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- RIGHT COLUMN: Password Change -->
                    <div class="lg:border-l lg:pl-12 border-slate-100 dark:border-slate-800">
                        <h3 class="text-lg font-bold mb-6 text-slate-800 dark:text-slate-200 border-b pb-2">修改密码</h3>

                        <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-position="top" size="large"
                            class="custom-form">
                            <el-form-item label="当前密码" prop="oldPassword">
                                <el-input v-model="pwdForm.oldPassword" type="password" placeholder="请输入当前使用的密码"
                                    show-password />
                            </el-form-item>

                            <el-form-item label="新密码" prop="newPassword">
                                <el-input v-model="pwdForm.newPassword" type="password" placeholder="设置新密码 (6-20位)"
                                    show-password />
                            </el-form-item>

                            <el-form-item label="确认新密码" prop="confirmPassword">
                                <el-input v-model="pwdForm.confirmPassword" type="password" placeholder="再次输入新密码"
                                    show-password />
                            </el-form-item>

                            <el-form-item class="pt-4">
                                <el-button type="primary" plain color="#ff5000" :loading="pwdLoading"
                                    class="!w-full !rounded !h-10 !text-base hover:!bg-orange-50"
                                    @click="submitPwdForm">
                                    修改密码
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { updateUserInfoApi, changePasswordApi } from '@/utils/api'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()

// --- Basic Info Logic ---
const infoLoading = ref(false)
const infoFormRef = ref<FormInstance>()

const infoForm = reactive({
    userName: '',
    email: '',
    gender: '1',
    age: 18,
})

const infoRules = reactive<FormRules>({
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    ],
    emial: [
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
    ],
})

// --- Password Logic ---
const pwdLoading = ref(false)
const pwdFormRef = ref<FormInstance>()

const pwdForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

const pwdRules = reactive<FormRules>({
    oldPassword: [
        { required: true, message: '请输入当前密码', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
    ]
})

// Initialize form from store
onMounted(() => {
    resetInfoForm()
})

const resetInfoForm = () => {
    if (userStore.userInfo) {
        const { userName, email, gender, age } = userStore.userInfo
        infoForm.userName = userName || ''
        infoForm.email = email || ''
        infoForm.gender = String(gender) || '1'
        infoForm.age = age || 18
    }
}

const submitInfoForm = async () => {
    if (!infoFormRef.value) return
    await infoFormRef.value.validate(async (valid) => {
        if (valid) {
            infoLoading.value = true
            try {
                const payload = {
                    ...userStore.userInfo,
                    ...infoForm,
                    // Ensure gender is mapped back to number if API requires, strictly checking the store implementation usually expects number
                    // but the v-model is string '0'/'1' for el-radio.
                    // Assuming API handles or we convert:
                    // gender: parseInt(infoForm.gender) // If needed. keeping as is if API is loose.
                }

                const res = await updateUserInfoApi(payload) as any
                if (res.code === 200) {
                    ElMessage.success('基本信息更新成功')
                    if (userStore.userInfo) {
                        Object.assign(userStore.userInfo, infoForm)
                    }
                } else {
                    ElMessage.error(res.message || '更新失败')
                }
            } catch (error) {
                console.error(error)
                ElMessage.error('更新基本信息时网络请求失败')
            } finally {
                infoLoading.value = false
            }
        }
    })
}

const submitPwdForm = async () => {
    if (!pwdFormRef.value) return
    await pwdFormRef.value.validate(async (valid) => {
        if (valid) {
            pwdLoading.value = true
            try {
                const res = await changePasswordApi(pwdForm) as any
                if (res.code === 200) {
                    ElMessage.success('密码修改成功')
                    pwdFormRef.value?.resetFields()

                    //重新登陆 删除userStore
                    userStore.$reset();
                } else {
                    ElMessage.error(res.message || '修改失败')
                }
            } catch (error) {
                ElMessage.error('修改密码时网络请求失败')
            } finally {
                pwdLoading.value = false
            }
        }
    })
}

</script>

<style scoped>
/* Scoped styles to tweak Element Plus look to match specific theme requirements if Tailwind utility classes aren't enough */
:deep(.el-form-item__label) {
    font-weight: 600;
    color: #475569;
    /* Slate-600 */
}

.dark :deep(.el-form-item__label) {
    color: #cbd5e1;
    /* Slate-300 */
}

/* Custom Input Styling Override to match the '智里治' look more closely if needed */
/* Custom Input Styling Override */
:deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #e2e8f0 inset;
    padding-top: 2px;
    padding-bottom: 2px;
}

.dark :deep(.el-input__wrapper) {
    background-color: #1e293b;
    /* slate-800 */
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.dark :deep(.el-input__inner) {
    color: #e2e8f0;
}

:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #ff5000 inset !important;
}

.dark :deep(.el-input-number__decrease),
.dark :deep(.el-input-number__increase) {
    background-color: #1e293b;
    border-color: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
}

.dark :deep(.el-radio) {
    color: #e2e8f0;
}

.dark :deep(.el-radio.is-bordered) {
    border-color: rgba(255, 255, 255, 0.1);
}

.dark :deep(.el-radio.is-bordered.is-checked) {
    border-color: #ff5000;
}
</style>