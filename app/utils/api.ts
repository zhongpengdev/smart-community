import { $api } from '../composables/useApi'

//获取当前用户角色
//api/permission/user/current
export const getCurrentUser = () => {
  return $api('/api/permission/user/current', {
    method: 'GET'
  })
}

export const registerUser = (data: any) => {
  return $api('api/user/register', {
    method: 'POST',
    body: data
  })
}

export const loginUser = (body: any, loginMethod: string) => {

  if (loginMethod === 'phone') {
    return $api('api/user/login', {
      method: "POST",
      body
    })
  }
  else {
    return $api('api/user/login-by-email', {
      method: "POST",
      body
    })
  }

}

//api/user/avatar/upload
export const uploadAvatarApi = (body: any) => {
  return $api('api/user/avatar/upload', {
    method: "POST",
    body
  })
}

/**
 * 上传单张图片
 * @param file 图片文件
 */
export const uploadImageApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return $api('/api/upload/image', {
    method: 'POST',
    body: formData
  })
}

export const updateUserInfoApi = (body: any) => {
  return $api('api/user/profile', {
    method: "PUT",
    body
  })
}

//忘记密码重置邮箱Api
export const sendResetPasswordEmailApi = (email: string) => {
  return $api('/api/user/send-verify-code', {
    method: "POST",
    body: { email } //JSON
  })
}

//重置密码
export const resetPasswordApi = (body: any) => {
  return $api('api/user/forgot-password', {
    method: "POST",
    body
  })
}

// 修改密码
export const changePasswordApi = (body: any) => {
  return $api('api/user/change-password', {
    method: "POST",
    body
  })
}

//退出登录 /api/user/logout
export const logoutUser = () => {
  return $api('api/user/logout', {
    method: 'POST'
  })
}

// 获取社区公告列表
export const getCommunityNewsApi = (params: any) => {
  return $api('/api/announcement/list', {
    method: 'GET',
    params
  })
}

// 获取公告详情
export const getAnnouncementDetailApi = (announceId: string | number) => {
  return $api(`/api/announcement/${announceId}`, {
    method: 'GET'
  })
}

// 获取访客登记列表
export const getVisitorListApi = (params: any) => {
  return $api('/api/visitor/list', {
    method: 'GET',
    params
  })
}

// 创建访客登记
export const createVisitorApi = (data: any) => {
  return $api('/api/visitor/register', {
    method: 'POST',
    body: data
  })
}

// 取消访客登记
export const cancelVisitorApi = (registerId: number | string) => {
  return $api(`/api/visitor/${registerId}`, {
    method: 'DELETE'
  })
}

// 获取所有车位信息 (用于车位图展示)
export const getAllParkingApi = (params: any) => {
  return $api('/api/parking/all', {
    method: 'GET',
    params
  })
}

// 提交车位登记申请
export const registerParkingApi = (data: any) => {
  return $api('/api/parking/register', {
    method: 'POST',
    body: data
  })
}


// --- 物业报事维修 ---

// 获取报事维修列表
export const getRepairListApi = (params: any) => {
  return $api('/api/repair/my-list', {
    method: 'GET',
    params
  })
}

// 提交报事维修
export const createRepairApi = (data: any) => {
  return $api('/api/repair/submit', {
    method: 'POST',
    body: data
  })
}

// --- 物业事项投诉 ---

// 获取投诉列表
export const getComplaintListApi = (params: any) => {
  return $api('/api/complaint/my-list', {
    method: 'GET',
    params
  })
}

// 提交投诉
export const createComplaintApi = (data: any) => {
  return $api('/api/complaint/submit', {
    method: 'POST',
    body: data
  })
}




//商城
//获取商品列表
export const getMallGoodsListApi = (data: any) => {
  return $api('/api/mall/list', {
    method: 'POST',
    body: data
  })
}

//获取商品详情
export const getMallProductDetailApi = (productId: string | number) => {
  return $api(`/api/mall/products/${productId}`, { method: 'GET' })
}

//商品收藏
export const collectProductApi = (productId: string | number) => {
  return $api(`/api/mall/products/${productId}/collect`, { method: 'POST' })
}

//取消收藏DELET请求
export const cancelCollectProductApi = (productId: string | number) => {
  return $api(`/api/mall/products/${productId}/collect`, { method: 'DELETE' })
}

//获取商品图片
export const getProductImagesApi = (ProductId: string | number) => {
  return $api(`/api/product/${ProductId}/images`, { method: 'GET' })
}

//添加商品到购物车
// /api/mall/cart/items
export const addToCartApi = (data: any) => {
  return $api('/api/mall/cart/items', {
    method: 'POST',
    body: data
  })
}

//获取购物车列表
///api/mall/cart/items
export const getCartListApi = () => {
  return $api('/api/mall/cart/items', { method: 'GET' })
}

//移除购物车商品
//api/mall/cart/items/{cartItemId}
export const removeCartApi = (cartItemId: string | number) => {
  return $api(`/api/mall/cart/items/${cartItemId}`, { method: 'DELETE' })
}

//更新购物车商品数量
///api/mall/cart/items/{cartItemId}/quantity
export const updateCartQuantityApi = (data: any) => {
  return $api(`/api/mall/cart/items/${data.cartId}/quantity`, {
    method: 'PUT',
    body: data
  })
}

//搜索商品
//api/mall/list
/**
 * 查询接口{
  "categoryId": 0,
  "keyword": "荔枝",
  "pageNum": 0,
  "pageSize": 0
}

响应
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pages": 1,
    "total": 1,
    "list": [
      {
        "productId": 34,
        "productName": "妃子笑荔枝（3斤装）",
        "description": "海南妃子笑，核小肉厚，当季新鲜采摘",
        "price": 49.9,
        "coverImg": "https://xxx.com/img/litchi.jpg",
        "sales": null,
        "isCollected": false
      }
    ]
  },
  "timestamp": 1768185908640
}
 */
export const searchMallProductApi = (data: any) => {
  return $api('/api/mall/list', {
    method: 'POST',
    body: data
  })
}

/**
 * 
 * 查询商品的所有可自提门店
 * 
/api/mall/stores

 * 请求参数{
  "productId": 35,
  "pageNum": 0,
  "pageSize": 0
}
 * 返回
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "storeId": 1,
      "storeName": "智慧社区-花城店2",
      "address": "智慧社区-花城店2",
      "businessHours": "",
      "contactPhone": "",
      "status": null
    }
  ],
  "timestamp": 1768188037165
}
 */

export const searchMallStoreApi = (data: any) => {
  return $api('/api/mall/stores', {
    method: 'POST',
    body: data
  })
}









// --- 物业缴费相关 ---

// 创建订单
//api/payment/create-order
// 创建订单
//api/payment/create-order
export const createOrderApi = (data: any) => {
  return $api(`/api/payment/create-order`, {
    method: 'POST',
    body: data
  })
}

