import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1B1B1B',
            border: '1px solid #EAEAEA',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          },
          success: {
            iconTheme: { primary: '#57C76F', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);

