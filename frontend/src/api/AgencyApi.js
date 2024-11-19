import { api } from './BaseApi';
import { router } from '../router/MatrixRouter';

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
            transformResponse: (response, meta, arg) =>
            {
                console.log(response);
            },
            transformErrorResponse: (response, meta, arg) =>
            {
                router.navigate("/login");
                console.log(response);
            },
            invalidatesTags: ['allAgencies'],
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

export const { useGetAllAgenciesQuery, useStoreAgencyMutation } = agencyApi;