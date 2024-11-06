import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Router>
      <Provider store={store}>
        <HelmetProvider>
          <CssBaseline />
          <div onContextMenu={e => e.preventDefault()}>
            <App />
          </div>
          <Toaster />
        </HelmetProvider>
      </Provider>
    </Router>
  // </React.StrictMode>,
)
