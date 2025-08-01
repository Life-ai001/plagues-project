// App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/AppRouter';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
