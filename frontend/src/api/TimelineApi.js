import { api } from './BaseApi';

const timelineApi = api.injectEndpoints({
    entityTypes: ['timeline'],
    endpoints: (builder) => ({
        storeTimeline: builder.mutation({
            // data = {id, name, description, matrixCase, timelineEntities}
            query: (data) => {
                console.log(data);
                return ({url: '/timeline/store', method: 'POST', body: data})
            },
            invalidatesTags: (result, error, arg) => [{type: 'Timeline', id:result?.id}],
        }),
        updateTimelineNameDescription: builder.mutation({
            // data = {id, name, description}
            query: (data) => {
                return ({url: '/timeline/update_name_description', method: 'POST', body: data})
            },
            invalidatesTags: (result, error, arg) => [{type: 'timelineListItem', id:result?.id}],
        }),
        removeTimeline: builder.mutation({
            query: (id) => ({url: `/timeline/remove`, method: 'POST',body: {id}}),
        }),
        // getTimelinesForCase: builder.query({
        //     query: (caseId) => ({url:`/link_chart/all_for_case/${caseId}`, method: 'GET'}),
        //     transformResponse: (response, meta, arg) => 
        //     {
        //         return response;
        //     },
        //     //providesTags: (result = [], error, id) => ['matrixCases'],
        //     keepUnusedDataFor: 300
        // }),
        getTimelineListForCase: builder.query({
            query: (caseId) => ({url:`/timeline/list/${caseId}`, method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (results, error, args) => results?.payload.map(result=>({type:'timelineListItem', id:result.id})),
            keepUnusedDataFor: 300
        }),
        getTimeline: builder.query({
            query: (timelineId) => ({url:`/timeline/${timelineId}`, method: 'GET'}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, arg) => [{type: 'timeline', id:result?.id}],
            keepUnusedDataFor: 300
        }),
    }),
    overrideExisting: false,
});

export const {  useStoreTimelineMutation,
                useRemoveTimelineMutation,
                useLazyGetTimelinesForCaseQuery,
                useGetTimelineListForCaseQuery,
                useLazyGetTimelineListForCaseQuery,
                useGetTimelineQuery,
                useLazyGetTimelineQuery,
                useUpdateTimelineNameDescriptionMutation
                } = timelineApi;