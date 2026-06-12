<template>
    <div>
        <!-- Header -->
        <div class="bg-white dark:bg-black px-4 py-4 sticky top-10 z-10">
            <div class="max-w-[1300px] mx-auto flex items-center gap-4">
                <h1 class="text-lg font-bold text-slate-800 dark:text-slate-100">我的钱包</h1>
            </div>
        </div>

        <div class="max-w-[1300px] mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Balance Card -->
            <div class="lg:col-span-1 space-y-6">
                <div
                    class="bg-gradient-to-br from-[#ff5000] to-[#ff8c00] rounded p-8 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden h-[300px] flex flex-col justify-between">
                    <div class="absolute top-0 right-0 p-8 opacity-20">
                        <Icon name="lucide:wallet" size="120" />
                    </div>
                    <div class="relative z-5">
                        <p class="text-sm font-medium opacity-80 mb-2">账户余额 (元)</p>
                        <h2 class="text-4xl font-black mb-2">
                            {{ loading && !walletInfo ? '---' : (walletInfo?.balance || 0).toFixed(2) }}
                        </h2>
                        <p v-if="walletInfo?.frozenAmount" class="text-xs opacity-70">
                            冻结金额: ¥{{ walletInfo.frozenAmount.toFixed(2) }}
                        </p>
                    </div>
                    <div class="relative z-5 flex gap-4">
                        <button @click="showRecharge = true"
                            class="flex-1 py-3 px-6 bg-white text-[#ff5000] rounded font-bold hover:bg-slate-50 transition-colors shadow-lg">充值</button>
                        <button
                            class="flex-1 py-3 px-6 bg-white/20 backdrop-blur-md text-white rounded font-bold hover:bg-white/30 transition-colors border border-white/30">转账</button>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 gap-4">
                    <div
                        class="bg-white dark:bg-black rounded p-6 border border-slate-100 dark:border-slate-800">
                        <p
                            class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 text-opacity-80">
                            总消费</p>
                        <p class="text-xl font-black text-slate-800 dark:text-white">¥{{ walletInfo?.totalExpense || 0
                            }}</p>
                    </div>
                    <div
                        class="bg-white dark:bg-black rounded p-6 border border-slate-100 dark:border-slate-800">
                        <p
                            class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 text-opacity-80">
                            总充值</p>
                        <p class="text-xl font-black text-slate-800 dark:text-white">¥{{ walletInfo?.totalRecharge || 0
                            }}</p>
                    </div>
                </div>
            </div>

            <!-- Transaction History -->
            <div class="lg:col-span-2">
                <div
                    class="bg-white dark:bg-black rounded p-8 border border-slate-100 dark:border-slate-800 min-h-[500px]">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">账单明细</h3>
                        </div>
                    </div>

                    <!-- Transaction List -->
                    <div v-if="loading && transactions.length === 0" class="space-y-4">
                        <div v-for="i in 6" :key="i"
                            class="h-16 bg-slate-50/50 dark:bg-slate-800/30 animate-pulse rounded"></div>
                    </div>

                    <div v-else-if="transactions.length === 0"
                        class="flex flex-col items-center justify-center py-24 text-slate-400">
                        <div
                            class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded flex items-center justify-center mb-4">
                            <Icon name="lucide:receipt-text" size="32" class="opacity-20" />
                        </div>
                        <p class="text-sm font-medium">暂无账单明细</p>
                    </div>

                    <div v-else class="space-y-1">
                        <div v-for="item in transactions" :key="item.transactionId"
                            class="group flex items-center justify-between py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all px-4 -mx-4 rounded border-b border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
                            <div class="flex items-center gap-4">
                                <div :class="isIncome(item.transactionType) ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'"
                                    class="w-10 h-10 rounded flex items-center justify-center transition-colors group-hover:scale-110 duration-300">
                                    <Icon :name="getTransactionIcon(item.transactionType)" size="18" />
                                </div>
                                <div class="space-y-0.5">
                                    <div class="flex items-center gap-2">
                                        <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
                                            {{ item.description || getTypeName(item.transactionType) }}
                                        </p>
                                        <span v-if="item.transactionType === 'RECHARGE'"
                                            class="text-[9px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded font-black tracking-tighter uppercase">Income</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-[10px] text-slate-400">
                                        <span>{{ formatDate(item.createTime) }}</span>
                                        <span class="w-1 h-1 bg-slate-200 rounded"></span>
                                        <span class="font-mono">{{ item.transactionNo.slice(-8) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-right flex flex-col items-end">
                                <p :class="isIncome(item.transactionType) ? 'text-emerald-500' : 'text-slate-900 dark:text-white'"
                                    class="font-black text-base tracking-tight">
                                    {{ isIncome(item.transactionType) ? '+' : '-' }}{{ Math.abs(item.amount).toFixed(2)
                                    }}
                                </p>
                                <p class="text-[9px] font-bold text-slate-400/70 uppercase tracking-tighter">
                                    Bal: ¥{{ item.balanceAfter.toFixed(2) }}
                                </p>
                            </div>
                        </div>

                        <!-- Load More Button -->
                        <div v-if="hasMore" class="pt-4 flex justify-center">
                            <button @click="loadMore" :disabled="loading"
                                class="flex items-center gap-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all border border-slate-100 dark:border-slate-700">
                                <span v-if="loading">加载中...</span>
                                <template v-else>
                                    <span>查看更多记录</span>
                                    <Icon name="lucide:chevron-down" size="14" />
                                </template>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Recharge Modal -->
        <WalletRecharge :show="showRecharge" @close="showRecharge = false" @success="handleRechargeSuccess" />
    </div>
</template>

<script setup lang="ts">
const { walletInfo, transactions, loading, transactionPage, hasMore, fetchWalletInfo, fetchTransactions } = useWallet();
const showRecharge = ref(false);

const handleRechargeSuccess = () => {
    // Shared state is updated automatically by doRecharge
};

onMounted(async () => {
    await Promise.all([
        fetchWalletInfo(),
        fetchTransactions(1, 5, 'ALL', false) // Initial load: page 1, size 5
    ]);
});

const loadMore = async () => {
    await fetchTransactions(transactionPage.value + 1, 5, 'ALL', true);
};

const isIncome = (type: string) => {
    const incomeTypes = ['RECHARGE', 'REFUND', 'SYSTEM_ADD'];
    return incomeTypes.includes(type?.toUpperCase());
};

const getTypeName = (type: string) => {
    const types: Record<string, string> = {
        'RECHARGE': '账户充值',
        'PAYMENT': '商户消耗',
        'REFUND': '款项退还',
        'FEE_PAYMENT': '物业缴费',
        'MALL_PAYMENT': '商城购物',
        'SYSTEM_ADD': '系统调增',
        'SYSTEM_SUB': '系统调减'
    };
    return types[type?.toUpperCase()] || type;
};

const getTransactionIcon = (type: string) => {
    switch (type?.toUpperCase()) {
        case 'RECHARGE': return 'lucide:plus-circle';
        case 'REFUND': return 'lucide:undo-2';
        case 'PAYMENT':
        case 'FEE_PAYMENT':
        case 'MALL_PAYMENT': return 'lucide:wallet-cards';
        case 'SYSTEM_ADD': return 'lucide:shield-check';
        case 'SYSTEM_SUB': return 'lucide:shield-alert';
        default: return 'lucide:arrow-right-left';
    }
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hours}:${minutes}`;
};
</script>