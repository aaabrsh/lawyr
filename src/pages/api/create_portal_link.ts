/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import initStripe from "stripe";

const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const customer = { customer_id: req.body.id, return_url: "/setting" };

    const { url } = await stripe.billingPortal.sessions.create({
      customer: req.body.id,
      return_url: `${req.headers.origin}/setting`,
    });

    return res.status(200).json({ url });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