//发起支付
//api/payment/initiate/{orderNo}
export const initiatePaymentApi = (orderNo: string | number) => {
  return $api(`/api/payment/initiate/${orderNo}`, {
    method: 'POST'
  })
}

//查询订单状态
///api/payment/query/{orderNo}
export const queryOrderStatusApi = (orderNo: string | number) => {
  return $api(`/api/payment/query/${orderNo}`, {
    method: 'GET'
  })
}


//模拟回调接口
///api/payment/mock/callback/{orderNo}
export const mockCallbackApi = (orderNo: string | number, success: boolean = true) => {
  return $api(`/api/payment/mock/callback/${orderNo}`, {
    method: 'POST',
    query: { success }
  })
}

// 查询缴费记录
export const getPaymentHistoryApi = (params: any) => {
  return $api('/api/property-fee/payments', {
    method: 'GET',
    params
  })
}

// 查询我的物业费账单
export const getMyBillsApi = (params: any) => {
  return $api('/api/property-fee/bills', {
    method: 'GET',
    params
  })
}

// 获取账单详情
export const getBillDetailApi = (billId: string | number) => {
  return $api(`/api/property-fee/bills/${billId}`, {
    method: 'GET'
  })
}



//钱包组件

//1. 获取钱包信息
//api/wallet/info 
export const getWalletInfoApi = () => {
  return $api('/api/wallet/info', { method: 'GET' })
}

//2. 查询交易记录
// /api/wallet/transactions
//参数 1.type: ALL  2.page:1 3.size:10 
export const getTransactionsApi = (params: any) => {
  return $api('/api/wallet/transactions', { method: 'GET', params })
}

//3. 充值接口
// /api/wallet/recharge
export const rechargeApi = (data: any) => {
  return $api('/api/wallet/recharge', { method: 'POST', body: data })
}

//选择支付方式
///api/payment/changePayMethod/{orderNo}
// 参数 orderNo paymentMethod
//返回：200成功 其他的话显示res.message
export const changePayMethodApi = (orderNo: string | number, paymentMethod: string) => {
  return $api(`/api/payment/changePayMethod/${orderNo}`, {
    method: 'POST',
    params: { paymentMethod }
  })
}




/*

创建商品订单
api/orders/product/create

请求参数：
{
  "storeId": 1,
  "cartItemIds": [7],
  "remark": "update"
}

返回参数：
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": 83,
    "orderNo": "ORDER202601071000463995D157",
    "userId": 12,
    "orderType": "PRODUCT",
    "orderTypeDesc": "商品订单",
    "amount": 13.8,
    "paymentMethod": "ALIPAY",
    "paymentMethodDesc": "支付宝",
    "status": 0,
    "statusDesc": "待支付",
    "storeId": 1,
    "storeName": "智慧社区-花城店",
    "description": "update",
    "relatedId": null,
    "createTime": "2026-01-07 10:00:47",
    "callbackTime": null,
    "pickUpTime": null,
    "finishTime": null,
    "expireTime": "2026-01-07 10:30:47",
    "products": [
      {
        "productId": 37,
        "productName": "西红柿（2斤装）",
        "productImage": "https://xxx.com/img/tomato.jpg",
        "quantity": 2,
        "price": 6.9,
        "subtotal": 13.8
      }
    ]
  },
  "timestamp": 1767751246758
}

*/
export const createProductOrderApi = (data: any) => {
  return $api('/api/orders/product/create', {
    method: 'POST',
    body: data
  })
}


/**
 * 查询所有的订单
 * GET/api/orders/list
 * 
 * 
 * 请求参数：
 * pageNum
 * pageSize
 * 
 * 返回参数：
 * {
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "orderId": 83,
        "orderNo": "ORDER202601071000463995D157",
        "orderType": "PRODUCT",
        "orderTypeDesc": "商品订单",
        "amount": 13.8,
        "status": 0,
        "statusDesc": "待支付",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": "智慧社区-花城店",
        "description": "update",
        "productCount": 2,
        "createTime": "2026-01-07 10:00:47"
      },
      {
        "orderId": 81,
        "orderNo": "ORDER20260106144712984C8A56",
        "orderType": "PROPERTY_FEE",
        "orderTypeDesc": "物业费",
        "amount": 700.5,
        "status": 2,
        "statusDesc": "支付成功/待取货",
        "paymentMethod": "WALLET",
        "paymentMethodDesc": "钱包",
        "storeName": null,
        "description": "物业费缴纳",
        "productCount": null,
        "createTime": "2026-01-06 14:47:12"
      }
    ],
    "total": 9,
    "size": 10,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767751448883
}
 */
export const getOrdersListApi = (params: any) => {
  return $api('/api/orders/list', {
    method: 'GET',
    params
  })
}

/*
按类型查询订单
/api/orders/list/by-type

参数：
orderType ：PRODUCT 商品订单， PROPERTY_FEE 物业费订单， RECHARGE 充值订单
pageNum
pageSize

返回参数：
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "orderId": 83,
        "orderNo": "ORDER202601071000463995D157",
        "orderType": "PRODUCT",
        "orderTypeDesc": "商品订单",
        "amount": 13.8,
        "status": 0,
        "statusDesc": "待支付",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": "智慧社区-花城店",
        "description": "update",
        "productCount": 2,
        "createTime": "2026-01-07 10:00:47"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767752362918
}


{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "orderId": 81,
        "orderNo": "ORDER20260106144712984C8A56",
        "orderType": "PROPERTY_FEE",
        "orderTypeDesc": "物业费",
        "amount": 700.5,
        "status": 2,
        "statusDesc": "支付成功/待取货",
        "paymentMethod": "WALLET",
        "paymentMethodDesc": "钱包",
        "storeName": null,
        "description": "物业费缴纳",
        "productCount": null,
        "createTime": "2026-01-06 14:47:12"
      },
      {
        "orderId": 80,
        "orderNo": "ORDER20260106144507DCEF8256",
        "orderType": "PROPERTY_FEE",
        "orderTypeDesc": "物业费",
        "amount": 700.5,
        "status": 2,
        "statusDesc": "支付成功/待取货",
        "paymentMethod": "WALLET",
        "paymentMethodDesc": "钱包",
        "storeName": null,
        "description": "物业费缴纳",
        "productCount": null,
        "createTime": "2026-01-06 14:45:08"
      },
      {
        "orderId": 79,
        "orderNo": "ORDER2026010614422034DE362A",
        "orderType": "PROPERTY_FEE",
        "orderTypeDesc": "物业费",
        "amount": 700.5,
        "status": 2,
        "statusDesc": "支付成功/待取货",
        "paymentMethod": "WALLET",
        "paymentMethodDesc": "钱包",
        "storeName": null,
        "description": "物业费缴纳",
        "productCount": null,
        "createTime": "2026-01-06 14:42:20"
      }
    ],
    "total": 3,
    "size": 10,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767752482608
}

{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "orderId": 62,
        "orderNo": "ORDER20260106141514C5BF9FB4",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 100,
        "status": 0,
        "statusDesc": "待支付",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 14:15:14"
      },
      {
        "orderId": 4,
        "orderNo": "ORDER2026010611144405C35CA5",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 100,
        "status": 1,
        "statusDesc": "支付中",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 11:14:44"
      },
      {
        "orderId": 3,
        "orderNo": "ORDER20260106110737C532933E",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 100,
        "status": 2,
        "statusDesc": "支付成功/待取货",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 11:07:37"
      },
      {
        "orderId": 2,
        "orderNo": "ORDER2026010611031076E1FEEC",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 100,
        "status": 1,
        "statusDesc": "支付中",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 11:03:10"
      },
      {
        "orderId": 1,
        "orderNo": "ORDER202601061055076E2A7026",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 800,
        "status": 2,
        "statusDesc": "支付成功/待取货",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 10:55:08"
      }
    ],
    "total": 5,
    "size": 10,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767752500316
}
*/

