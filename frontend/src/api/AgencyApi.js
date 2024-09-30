import { api } from './BaseApi';

const agencyApi = api.injectEndpoints({
    entityTypes: ['agency'],
    endpoints: (builder) => ({
        getAllAgencies: builder.query({
            query: () => '/agency/all',
            transformResponse: (response, meta, arg) => 
            {
                return response;
            },
            providesTags: ['allAgencies'],
            keepUnusedDataFor: 300
        }),
        storeAgency: builder.mutation({
            query: (agency) => ({
                url: '/agency/store',
                method: 'POST',
                body: agency,
            }),
            invalidatesTags: ['allAgencies'],
        }),
    }),
    overrideExisting: false,
});

export const { useGetAllAgenciesQuery, useStoreAgencyMutation } = agencyApi;