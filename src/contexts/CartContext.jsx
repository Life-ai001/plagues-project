import React, { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(cartService.getCart());
  const [cartCount, setCartCount] = useState(cartService.getCartCount());
  const [cartTotal, setCartTotal] = useState(cartService.getCartTotal());

  // Update cart count and total whenever cart changes
  useEffect(() => {
    setCartCount(cartService.getCartCount());
    setCartTotal(cartService.getCartTotal());
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const updatedCart = cartService.addToCart(product, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartService.removeFromCart(productId);
    setCart(updatedCart);
    return updatedCart;
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cartService.updateQuantity(productId, newQuantity);
    setCart(updatedCart);
    return updatedCart;
  };

  // Clear the entire cart
  const clearCart = () => {
    const updatedCart = cartService.clearCart();
    setCart(updatedCart);
    return updatedCart;
  };

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Get quantity of a specific item in cart
  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
