import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './Pricing.css';

const publishKey = "pk_test_51POtZ02NvOaTgEjIlqDnusZYN0J7Sj6mZReqDaEYB1dpb0pADOSTXaI2wkCYRV3qIm12vfTsxwCFTWi0YWrk9RXv00n2O5f7wm";
const stripePromise = loadStripe(publishKey);

const Pricing = () => {
    const handleClick = async (priceId) => {
        console.log('Button clicked for price ID:', priceId);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: window.location.origin + '/success',
            cancelUrl: window.location.origin + '/cancel',
        });
        if (error) {
            console.error("Error redirecting to Stripe checkout:", error);
        }
    };

    return (
        <div className="pricing">
            <h2>Pricing</h2>
            <p>Choose the plan that suits you best.</p>
            <div className="pricing-plans">
                <div className="plan single-account">
                    <h3>Single Account</h3>
                    <p className="price">$10/month</p>
                    <ul>
                        <li>Feature 1</li>
                        <li>Feature 2</li>
                        <li>Feature 3</li>
                    </ul>
                    <button onClick={() => handleClick('price_1Hh1YX2eZvKYlo2C0hZP5mnO')}>Choose Plan</button>
                </div>
                <div className="plan organizational-account">
                    <h3>Organizational Account</h3>
                    <p className="price">$30/month</p>
                    <ul>
                        <li>Feature A</li>
                        <li>Feature B</li>
                        <li>Feature C</li>
                    </ul>
                    <button onClick={() => handleClick('price_1Hh1YX2eZvKYlo2CQVG5XgHO')}>Choose Plan</button>
                </div>
            </div>
        </div>
    );
}

export default Pricing;
