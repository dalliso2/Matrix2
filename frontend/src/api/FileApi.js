import { api } from './BaseApi';
import { onQueryStartedHandler } from './ApiUtils';

const fileApi = api.injectEndpoints({
    entityTypes: ['file'],
    endpoints: (builder) => ({
        storeFiles: builder.mutation({
            query: (fileDataArray) => ({
                url: '/file/update_files',
                method: 'POST',
                body: fileDataArray,
            }),
            async onQueryStarted(fileDataArray, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving file(s)..." );
            }
        }),
        searchFilesNotLinkedToEntity: builder.query({
            query: (params) => ({ url:`/file/search_not_linked_to_entity?entity_id=${params.entityId}&search_string=${params.searchString}`, method: 'GET' }),
            async onQueryStarted(fileDataArray, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: ['file'],
            keepUnusedDataFor: 300
        }),

        // addFileToEntity: builder.mutation({
        //     query: (entityFile) => ({
        //         url: '/entity_file/add',
        //         method: 'POST',
        //         body: entityFile,
        //     }),
        //     transformResponse: (response, meta, arg) => 
        //     {
        //         // console.log(response);
        //         // if (!response.api_error)
        //         //     store.dispatch(replaceSearchResult(response));
        //         return response;
        //     },
        //     invalidatesTags: ['allEntities', 'entity'],
        // }),
        // addEntityToCase: builder.mutation({
        //     query: (caseEntity) => ({
        //         url: '/case_entity/add',
        //         method: 'POST',
        //         body: caseEntity,
        //     }),
        // }),
    }),
    overrideExisting: false,
});

export const { useStoreFilesMutation, useLazySearchFilesNotLinkedToEntityQuery} = fileApi;