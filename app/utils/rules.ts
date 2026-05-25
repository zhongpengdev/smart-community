// 常用正则表达式
export const PHONE_REGEX = /^1[3-9]\d{9}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 验证函数
export const isValidPhone = (phone: string): boolean => {
    return PHONE_REGEX.test(phone);
};

export const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
};

// 手机号码正则表达式验证规则
export const phoneRule = [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
        pattern: PHONE_REGEX,
        message: '请输入正确的手机号码格式',
        trigger: 'blur'
    }
]
