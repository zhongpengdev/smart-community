# 修复日志 - 2026-05-08

## 问题描述
**Bug**: 首次访问界面或处于未登录状态时，系统会连续弹出多个 "请先登录" 的 ElMessage 提示。

## 原因分析
1. **API 拦截器过于激进**: 原 `composables/useApi.ts` 在 `onRequest` 阶段检查 Token。如果 Token 不存在且访问的是非白名单接口，会针对**每一个**并发请求都触发一次报错提示。首页初始化时通常会并发调用多个接口（如公告、用户信息等），导致提示堆叠。
2. **重复的权限检查**: `layouts/superCommunity.vue` 的 `onMounted` 钩子与 `superCommunity.ts` 路由中间件均包含登录检查及报错逻辑，导致进入后台管理系统时产生双重提示。
3. **页面配置不统一**: 后台数据看板首页缺失中间件配置，导致权限验证逻辑分散在布局组件中。

## 修复方案
1. **重构 API 拦截器 (`composables/useApi.ts`)**:
    - 移除 `onRequest` 中的强制弹窗。
    - 增加 `onResponseError` 统一处理 401 (Unauthorized) 状态码。
    - **引入节流机制**: 使用 `useState` 维护一个 `is-auth-message-showing` 状态，配合 `setTimeout` 确保 2 秒内即便有多个并发 401 响应，也仅弹出一个提示框。
2. **清理冗余逻辑 (`layouts/superCommunity.vue`)**:
    - 移除了布局组件中重复的 `ElMessage.error` 提示，将权限验证的交互反馈主要交给中间件处理。
3. **完善路由守卫 (`pages/superCommunity/index.vue`)**:
    - 为后台首页补全 `middleware: 'super-community'` 配置，确保权限验证逻辑的一致性。

## 影响范围
- 全局 API 请求处理
- 后台管理系统 (`/superCommunity`) 的准入逻辑
