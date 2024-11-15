import { api } from './BaseApi';

const LinkChartApi = api.injectEndpoints({
    entityTypes: ['linkChart'],
    endpoints: (builder) => ({
        storeLinkChart: builder.mutation({
            // data = {id, matrixCase, name, entities, styleSheet}
            query: (data) => {
                return ({url: '/link_chart/store', method: 'POST', body: data})
            },
            invalidatesTags: (result, error, arg) => [{type: 'linkChart', id:result?.id}],
        }),
        updateLinkChartNameDescription: builder.mutation({
            // data = {id, name, description}
            query: (data) => {
                return ({url: '/link_chart/update_name_description', method: 'POST', body: data})
            },
            invalidatesTags: (result, error, arg) => [{type: 'linkChartListItem', id:result?.id}],
        }),
        removeLinkChart: builder.mutation({
            query: (id) => ({url: `/link_chart/remove`, method: 'POST',body: {id}}),
        }),
        // getLinkChartsForCase: builder.query({
        //     query: (caseId) => ({url:`/link_chart/all_for_case/${caseId}`, method: 'GET'}),
        //     transformResponse: (response, meta, arg) => 
        //     {
        //         return response;
        //     },
        //     //providesTags: (result = [], error, id) => ['matrixCases'],
        //     keepUnusedDataFor: 300
        // }),
        getLinkChartListForCase: builder.query({
            query: (caseId) => ({url:`/link_chart/list/${caseId}`, method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
//            providesTags: (results, error, args) => results?.payload.map(result=>({type:'linkChartListItem', id:result.id})),
            keepUnusedDataFor: 300
        }),
        getLinkChart: builder.query({
            query: (linkChartId) => ({url:`/link_chart/${linkChartId}`, method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, arg) => [{type: 'linkChart', id:result?.id}],
            keepUnusedDataFor: 300
        }),
    }),
    overrideExisting: false,
});

export const {  useStoreLinkChartMutation,
                useRemoveLinkChartMutation,
                useLazyGetLinkChartsForCaseQuery,
                useGetLinkChartListForCaseQuery,
                useLazyGetLinkChartListForCaseQuery,
                useGetLinkChartQuery,
                useUpdateLinkChartNameDescriptionMutation
                } = LinkChartApi;