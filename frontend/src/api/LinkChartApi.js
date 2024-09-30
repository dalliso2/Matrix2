import { api } from './BaseApi';

const LinkChartApi = api.injectEndpoints({
    entityTypes: ['linkChart'],
    endpoints: (builder) => ({
        storeLinkChart: builder.mutation({
            query: (data) => ({url: '/link_chart/store', method: 'POST', body: data}),
        }),
        removeLinkChart: builder.mutation({
            query: (id) => ({url: `/link_chart/remove`, method: 'POST',body: {id}}),
        }),
        getLinkChartsForCase: builder.query({
            query: (caseId) => ({url:`/link_chart/all_for_case/${caseId}`, method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            //providesTags: (result = [], error, id) => ['matrixCases'],
            keepUnusedDataFor: 300
        }),
    }),
    overrideExisting: false,
});

export const {  useStoreLinkChartMutation,
                useRemoveLinkChartMutation,
                useLazyGetLinkChartsForCaseQuery,
                } = LinkChartApi;