const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/payment-checkout', async (req, res) => {
  const { email, cart } = req.body;

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ['IN', 'US'],
    },

    customer_email: email,

    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'inr',
          },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        },
      },
    ],

    line_items: cart.map((item) => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title.substr(0, 24) + '...',
          },
          unit_amount: item.price * 100,
        },
        quantity: item.cartQty,
      };
    }),

    mode: 'payment',
    success_url: 'http://localhost:3000',
    cancel_url: 'http://localhost:3000/cart',
  });

  res.json({ url: session.url });
});

module.exports = router;
