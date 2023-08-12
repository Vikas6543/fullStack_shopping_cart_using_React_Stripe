const express = require('express');
const isAuthenticated = require('../middlewares/auth');
const router = express.Router();
const ordersModel = require('../models/ordersModel');
const userModel = require('../models/userModel');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// stripe payment
router.post('/checkout', isAuthenticated, async (req, res) => {
  const { id, cart } = req.body;

  const user = await userModel.findById(id);

  const orderData = cart.map((item) => {
    return {
      userId: user._id,
      title: item.title.substr(0, 24) + '...',
      quantity: item.cartQty,
      price: item.price,
    };
  });

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      cart: JSON.stringify(orderData),
    },
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ['IN', 'US'],
    },

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

    customer: customer.id,
    mode: 'payment',
    success_url:
      'https://react-cart-stripe.onrender.com/?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://react-cart-stripe.onrender.com/cart',
  });

  res.json({ url: session.url });
});

// stripe webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_ENDPOINT_SECRET_KEY
      );
    } catch (err) {
      console.log(err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        break;

      case 'checkout.session.completed':
        const data = event.data.object;
        let customer = await stripe.customers.retrieve(data.customer);
        customer = JSON.parse(customer?.metadata?.cart);
        console.log(customer);
        customer.forEach(async (item) => {
          try {
            await ordersModel.create({
              userId: item.userId,
              email: data.customer_details.email,
              product: item.title,
              quantity: item.quantity,
              price: item.price,
              address: data.customer_details.address,
            });
          } catch (error) {
            console.log(error);
            return response.status(500).json({ error: 'Something went wrong' });
          }
        });

      default:
        console.log(event.type);
    }

    response.send().end();
  }
);

// stripe verify webhook
router.get('/verify-payment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    return res.status(200).json({
      message: 'Payment verified Successfully',
      status: session.payment_status,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Payment verification failed');
  }
});

module.exports = router;
