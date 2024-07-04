// This is your test secret API key.
const stripe = Stripe("pk_test_51PT1d4065Mm9w2p2hlF88kKv9KHrLQRX6bfnAP8yIFmKaiA1nolaiCTCQonKR11AA4PQCPA16zvON5YKIuP4rYSH00mpUg2UBk");
const authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5NjUyNTM5LCJpYXQiOjE3MTk2NTA0MzksImp0aSI6IjQ5YmJhMDQ2YWY0YjQ5YzZiYmNjMjEzMDI2OWVkZDM2IiwidXNlcl9pZCI6MX0.qMn09dF7E1owKAYRX_mV-I4JZdnQk0CEIdyw1yc1Z2g"
initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/corporate/create-checkout-session/", {
      method: "POST",
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',  // Include this if you're sending JSON data
      }
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}