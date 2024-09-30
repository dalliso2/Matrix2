import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { router } from './router/MatrixRouter';
import store from './state/store';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>  
      <CssBaseline/>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}/>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </LocalizationProvider>
  );
}