/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import initStripe from "stripe";
import { fetchCustomerData } from "../../../utils/supabase-admin";

const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

export default async function fetchCustomer(req: any, res: any) {
  if (req.method === "GET") {
    try {
      // get customer data
      const { id } = req.query;
      return res.json(await fetchCustomerData(id))
    } catch (err) {
      console.log(err);
      res.json({ msg: "Error: Couldn't fetch customer", customer: null });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
