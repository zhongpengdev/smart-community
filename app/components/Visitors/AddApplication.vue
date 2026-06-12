<template>
    <el-dialog v-model="visible" title="新建访客登记" width="500px" :close-on-click-modal="false" class="custom-dialog">
        <el-form label-position="top" :model="form" :rules="rules" ref="formRef">
            <el-form-item label="访客姓名" prop="visitorName">
                <el-input v-model="form.visitorName" placeholder="请输入访客姓名" />
            </el-form-item>
            <el-form-item label="访客电话" prop="visitorPhone">
                <el-input v-model="form.visitorPhone" placeholder="请输入访客电话" />
            </el-form-item>
            <el-form-item label="来访目的" prop="visitPurpose">
                <el-input v-model="form.visitPurpose" type="textarea" placeholder="请输入来访目的" />
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="放行时间" prop="allowTime">
                        <input v-model="form.allowTime" type="datetime-local"
                            class="w-full h-[32px] px-3 border border-[#dcdfe6] rounded bg-white dark:bg-black dark:border-slate-700 focus:border-[#ff5000] outline-none transition-colors text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="有效期至" prop="validDate">
                        <input v-model="form.validDate" type="datetime-local"
                            class="w-full h-[32px] px-3 border border-[#dcdfe6] rounded bg-white dark:bg-black dark:border-slate-700 focus:border-[#ff5000] outline-none transition-colors text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" :loading="loading" @click="handleSubmit">提交登记</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { phoneRule } from '~/utils/rules'
const { createVisitor, loading } = useVisitorList()

const emit = defineEmits(['success'])
const visible = ref(false)
const formRef = ref()

const form = reactive({
    visitorName: '',
    visitorPhone: '',
    visitPurpose: '',
    allowTime: '',
    validDate: ''
})

const rules = {
    visitorName: [{ required: true, message: '请输入访客姓名', trigger: 'blur' }],
    visitorPhone: phoneRule,
    visitPurpose: [{ required: true, message: '请输入来访目的', trigger: 'blur' }],
    allowTime: [{ required: true, message: '请选择放行时间', trigger: 'change' }],
    validDate: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

const open = () => {
    // Reset form
    form.visitorName = ''
    form.visitorPhone = ''
    form.visitPurpose = ''
    form.allowTime = ''
    form.validDate = ''
    visible.value = true
}

const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
            // Format datetime-local string (YYYY-MM-DDTHH:mm) to backend format (YYYY-MM-DD HH:mm:ss)
            const submitData = {
                ...form,
                allowTime: form.allowTime ? form.allowTime.replace('T', ' ') + ':00' : '',
                validDate: form.validDate ? form.validDate.replace('T', ' ') + ':00' : ''
            }

            const success = await createVisitor(submitData)

            if (success) {
                visible.value = false
                emit('success')
            }
        }
    })
}

defineExpose({ open })
</script>

<style scoped>
/* Customize Element Plus Dialog to match theme partially if needed */
:deep(.el-button--primary) {
    background-color: #ff5000;
    border-color: #ff5000;
}

:deep(.el-button--primary:hover) {
    background-color: #ff3d00;
    border-color: #ff3d00;
}
</style>
