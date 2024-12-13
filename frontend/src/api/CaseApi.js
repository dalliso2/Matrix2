import { api } from './BaseApi';
import { onQueryStartedHandler, getTags } from './ApiUtils';

const caseApi = api.enhanceEndpoints({addTagTypes:['matrixCase','caseUserList','matrixCases','castList']})
                    .injectEndpoints({
    endpoints: (builder) => ({
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
            query: (id) => ({url:'/user/case_list', method: 'GET'}),
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
        storeUserCaseRole: builder.mutation({
            query: (ucr) => ({url: '/ucr/store', method: 'POST', body: ucr}),
            async onQueryStarted( newUcr,{queryFulfilled, dispatch, requestId}) {
                const patchResult = dispatch(api.util.updateQueryData('getCaseUsers', newUcr.caseId, (draft) => {
                    draft.payload.find(ucr => ucr.userId === newUcr.userId).roleId = newUcr.roleId;
                }));
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined, undefined, ()=>patchResult.undo());
            },
        }),
        addUserCaseRole: builder.mutation({
            query: (ucr) => ({url: '/ucr/store', method: 'POST', body: ucr}),
            invalidatesTags: (result, error, data) => [{type:'caseUserList', id:data.caseId}],
        }),
        deleteUserCaseRole: builder.mutation({
            query: (data) => ({url: '/ucr/delete', method: 'DELETE', body: data}),
            invalidatesTags: (result, error, data) => [{type:'caseUsers', id:data.caseId}],
            async onQueryStarted( deletedUcr,{queryFulfilled, dispatch, requestId}) {
                const patchResult = dispatch(api.util.updateQueryData('getCaseUsers', deletedUcr.caseId, (draft) => {
                    const removeId = draft.payload.findIndex(ucr => ucr.userId === deletedUcr.userId);
                    if (removeId >= 0)
                        draft.payload.splice(removeId,1);
                }));
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined, undefined, ()=>patchResult.undo());
            },
        }),
    }),
    overrideExisting: false,
});

export const {  useStoreCaseMutation,
                useGetUserCaseListQuery, 
                useLazyGetUserCaseListQuery,
                useGetCaseQuery,
                useGetCaseUsersQuery,
                useStoreUserCaseRoleMutation,
                useAddUserCaseRoleMutation,
                useDeleteUserCaseRoleMutation,
                } = caseApi;