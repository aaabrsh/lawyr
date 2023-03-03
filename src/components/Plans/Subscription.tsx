/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
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
      <p className="py-4 text-center text-zinc-800">
        You are subscribed to the following plan
      </p>
      <div className="flex flex-col rounded border border-zinc-400 bg-zinc-800 px-8 py-8 text-gray-300 shadow">
        <div className="pb-2">
          <h1 className="font-bold">Plan Type: </h1>
          <p className="pl-2 font-light">
            Your are currently on the&nbsp;
            <span className="font-bold">{customer?.billingPlan}</span>&nbsp;plan
          </p>
        </div>
        {customer?.billingPlan === "business" ? (
          <div className="pb-2">
            <h1 className="font-bold">Company Name: </h1>
            <p className="pl-2 font-light">{customer?.company_name}</p>
          </div>
        ) : (
          <div className="pb-2">
            <h1 className="font-bold">Customer Name: </h1>
            <p className="pl-2 font-light">{customer?.name}</p>
          </div>
        )}
        <div className="pb-2">
          <h1 className="font-bold">Email: </h1>
          <p className="pl-2 font-light">{customer?.email}</p>
        </div>
        {customer?.billingPlan === "lawyer" && (
          <>
            <div className="pb-2">
              <h1 className="font-bold">License Country: </h1>
              <p className="pl-2 font-light">{customer?.license_country}</p>
            </div>
            <div className="pb-2">
              <h1 className="font-bold">License State: </h1>
              <p className="pl-2 font-light">{customer?.license_state}</p>
            </div>
          </>
        )}
        <div className="mt-5 block w-full rounded-md bg-white text-center text-sm font-semibold text-black hover:border hover:border-white hover:bg-pink-400 hover:text-white">
          <button className="w-full py-2" onClick={redirectCustomerPortal}>
            Manage Your Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
