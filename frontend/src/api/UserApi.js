import { api } from './BaseApi';

const userApi = api.enhanceEndpoints({addTagTypes:['User']}).injectEndpoints({
    //entityTypes: ['currentUser','user'],
    endpoints: (builder) => ({
        login: builder.query({
            query: (credentials) => ({url: '/login', method: 'POST', body: credentials}),
            transformResponse: (response, meta, arg) => 
            {
                console.log("login",response);
                return response || [];
            },
            providesTags: (result, error, arg) => {
                console.log("login - providesTags",result.payload?.user?[{type: 'User', id:result.payload.user.id}]:[]);
                return result.payload?.user?[{type: 'User', id:result.payload.user.id}]:[]
            },
        }),   
        refreshCredentials: builder.query({
            query: (credentials) => ({url: '/refresh-credentials', method: 'POST', body: credentials}),
            transformResponse: (response, meta, arg) => 
            {
                return response || [];
            },
        }),       
        searchUsers: builder.query({
            query: (filter) => ({url:`/user/search/${filter}`}),
            transformResponse: (response, meta, arg) => 
            {
                console.log("searchUsers",response);    
                return response || [];
            },
            providesTags: (result, error, arg) => 
            {
                console.log("searchUsers - providesTags",result.payload?.map(user => ({type: 'User', id:user.id})));
                return result.payload?.map(user => ({type: 'User', id:user.id}))
            },
        }),
        getUser: builder.query({
            query: (id) => ({url:`/user/${id}`}),
            transformResponse: (response, meta, arg) => 
            {
                console.log("getUser",response);
                return response;
            },
            providesTags: (result, error, id) => result?[{type: 'User', id:result.payload.id}]:[],
            keepUnusedDataFor: 300
        }),
        getCurrentUser: builder.query({
            query: () => '/user/current',
            transformResponse: (response, meta, arg) => 
            {
                console.log("getCurrentUser",response);
                return response;
            },
            providesTags: (result, error, id) => result?[{type: 'User', id:result.payload.id}]:[],
        }),
        storeUser: builder.mutation({
            query: (data) => ({url: '/user/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, arg) => 
            {
                console.log("storeUser - invalidating tags ",result.payload?[{type: 'User', id:result.payload.id}]:[]);
                return result.payload?[{type: 'User', id:result.payload.id}]:[];
            },
        }),
        setUserDarkTheme: builder.mutation({
            query: (darkThemeBoolean) => ({
                url: '/user/theme',
                method: 'PATCH',
                body: { darkTheme: darkThemeBoolean },
            }),
            transformResponse: (response, meta, arg) => 
            {
                console.log("setUserDarkTheme",response);
                return response;
            },
            invalidatesTags: (result, error, arg) => 
            {
                console.log("setUserDarkTheme - invalidating tags ",result.payload?[{type: 'User', id:user.id}]:[]);
                return result.payload?[{type: 'User', id:user.id}]:[]
            },
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/user/password',
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (response, meta, arg) => 
            {
                console.log("updatePassword",response);
                return response;
            },            
            invalidatesTags: (result, error, arg) => result.payload?[{type: 'User', id:user.id}]:[],
        }),
    }),
    overrideExisting: false,
});

export const {  useLazySearchUsersQuery,
                useLazyGetCurrentUserQuery, 
                useGetCurrentUserQuery, 
                useSetUserDarkThemeMutation, 
                useUpdatePasswordMutation,
                useStoreUserMutation,
                useGetUserQuery,
                useLazyLoginQuery,
                useLazyRefreshCredentialsQuery
                } = userApi;