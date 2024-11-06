import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../services/api'

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}` }),
    tagTypes: ["Chat", "User", "Message"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "/chat/get-chat",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),
        searchUserc: builder.query({
            query: (name) => ({
                url: `/user/search?name=${name}`,
                credentials: "include",
            }),
            providesTags: ["User"],
        }),
        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/sendrequest",
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
        getNotification: builder.query({
            query: () => ({
                url: "/user/my-notification",
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        }),
        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/acceptrequest",
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
        chatDetails: builder.query({
            query: ({ chatId, populate }) => {
                let url = `/chat/${chatId}?populate=${populate}`;
                return ({
                    url,
                    credentials: "include",
                })
            },
            providesTags: ["Chat"],
        }),
        getMessages: builder.query({
            query: ({ chatId, page }) => ({
                url: `/chat/message/${chatId}?page=${page}`,
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        }),
        sendAttachments: builder.mutation({
            query: (data) => ({
                url: "/chat/message",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        myGroups: builder.query({
            query: () => ({
                url: "/chat/get-group",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),
        availableFriends: builder.query({
            query: (chatId) => {
                let url = `/user/my-friends${chatId ? `?chatId=${chatId}` : ""}`
                return ({
                    url,
                    credentials: "include",
                })
            },
            providesTags: ["Chat"],
        }),
        newGroup: builder.mutation({
            query: (data) => ({
                url: "/chat/new",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
        renameGroupName: builder.mutation({
            query: ({ chatId, name }) => ({
                url: `/chat/${chatId}`,
                method: "PUT",
                body: { name },
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
        removeGroupMember: builder.mutation({
            query: ({ chatId, userId }) => ({
                url: `/chat/remove-members`,
                method: "PUT",
                body: { chatId, userId },
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
        addGroupMember: builder.mutation({
            query: ({ chatId, members }) => ({
                url: `/chat/add-members`,
                method: "PUT",
                body: { chatId, members },
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/chat/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `/chat/leave-group/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"],
        }),
    }),
});

export default api;
export const {
    useMyChatsQuery,
    useLazySearchUsercQuery,
    useSendFriendRequestMutation,
    useGetNotificationQuery,
    useAcceptFriendRequestMutation,
    useChatDetailsQuery,
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupNameMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMemberMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
} = api;