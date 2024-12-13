import { api } from './BaseApi';
import { onQueryStartedHandler } from './ApiUtils';

const entityDefinitionApi = api.enhanceEndpoints({addTagTypes:['EntityDefinition', 'EntityDefinitionList']}).injectEndpoints({
    endpoints: (builder) => ({
        getAllEntityDefinitions: builder.query({
            query: (filter) => ({url:`/entity_definition/all`}),
            keepUnusedDataFor: 300,
            providesTags: (result, error, filter) => [{type: 'EntityDefinitionList'}], 
            async onQueryStarted(undefined, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, undefined);
            }
        }),        
        storeEntityDefinition: builder.mutation({
            query: (entityDef) => ({url: '/entity_definition/store', method: 'POST', body: entityDef}),
            invalidatesTags: (result, error, data) => [{type: 'EntityDefinitionList'}],
            async onQueryStarted(entityDef, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving entity definition - " + entityDef.name);
            }
        }),
    }),
    overrideExisting: false,
});

export const {  useGetAllEntityDefinitionsQuery,
                useStoreEntityDefinitionMutation, 
                } = entityDefinitionApi;