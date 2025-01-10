import { api } from './BaseApi';
import { onQueryStartedHandler, getTags } from './ApiUtils';

const caseApi = api.enhanceEndpoints({addTagTypes:['matrixCase','caseUserList','matrixCases','castList']})
                    .injectEndpoints({
    endpoints: (builder) => ({
        searchCases: builder.query({
            query: (searchText) => ({url: `/case/search?searchText=${searchText}`, method: 'GET'}),
            providesTags: (result, error, data) => getTags('matrixCase',result?.payload),
            keepUnusedDataFor: 300,
            async onQueryStarted(id,{queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId );
            },
        }),
        storeCase: builder.mutation({
            query: (data) => ({url: '/case/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, data) => getTags('matrixCase', result?.payload),
            async onQueryStarted(data,{queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving case " + data.name);
            },
        }),
        getCase: builder.query({
            query: (id) => ({url: `/case/${id}`, method: 'GET',}),
            providesTags: (result, error, data) => getTags('matrixCase',result?.payload),
            keepUnusedDataFor: 300,
            async onQueryStarted(id,{queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId );
            },
            keepUnusedDataFor: 300,
        }),
        getUserCaseList: builder.query({
            query: () => ({url:'/user/case_list', method: 'GET'}),
            providesTags: (result = [], error, id) => ['caseList'],
            keepUnusedDataFor: 300,
            async onQueryStarted(id,{queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId );
            },
        }),
        getCaseUsers: builder.query({
            query: (caseId) => ({url:`/case/users/${caseId}`, method: 'GET'}),
            providesTags: (result, error, caseId) => [{type:'caseUserList', id:caseId}],
            async onQueryStarted(caseId,{queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId );
            },
            keepUnusedDataFor: 300,
        }),
        // params = {ucr:{userId, caseId, roleId}, filterString} - filterString is optional
        addUserToCase: builder.mutation({
            query: (params) => ({url: '/case/users/add_update', method: 'POST', body: params.ucr}),
            // if filterstring is not provided, the mutation will invalidate all caseUserList tags
            invalidatesTags: (result, error, params) => params?.filterString?[{type:'caseUserList', id:params.ucr.caseId}]:[],
            async onQueryStarted( params,{queryFulfilled, dispatch, requestId}) {
                const newUcr = params.ucr;
                const patchGetCaseUsersResult = dispatch(api.util.updateQueryData('getCaseUsers', newUcr.caseId, (draft) => {
                    const existingUser = draft.payload.find(ucr => ucr.userId === newUcr.userId);
                    if (existingUser)
                        existingUser.roleId = newUcr.roleId;
                }));
                const patchSearchUsers = dispatch(api.util.updateQueryData('searchUsers', params.filterString, (draft) => {
                    draft.payload = draft.payload.filter(user => user.id !== newUcr.userId);
                }));
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined, undefined, ()=>{patchGetCaseUsersResult.undo();patchSearchUsers.undo();});
            },
        }),
        // storeUserCaseRole: builder.mutation({
        //     query: (ucr) => ({url: '/ucr/store', method: 'POST', body: ucr}),
        //     async onQueryStarted( newUcr,{queryFulfilled, dispatch, requestId}) {
        //         const patchResult = dispatch(api.util.updateQueryData('getCaseUsers', newUcr.caseId, (draft) => {   
        //             console.log("111111111111111111111111");
        //             console.log(newUcr);
        //             draft.payload.find(ucr => ucr.userId === newUcr.userId).roleId = newUcr.roleId;
        //         }));
        //         onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined, undefined, ()=>patchResult.undo());
        //     },
        // }),
        // addUserCaseRole: builder.mutation({
        //     query: (ucr) => ({url: '/ucr/store', method: 'POST', body: ucr}),
        //     invalidatesTags: (result, error, data) => [{type:'caseUserList', id:data.caseId}],
        // }),
        removeUserFromCase: builder.mutation({
            query: (data) => ({url: '/case/users/remove', method: 'DELETE', body: data.ucr}),
            invalidatesTags: (result, error, data) => [{type:'caseUsers', id:data.caseId}],
            async onQueryStarted( {ucr},{queryFulfilled, dispatch, requestId}) {
                const patchResult = dispatch(api.util.updateQueryData('getCaseUsers', ucr.caseId, (draft) => {
                    draft.payload = draft.payload.filter(userRec => userRec.userId !== ucr.userId);
                }));
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined, undefined, ()=>patchResult.undo());
            },
        }),
    }),
    overrideExisting: false,
});

export const {  useStoreCaseMutation,
                useGetCaseQuery,
                useGetUserCaseListQuery, 
                useLazyGetUserCaseListQuery,
                useLazySearchCasesQuery,
                useGetCaseUsersQuery,
                useAddUserToCaseMutation,
                //useStoreUserCaseRoleMutation,
                //useAddUserCaseRoleMutation,
                useRemoveUserFromCaseMutation,
                } = caseApi;