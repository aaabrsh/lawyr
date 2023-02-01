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

// import axios from "axios";
export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const { data: session } = useSession();
  const [selected, setSelected] = useState("gptneo");
  const user = session?.user?.email;
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

  const cart = {
    name: "Subscripbe to sota models",
    imageUrl:
      "https://media.licdn.com/dms/image/D4E0BAQG7ffm-PF-X7w/company-logo_200_200/0/1666418506733?e=1681948800&v=beta&t=PGp3wGjbUiHUUBhmZ-kQdrnWXMWn61dNWfeLXazXAu4",
    price: 40,
    qty: 1,
    id: "sub",
  };
  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();
    stripe.redirectToCheckout({ sessionId: data.id });
  };

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
          <div className="mx-auto max-w-2xl py-16 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Chat start */}
            <>
              {/* component */}
              <button
                className="my-2 flex w-full items-center justify-center rounded-lg bg-blue-900 py-2 font-bold text-white"
                onClick={(e) => {
                  e.preventDefault();
                  checkout(
                    {
                      lineItems: [
                        {
                          price: process.env.PRODUCT,
                          quantity: 1,
                        },
                      ],
                    },
                    selected
                  );
                }}
              >
                Continue with stripe
              </button>
            </>
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
