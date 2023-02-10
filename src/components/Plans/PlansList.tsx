import { useState } from "react";

export default function PlansList({
  plans,
  showSubscribeButton,
  showCreateAccountButton,
  openModal,
  processSubscription,
}) {
  const [billingInterval, setBillingInterval] = useState<"year" | "month">(
    "month"
  );

  return (
    <>
      <div className="relative mt-6 flex self-center rounded-lg border border-pink-400 p-0.5 sm:mt-8">
        <button
          onClick={() => setBillingInterval("month")}
          type="button"
          className={`${
            billingInterval === "month"
              ? "relative w-1/2 border-zinc-800 bg-pink-400 text-white shadow-sm"
              : "relative ml-0.5 w-1/2 border border-transparent text-zinc-800"
          } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
        >
          Monthly billing
        </button>
        <button
          onClick={() => setBillingInterval("year")}
          type="button"
          className={`${
            billingInterval === "year"
              ? "relative w-1/2 border-zinc-800 bg-pink-400 text-white shadow-sm"
              : "relative ml-0.5 w-1/2 border border-transparent text-zinc-800"
          } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
        >
          Yearly billing
        </button>
      </div>
      <div className="w-full py-16 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Chat start */}
        <>
          {/* component */}
          {/* <div className="flex gap-5 flex-wrap bg-zinc-200 py-16"> */}
          <div className="grid w-auto gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex h-40 flex-col rounded border border-zinc-400 bg-zinc-800 px-6 py-4 text-white shadow"
              >
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="flex-grow py-3 text-gray-300">
                  ${plan.price / 100} / {plan.interval}
                </p>
                {/* {!isLoading && ( */}
                <div className="block w-full rounded-md bg-white text-center text-sm font-semibold text-black hover:border hover:border-white hover:bg-pink-400 hover:text-white">
                  {showSubscribeButton && (
                    <button
                      className="w-full py-2"
                      onClick={processSubscription(plan.id)}
                    >
                      Subscribe
                    </button>
                  )}
                  {showCreateAccountButton && (
                    <button className="w-full py-2" onClick={openModal}>
                      Create Account
                    </button>
                  )}
                </div>
                {/* )} */}
              </div>
            ))}
          </div>
        </>
      </div>
    </>
  );
}
