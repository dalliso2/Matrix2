import { setCurrentUser } from '../state/AppSlice';
import { api } from './BaseApi';
import { onQueryStartedHandler, getTags } from './ApiUtils';

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
            //providesTags: (result, error, arg) => result?.payload?[{type: 'User', id:result.payload.user.id}]:[],
            providesTags: (result, error, arg) => getTags('User', result?.payload?.user?.id),
        }),   
        searchUsers: builder.query({
            query: (filter) => ({url:`/user/search/${filter}`}),
            transformResponse: (response, meta, arg) => 
            {
                console.log("searchUsers",response);    
                return response || [];
            },
            providesTags: (result, error, arg) => result?.payload?result.payload.map(user => ({type: 'User', id:user.id})):[],
            keepUnusedDataFor: 300,
            async onQueryStarted(filter, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined);
            }
        }),
        // getUser: builder.query({
        //     query: (id) => ({url:`/user/${id}`}),
        //     transformResponse: (response, meta, arg) => 
        //     {
        //         console.log("getUser",response);
        //         return response;
        //     },
        //     providesTags: (result, error, id) => result?[{type: 'User', id:result.payload.id}]:[],
        //     async onQueryStarted(id , { dispatch, queryFulfilled, requestId }) {
        //         onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined);
        //     },
        //     keepUnusedDataFor: 300
        // }),
        // getCurrentUser: builder.query({
        //     query: () => '/user/current',
        //     transformResponse: (response, meta, arg) => 
        //     {
        //         console.log("getCurrentUser",response);
        //         return response;
        //     },
        //     async onQueryStarted(undefined , { dispatch, queryFulfilled, requestId }) {
        //         onQueryStartedHandler(queryFulfilled, dispatch, requestId );
        //     },
        //     providesTags: (result, error, id) => result?.payload?.id?[{type: 'User', id:result.payload.id}]:[],
        // }),
        storeUser: builder.mutation({
            query: (userData) => ({url: '/user/store', method: 'POST', body: userData}),
            async onQueryStarted(userData , { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving user " + userData.username);
            },
            invalidatesTags: (result, error, arg) => result?.payload?[{type: 'User', id:result.payload.id}]:[],
        }),
        setUserDarkTheme: builder.mutation({
            query: (darkThemeBoolean) => ({
                url: '/user/theme',
                method: 'PATCH',
                body: { darkTheme: darkThemeBoolean },
            }),
            invalidatesTags: (result, error, arg) => result?.payload?[{type: 'User', id:result.payload.id}]:[],
            async onQueryStarted(arg,{queryFulfilled, dispatch, requestId, getState}) {
                // optimistic update
                dispatch(setCurrentUser({...getState().app.currentUser, darkTheme:arg}));
                onQueryStartedHandler(queryFulfilled, dispatch, requestId);
            },
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: '/user/password',
                method: 'PATCH',
                body: data,
            }),
            async onQueryStarted(data,{queryFulfilled, dispatch, requestId, getState}) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId);
            },
            invalidatesTags: (result, error, arg) => result?.payload?[{type: 'User', id:user.id}]:[],
        }),
    }),
    overrideExisting: false,
});

export const {  useLazySearchUsersQuery,
                //useLazyGetCurrentUserQuery, 
                //useGetCurrentUserQuery, 
                useSetUserDarkThemeMutation, 
                useUpdatePasswordMutation,
                useStoreUserMutation,
                useGetUserQuery,
                useLazyLoginQuery,
                //useLazyRefreshCredentialsQuery
                } = userApi;