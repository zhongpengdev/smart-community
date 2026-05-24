
import { useDebounceFn } from '@vueuse/core'
import { getCommunityNewsApi, getForumPostListApi } from '~/utils/api'

/**
 * 搜索结果接口
 */
export interface SearchResult {
    id: string | number
    type: 'service' | 'news' | 'forum'
    title: string
    description?: string
    icon?: string
    path: string
    category?: string
    // 额外字段用于展示
    image?: string
    timestamp?: string
}

interface SearchState {
    query: string
    loading: boolean
    results: {
        services: SearchResult[]
        news: SearchResult[]
        forum: SearchResult[]
    }
    isOpen: boolean
    hasSearched: boolean // 新增：是否执行过搜索
}

/**
 * 静态服务列表
 */
const staticServices = [
    { name: '社区论坛', path: '/service/community/forum', icon: 'lucide:layout-grid', desc: '邻里交流互动' },
    { name: '通知公告', path: '/service/community/news', icon: 'lucide:megaphone', desc: '查看社区最新消息' },
    { name: '物业缴费', path: '/service/community/payment', icon: 'lucide:credit-card', desc: '在线缴纳物业费' },
    { name: '报修投诉', path: '/service/community/issues', icon: 'lucide:wrench', desc: '在线报修与投诉建议' },
    { name: '停车服务', path: '/service/community/parking', icon: 'lucide:car', desc: '车位管理与缴费' },
    { name: '访客管理', path: '/service/community/visitors', icon: 'lucide:users', desc: '访客预约登记' },
    { name: '我的好友', path: '/service/community/friends', icon: 'lucide:user', desc: '社区好友管理' },
    { name: '我的钱包', path: '/wallet', icon: 'lucide:wallet', desc: '充值与消费记录' },
    { name: '个人信息', path: '/profile', icon: 'lucide:user-circle', desc: '个人资料设置' }
]

// 全局共享状态
const searchState = reactive<SearchState>({
    query: '',
    loading: false,
    results: {
        services: [],
        news: [],
        forum: []
    },
    isOpen: false,
    hasSearched: false // 新增：是否执行过搜索
})

export const useGlobalSearch = () => {

    // 搜索静态服务
    const searchStaticServices = async (keyword: string): Promise<SearchResult[]> => {
        if (!keyword) return []
        return staticServices
            .filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()))
            .map((item, index) => ({
                id: `service-${index}`,
                type: 'service',
                title: item.name,
                description: item.desc,
                icon: item.icon,
                path: item.path
            }))
    }

    // 搜索新闻公告
    const searchNews = async (keyword: string): Promise<SearchResult[]> => {
        try {
            if (!keyword) return []
            const res: any = await getCommunityNewsApi({
                keyword,
                pageNum: 1,
                pageSize: 5
            })
            if (res.code === 200 && res.data?.records) {
                return res.data.records.map((item: any) => ({
                    id: item.announcementId || item.announceId || item.id,
                    type: 'news',
                    title: item.title,
                    description: item.summary || item.content?.substring(0, 50),
                    path: `/service/community/news/${item.announcementId || item.announceId || item.id}`,
                    timestamp: item.createTime
                }))
            }
            return []
        } catch (e) {
            console.error('Search news error:', e)
            return []
        }
    }

    // 搜索论坛帖子
    const searchForumPosts = async (keyword: string): Promise<SearchResult[]> => {
        try {
            if (!keyword) return []
            const res: any = await getForumPostListApi({
                keyword,
                pageNo: 1,
                pageSize: 5,
                sortBy: 'latest'
            })
            if (res.code === 200 && res.data?.records) {
                return res.data.records.map((item: any) => ({
                    id: item.postId,
                    type: 'forum',
                    title: item.title,
                    description: item.contentSummary,
                    path: `/service/community/forum/post/${item.postId}`,
                    image: item.firstImage,
                    category: item.sectionName
                }))
            }
            return []
        } catch (e) {
            console.error('Search forum error:', e)
            return []
        }
    }

    // 执行搜索
    const performSearch = async () => {
        const keyword = searchState.query
        if (!keyword.trim()) {
            searchState.results = { services: [], news: [], forum: [] }
            return
        }

        searchState.loading = true
        searchState.hasSearched = true
        searchState.isOpen = true


        try {
            const [servicesResults, newsResults, forumResults] = await Promise.all([
                searchStaticServices(keyword),
                searchNews(keyword),
                searchForumPosts(keyword)
            ])

            searchState.results = {
                services: servicesResults,
                news: newsResults,
                forum: forumResults
            }
        } catch (error) {
            console.error('Global search error:', error)
        } finally {
            searchState.loading = false
        }
    }

    // 清空搜索
    const clearSearch = () => {
        searchState.query = ''
        searchState.results = { services: [], news: [], forum: [] }
        searchState.isOpen = false
        searchState.hasSearched = false
    }

    return {
        searchState,
        performSearch,
        clearSearch
    }
}
