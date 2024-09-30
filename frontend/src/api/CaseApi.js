import { api } from './BaseApi';

const caseApi = api.injectEndpoints({
    entityTypes: ['matrixCase', 'caseUsers','matrixCases'],
    endpoints: (builder) => ({
        storeCase: builder.mutation({
            query: (data) => ({url: '/case/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, data) => ['matrixCases'],
        }),
        getCase: builder.query({
            query: (id) => ({url: `/case/${id}`, method: 'GET',}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, data) => result?[{type: 'matrixCase', id:result.id}]:[],
            keepUnusedDataFor: 300
        }),
        getUserCaseList: builder.query({
            query: (id) => ({url:'/user/case_list', method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result = [], error, id) => ['matrixCases'],
            keepUnusedDataFor: 5
        }),
        getCaseUsers: builder.query({
            query: (caseId) => ({url:`/case/users/${caseId}`, method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result = [], error, caseId) => ['caseUsers'],
            keepUnusedDataFor: 300
        }),
        storeUserCaseRole: builder.mutation({
            query: (data) => ({url: '/ucr/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, data) => ['caseUsers'],
        }),
        deleteUserCaseRole: builder.mutation({
            query: (data) => ({url: '/ucr/delete', method: 'DELETE', body: data}),
            invalidatesTags: (result, error, data) => ['caseUsers'],
        }),
    }),
    overrideExisting: false,
});

export const {  useStoreCaseMutation,
                useGetUserCaseListQuery, 
                useGetCaseQuery,
                useGetCaseUsersQuery,
                useStoreUserCaseRoleMutation,
                useDeleteUserCaseRoleMutation,
                } = caseApi;