import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './global.css'
import { reduxStore } from './redux';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>
);

