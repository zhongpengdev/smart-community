export const useAuth = () => {
  const loading = ref(false);
  const error = ref(null);

  const registerAction = async (formData: any) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await registerUser(formData);
      return res;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  //登录逻辑
  const loginAction = async (credentials: any, loginMethod: string) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await loginUser(credentials, loginMethod) as any;

      if (res?.code != 200) {
        throw new Error(res?.message);
      }

      const token = res?.data?.token;

      const userInfo = {
        userId: res?.data?.userId,
        phone: res?.data?.phone,
        email: res?.data?.email,
        avatar: res?.data?.avatar,
        gender: res?.data?.gender,
        age: res?.data?.age,
        userType: res?.data?.userType,
        status: res?.data?.status,
        userName: res?.data?.userName,
      }

      //进行用户权限保存
      if (token && userInfo.userId) {
        const userStore = useUserStore();
        // 先保存登录状态，这样后续的 getCurrentUser 请求才能带上 Token
        userStore.setLoginState(token, userInfo);

        const usersPermission = await getCurrentUser() as any;

        if (usersPermission.code == 200) {
          const roles = usersPermission.data.roles;
          const permission = usersPermission.data.permissions;

          userStore.setRoles(roles);
          userStore.setPermissions(permission);
        } else {
          console.error('获取用户权限失败:', usersPermission);
        }
      }
      return res;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    registerAction,
    loginAction,
  };
};