export const getOrdersListByTypeApi = (params: any) => {
  return $api('/api/orders/list/by-type', {
    method: 'GET',
    params
  })
}

/*
按照订单状态查询
/api/orders/list/by-status

参数：
status: 0 1 2 3
pageNum
pageSize

返回参数：

{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "orderId": 4,
        "orderNo": "ORDER2026010611144405C35CA5",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 100,
        "status": 1,
        "statusDesc": "支付中",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 11:14:44"
      },
      {
        "orderId": 2,
        "orderNo": "ORDER2026010611031076E1FEEC",
        "orderType": "RECHARGE",
        "orderTypeDesc": "充值",
        "amount": 100,
        "status": 1,
        "statusDesc": "支付中",
        "paymentMethod": "ALIPAY",
        "paymentMethodDesc": "支付宝",
        "storeName": null,
        "description": "钱包充值",
        "productCount": null,
        "createTime": "2026-01-06 11:03:10"
      }
    ],
    "total": 2,
    "size": 10,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767752549878
}
*/


export const getOrdersListByStatusApi = (params: any) => {
  return $api('/api/orders/list/by-status', {
    method: 'GET',
    params
  })
}


/*
获取订单详情
/api/orders/{orderId}

返回值：
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "orderId": 83,
    "orderNo": "ORDER202601071000463995D157",
    "userId": 12,
    "orderType": "PRODUCT",
    "orderTypeDesc": "商品订单",
    "amount": 13.8,
    "paymentMethod": "ALIPAY",
    "paymentMethodDesc": "支付宝",
    "status": 0,
    "statusDesc": "待支付",
    "storeId": 1,
    "storeName": "智慧社区-花城店",
    "description": "update",
    "relatedId": null,
    "createTime": "2026-01-07 10:00:47",
    "callbackTime": null,
    "pickUpTime": null,
    "finishTime": null,
    "expireTime": "2026-01-07 10:30:47",
    "products": [
      {
        "productId": 37,
        "productName": "西红柿（2斤装）",
        "productImage": "https://xxx.com/img/tomato.jpg",
        "quantity": 2,
        "price": 6.9,
        "subtotal": 13.8
      }
    ]
  },
  "timestamp": 1767753121710
}
*/

export const getOrderDetailApi = (orderId: string | number) => {
  return $api(`/api/orders/${orderId}`, { method: 'GET' })
}

/*
取消订单
/api/orders/{orderId}/cancel
返回code200
*/

export const cancelOrderApi = (orderId: string | number) => {
  return $api(`/api/orders/${orderId}/cancel`, { method: 'POST' })
}






//论坛相关

/*
获取论坛版块
/api/forum/section/list

{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "sectionId": 1,
      "sectionName": "社区公告",
      "sectionDesc": "社区官方公告和重要通知",
      "iconUrl": null,
      "sortOrder": 1,
      "postCount": 0,
      "status": 1,
      "createTime": "2026-01-06 10:01:03"
    },
    {
      "sectionId": 2,
      "sectionName": "邻里互助",
      "sectionDesc": "邻里之间互帮互助，共建和谐社区",
      "iconUrl": null,
      "sortOrder": 2,
      "postCount": 0,
      "status": 1,
      "createTime": "2026-01-06 10:01:03"
    },
    {
      "sectionId": 3,
      "sectionName": "生活分享",
      "sectionDesc": "分享生活中的点点滴滴",
      "iconUrl": null,
      "sortOrder": 3,
      "postCount": 0,
      "status": 1,
      "createTime": "2026-01-06 10:01:03"
    }
  ],
  "timestamp": 1767762305159
}

*/

export const getForumSectionListApi = () => {
  return $api('/api/forum/section/list', { method: 'GET' })
}


/**
 * 获取帖子列表
 * /api/forum/post/list
 * 
 * 参数
 * {
  "pageNo": 1,
  "pageSize": 5,
  "orderBy1": "",
  "isAsc1": true,
  "orderBy2": "",
  "isAsc2": true,
  "sectionId": 2,
  "keyword": "",
  "isEssence": 0,
  "sortBy": "latest"
}


返回


{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "postId": 1,
        "sectionId": 2,
        "sectionName": "邻里互助",
        "userId": 12,
        "userName": "余文俊",
        "userAvatar": "http://localhost:8080/api/uploads/avatar/20260106/542dd118364d4bde82daed941fb14cf6.webp",
        "title": "寻找丢失的钥匙",
        "contentSummary": "今天下午在小区花园丢失了一串钥匙，上面有小熊挂件，如有拾到请联系我，谢谢！",
        "firstImage": null,
        "viewCount": 50,
        "likeCount": 5,
        "commentCount": 3,
        "isTop": 0,
        "isEssence": 0,
        "createTime": "2026-01-06 10:20:22",
        "isTop": 0, 	//是否置顶 0-否 1-是
        "isEssence": 0, 	//是否精华 0-否 1-是
        "isLiked": false,
        "isCollected": false
      }
    ],
    "total": 1,
    "size": 5,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767764393037
}
 */

export const getForumPostListApi = (params: any) => {
  return $api('/api/forum/post/list', { method: 'POST', body: params })
}

/**
 * 发布帖子
 * /api/forum/post/create
 * 
 * 参数
 * {
  "sectionId": 0,
  "title": "",
  "content": "",
  "images": "http://example.com/1.jpg,http://example.com/2.jpg"
}

返回
{
  "code": 200,
  "message": "发布成功",
  "data": 4,
  "timestamp": 1767765030825
}
 */

export const createForumPostApi = (data: any) => {
  return $api('/api/forum/post/create', { method: 'POST', body: data })
}

/*
点赞帖子
/api/forum/post/new/{postId}/like

参数postId
返回
{
  "code": 200,
  "message": "点赞成功",
  "data": null,
  "timestamp": 1767765155185
}

*/
export const likeForumPostApi = (postId: string | number) => {
  return $api(`/api/forum/post/new/${postId}/like`, { method: 'POST' })
}


