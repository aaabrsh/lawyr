import { loadStripe } from "@stripe/stripe-js";

export async function checkout({ lineItems }, selected) {
  let stripePromise = null;

  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
    }
    return stripePromise;
  };

  const stripe = await getStripe();

  await stripe.redirectToCheckout({
    mode: "payment",
    lineItems,
    successUrl: `http://localhost:3000/dashboard/download?${selected}?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: window.location.origin,
  });
}
