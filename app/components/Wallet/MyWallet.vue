<template>
    <NuxtLink to="/wallet"
        class="block group relative overflow-hidden bg-white dark:bg-slate-900 rounded p-6 border border-slate-100 dark:border-slate-800 shadow-sm h-full">

        <!-- Decorative background elements -->
        <div
            class="absolute -top-12 -right-12 w-32 h-32 bg-orange-100/50 dark:bg-orange-500/10 rounded blur-3xl group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20 transition-colors">
        </div>
        <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-[#ff5000]/5 dark:bg-[#ff5000]/10 rounded blur-2xl">
        </div>

        <div class="relative z-10 flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded bg-gradient-to-br from-[#ff5000] to-[#ff8c00] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <Icon name="lucide:wallet" size="20" />
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100">我的钱包</h3>
                        <p class="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
                            Wallet Services</p>
                    </div>
                </div>
                <div
                    class="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#ff5000] group-hover:bg-orange-50 transition-all">
                    <Icon name="lucide:chevron-right" size="16" />
                </div>
            </div>

            <!-- Balance Section -->
            <div class="flex items-end justify-between mt-auto">
                <div>
                    <div
                        class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-widest text-opacity-80">
                        账户余额 (元)
                    </div>
                    <div class="flex items-baseline gap-1">
                        <template v-if="loading && !walletInfo">
                            <div class="h-8 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"></div>
                        </template>
                        <template v-else>
                            <span class="text-2xl font-black text-slate-900 dark:text-white">{{ (walletInfo?.balance ||
                                0).toFixed(2) }}</span>
                        </template>
                    </div>
                </div>

                <!-- Total Expense/Recharge or static Points -->
                <div class="text-right">
                    <div class="text-[10px] text-slate-400 dark:text-slate-500 mb-1">本月消耗</div>
                    <div class="text-sm font-bold text-[#ff5000]">
                        {{ walletInfo ? `¥${walletInfo.totalExpense}` : '---' }}
                    </div>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
const { walletInfo, fetchWalletInfo, loading } = useWallet();

onMounted(() => {
    fetchWalletInfo();
});
</script>

<style scoped>
.group:hover {
    border-color: rgba(255, 80, 0, 0.2);
}
</style>
