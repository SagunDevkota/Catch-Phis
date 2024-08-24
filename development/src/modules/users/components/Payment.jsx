import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const Payment = () => {
  const stripePromise = loadStripe('pk_test_51PT1d4065Mm9w2p2hlF88kKv9KHrLQRX6bfnAP8yIFmKaiA1nolaiCTCQonKR11AA4PQCPA16zvON5YKIuP4rYSH00mpUg2UBk');

  useEffect(() => {
    const initialize = async () => {
      const stripe = await stripePromise;

      const fetchClientSecret = async () => {
        const response = await fetch(`${process.env.REACT_APP_CATCHPHIS_SERVER_URL}/api/payment/create-checkout-session/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const { clientSecret } = await response.json();
        return clientSecret;
      };

      const checkout = await stripe.initEmbeddedCheckout({
        fetchClientSecret,
      });

      // Mount Checkout to the specified element
      checkout.mount('#checkout');
    };

    initialize();
  }, [stripePromise]);

  return (
    <div>
      <h2>Payment Checkout</h2>
      <div id="checkout">
        {/* Checkout form will be inserted here by Stripe */}
      </div>
    </div>
  );
};

export default Payment;
