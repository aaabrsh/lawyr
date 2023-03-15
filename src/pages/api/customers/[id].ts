/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { prisma } from "../../../server/db";
import { stripe } from "../../../utils/stripe";

export default async function fetchCustomer(req: any, res: any) {
  if (req.method === "GET") {
    try {
      // get customer data
      const { id } = req.query;
      const customer = await prisma.customer.findFirst({
        where: {
          userId: id,
        },
      });

      if (!customer?.billingPlan) {
        //if the customer doesn't have a billing plan(is not subscribed)
        return res.json(null);
      }

      const stripe_customer: {} = await stripe.customers
        .retrieve(customer?.stripe_customer_id ?? "")
        .catch(() => ({}));

      res.json({
        customer: {
          ...customer,
          email: stripe_customer?.email,
          name: stripe_customer?.name,
        },
      });
    } catch (err) {
      console.log(err);
      res.json({ msg: "Error: Couldn't fetch customer", customer: null });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
