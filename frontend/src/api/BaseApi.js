import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: '/api',
        prepareHeaders(headers, {getState}) {
            const authToken = getState().app.authToken;

            if (authToken) 
            {
                headers.set('Authorization', `Bearer ${authToken}`);
            }
        },
        credentials: 'include',
    }),
    tagTypes: ['currentUser', 'agency', 'matrixCase', 'entity'],
    endpoints: (builder) => ({}),
});
