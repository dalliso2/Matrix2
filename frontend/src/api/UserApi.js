import { api } from './BaseApi';

const userApi = api.enhanceEndpoints({addTagTypes:['User','CurrentUser']}).injectEndpoints({
    //entityTypes: ['currentUser','user'],
    endpoints: (builder) => ({
        searchUsers: builder.query({
            query: (filter) => ({url:`/user/search/${filter}`}),
            transformResponse: (response, meta, arg) => 
            {
                console.log(response);
                return response || [];
            },
            providesTags: (result, error, filter) => result?[...result.payload.map(({id}) => ({type: 'User', id}))]:[],
            keepUnusedDataFor: 300
        }),
        getUser: builder.query({
            query: (id) => ({url:`/user/${id}`}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, id) => result?[{type: 'User', id:result.payload.id}]:[],
            keepUnusedDataFor: 300
        }),
        getCurrentUser: builder.query({
            query: () => '/user/current',
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: ['CurrentUser'],
            keepUnusedDataFor: 300
        }),
        storeUser: builder.mutation({
            query: (data) => ({url: '/user/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, data) => result?[{type: 'User', id:result.payload.id}]:[],
        }),
        setUserDarkTheme: builder.mutation({
            query: (darkThemeBoolean) => ({
                url: '/user/theme',
                method: 'PATCH',
                body: { darkTheme: darkThemeBoolean },
            }),
            invalidatesTags: (result, error, data) => [{type: 'CurrentUser'}],
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/user/password',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, data) => [{type: 'CurrentUser'}],
        }),
    }),
    overrideExisting: false,
});

export const {  useLazySearchUsersQuery,
                useGetCurrentUserQuery, 
                useSetUserDarkThemeMutation, 
                useUpdatePasswordMutation,
                useStoreUserMutation,
                useGetUserQuery,
                } = userApi;