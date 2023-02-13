// import cookie from "cookie";
import initStripe from "stripe";
import { useSession, getSession } from "next-auth/react";
import { createOrRetrieveCustomer } from "../../../utils/supabase-admin";

const handler = async (req, res) => {
  if (req.method === "POST") {
    // const { data: session } = useSession();
    // const user = session?.user?.email;

    // if (!user) {
    //   return res.status(401).send("Unauthorized");
    // }

    //   const token = cookie.parse(req.headers.cookie)["sb:token"];

    //   supabase.auth.session = () => ({
    //     access_token: token,
    //   });

    //   const {
    //     data: { stripe_customer },
    //   } = await supabase
    //     .from("profile")
    //     .select("stripe_customer")
    //     .eq("id", user.id)
    //     .single();

    const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
    const { priceId } = req.query;
    const { userId } = req.body;
    console.log(priceId);

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
      success_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancelled",
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
