<template>
  <footer
    class=" bg-white dark:bg-black text-slate-600 dark:text-slate-400 pt-10 pb-6 font-sans border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
    <div class="max-w-[1300px] mx-auto px-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tighter transition-colors">
              Neuedu<span class="text-[#ff5000]">智慧社区</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
            致力于打造安全、便捷、智能的现代化社区生活服务平台。
          </p>

          <div class="flex items-center gap-3 pt-1">

            <div class="relative group cursor-pointer">
              <div
                class="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#07c160] transition-colors">
                <Icon name="ri:wechat-fill" size="18"
                  class="text-slate-600 dark:text-slate-400 group-hover:text-white" />
              </div>
              <div
                class="absolute bottom-full left-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg">
                <div class="bg-white p-2 rounded border border-slate-100">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Neuedu" class="w-20 h-20" />
                </div>
              </div>
            </div>

            <a href="#"
              class="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-[#e6162d] group transition-colors">
              <Icon name="ri:weibo-fill" size="18" class="text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </a>

            <a href="#"
              class="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-black group transition-colors">
              <Icon name="ri:tiktok-fill" size="18" class="text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="text-slate-900 dark:text-white font-bold text-sm mb-4">快速链接</h3>
          <ul class="space-y-2 text-xs">
            <li>
              <NuxtLink to="#" class="hover:text-[#ff5000] transition-colors">关于我们</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-[#ff5000] transition-colors">社区服务</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#" class="hover:text-[#ff5000] transition-colors">新闻公告</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-slate-900 dark:text-white font-bold text-sm mb-4">帮助支持</h3>
          <ul class="space-y-2 text-xs">
            <li><a href="#" class="hover:text-[#ff5000] transition-colors">用户协议</a></li>
            <li><a href="#" class="hover:text-[#ff5000] transition-colors">隐私政策</a></li>
            <li><a href="#" class="hover:text-[#ff5000] transition-colors">常见问题</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-slate-900 dark:text-white font-bold text-sm mb-4">联系方式</h3>
          <div class="space-y-3">
            <div>
              <div class="text-[10px] text-slate-400">服务热线</div>
              <div class="text-lg font-bold text-[#ff5000] font-mono leading-none">400-888-6666</div>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <Icon name="lucide:mail" class="text-slate-400" size="14" />
              <span
                class="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">contact@neuedu.com</span>
            </div>

            <div class="flex items-start gap-2 text-xs">
              <Icon name="lucide:map-pin" class="text-slate-400 mt-0.5" size="14" />
              <span>沈阳市浑南区新秀街 2 号</span>
            </div>
          </div>
        </div>

      </div>

      <div class="border-t border-slate-100 dark:border-slate-800 my-6"></div>

      <div
        class="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-400 dark:text-slate-500">

        <div class="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4">
          <span>&copy; 2024 Neuedu.com</span>
          <span class="hidden md:inline w-px h-3 bg-slate-300 dark:bg-slate-700"></span>
          <a href="#" class="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">辽ICP备12345678号</a>
          <span class="hidden md:inline w-px h-3 bg-slate-300 dark:bg-slate-700"></span>
          <a href="#" class="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <Icon name="lucide:shield-check" size="12" />
            辽公网安备 210100号
          </a>
        </div>

        <div class="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
          <Icon name="lucide:award" size="14" />
          <span>可信网站验证</span>
        </div>

      </div>
    </div>
  </footer>
</template>