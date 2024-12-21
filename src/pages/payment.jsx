import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalPayment = ({ cart, onSuccess, onError }) => {
  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

  // PayPal configuration
  const initialOptions = {
    clientId: "YOUR_PAYPAL_CLIENT_ID", // Replace with your actual PayPal Client ID
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice,
                currency_code: "USD"
              },
              description: `Purchase of ${cart.length} items`
            }]
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();
            onSuccess(details);
          } catch (error) {
            onError(error);
          }
        }}
        onError={(err) => onError(err)}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;