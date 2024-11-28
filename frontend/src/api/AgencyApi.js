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
            async onQueryStarted(agency, { dispatch, queryFulfilled }) {
                onQueryStartedHandler(queryFulfilled, dispatch, agency, "Saving agency - " + agency.name);
            },

            // async onQueryStarted(agency, { dispatch, queryFulfilled }) {

            //     const result = dispatch(api.util.updateQueryData('getAllAgencies', undefined, (draft) => {
            //                         const ag = draft?.payload?.find(a => a.id === agency.id);
            //                         if (ag)
            //                             Object.assign(ag,agency); 
            //                         else
            //                             draft?.payload?.push(agency);
            //                     }))
            //     try {
            //         console.log(await queryFulfilled);
            //         enqueueSnackbar((agency.id?"Updated":"Created") + " agency: " + agency.name, {variant:'success'});
            //     }
            //     catch
            //     {
            //         console.log(queryFulfilled);
            //         result.undo();
            //         enqueueSnackbar((agency.id?"Update":"Create") + " failed: " + agency.name, {variant:'error'});
            //     }
            // }
        }),
    }),
    overrideExisting: false,
}); 

export const { useGetAllAgenciesQuery, useLazyGetAllAgenciesQuery, useStoreAgencyMutation } = agencyApi;