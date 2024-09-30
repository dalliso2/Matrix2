import { api } from './BaseApi';

const entityDefinitionApi = api.enhanceEndpoints({addTagTypes:['EntityDefinition']}).injectEndpoints({
    endpoints: (builder) => ({
        getAllEntityDefinitions: builder.query({
            query: (filter) => ({url:`/entity_definition/all`}),
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: (result, error, filter) => 
                result?result.payload.map(({id}) => ({type: 'EntityDefinition', id})):[],  
            keepUnusedDataFor: 300
        }),        
        storeEntityDefinition: builder.mutation({
            query: (data) => ({url: '/entity_definition/store', method: 'POST', body: data}),
            invalidatesTags: (result, error, data) => result?[{type:'EntityDefinition', id:result.id}]:[],
        }),
    }),
    overrideExisting: false,
});

export const {  useGetAllEntityDefinitionsQuery,
                useStoreEntityDefinitionMutation, 
                } = entityDefinitionApi;