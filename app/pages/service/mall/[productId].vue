<template>
    <div class="min-h-screen bg-[#f4f4f4] dark:bg-slate-900 pb-24">
        <!-- Main Detail Container -->
        <div class="max-w-[1190px] mx-auto pt-4 px-4 md:px-0">

            <!-- 2. Main Product Content -->
            <div class="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 rounded p-6 shadow-sm min-h-[500px]">

                <!-- Left: Image Gallery -->
                <div class="w-full md:w-[460px] flex gap-4 shrink-0">
                    <!-- Thumbnails -->
                    <div v-if="productImages.length > 0"
                        class="hidden md:flex flex-col gap-3 max-h-[460px] overflow-y-auto">
                        <div v-for="(img, index) in productImages" :key="img.imageId"
                            class="w-16 h-16 rounded border-2 overflow-hidden cursor-pointer transition-all shrink-0"
                            :class="activeImage === img.imageUrl ? 'border-[#ff5000]' : 'border-transparent hover:border-slate-200'"
                            @click="activeImage = img.imageUrl">
                            <img :src="img.imageUrl" class="w-full h-full object-cover">
                        </div>
                    </div>

                    <!-- Main Image -->
                    <div
                        class="flex-1 aspect-square bg-[#f9f9f9] dark:bg-slate-900 rounded overflow-hidden relative group border border-slate-100 dark:border-slate-700">
                        <img v-if="activeImage" :src="activeImage" class="w-full h-full object-contain"
                            :alt="product?.productName">
                        <div v-else-if="loading" class="w-full h-full animate-pulse bg-slate-100 dark:bg-slate-800">
                        </div>
                        <div v-else class="w-full h-full flex items-center justify-center text-slate-300">暂无图片</div>
                    </div>
                </div>

                <!-- Right: Detail Info -->
                <div class="flex-1 flex flex-col pt-0 md:pt-2">
                    <h1 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3">
                        {{ product?.productName || '加载中...' }}
                    </h1>

                    <p
                        class="text-sm text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-900/50 p-3 rounded border border-slate-100 dark:border-slate-800">
                        {{ product?.description }}
                    </p>

                    <!-- Price Card -->
                    <div
                        class="bg-gradient-to-r from-[#ff0036] to-[#ff5000] rounded p-5 text-white mb-6 relative overflow-hidden">
                        <div class="flex items-baseline gap-1 relative z-10">
                            <span class="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded mr-1">天天特价</span>
                            <span class="text-sm font-sans">¥</span>
                            <span class="text-4xl font-black">{{ String(product?.price || 0).split('.')[0] }}</span>
                            <span
                                v-if="String(product?.price || 0).includes('.') && String(product?.price || 0).split('.')[1]"
                                class="text-xl font-black">.{{ String(product?.price || 0).split('.')[1] }}</span>
                        </div>
                        <div class="text-xs opacity-80 mt-1 relative z-10">社区直供 · 全城底价</div>

                        <div
                            class="absolute top-0 right-0 h-full w-1/3 bg-white/10 skew-x-[-20deg] flex items-center justify-center translate-x-10">
                            <span class="text-xl font-bold italic rotate-[20deg]">专享优惠</span>
                        </div>
                    </div>

                    <!-- Meta Info List -->
                    <div class="space-y-6 text-sm border-t border-slate-50 dark:border-slate-700 pt-6">
                        <!-- Shipping & Stores -->
                        <div class="flex items-start gap-3">
                            <Icon name="lucide:truck" size="18" class="text-slate-400 mt-1" />
                            <div class="flex-1 flex flex-col gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="text-slate-500 shrink-0">配送说明</span>
                                </div>
                                <!-- Available Stores -->
                                <div v-if="product?.availableStores?.length" class="space-y-2">
                                    <div v-for="store in product.availableStores" :key="store.storeId"
                                        @click="selectedStoreId = store.storeId"
                                        class="p-3 rounded border cursor-pointer transition-all"
                                        :class="selectedStoreId === store.storeId ? 'border-[#ff5000] bg-orange-50 dark:bg-orange-900/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-orange-200'">
                                        <div class="flex items-center justify-between mb-1">
                                            <div class="flex items-center gap-2">
                                                <div class="w-3 h-3 rounded border border-slate-300 flex items-center justify-center"
                                                    :class="selectedStoreId === store.storeId ? 'border-[#ff5000] bg-[#ff5000]' : ''">
                                                    <Icon v-if="selectedStoreId === store.storeId" name="lucide:check"
                                                        size="8" class="text-white" />
                                                </div>
                                                <span class="font-bold"
                                                    :class="selectedStoreId === store.storeId ? 'text-[#ff5000]' : 'text-slate-700 dark:text-slate-300'">{{
                                                        store.storeName }}</span>
                                            </div>
                                            <span
                                                class="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">库存:
                                                {{ store.stock }}</span>
                                        </div>
                                        <div class="flex items-center gap-1 text-xs text-slate-500 pl-5">
                                            <Icon name="lucide:map-pin" size="12" /> {{ store.address }}
                                        </div>
                                        <div class="text-[10px] text-slate-400 mt-1 pl-5">营业时间: {{
                                            store.businessHours
                                        }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quantity Selector -->
                        <div class="flex items-center gap-3">
                            <Icon name="lucide:shopping-bag" size="18" class="text-slate-400" />
                            <div class="flex items-center gap-4">
                                <span class="text-slate-500 shrink-0">购买数量</span>
                                <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded p-1">
                                    <button @click="quantity > 1 && quantity--"
                                        class="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm text-slate-800 dark:text-slate-200 font-bold text-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                        :disabled="quantity <= 1">
                                        -
                                    </button>
                                    <input type="number" v-model="quantity"
                                        class="w-12 text-center bg-transparent border-none text-base font-bold text-slate-800 dark:text-slate-100 focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none" />
                                    <button @click="quantity++"
                                        class="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 rounded shadow-sm text-slate-800 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 transition-colors">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Services -->
                        <div class="flex items-center gap-3">
                            <Icon name="lucide:shield-check" size="18" class="text-slate-400" />
                            <div class="flex items-center gap-4 flex-wrap">
                                <span class="text-slate-500 shrink-0">服务保证</span>
                                <span class="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                                    <Icon name="lucide:check-circle" size="14" class="text-green-500" /> 7天无理由
                                </span>
                                <span class="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                                    <Icon name="lucide:check-circle" size="14" class="text-green-500" /> 极速退款
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Bottom Bar -->
        <div
            class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[500px] h-16 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white/20 dark:border-slate-700/50 z-[200] px-4 flex items-center justify-between">
            <div class="flex items-center gap-6 px-2">
                <div class="flex flex-col items-center gap-0.5 cursor-pointer transition-colors group"
                    @click="handleCollect(product?.productId)">
                    <Icon name="lucide:heart" size="22"
                        :class="product?.isCollected ? 'text-red-500 fill-red-500' : 'text-slate-500 group-hover:text-red-400'" />
                    <span class="text-[10px] font-bold transition-colors"
                        :class="product?.isCollected ? 'text-red-500' : 'text-slate-500 group-hover:text-red-400'">
                        {{ product?.isCollected ? '取消收藏' : '收藏' }}
                    </span>
                </div>
            </div>

            <div class="flex-1 max-w-[280px] flex h-11 rounded overflow-hidden shadow-sm">
                <button @click="handleAddToCart"
                    class="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
                    加入购物车
                </button>
                <button @click="handleBuyNow"
                    class="flex-1 bg-gradient-to-r from-[#ff5000] to-[#ff0036] text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
                    立即购买
                </button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const productId = route.params.productId as string

const product = ref<any>(null)
const loading = ref(false)

import { useMallGoods } from '@/composables/mall/useMallGoods'
import { useGoodsOrder } from '@/composables/mall/useGoodsOrder'
const { fetchDetail, fetchCollect, fetchCancelCollect, fetchProductImages, fetchAddToCart } = useMallGoods();

const productImages = ref<any[]>([])
const activeImage = ref('')
const quantity = ref(1)
const selectedStoreId = ref<number | null>(null)

definePageMeta({
    layout: 'mall'
})

const loadData = async () => {
    loading.value = true
    const [detailData, imagesData] = await Promise.all([
        fetchDetail(productId),
        fetchProductImages(productId)
    ])

    if (detailData) {
        product.value = detailData
        useSeoMeta({
            title: `${product.value.productName} - 智慧社区商城`,
            description: product.value.description
        })

        // Default select first store
        if (detailData.availableStores && detailData.availableStores.length > 0) {
            selectedStoreId.value = detailData.availableStores[0].storeId
        }
    }

    if (imagesData && imagesData.length > 0) {
        productImages.value = imagesData
        // Find main image or use first one
        const mainImg = imagesData.find((img: any) => img.isMain === 1)
        activeImage.value = mainImg ? mainImg.imageUrl : imagesData[0].imageUrl
    } else if (detailData?.coverImg) {
        activeImage.value = detailData.coverImg
    }

    loading.value = false
}

onMounted(() => {
    loadData()
})

const handleCollect = async (productId: string) => {
    let success;
    if (product.value.isCollected) {
        success = await fetchCancelCollect(productId);
    } else {
        success = await fetchCollect(productId);
    }
    if (success) {
        product.value.isCollected = !product.value.isCollected;
        ElMessage.success(product.value.isCollected ? '添加收藏成功' : '已取消收藏');
    }
}


const { createOrder } = useGoodsOrder()

const handleAddToCart = async () => {
    if (!selectedStoreId.value) {
        ElMessage.warning('请选择门店');
        return;
    }
    if (quantity.value < 1) {
        ElMessage.warning('请选择购买数量');
        return;
    }

    const data = {
        productId: productId,
        storeId: selectedStoreId.value,
        quantity: quantity.value
    };

    await fetchAddToCart(data);
}

const { cartList, fetchCartList } = useMallGoods(); // Destructure cartList and fetchCartList

const handleBuyNow = async () => {
    if (!selectedStoreId.value) {
        ElMessage.warning('请选择门店');
        return;
    }
    if (quantity.value < 1) {
        ElMessage.warning('请选择购买数量');
        return;
    }

    const data = {
        productId: productId,
        storeId: selectedStoreId.value,
        quantity: quantity.value
    };

    // 1. Add to cart first
    loading.value = true;
    const res = await fetchAddToCart(data); // Returns data or true

    let cartItemId: number | null = null

    // Try to get cartItemId from response (if backend returns it)
    if (typeof res === 'object') {
        if (res.cartId) cartItemId = res.cartId;
        else if (res.id) cartItemId = res.id;
        // Some backends return data directly
    }

    // If not found, fetch cart list to find the item matching product and store
    // This is a fallback strategy if API doesn't return the ID
    if (!cartItemId) {
        await fetchCartList()
        const found = cartList.value.find((item: any) =>
            String(item.productId) === String(productId) &&
            Number(item.storeId) === Number(selectedStoreId.value)
        )
        if (found) {
            cartItemId = found.cartId
        }
    }

    loading.value = false;

    if (!cartItemId) {
        ElMessage.error('结算失败：无法获取购物车商品信息');
        return;
    }

    // 2. Confirm Checkout
    try {
        await ElMessageBox.confirm(
            `确定要立即购买该商品吗？`,
            '购买确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }
        )

        // 3. Create Order
        // Assuming createOrder takes cartItemIds array
        const orderRes = await createOrder(Number(selectedStoreId.value), [cartItemId], '立即购买')

        if (orderRes) {
            // Success
            ElMessage.success('下单成功');
            navigateTo('/service/mall/mo')
        }

    } catch (e) {
        // Cancelled or error
        if (e !== 'cancel') {
            console.error(e)
        }
    }
}

</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>