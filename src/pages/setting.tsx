/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { getSession } from "next-auth/react";
import Header from "../components/Header";
import initStripe from "stripe";
import { prisma } from "../server/db";
import UserForm from "../components/Setting/UserForm";
import Plans from "../components/Plans";
import axios from "axios";

export default function PlanSetting({ session, user, plans, customer }) {
  let initial_data = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    country: user?.country ?? "",
    dob: user?.dob ?? "",
    street_address: user?.street_address ?? "",
    city: user?.city ?? "",
    state: user?.state ?? "",
    zip_code: user?.zip_code ?? "",
    license_country: user?.license_country ?? "",
    license_state: user?.license_state ?? "",
    company_name: user?.company_name ?? "",
  };
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

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
          <Plans plans={plans} customer={customer} user={user} />
          {!session?.user && (
            <UserForm user={initial_data} id={user?.id} customer={customer} />
          )}
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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  // check if user is signed in
  //   if (!session) {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }

  //get plans
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price: any) => {
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
  const sortedPlans = plans.sort((a: any, b: any) => a.price - b.price);

  //get current user data
  let user: any = {};
  let customer: any = null;
  try {
    user = await prisma.user
      .findFirst({
        where: {
          id: session?.user?.id,
        },
      })
      .then((res) => {
        if (res && res.dob) {
          let year = res.dob.getFullYear();
          let month: any = res.dob.getMonth();
          if (month < 10) {
            month = `0${month}`;
          }
          let date = res.dob.getDate();
          if (date < 10) {
            date = `0${date}`;
          }
          res.dob = `${year}-${month}-${date}`;
        }
        return res;
      });

    //get customer information
    let id = session?.user?.id;
    let data = await fetch(`/api/customers/${id}`).then((res) => res.json());
    customer = data?.customer;
  } catch (err) {
    console.log(err);
  }
  return {
    props: {
      plans: sortedPlans,
      session,
      user,
      customer,
    },
  };
}
