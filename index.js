const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const dotenv = require("dotenv");
const stripe = require('stripe')('sk_test_51OgLaDSEqhaKAmkhui8Zb2ZbXXD8W5cHZHwSfkg0S3IicDrM6rZcdI4tv53fxZr2lgjOxd314mXKzmeZLHg0IuCs00lr22iTK5');

const authRoutes = require("./route/user");
const uploadRoute = require('./route/uploads')
const cors = require("cors");
const bodyParser = require("body-parser");
const YOUR_DOMAIN = 'http://localhost:8000';
const app = express();
const port = 8000;

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use('/api', uploadRoute);


app.post('/create-checkout-session', async (req, res) => {
  const product = await stripe.products.create({
    name: req.body.product,
  });

  if(product){
      var price = await stripe.prices.create({
        product: `${product?.id}`,
        unit_amount: req.body.amount * 100,
        currency: 'inr',
      });
  }
  if(price.id){
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price.id,
          quantity: 1,
        },
      ],
      customer_email: 'codesense24@gmail.com',
      mode: 'payment',
      return_url: `http://localhost:8000/return?session_id={CHECKOUT_SESSION_ID}`,
    });   
    console.log(session)
    return res.send({clientSecret: session.client_secret});
  }
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  console.log(session)
  return res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

