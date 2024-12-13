import { api } from './BaseApi';
import { onQueryStartedHandler } from './ApiUtils';

const entityApi = api.enhanceEndpoints({addTagTypes:['Entity','EntityFile','RelatedEntities']}) // id associated with EntityFiles tag is the entityId
                    .injectEndpoints({
    endpoints: (builder) => ({
        searchEntities: builder.query({
            query: (data) => ({ url:`/entity/search`, method: 'POST', body: data }),
            providesTags: (result, error, data) => 
                result?result.payload.flatMap(entityGroup=>entityGroup.map(entity=>({type:'Entity', id:entity.id}))):[],
            async onQueryStarted( data,{queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId,);
            },
            keepUnusedDataFor: 300,
        }),
        getAllEntitiesForCase: builder.query({
            query: (caseId) => ({ url:`/entity/all_for_case/${caseId}`, method: 'GET' }),
            async onQueryStarted( caseId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            keepUnusedDataFor: 300
        }),        
        getAllLinkChartEntitiesForCase: builder.query({
            query: (caseId) => ({ url:`/entity/all_link_chart_for_case/${caseId}`, method: 'GET' }),
            async onQueryStarted( caseId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            keepUnusedDataFor: 300
        }),   
        getEntity: builder.query({
            query: (entityId) => ({ url:`/entity/${entityId}`, method: 'GET' }),
            transformResponse: (response, meta, arg) => 
            {
                //console.log("EntityAPI - getEntityFiles")
                return response;
            },
            providesTags: (result, error, arg)=>[{type:'Entity',id:arg}],
            async onQueryStarted( entityId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            keepUnusedDataFor: 300
            //invalidatesTags: (result, error, arg)=>result?.length?[result.payload[0].matrixEntity]:[],
            //invalidatesTags: (result, error, arg)=>result && result.map((entityFile)=>({type:'EntityFile',entityFile:id})),
        }),
        findEntitiesByIds: builder.query({
            // data should be in the format {caseId:Long, ids:[Long]}
            query: (data) => ({ url:`/entity/find_by_ids`, method: 'POST', body: data }),
            async onQueryStarted( data, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            // providesTags: (result, error, data) => 
            // {
            //     const y = result?result.payload.flatMap(entityGroup=>entityGroup.map(entity=>({type:'Entity', id:entity.id}))):[];
            //     console.log(y);
            //     return y;
            // },
            keepUnusedDataFor: 300
        }),
        storeEntity: builder.mutation({
            query: (entity) => ({
                url: '/entity/store',
                method: 'POST',
                body: entity,
            }),
            async onQueryStarted( entity, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving entity..." );
            },
            invalidatesTags: (result, error, data) => result?[{type:'Entity', id:result.id}]:[],
        }),        
        addFilesToEntity: builder.mutation({
            // entityFileMsgs is an array of objects with entityId and fileId [{entityId:1, fileId:2},...]
            query: (entityFileMsgs) => ({
                url: '/entity_file/add',
                method: 'POST',
                body: entityFileMsgs,
            }),
            async onQueryStarted( entityFileMsgs, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Adding files to entity..." );
            },
            invalidatesTags: (result, error, arg)=>result?[{type:'EntityFile', id:result.payload[0].matrixEntity}]:[],
            //invalidatesTags: (result, error, arg)=>result?result.payload.map(entityFile=>({type:'EntityFile', id:entityFile.id})):[],
        }),        
        getEntityFiles: builder.query({
            query: (entityId) => ({ url:`/entity_file/all_for_entity/${entityId}`, method: 'GET' }),
            async onQueryStarted( entityId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId,);
            },
            providesTags: (result, error, arg)=>[{type:'EntityFile',id:arg}],
            keepUnusedDataFor: 300
            //invalidatesTags: (result, error, arg)=>result?.length?[result.payload[0].matrixEntity]:[],
            //invalidatesTags: (result, error, arg)=>result && result.map((entityFile)=>({type:'EntityFile',entityFile:id})),
        }),
        removeEntityFile: builder.mutation({
            query: (id) => ({url: '/entity_file/remove', method: 'DELETE', body: {id}}),
            async onQueryStarted( id, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Removing file from entity..." );
            },
            invalidatesTags: (result, error, arg)=>result && [{type:'EntityFile',id:result.payload.id}],
        }),
        searchEntitiesNotLinked: builder.query({
            query: (data) => ({ url:`/entity/search_unlinked_entities`, method: 'POST', body: data }),
            async onQueryStarted( data, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            keepUnusedDataFor: 300
        }),
        linkEntities: builder.mutation({
            query: (entityRelationshipMsg) => ({
                url: '/entity/link',
                method: 'POST',
                body: entityRelationshipMsg,
            }),
            async onQueryStarted( entityRelationshipMsg, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Linking entities..." );
            },
            invalidatesTags: (result, error, arg)=>[{type:'RelatedEntities',id:arg.parentId},{type:'RelatedEntities',id:arg.childId}],
        }),     
        unlinkEntities: builder.mutation({
            query: (entityRelationship) => ({
                url: '/entity/unlink',
                method: 'POST',
                body: {id:entityRelationship.id},
            }),
            async onQueryStarted( entityRelationship, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Unlinking entities..." );
            },
            //invalidatesTags: (result, error, arg)=>[{type:'RelatedEntities',id:arg.parentId},{type:'RelatedEntities',id:arg.childId}],
        }),            
        getRelatedEntities: builder.query({
            query: (entityId) => ({ url:`/entity/children/${entityId}`, method: 'GET' }),
            async onQueryStarted( entityId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, arg)=>[{type:'RelatedEntities',id:arg}],
            keepUnusedDataFor: 300
        }),
        getCaseEntityRelationships: builder.query({
            query: (caseId) => ({ url:`/entity/case_relationships/${caseId}`, method: 'GET' }),
            async onQueryStarted( entityId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            providesTags: (result, error, arg)=>[{type:'EntityRelationships',id:arg}],
            keepUnusedDataFor: 300
        }),
        getAllTimelineEntitiesForCase: builder.query({
            query: (caseId) => ({ url:`/entity/timeline_entities/${caseId}`, method: 'GET' }),
            async onQueryStarted( caseId, { queryFulfilled, dispatch, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, );
            },
            // providesTags: (result, error, arg)=>[{type:'Entity',id:arg}],
            // keepUnusedDataFor: 300,
            //invalidatesTags: (result, error, arg)=>result?.length?[result.payload[0].matrixEntity]:[],
            //invalidatesTags: (result, error, arg)=>result && result.map((entityFile)=>({type:'EntityFile',entityFile:id})),
        }),   
    }),
    overrideExisting: false,
});

export const { useLazySearchEntitiesQuery, 
                useGetEntityQuery,
                useLazyGetAllEntitiesForCaseQuery,
                useGetAllLinkChartEntitiesForCaseQuery,
                useLazyGetAllLinkChartEntitiesForCaseQuery,
                useStoreEntityMutation, 
                useAddEntityToCaseMutation,
                useAddFilesToEntityMutation,
                useGetEntityFilesQuery, 
                useRemoveEntityFileMutation,
                useLazySearchEntitiesNotLinkedQuery,
                useLinkEntitiesMutation,
                useGetRelatedEntitiesQuery,
                useUnlinkEntitiesMutation,
                useLazyFindEntitiesByIdsQuery,
                useGetCaseEntityRelationshipsQuery,
                useLazyGetCaseEntityRelationshipsQuery,
                useLazyGetAllTimelineEntitiesForCaseQuery } = entityApi;