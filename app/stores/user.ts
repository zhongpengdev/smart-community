interface UserInfo {
  userId: string;
  phone: string;
  email: string;
  avatar: string;
  gender: string;
  age: number;
  userType: number;
  status: number;
  userName: string;
}

interface UserRole {
  roleId: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: number;
}

interface UserPermission {
  permissionId: number;
  permissionName: string;
  permissionCode: string;
  description: string;
  status: number;
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null);
  const userInfo = ref<UserInfo | null>(null);
  const userRole = ref<UserRole | null>(null); // Keep for compatibility if needed, or just use plural
  const userRoles = ref<UserRole[] | null>(null);
  const userPermissions = ref<UserPermission[] | null>(null);

  const isLoggedIn = computed(() => !!token.value)
  const displayName = computed(() => userInfo.value?.userName)

  function setLoginState(newToken: string, newUser: UserInfo) {
    token.value = newToken
    userInfo.value = newUser
  }

  function setRole(newRole: UserRole) {
    userRole.value = newRole;
  }

  function setRoles(newRoles: UserRole[]) {
    userRoles.value = newRoles;
    userRole.value = newRoles.length > 0 ? (newRoles[0] as UserRole) : null;
  }

  function setPermissions(newPermissions: UserPermission[]) {
    userPermissions.value = newPermissions;
  }

  function logout() {
    token.value = null
    userInfo.value = null

    userRole.value = null;
    userRoles.value = null;
    userPermissions.value = null;
    
    // 断开 WebSocket 连接
    if (import.meta.client) {
      const { disconnect } = useWebSocket()
      disconnect()
      console.log('用户退出登录，已断开 WebSocket 连接')
    }
    
    // Clean up local storage persistence if needed, though setting to null usually suffices with persist plugin
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    displayName,
    setLoginState,
    setRole,
    setRoles,
    setPermissions,
    logout,
    userRole,
    userRoles,
    userPermissions
  }
}, {
  persist: {
    // info storted in localStorage
    storage: import.meta.client ? localStorage : undefined,
  },
}
)