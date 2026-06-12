import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
    state: () => ({
        sessionId: null as string | number | null,
        sessionTitle: '' as string,
        isSidebarExpanded: true,
    }),
    actions: {
        setSession(id: string | number, title: string = '') {
            this.sessionId = id
            this.sessionTitle = title
        },
        updateTitle(title: string) {
            this.sessionTitle = title
        },
        clearSession() {
            this.sessionId = null
            this.sessionTitle = ''
        }
    }
})
