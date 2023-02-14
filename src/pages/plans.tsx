/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import Image from "next/image";
import Catagories from "../components/Dashboard/Catagories";
import { checkout } from "../lib/getStripe";
import initStripe from "stripe";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import PlansList from "../components/Plans/PlansList";
import AuthModal from "../components/AuthModel";
import Subscription from "../components/Plans/Subscription";
import { useRouter } from "next/router";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Stripe from "stripe";

// import axios from "axios";
export default function Plans({ plans }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const [showAuthModal, setAuthModal] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const { data: session } = useSession();
  const [selected, setSelected] = useState("gptneo");
  const user = session?.user?.email;
  let {
    query: { success },
  } = useRouter();
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [isSuccessModal, setSuccessModalType] = useState<boolean>(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  //   const getFiles = async () => {
  //     const { data } = await axios.get(`/api/file?email=${user}`);
  //     const key = "title";
  //     const array = data.datas
  //     const arrayUniqueByKey = [
  //       ...new Map(array.map((item) => [item[key], item])).values(),
  //     ];

  //     setFiles(arrayUniqueByKey);
  //   };
  useEffect(() => {
    // getFiles();
  }, []);

  useEffect(() => {
    if (success?.toString().toLowerCase() === "subscribed") {
      setSuccessModal(true);
      setSuccessModalType(true);
    } else if (success?.toString().toLowerCase() === "failed") {
      setSuccessModal(true);
      setSuccessModalType(false);
    }
  }, [session]);

  useEffect(() => {
    //fetch the customer data using the id from session
    const fetchCustomer = async () => {
      let id = session?.user?.id;
      let { data } = await axios.get(`/api/customers/${id}`);
      let temp = data?.customer?.billingPlan
        ? {
            ...data.customer,
            customerName: session?.user?.name,
            email: session?.user?.email,
          }
        : null;
      setCustomerData(temp);
    };

    fetchCustomer();
  }, [session]);

  // const cart = {
  //   name: "Subscripbe to sota models",
  //   imageUrl:
  //     "https://media.licdn.com/dms/image/D4E0BAQG7ffm-PF-X7w/company-logo_200_200/0/1666418506733?e=1681948800&v=beta&t=PGp3wGjbUiHUUBhmZ-kQdrnWXMWn61dNWfeLXazXAu4",
  //   price: 40,
  //   qty: 1,
  //   id: "sub",
  // };
  // const handleCheckout = async () => {
  //   const stripe = await getStripe();

  //   const response = await fetch("/api/stripe", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(cart),
  //   });

  //   if (response.statusCode === 500) return;

  //   const data = await response.json();
  //   stripe.redirectToCheckout({ sessionId: data.id });
  // };

  const processSubscription = (planId) => async () => {
    const { data } = await axios.post(`/api/subscription/${planId}`, {
      userId: session?.user?.id,
    });
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;

  return (
    <>
      <Header />
      <div className="flex bg-[#fdfdff]">
        <div className=" flex-none ">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div
          className={active ? "hidden flex-1 duration-1000 sm:block" : "flex-1"}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-zinc-800 sm:text-center sm:text-4xl">
              Pricing Plans
            </h1>
            {customerData ? (
              <Subscription customer={customerData} />
            ) : (
              <PlansList
                plans={plans}
                showSubscribeButton={showSubscribeButton}
                showCreateAccountButton={showCreateAccountButton}
                openModal={() => setAuthModal(true)}
                processSubscription={processSubscription}
              />
            )}
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-blue-900 bg-opacity-25" />
          </Transition.Child>

          {/* <Options setIsOpen={setIsOpen} /> */}
        </Dialog>
      </Transition>
      <AuthModal show={showAuthModal} onClose={() => setAuthModal(false)} />
      {/* Modal to show after subscription session */}
      <Transition appear show={successModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSuccessModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-center text-5xl">
                    {isSuccessModal ? (
                      <AiOutlineCheckCircle className="rounded rounded-[50%] text-green-400" />
                    ) : (
                      <AiOutlineCloseCircle className="text-red-400" />
                    )}
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="py-2 text-center text-xl font-bold leading-6 text-gray-900"
                  >
                    {isSuccessModal ? (
                      <div>Payment Successful</div>
                    ) : (
                      <div>
                        Payment Cancelled
                        <div className="pt-2 text-sm">
                          You Have Not Been Charged!
                        </div>
                      </div>
                    )}
                  </Dialog.Title>

                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      className={
                        "rounded-md border border px-4 py-2 text-center text-sm font-medium focus:outline-none" +
                        (isSuccessModal
                          ? " border-green-400 bg-green-100 text-green-400"
                          : " border-red-400 bg-red-100 text-red-400")
                      }
                      onClick={() => setSuccessModal(false)}
                    >
                      close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      ;
    </>
  );
}
// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// }

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};