/**
 * 取消点赞
 * 
/api/forum/post/cancel/{postId}/like
和点赞相同
 */
export const cancelLikeForumPostApi = (postId: string | number) => {
  return $api(`/api/forum/post/cancel/${postId}/like`, { method: 'DELETE' })
}

/**
 * 
 * 收藏帖子
 * POST
/api/forum/post/new/{postId}/collect


参数：postId

返回
{
  "code": 200,
  "message": "收藏成功",
  "data": null,
  "timestamp": 1767767736406
}
 */

export const collectForumPostApi = (postId: string | number) => {
  return $api(`/api/forum/post/new/${postId}/collect`, { method: 'POST' })
}

/**
 * 取消收藏
 * /api/forum/post/cancel/{postId}/collect
 * DELETE
 * 参数：postId
 */
export const cancelCollectForumPostApi = (postId: string | number) => {
  return $api(`/api/forum/post/cancel/${postId}/collect`, { method: 'DELETE' })
}



/**
 * 我收藏的帖子
 * /api/forum/post/my/collected
 * 参数 pageNumber
 * PageSize
 * 
 * 返回
 * {
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "postId": 3,
        "sectionId": 5,
        "sectionName": "宠物天地",
        "userId": 13,
        "userName": "李忠鹏",
        "userAvatar": "http://localhost:8080/api/uploads/avatar/20260105/4205702680134ff6bf36f0de81bf359d.png",
        "title": "新来的小猫咪",
        "contentSummary": "家里新来了一只小橘猫，超级可爱，大家来看看！",
        "firstImage": null,
        "viewCount": 200,
        "likeCount": 30,
        "commentCount": 12,
        "isTop": 0,
        "isEssence": 0,
        "createTime": "2026-01-06 10:20:22"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1,
    "pages": 1
  },
  "timestamp": 1767768666050
}
 */

export const getMyCollectedForumPostApi = (params: any) => {
  return $api('/api/forum/post/my/collected', { method: 'GET', params })
}


// ==================== 好友管理 ====================

/**
 * 获取好友列表
 * GET /api/friend/list
 * 
 * 参数：
 * - pageNum: 页码
 * - pageSize: 每页大小
 * 
 * 返回：
 * {
 *   "code": 200,
 *   "data": {
 *     "records": [{
 *       "friendId": 0,
 *       "friendUserId": 0,
 *       "friendUserName": "",
 *       "friendAvatar": "",
 *       "remark": "",
 *       "status": 1,  // 0-待确认 1-已同意 2-已拒绝
 *       "createTime": ""
 *     }],
 *     "total": 0
 *   }
 * }
 */
export const getFriendListApi = (params: any) => {
  return $api('/api/friend/list', {
    method: 'GET',
    params
  })
}

/**
 * 获取好友申请列表
 * GET /api/friend/requests
 * 
 * 参数：
 * - pageNum: 页码
 * - pageSize: 每页大小
 * 
 * 返回：同好友列表格式
 */
export const getFriendRequestsApi = (params: any) => {
  return $api('/api/friend/requests', {
    method: 'GET',
    params
  })
}

/**
 * 搜索用户
 * POST /api/friend/search
 * 
 * 参数：
 * {
 *   "keyword": "",      // 搜索关键词（手机号或姓名）
 *   "pageNum": 1,       // 页码
 *   "pageSize": 20      // 每页大小
 * }
 * 
 * 返回：
 * {
 *   "code": 200,
 *   "data": {
 *     "records": [{
 *       "userId": 1,
 *       "userName": "张三",
 *       "phone": "138****8000",
 *       "avatar": "https://xxx.com/avatar.jpg",
 *       "gender": 1,
 *       "age": 28,
 *       "friendStatus": 0  // 0-非好友，1-待审核，2-已是好友
 *     }],
 *     "total": 0
 *   }
 * }
 */
export const searchUsersApi = (data: any) => {
  return $api('/api/friend/search', {
    method: 'POST',
    body: data
  })
}

/**
 * 发送好友申请
 * POST /api/friend/request
 * 
 * 参数：
 * {
 *   "friendUserId": 0,  // 好友用户ID
 *   "remark": ""        // 好友备注（可选）
 * }
 */
export const sendFriendRequestApi = (data: any) => {
  return $api('/api/friend/request', {
    method: 'POST',
    body: data
  })
}

/**
 * 接受好友申请
 * POST /api/friend/{friendId}/accept
 * 
 * 参数：
 * - friendId: 好友关系ID
 */
export const acceptFriendRequestApi = (friendId: string | number) => {
  return $api(`/api/friend/${friendId}/accept`, {
    method: 'POST'
  })
}

/**
 * 拒绝好友申请
 * POST /api/friend/{friendId}/reject
 * 
 * 参数：
 * - friendId: 好友关系ID
 */
export const rejectFriendRequestApi = (friendId: string | number) => {
  return $api(`/api/friend/${friendId}/reject`, {
    method: 'POST'
  })
}

/**
 * 删除好友
 * DELETE /api/friend/{friendUserId}
 * 
 * 参数：
 * - friendUserId: 好友用户ID
 */
export const deleteFriendApi = (friendUserId: string | number) => {
  return $api(`/api/friend/${friendUserId}`, {
    method: 'DELETE'
  })
}


// ==================== 通知管理 ====================

/**
 * 获取通知列表
 * GET /api/notification/list
 * 
 * 参数：
 * - pageNum: 页码
 * - pageSize: 每页大小
 */
export const getNotificationListApi = (params: { pageNum?: number; pageSize?: number }) => {
  return $api('/api/notification/list', {
    method: 'GET',
    params
  })
}

/**
 * 标记通知已读
 * POST /api/notification/{notificationId}/read
 * 
 * 参数：
 * - notificationId: 通知ID
 */
export const markNotificationReadApi = (notificationId: number) => {
  return $api(`/api/notification/${notificationId}/read`, {
    method: 'POST'
  })
}

// ==================== 私信管理 ====================

/**
 * 发送私信
 * POST /api/message/send
 * 
 * 参数：
 * {
 *   "toUserId": 0,
 *   "content": ""
 * }
 */
