import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRouter from './routers/AppRouter.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slide, ToastContainer } from 'react-toastify';
import AuthContextProvider from './auth/AuthProvider.jsx';
import { CartProvider } from './contexts/CartContext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <AppRouter />
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              theme="dark"
              transition={Slide}
            />
          </CartProvider>
        </QueryClientProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
