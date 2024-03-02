// This is your test secret API key.
const stripe = require('stripe')('sk_test_51OpmuHB7FKYYPEvRyi1OzK1qdI640XWTRwZX6EBuRKmXxRi2qxbHVGbA6JR7R6bDMaAS2t08EGjp4NmKaEnJt0uN00NaCbooYn');
const express = require('express');
const cors = require('cors'); 

const app = express();
app.use(express.static('public'));


const YOUR_DOMAIN = 'https://payment-gateway-demo.onrender.com';
const corsOptions = {
  origin: YOUR_DOMAIN, // Replace with the origin of your frontend app
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res,next)=>{
  res.redirect('/checkout.html')
})
app.post('/create-checkout-session', async (req, res) => {

  //payload
  // {
  //   productName,
  //   productDescription,
  //   productImage,
  //   productPrice
  // }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'usd',
          product_data: {
            name: req.body.productName,
            description: req.body.productDescription,
            images: [req.body.productImage],

          },
          unit_amount_decimal: req.body.productPrice,

        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.json({resultUrl: session.url});
});

app.listen(4242, () => console.log('Running on port 4242'));