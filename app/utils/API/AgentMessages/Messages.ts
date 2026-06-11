import { $agentApi } from '~/utils/API/agent'

export const MessagesApi = {
    /**
     * 创建新会话
     * @param payload 包含标题等信息
     */
    createSession: (payload: { content: string, title?: string }) => {
        return $agentApi('/create_new_session', {
            method: 'POST',
            body: payload
        })
    }
}

export const get_session_messages = (sessionId: string | number) => {
    return $agentApi('/message/get-all-messages', {
        method: 'GET',
        query: {
            session_id: sessionId
        }
    });
}

//删除会话
// export const deleteSession = (session_id: string | number) => {
//     return $agentApi('/delete-session', {
//         method: 'DELETE',
//         query: {
//             session_id: session_id
//         }
//     });
// }
export const deleteSession = (session_id: string | number) => {
    return $agentApi('/delete-session', {
        method: 'DELETE',
        params: { session_id }
    })
}
