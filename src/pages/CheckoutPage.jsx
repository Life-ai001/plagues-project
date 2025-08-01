import React from 'react';
import { useLocation } from 'react-router-dom';
import './Css/CheckoutPage.css';

// Payment method logos with working image URLs
const PAYMENT_METHODS = [
  {
    id: 'esewa',
    name: 'eSewa',
    logo: 'https://esewa.com.np/common/images/og_image.jpg', // Using og_image as it's more reliable
    url: 'https://esewa.com.np/#/home'
  },
  {
    id: 'khalti',
    name: 'Khalti',
    logo: 'https://web.khalti.com/static/img/logo.png', // Direct link to Khalti logo
    url: 'https://web.khalti.com/#/login'
  },
  {
    id: 'imepay',
    name: 'IME Pay',
    logo: 'https://www.imepay.com.np/images/logo.png', // Updated IME Pay logo URL
    url: 'https://services.imepay.com.np/'
  },
  {
    id: 'fonepay',
    name: 'Fonepay',
    logo: 'https://fonepay.com/assets/images/logo/logo.png', // Updated Fonepay logo URL
    url: 'https://fonepay.com/customers/qr-payment'
  }
];

export default function CheckoutPage() {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  
  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  // Handle payment method selection
  const handlePayment = (paymentMethod) => {
    // Here you would typically integrate with the payment gateway
    console.log('Selected payment method:', paymentMethod);
    alert(`Redirecting to ${paymentMethod} for payment of $${totalAmount.toFixed(2)}`);
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        {cartItems.length > 0 ? (
          <div className="order-items">
            {cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-name">{item.name}</div>
                <div className="item-quantity">x {item.quantity || 1}</div>
                <div className="item-price">${(item.price * (item.quantity || 1)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No items in cart</p>
        )}
        
        <div className="order-total">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="checkout-section">
        <h3>Select Payment Method</h3>
        <div className="payment-options">
          {PAYMENT_METHODS.map(method => (
            <a
              key={method.id}
              href={method.url}
              target="_blank"
              rel="noopener noreferrer"
              className="payment-button"
              onClick={(e) => {
                e.preventDefault();
                handlePayment(method.name);
                // In a real app, you would integrate with the payment gateway here
                window.open(method.url, '_blank');
              }}
            >
              {method.logo ? (
                <img 
                  src={method.logo} 
                  alt={method.name} 
                  className="payment-icon" 
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      const text = document.createTextNode(method.name);
                      parent.appendChild(text);
                    }
                  }}
                />
              ) : (
                <span>{method.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Delivery Message */}
      <div className="delivery-message">
        <p>Your product will be delivered within 2-5 business days after successful payment.</p>
      </div>
    </div>
  );
}
