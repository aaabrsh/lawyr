// import cookie from "cookie";
import initStripe from "stripe";
import { useSession, getSession } from "next-auth/react";
import { createOrRetrieveCustomer } from "../../../utils/supabase-admin";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
    const { priceId } = req.query;
    const { userId } = req.body;

    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    const stripe_customer = await createOrRetrieveCustomer(userId);

    const sessions = await stripe.checkout.sessions.create({
      customer: stripe_customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/setting/?success=subscribed`,
      cancel_url: `${process.env.NEXTAUTH_URL}/setting/?success=failed`,
    });

    res.send({
      id: sessions.id,
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
