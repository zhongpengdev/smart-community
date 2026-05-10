# 技术债深度分析：请求链路碎片化与非规范 fetch 滥用

## 1. 问题现状描述
目前项目中存在严重的“双轨制”请求逻辑：
*   **规范轨道**: 部分组件使用 `composables/useApi.ts` 中定义的 `$api`。
*   **非规范轨道**: 大量后台管理页面（`SuperCommunity` 系列）直接在 `.vue` 文件中使用原生 `fetch`，并手动拼接 URL 和注入 Token。

### 🚨 典型错误代码示例 (Anti-pattern)
```typescript
// pages/superCommunity/system/user/index.vue
const config = useRuntimeConfig()
const response = await fetch(`${config.public.apiBase}/api/admin/users`, {
    headers: {
        'Authorization': `Bearer ${useUserStore().token}`
    }
})
const res = await response.json()
```

## 2. 核心风险分析

### 2.1 全局拦截器失效 (Security & DX)
我们在 `useApi.ts` 中精心设计的全局逻辑对这些 `fetch` 请求**完全无效**：
*   **401 节流引导**: 当 Token 过期时，这些页面不会自动跳转登录页，而是直接报错或静默失败。
*   **统一 BaseURL**: 必须每个页面手动写 `useRuntimeConfig`，一旦变量名变更，全量失效。
*   **请求日志/追踪**: 无法统一监控这些请求的成功率和耗时。

### 2.2 代码冗余与维护地狱
*   **逻辑重复**: 每个页面都在重复编写拼接 `Authorization` 头的逻辑（违反 DRY 原则）。
*   **契约不可见**: 业务逻辑与底层通信逻辑高度耦合。如果要查看某个接口的定义，必须翻阅具体的 Vue 模板。

### 2.3 异常处理脆弱
原生 `fetch` 不会自动抛出 HTTP 错误状态（如 500, 404），开发者必须手动检查 `response.ok`。目前项目中大多缺失此类检查，导致前端容易出现假死或逻辑错误。

---

## 3. 大厂级规范建议 (The Standard)

### 3.1 契约分层架构
大厂规范要求建立 **API 契约层 (Contract Layer)**，实现：**UI 组件 -> API 函数 -> 统一网关 -> 网络**。

1.  **UI 层**: 只负责调用函数，传递参数，不关心 Token 和域名。
2.  **API 契约层 (`utils/api.ts`)**: 定义接口路径、方法、参数类型。
3.  **网关层 (`useApi.ts`)**: 统一处理 Header、鉴权、报错节流、域名转换。

---

## 4. 专项重构方案 (The Refactoring Blueprint)

### 第一阶段：在 `utils/api.ts` 中建立契约映射
将分散在 Vue 里的路径提取出来，例如：

```typescript
// utils/api.ts (新增规范)

/** 后台管理：获取用户列表 */
export const getAdminUsersApi = (params: any) => {
  return $api('/api/admin/users', { method: 'GET', params })
}

/** 后台管理：更新角色 */
export const updateRoleApi = (roleId: number, data: any) => {
  return $api(`/api/permission/role/${roleId}`, { method: 'PUT', body: data })
}
```

### 第二阶段：批量清理 Vue 页面中的 fetch
以下模块必须进行全量重构：

| 模块路径 | 涉及功能 | 重构重点 |
| :--- | :--- | :--- |
| `pages/superCommunity/system/user/` | 用户管理、状态切换、角色分配 | 移除 fetch，迁移至 `getAdminUsersApi` 系列。 |
| `pages/superCommunity/system/role/` | 角色列表、权限分配 | 移除手动 Header 注入。 |
| `pages/superCommunity/system/permission/` | 权限增删改查 | 统一使用 `$api` 自动错误处理。 |
| `pages/superCommunity/property/fee/` | 物业费后台数据请求 | 修复 URL 拼接中的 QueryString 冗余。 |

### 第三阶段：移除 UI 层的 useRuntimeConfig 依赖
页面组件不再需要为了请求而引入 `useRuntimeConfig` 和 `useUserStore`，使组件逻辑更加纯粹。

---

## 5. 预期收益
*   **100% 鉴权同步**: 所有接口自动共享 401 自动跳转和报错节流逻辑。
*   **维护效率提升**: 修改一个路径或一个 Header，全项目生效。
*   **类型健壮性**: 为 API 函数添加 TS Interface 后，可实现前端到后端的全链路类型检查。
