import { api } from './BaseApi';

const fileApi = api.injectEndpoints({
    entityTypes: ['file'],
    endpoints: (builder) => ({
        storeFiles: builder.mutation({
            query: (fileDataArray) => ({
                url: '/file/update_files',
                method: 'POST',
                body: fileDataArray,
            }),
            transformResponse: (response, meta, arg) => 
            {
                // if (!response.api_error)
                //     store.dispatch(replaceSearchResult(response));
                return response;
            },
        }),
        searchFilesNotLinkedToEntity: builder.query({
            query: (params) => ({ url:`/file/search_not_linked_to_entity?entity_id=${params.entityId}&search_string=${params.searchString}`, method: 'GET' }),
            transformResponse: (response, meta, arg) => 
            {
                // if (!response.api_error)
                //     store.dispatch(replaceSearchResult(response));
                return response;
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