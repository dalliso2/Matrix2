import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../api/BaseApi";
import appSlice from "./AppSlice";

const store = configureStore(
{
    reducer: 
    {
        app: appSlice,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;


