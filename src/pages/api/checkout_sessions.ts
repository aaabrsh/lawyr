/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// src/pages/api/examples.ts
//@ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { cart } = JSON.parse(req.body);
    const lineItem = [];
    for (const key in cart) {
      lineItem.push({
        _data: {
          currencey: "usd",
          product_data: {
            name: cart[key].name,
            image: cart[key].imageUrl,
          },
          unit_amount: cart[key].price * 100,
        },
        quantity: cart[key].qty,
      });
    }

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: "price_1MRMjsFUkugsyUNgwD8J6GyM",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      // res.redirect(303, session.url);
      res.status(200).json({ session });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default examples;