export const sendMessageApi = (data: any) => {
  return $api('/api/message/send', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取聊天记录
 * GET /api/message/chat/{otherUserId}
 * 
 * 参数：
 * - otherUserId: 对方用户ID
 * - pageNum: 页码
 * - pageSize: 每页大小
 */
export const getChatHistoryApi = (otherUserId: string | number, params: any) => {
  return $api(`/api/message/chat/${otherUserId}`, {
    method: 'GET',
    params
  })
}

/**
 * 标记消息已读
 * POST /api/message/{messageId}/read
 */
export const markMessageReadApi = (messageId: string | number) => {
  return $api(`/api/message/${messageId}/read`, {
    method: 'POST'
  })
}

/**
 * 标记与某人的所有消息为已读
 * POST /api/message/read-all/{otherUserId}
 */
export const markAllMessagesReadApi = (otherUserId: string | number) => {
  return $api(`/api/message/read-all/${otherUserId}`, {
    method: 'POST'
  })
}

/**
 * 获取未读消息数量
 * GET /api/message/unread-count
 */
export const getUnreadCountApi = () => {
  return $api('/api/message/unread-count', {
    method: 'GET'
  })
}

/**
 * 检查用户在线状态
 * GET /api/message/online/{userId}
 */
export const checkUserOnlineApi = (userId: string | number) => {
  return $api(`/api/message/online/${userId}`, {
    method: 'GET'
  })
}

/**
 * 删除消息
 * DELETE /api/message/{messageId}
 */
export const deleteMessageApi = (messageId: string | number) => {
  return $api(`/api/message/${messageId}`, {
    method: 'DELETE'
  })
}


/**
 * 获取帖子详情
 * GET
/api/forum/post/get/{postId}
参数：postId
返回：

{
  "code": 200,
  "message": "操作成功",
  "data": {
    "postId": 1,
    "sectionId": 2,
    "sectionName": "邻里互助",
    "userId": 12,
    "userName": "余文俊",
    "userAvatar": "http://localhost:8080/api/uploads/avatar/20260106/542dd118364d4bde82daed941fb14cf6.webp",
    "title": "寻找丢失的钥匙",
    "content": "今天下午在小区花园丢失了一串钥匙，上面有小熊挂件，如有拾到请联系我，谢谢！",
    "images": null,
    "viewCount": 51,
    "likeCount": 5,
    "commentCount": 3,
    "collectCount": 1,
    "isTop": 0,
    "isEssence": 0,
    "isLiked": false,
    "isCollected": false,
    "createTime": "2026-01-06 10:20:22",
    "updateTime": "2026-01-07 15:05:26"
  },
  "timestamp": 1767836338864
}
*/

export const getForumPostDetailApi = (postId: string | number) => {
  return $api(`/api/forum/post/get/${postId}`, { method: 'GET' })
}

// ==================== 订单管理 API ====================

/**
 * 管理员查询所有订单（分页+筛选）
 * @param data 查询条件
 */
export const getAdminOrderListApi = (data: {
  orderType?: string
  status?: number
  orderNo?: string
  userId?: number
  startTime?: string
  endTime?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/orders/query', {
    method: 'POST',
    body: data
  })
}

/**
 * 管理员查询订单详情
 * @param orderId 订单ID
 */
export const getAdminOrderDetailApi = (orderId: number) => {
  return $api(`/api/admin/orders/${orderId}`, { method: 'GET' })
}

/**
 * 管理员处理订单
 * @param orderId 订单ID
 * @param data 处理数据
 */
export const handleAdminOrderApi = (orderId: number, data: {
  action: string // deliver-发货, complete-完成, refund-退款, cancel-取消
  remark?: string
}) => {
  return $api(`/api/admin/orders/${orderId}/handle`, {
    method: 'POST',
    body: data
  })
}

/**
 * 管理员获取订单统计
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const getAdminOrderStatisticsApi = (startTime?: string, endTime?: string) => {
  const params = new URLSearchParams()
  if (startTime) params.append('startTime', startTime)
  if (endTime) params.append('endTime', endTime)
  return $api(`/api/admin/orders/statistics${params.toString() ? '?' + params.toString() : ''}`, {
    method: 'GET'
  })
}

// ==================== 论坛管理 API ====================

/**
 * 删除帖子
 * @param postId 帖子ID
 */
export const deleteForumPostApi = (postId: number) => {
  return $api(`/api/forum/post/delete/${postId}`, { method: 'DELETE' })
}

/**
 * 更新帖子
 * @param postId 帖子ID
 * @param data 更新数据
 */
export const updateForumPostApi = (postId: number, data: {
  title: string
  content: string
  images?: string
}) => {
  return $api(`/api/forum/post/update/${postId}`, {
    method: 'PUT',
    body: data
  })
}

/**
 * 设置/取消帖子置顶
 * @param postId 帖子ID
 * @param isTop 是否置顶 0-否 1-是
 */
export const setForumPostTopApi = (postId: number, isTop: number) => {
  return $api(`/api/forum/post/${postId}/top?isTop=${isTop}`, {
    method: 'POST'
  })
}

/**
 * 设置/取消帖子精华
 * @param postId 帖子ID
 * @param isEssence 是否精华 0-否 1-是
 */
export const setForumPostEssenceApi = (postId: number, isEssence: number) => {
  return $api(`/api/forum/post/${postId}/essence?isEssence=${isEssence}`, {
    method: 'POST'
  })
}

// ==================== 论坛板块管理 API ====================

/**
 * 查询所有板块（分页）
 * @param data 查询参数
 */
export const queryForumSectionsApi = (data: {
  sectionName?: string
  status?: number
  pageNum: number
  pageSize: number
}) => {
  return $api('/api/admin/forum/section/query', {
    method: 'POST',
    body: data
  })
}

/**
 * 查询板块详情
 * @param sectionId 板块ID
 */
export const getForumSectionDetailApi = (sectionId: number) => {
  return $api(`/api/admin/forum/section/${sectionId}`, {
    method: 'GET'
  })
}

/**
 * 创建板块
 * @param data 板块数据
 */
export const createForumSectionApi = (data: {
  sectionName: string
  sectionDesc?: string
  iconUrl?: string
  sortOrder: number
  status: number
}) => {
  return $api('/api/admin/forum/section/create', {
    method: 'POST',
    body: data
  })
}

/**
 * 更新板块
 * @param sectionId 板块ID
 * @param data 板块数据
 */
export const updateForumSectionApi = (sectionId: number, data: {
  sectionName: string
  sectionDesc?: string
  iconUrl?: string
  sortOrder: number
  status: number
}) => {
  return $api(`/api/admin/forum/section/${sectionId}`, {
    method: 'PUT',
    body: data
  })
}

/**
 * 删除板块
 * @param sectionId 板块ID
 */
export const deleteForumSectionApi = (sectionId: number) => {
  return $api(`/api/admin/forum/section/${sectionId}`, {
    method: 'DELETE'
  })
}

/**
 * 启用/禁用板块
 * @param sectionId 板块ID
 * @param status 状态 0-禁用 1-启用
 */
export const toggleForumSectionStatusApi = (sectionId: number, status: number) => {
  return $api(`/api/admin/forum/section/${sectionId}/status?status=${status}`, {
    method: 'POST'
  })
}

/**
 * 获取板块统计
 */
export const getForumSectionStatisticsApi = () => {
  return $api('/api/admin/forum/section/statistics', {
    method: 'GET'
  })
}

// ==================== 通知管理 API ====================

/**
 * 查询所有通知（分页）
 * @param data 查询参数
 */
export const queryNotificationsApi = (data: {
  userId?: number
  type?: number
  isRead?: number
  keyword?: string
  startTime?: string
  endTime?: string
  pageNum: number
  pageSize: number
}) => {
  return $api('/api/admin/notification/query', {
    method: 'POST',
    body: data
  })
}

/**
 * 查询通知详情
 * @param notificationId 通知ID
 */
export const getNotificationDetailApi = (notificationId: number) => {
  return $api(`/api/admin/notification/${notificationId}`, {
    method: 'GET'
  })
}

/**
 * 发送通知
 * @param data 通知数据
 */
export const sendNotificationApi = (data: {
  userId?: number
  type: number
  title: string
  content: string
  relatedId?: number
}) => {
  return $api('/api/admin/notification/send', {
    method: 'POST',
    body: data
  })
}

/**
 * 删除通知
 * @param notificationId 通知ID
 */
export const deleteNotificationApi = (notificationId: number) => {
  return $api(`/api/admin/notification/${notificationId}`, {
    method: 'DELETE'
  })
}

/**
 * 批量删除通知
 * @param notificationIds 通知ID数组
 */
export const batchDeleteNotificationsApi = (notificationIds: number[]) => {
  return $api('/api/admin/notification/batch-delete', {
    method: 'POST',
    body: notificationIds
  })
}

/**
 * 获取通知统计
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const getNotificationStatisticsApi = (startTime?: string, endTime?: string) => {
  const params = new URLSearchParams()
  if (startTime) params.append('startTime', startTime)
  if (endTime) params.append('endTime', endTime)
  return $api(`/api/admin/notification/statistics${params.toString() ? '?' + params.toString() : ''}`, {
    method: 'GET'
  })
}

// ==================== 公告管理 API ====================

/**
 * 查询所有公告（分页）
 * @param data 查询参数
 */
export const queryAnnouncementsApi = (data: {
  keyword?: string
  publishUserId?: number
  startTime?: string
  endTime?: string
  pageNum: number
  pageSize: number
}) => {
  return $api('/api/admin/announcement/query', {
    method: 'POST',
    body: data
  })
}

/**
 * 查询公告详情（管理端）
 * @param announceId 公告ID
 */
export const getAdminAnnouncementDetailApi = (announceId: number) => {
  return $api(`/api/admin/announcement/${announceId}`, {
    method: 'GET'
  })
}

/**
 * 发布公告
 * @param data 公告数据
 */
export const publishAnnouncementApi = (data: {
  title: string
  content: string
}) => {
  return $api('/api/announcement/publish', {
    method: 'POST',
    body: data
  })
}

/**
 * 更新公告
 * @param announceId 公告ID
 * @param data 公告数据
 */
export const updateAnnouncementApi = (announceId: number, data: {
  title: string
  content: string
}) => {
  return $api(`/api/admin/announcement/${announceId}`, {
    method: 'PUT',
    body: data
  })
}

/**
 * 删除公告
 * @param announceId 公告ID
 */
export const deleteAnnouncementApi = (announceId: number) => {
  return $api(`/api/admin/announcement/${announceId}`, {
    method: 'DELETE'
  })
}

/**
 * 获取公告统计
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const getAnnouncementStatisticsApi = (startTime?: string, endTime?: string) => {
  const params = new URLSearchParams()
  if (startTime) params.append('startTime', startTime)
  if (endTime) params.append('endTime', endTime)
  return $api(`/api/admin/announcement/statistics${params.toString() ? '?' + params.toString() : ''}`, {
    method: 'GET'
  })
}

// ==================== 商品管理 API ====================

/**
 * 查询商品列表（管理端）
 * @param data 查询参数
 */
export const queryAdminProductsApi = (data: {
  categoryId?: number
  keyword?: string
  pageNum: number
  pageSize: number
}) => {
  return $api('/api/admin/products/list', {
    method: 'POST',
    body: data
  })
}

/**
 * 创建/更新商品
 * @param data 商品数据
 */
export const saveProductApi = (data: {
  productId?: number
  productName: string
  categoryId: number
  price: number
  originalPrice?: number
  stock: number
  coverImg: string
  detailImgs?: string[]
  description?: string
  status?: string
}) => {
  return $api('/api/admin/products', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取商品分类列表
 */
export const getProductCategoriesApi = () => {
  return $api('/api/admin/product-categories/list', {
    method: 'POST',
    body: {
      pageNo: 1,
      pageSize: 1000
    }
  })
}

// ==================== 门店管理 API ====================

/**
 * 查询门店列表（管理端）
 * @param data 查询参数
 */
export const queryAdminStoresApi = (data: {
  pageNum?: number
  pageSize?: number
  storeName?: string
  areaId?: number
  status?: number
  orderBy?: string
  isAsc?: boolean
}) => {
  return $api('/api/admin/stores/list', {
    method: 'POST',
    body: data
  })
}

// ==================== 门店商品管理 API ====================

/**
 * 分页查询门店商品列表
 * @param data 查询参数
 */
export const queryStoreProductsApi = (data: {
  storeId?: number
  productId?: number
  productName?: string
  storeName?: string
  status?: number
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/store-products/query', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取门店商品统计信息
 */
export const getStoreProductStatisticsApi = () => {
  return $api('/api/admin/store-products/statistics', {
    method: 'GET'
  })
}

/**
 * 添加门店商品
 * @param data 门店商品数据
 */
export const addStoreProductApi = (data: {
  storeId: number
  productId: number
  stock: number
  status?: number
}) => {
  return $api('/api/admin/store-products', {
    method: 'POST',
    body: data
  })
}

/**
 * 更新门店商品
 * @param data 门店商品数据
 */
export const updateStoreProductApi = (data: {
  id: number
  stock?: number
  status?: number
}) => {
  return $api('/api/admin/store-products', {
    method: 'PUT',
    body: data
  })
}

/**
 * 删除门店商品
 * @param id 门店商品ID
 */
export const deleteStoreProductApi = (id: number) => {
  return $api(`/api/admin/store-products/${id}`, {
    method: 'DELETE'
  })
}

/**
 * 批量删除门店商品
 * @param ids 门店商品ID列表
 */
export const batchDeleteStoreProductsApi = (ids: number[]) => {
  return $api('/api/admin/store-products/batch-delete', {
    method: 'DELETE',
    body: { ids }
  })
}

/**
 * 批量更新门店商品状态
 * @param ids 门店商品ID列表
 * @param status 状态
 */
export const batchUpdateStoreProductStatusApi = (ids: number[], status: number) => {
  return $api('/api/admin/store-products/batch-update-status', {
    method: 'PUT',
    body: { ids, status }
  })
}

/**
 * 获取门店商品详情
 * @param id 门店商品ID
 */
export const getStoreProductDetailApi = (id: number) => {
  return $api(`/api/admin/store-products/${id}`, {
    method: 'GET'
  })
}

// ==================== 报事维修管理 API ====================

/**
 * 查询报事维修列表（管理端）
 * @param data 查询参数
 */
export const queryRepairListApi = (data: {
  reportType?: string
  status?: number
  userId?: number
  keyword?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/repair/admin/list', {
    method: 'POST',
    body: data
  })
}

/**
 * 处理报事维修（管理端）
 * @param reportId 报事ID
 * @param data 处理数据
 */
export const handleRepairApi = (reportId: number, data: {
  status: number
  handleResult?: string
}) => {
  return $api(`/api/repair/admin/${reportId}/handle`, {
    method: 'PUT',
    body: data
  })
}

// ==================== 投诉管理 API ====================

/**
 * 查询投诉列表（管理端）
 * @param data 查询参数
 */
export const queryComplaintListApi = (data: {
  complaintType?: string
  status?: number
  userId?: number
  keyword?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/complaint/admin/list', {
    method: 'POST',
    body: data
  })
}

/**
 * 处理投诉（管理端）
 * @param complaintId 投诉ID
 * @param data 处理数据
 */
export const handleComplaintApi = (complaintId: number, data: {
  status: number
  handleResult: string
}) => {
  return $api(`/api/complaint/admin/${complaintId}/handle`, {
    method: 'PUT',
    body: data
  })
}

// ==================== 管理端-访客通行管理 API ====================

/**
 * 查询访客登记列表（管理端）
 * @param data 查询参数
 */
export const queryAdminVisitorListApi = (data: {
  status?: number
  userId?: number
  visitorName?: string
  visitorPhone?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/visitor/query', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取访客统计信息（管理端）
 */
export const getAdminVisitorStatisticsApi = () => {
  return $api('/api/admin/visitor/statistics', {
    method: 'GET'
  })
}

/**
 * 获取访客登记详情（管理端）
 * @param registerId 登记ID
 */
export const getAdminVisitorDetailApi = (registerId: number) => {
  return $api(`/api/admin/visitor/${registerId}`, {
    method: 'GET'
  })
}

/**
 * 删除访客登记（管理端）
 * @param registerId 登记ID
 */
export const deleteAdminVisitorApi = (registerId: number) => {
  return $api(`/api/admin/visitor/${registerId}`, {
    method: 'DELETE'
  })
}

/**
 * 批量删除访客登记（管理端）
 * @param ids 登记ID列表
 */
export const batchDeleteAdminVisitorApi = (ids: number[]) => {
  return $api('/api/admin/visitor/batch-delete', {
    method: 'POST',
    body: ids
  })
}

/**
 * 审核访客登记（管理端）
 * @param registerId 登记ID
 * @param data 审核数据
 */
export const auditAdminVisitorApi = (registerId: number, data: {
  status: number // 1-通过 2-拒绝
  rejectReason?: string
}) => {
  return $api(`/api/admin/visitor/${registerId}/audit`, {
    method: 'POST',
    body: data
  })
}

/**
 * 批量审核访客登记（管理端）
 * @param ids 登记ID列表
 * @param data 审核数据
 */
export const batchAuditAdminVisitorApi = (ids: number[], data: {
  status: number // 1-通过 2-拒绝
  rejectReason?: string
}) => {
  return $api('/api/admin/visitor/batch-audit', {
    method: 'POST',
    body: ids,
    params: data
  })
}

// ==================== 管理端-车位管理 API ====================

/**
 * 查询车位列表（管理端）
 * @param params 查询参数
 */
export const queryAdminParkingListApi = (params: {
  spaceNo?: string
  carNumber?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/parking/list', {
    method: 'GET',
    params
  })
}

/**
 * 获取车位统计信息（管理端）
 */
export const getAdminParkingStatisticsApi = () => {
  return $api('/api/admin/parking/statistics', {
    method: 'GET'
  })
}

/**
 * 获取车位详情（管理端）
 * @param spaceId 车位ID
 */
export const getAdminParkingDetailApi = (spaceId: number) => {
  return $api(`/api/admin/parking/${spaceId}`, {
    method: 'GET'
  })
}

/**
 * 删除车位（管理端）
 * @param spaceId 车位ID
 */
export const deleteAdminParkingApi = (spaceId: number) => {
  return $api(`/api/admin/parking/${spaceId}`, {
    method: 'DELETE'
  })
}

/**
 * 批量删除车位（管理端）
 * @param ids 车位ID列表
 */
export const batchDeleteAdminParkingApi = (ids: number[]) => {
  return $api('/api/admin/parking/batch-delete', {
    method: 'POST',
    body: ids
  })
}

/**
 * 审核车位申请（管理端）
 * @param spaceId 车位ID
 * @param data 审核数据
 */
export const auditAdminParkingApi = (spaceId: number, data: {
  status: number // 1-通过 2-拒绝
  rejectReason?: string
}) => {
  return $api(`/api/admin/parking/${spaceId}/audit`, {
    method: 'POST',
    body: data
  })
}

/**
 * 批量审核车位申请（管理端）
 * @param ids 车位ID列表
 * @param data 审核数据
 */
export const batchAuditAdminParkingApi = (ids: number[], data: {
  status: number // 1-通过 2-拒绝
  rejectReason?: string
}) => {
  return $api('/api/admin/parking/batch-audit', {
    method: 'POST',
    body: ids,
    params: data
  })
}

// ==================== 管理端-数据看板 ====================

/**
 * 获取完整数据看板
 * 获取后台首页所有统计数据，包含用户、订单、报修投诉、车位访客、物业费、论坛等多维度数据
 */
export const getAdminDashboardApi = () => {
  return $api('/api/admin/dashboard', {
    method: 'GET'
  })
}

/**
 * 获取用户统计数据
 */
export const getAdminDashboardUserApi = () => {
  return $api('/api/admin/dashboard/user', {
    method: 'GET'
  })
}

/**
 * 获取订单统计数据
 */
export const getAdminDashboardOrderApi = () => {
  return $api('/api/admin/dashboard/order', {
    method: 'GET'
  })
}

/**
 * 获取报修投诉统计数据
 */
export const getAdminDashboardServiceApi = () => {
  return $api('/api/admin/dashboard/service', {
    method: 'GET'
  })
}

/**
 * 获取车位访客统计数据
 */
export const getAdminDashboardSecurityApi = () => {
  return $api('/api/admin/dashboard/security', {
    method: 'GET'
  })
}

/**
 * 获取物业费统计数据
 */
export const getAdminDashboardPropertyFeeApi = () => {
  return $api('/api/admin/dashboard/property-fee', {
    method: 'GET'
  })
}

/**
 * 获取论坛统计数据
 */
export const getAdminDashboardForumApi = () => {
  return $api('/api/admin/dashboard/forum', {
    method: 'GET'
  })
}

// ==================== 管理端-物业费管理 ====================

/**
 * 获取物业费统计数据
 */
export const getAdminPropertyFeeStatisticsApi = () => {
  return $api('/api/admin/property-fee/statistics', {
    method: 'GET'
  })
}

/**
 * 查询账单列表
 */
export const getAdminPropertyFeeBillsApi = (data: {
  userId?: number
  userName?: string
  billingPeriod?: string
  status?: number
  overdue?: boolean
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/property-fee/bills/list', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取账单详情
 */
export const getAdminPropertyFeeBillDetailApi = (billId: number) => {
  return $api(`/api/admin/property-fee/bills/${billId}`, {
    method: 'GET'
  })
}

/**
 * 更新账单
 */
export const updateAdminPropertyFeeBillApi = (billId: number, data: {
  propertyFee?: number
  waterFee?: number
  electricityFee?: number
  gasFee?: number
  parkingFee?: number
  otherFee?: number
  dueDate?: string
}) => {
  return $api(`/api/admin/property-fee/bills/${billId}`, {
    method: 'PUT',
    body: data
  })
}

/**
 * 删除账单
 */
export const deleteAdminPropertyFeeBillApi = (billId: number) => {
  return $api(`/api/admin/property-fee/bills/${billId}`, {
    method: 'DELETE'
  })
}

/**
 * 生成单个账单
 */
export const generateAdminPropertyFeeBillApi = (data: {
  userId: number
  billingPeriod: string
  propertyFee?: number
  waterFee?: number
  electricityFee?: number
  gasFee?: number
  parkingFee?: number
  otherFee?: number
  dueDate?: string
}) => {
  return $api('/api/admin/property-fee/bills/generate', {
    method: 'POST',
    body: data
  })
}

/**
 * 批量生成账单
 */
export const batchGenerateAdminPropertyFeeBillApi = (data: {
  userIds?: number[]
  billingPeriod: string
  propertyFee?: number
  waterFee?: number
  electricityFee?: number
  gasFee?: number
  parkingFee?: number
  otherFee?: number
  dueDate: string
  skipExistingBill?: boolean
}) => {
  return $api('/api/admin/property-fee/bills/batch-generate', {
    method: 'POST',
    body: data
  })
}

/**
 * 批量删除账单
 */
export const batchDeleteAdminPropertyFeeBillApi = (billIds: number[]) => {
  return $api('/api/admin/property-fee/bills/batch-delete', {
    method: 'POST',
    body: billIds
  })
}

/**
 * 获取逾期账单列表
 */
export const getAdminPropertyFeeOverdueBillsApi = (params: {
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/property-fee/bills/overdue', {
    method: 'GET',
    params
  })
}

/**
 * 发送催缴通知
 */
export const sendPropertyFeeReminderApi = (billIds: number[]) => {
  return $api('/api/admin/property-fee/bills/send-reminder', {
    method: 'POST',
    body: billIds
  })
}

/**
 * 查询缴费记录
 */
export const getAdminPropertyFeePaymentsApi = (data: {
  userId?: number
  paymentMethod?: string
  status?: number
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}) => {
  return $api('/api/admin/property-fee/payments/list', {
    method: 'POST',
    body: data
  })
}

// ========== 用户角色管理 ==========

/**
 * 获取管理后台用户列表
 */
export const getAdminUsersApi = (params: {
  page: number
  size: number
  keyword?: string
  status?: number
  userType?: number
}) => {
  return $api('/api/admin/users', {
    method: 'GET',
    params
  })
}

/**
 * 获取管理后台用户详情
 */
export const getAdminUserDetailsApi = (userId: string | number) => {
  return $api(`/api/admin/users/${userId}`, {
    method: 'GET'
  })
}

/**
 * 更新用户状态（冻结/解冻）
 */
export const updateAdminUserStatusApi = (userId: string | number, status: number) => {
  return $api(`/api/admin/users/${userId}/status`, {
    method: 'PUT',
    body: { status }
  })
}

/**
 * 删除用户
 */
export const deleteAdminUserApi = (userId: string | number) => {
  return $api(`/api/admin/users/${userId}`, {
    method: 'DELETE'
  })
}

/**
 * 获取所有角色列表
 */
export const getRoleListApi = () => {
  return $api('/api/permission/role/list', {
    method: 'GET'
  })
}

/**
 * 为用户分配角色
 * @param data 包含 userId 和 roleIds 的请求体
 */
export const assignUserRolesApi = (data: {
  userId: number
  roleIds: number[]
}) => {
  return $api('/api/permission/user/assign-roles', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取角色的角色列表
 * @param userId 用户ID
 */
export const getUserRolesApi = (userId: number) => {
  return $api(`/api/permission/user/${userId}/roles`, {
    method: 'GET'
  })
}

// ========== 角色与权限管理 ==========

/**
 * 获取所有权限列表
 */
export const getPermissionListApi = () => {
  return $api('/api/permission/list', {
    method: 'GET'
  })
}

/**
 * 获取角色拥有的权限列表
 */
export const getRolePermissionsApi = (roleId: number) => {
  return $api(`/api/permission/role/${roleId}/permissions`, {
    method: 'GET'
  })
}

/**
 * 创建新角色
 */
export const createRoleApi = (data: {
  roleName: string
  roleCode: string
  description?: string
  status: number
}) => {
  return $api('/api/permission/role/create', {
    method: 'POST',
    body: data
  })
}

/**
 * 更新角色信息
 */
export const updateRoleApi = (roleId: number, data: {
  roleName: string
  roleCode: string
  description?: string
  status: number
}) => {
  return $api(`/api/permission/role/${roleId}`, {
    method: 'PUT',
    body: data
  })
}

/**
 * 删除角色
 */
export const deleteRoleApi = (roleId: number) => {
  return $api(`/api/permission/role/${roleId}`, {
    method: 'DELETE'
  })
}

/**
 * 为角色分配权限
 */
export const assignRolePermissionsApi = (data: {
  roleId: number
  permissionIds: number[]
}) => {
  return $api('/api/permission/role/assign-permissions', {
    method: 'POST',
    body: data
  })
}

/**
 * 创建新权限
 */
export const createPermissionApi = (data: {
  permissionName: string
  permissionCode: string
  resourceType: string
  description?: string
  status: number
}) => {
  return $api('/api/permission/create', {
    method: 'POST',
    body: data
  })
}

/**
 * 更新权限信息
 */
export const updatePermissionApi = (permissionId: number, data: {
  permissionName: string
  permissionCode: string
  resourceType: string
  description?: string
  status: number
}) => {
  return $api(`/api/permission/${permissionId}`, {
    method: 'PUT',
    body: data
  })
}

/**
 * 删除权限
 */
export const deletePermissionApi = (permissionId: number) => {
  return $api(`/api/permission/${permissionId}`, {
    method: 'DELETE'
  })
}