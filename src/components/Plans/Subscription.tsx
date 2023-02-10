export default function Subscription({ customer }) {
  const redirectCustomerPortal = async () => {
    const res: Response = await fetch("/api/create_portal_link", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ id: customer.stripe_customer_id }),
    });

    const { url } = await res.json();

    window.location.assign(url);
  };

  return (
    <div className="px-4">
      <p className="py-4 text-zinc-800 text-center">
        You are subscribed to the following plan
      </p>
      <div className="flex flex-col rounded border border-zinc-400 bg-zinc-800 px-8 py-8 text-gray-300 shadow">
        <div className="pb-2">
          <h1 className="font-bold">Your Plan: </h1>
          <p className="pl-2 font-light">
            Your are currently on the&nbsp;
            <span className="font-bold">{customer.billingPlan}</span>&nbsp;plan
          </p>
          {/* <p className="pl-2 font-light">
            ${customer.price / 100} / {customer.interval}
          </p> */}
        </div>
        <div className="pb-2">
          <h1 className="font-bold">Your Name: </h1>
          <p className="pl-2 font-light">{customer.customerName}</p>
        </div>
        <div className="pb-2">
          <h1 className="font-bold">Your Email: </h1>
          <p className="pl-2 font-light">{customer.email}</p>
        </div>
        <div className="mt-5 block w-full rounded-md bg-white text-center text-sm font-semibold text-black hover:border hover:border-white hover:bg-pink-400 hover:text-white">
          <button className="w-full py-2" onClick={redirectCustomerPortal}>
            Manage Your Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
