import { api } from './BaseApi';
import { onQueryStartedHandler } from './ApiUtils';

const agencyApi = api.injectEndpoints({
    entityTypes: ['agency'],
    endpoints: (builder) => ({
        getAllAgencies: builder.query({
            query: () => '/agency/all',
            providesTags: ['allAgencies'],
            async onQueryStarted(undefined, { dispatch, queryFulfilled }) {
                onQueryStartedHandler(queryFulfilled, dispatch, undefined);
            },
            keepUnusedDataFor: 300
        }),
        storeAgency: builder.mutation({
            query: (agency) => ({
                url: '/agency/store',
                method: 'POST',
                body: agency,
            }),
            invalidatesTags: ['allAgencies'],
            async onQueryStarted(agency, { dispatch, queryFulfilled, requestId }) {
                onQueryStartedHandler(queryFulfilled, dispatch, requestId, "Saving agency - " + agency.name);
            },
        }),
    }),
    overrideExisting: false,
}); 

export const { useGetAllAgenciesQuery, useLazyGetAllAgenciesQuery, useStoreAgencyMutation } = agencyApi;