import stripe from "../../utils/stripe"

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const customer = { customer_id: req.body.id, return_url: "/plans" };

    const { url } = await stripe.billingPortal.sessions.create({
      customer: req.body.id,
      return_url: `${req.headers.origin}/plans`,
    });

    return res.status(200).json({ url });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
