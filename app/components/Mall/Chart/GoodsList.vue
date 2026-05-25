<template>
    <div class="space-y-4">
        <!-- Select All Header (Global) -->
        <div
            class="bg-white dark:bg-slate-800 p-4 rounded border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div @click="emit('toggleSelectAll')"
                    class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors"
                    :class="isAllSelected ? 'bg-[#ff5000] border-[#ff5000]' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'">
                    <Icon name="lucide:check" size="14" class="text-white" v-if="isAllSelected" />
                </div>
                <span class="text-base font-medium text-slate-700 dark:text-slate-200">全选 ({{ totalCount }})</span>
            </div>

            <MallSearchBar width="290px" height="45px" placeholder="搜索购物车宝贝" button-text="搜索" />
        </div>

        <!-- Store Groups -->
        <div v-for="store in groupedCartList" :key="store.storeId"
            class="bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 overflow-hidden">

            <!-- Store Header -->
            <div
                class="px-5 py-3 border-b border-slate-50 dark:border-slate-700/50 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                <div @click="toggleStoreSelection(store.storeId)"
                    class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors"
                    :class="isStoreSelected(store.storeId) ? 'bg-[#ff5000] border-[#ff5000]' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'">
                    <Icon name="lucide:check" size="14" class="text-white" v-if="isStoreSelected(store.storeId)" />
                </div>
                <div class="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <Icon name="lucide:store" size="16" class="text-slate-400" />
                    <span>{{ store.storeName }}</span>
                    <Icon name="lucide:chevron-right" size="14" class="text-slate-400" />
                </div>
            </div>

            <!-- Items -->
            <div class="p-5 space-y-6">
                <div v-for="item in store.items" :key="item.cartId" class="flex gap-4 group">
                    <!-- Item Checkbox -->
                    <div class="flex items-start pt-8">
                        <div @click="emit('toggleSelection', item.cartId)"
                            class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors"
                            :class="selectedIds.includes(item.cartId) ? 'bg-[#ff5000] border-[#ff5000]' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'">
                            <Icon name="lucide:check" size="14" class="text-white"
                                v-if="selectedIds.includes(item.cartId)" />
                        </div>
                    </div>

                    <!-- Item Image -->
                    <div
                        class="w-28 h-28 bg-slate-50 dark:bg-slate-900 rounded overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                        <img v-if="item.coverImg" :src="item.coverImg" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                            <Icon name="lucide:image" size="24" />
                        </div>
                    </div>

                    <!-- Item Details -->
                    <div class="flex-1 flex flex-col justify-between">
                        <!-- Top Row: Title & Remove -->
                        <div class="flex justify-between items-start">
                            <h3
                                class="font-medium text-slate-800 dark:text-slate-100 text-sm md:text-base line-clamp-2 w-3/4 hover:text-[#ff5000] cursor-pointer transition-colors">
                                {{ item.productName }}
                            </h3>

                        </div>

                        <!-- Price & Qty -->
                        <div class="flex items-end justify-between mt-auto">
                            <div class="flex flex-col">
                                <span class="text-xs text-[#ff5000] font-bold mb-0.5"
                                    v-if="item.price >= 100">大促价保</span>
                                <div class="flex items-baseline gap-1 text-[#ff5000]">
                                    <span class="text-xs font-bold">¥</span>
                                    <span class="text-lg md:text-xl font-black">{{ item.price }}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <!-- Stepper -->
                                <div class="flex items-center border border-slate-200 dark:border-slate-600 rounded">
                                    <button @click="emit('quantityChange', item, -1)"
                                        class="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors border-r border-slate-200 dark:border-slate-600 rounded"
                                        :disabled="item.quantity <= 1 || item.loading">
                                        -
                                    </button>
                                    <input type="number" :value="item.quantity"
                                        @change="(e: any) => emit('quantityUpdate', item, parseInt(e.target.value))"
                                        class="w-10 text-center bg-transparent border-none text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none py-1" />
                                    <button @click="emit('quantityChange', item, 1)"
                                        class="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors border-l border-slate-200 dark:border-slate-600 rounded"
                                        :disabled="item.loading">
                                        +
                                    </button>
                                </div>

                                <!-- Remove Link -->
                                <div class="flex flex-col gap-2 text-xs">
                                    <button class="text-slate-400 hover:text-[#ff5000] cursor-pointer">移入收藏</button>
                                    <button @click="emit('remove', item.cartId)"
                                        class="text-slate-400 hover:text-red-500 cursor-pointer">删除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface CartItem {
    cartId: number
    productId: number
    productName: string
    price: number
    coverImg?: string
    storeId: number
    storeName: string
    quantity: number
    stock: number
    loading?: boolean
}

interface GroupedStore {
    storeId: number
    storeName: string
    items: CartItem[]
}

const props = defineProps<{
    cartList: CartItem[]
    selectedIds: number[]
}>()

const emit = defineEmits<{
    (e: 'toggleSelectAll'): void
    (e: 'toggleSelection', id: number): void
    (e: 'toggleStoreSelection', ids: number[]): void
    (e: 'quantityChange', item: CartItem, delta: number): void
    (e: 'quantityUpdate', item: CartItem, quantity: number): void
    (e: 'remove', id: number): void
}>()

const totalCount = computed(() => props.cartList.length)
const isAllSelected = computed(() => props.cartList.length > 0 && props.selectedIds.length === props.cartList.length)

const groupedCartList = computed<GroupedStore[]>(() => {
    const groups: Record<number, GroupedStore> = {}
    props.cartList.forEach(item => {
        if (!groups[item.storeId]) {
            groups[item.storeId] = {
                storeId: item.storeId,
                storeName: item.storeName || '未知店铺',
                items: []
            }
        }
        groups[item.storeId].items.push(item)
    })
    return Object.values(groups)
})

const isStoreSelected = (storeId: number) => {
    const store = groupedCartList.value.find(g => g.storeId === storeId)
    if (!store) return false
    return store.items.every(item => props.selectedIds.includes(item.cartId))
}

const toggleStoreSelection = (storeId: number) => {
    const store = groupedCartList.value.find(g => g.storeId === storeId)
    if (!store) return
    const itemIds = store.items.map(item => item.cartId)
    // Check if all selected, then deselect all. Else select all.
    // Logic handled by parent or we calculate here and send ids?
    // It's cleaner to let parent handle logic, but parent doesn't know grouping easily.
    // Let's send the list of IDs for this store to toggle.
    // Or better: Parent expects "Toggle THESE IDs".

    // Actually, to make "toggleStoreSelection" work, we need to know the intent (select or deselect).
    const allSelected = isStoreSelected(storeId)
    // Emit a specific event for store toggle? Or reuse generic?
    // Let's use a specific one for clarity
    emit('toggleStoreSelection', itemIds)
}

</script>

<style scoped>
/* Scoped styles if needed */
</style>
