/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Fragment, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Dialog, Transition } from "@headlessui/react";
import Formik from "formik";

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("This field is required"),
});

const LearnMoreModel = ({ show = false, onClose = () => null }) => {
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const closeModal = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // Reset modal
  useEffect(() => {
    if (!show) {
      // Wait for 200ms for aniamtion to finish
      setTimeout(() => {
        setDisabled(false);
        setConfirm(false);
        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 h-screen overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative my-8 inline-block w-full  transform overflow-hidden bg-gray-900 text-left align-middle shadow-xl transition-all sm:rounded-md">
              {/* Close icon */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 shrink-0 rounded-md p-1 text-4xl transition hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <div className="mx-2 mt-52 text-center">
                <h1 className="xs:text-5xl text-4xl font-extrabold text-gray-100 md:text-6xl">
                  <span className="text-white">How can legalmindz</span> help
                  you
                </h1>
                {/* <h2 className="xs:text-4xl text-3xl font-extrabold leading-tight text-gray-200 md:text-5xl">
            Get a <span className="text-white">Better</span> and{" "}
            <span className="text-white">Professionals</span> Design
          </h2> */}
              </div>
              <div className="container mx-auto flex flex-col flex-wrap items-center pt-24 md:flex-row md:pt-36">
                {/*Left Col*/}

                <div className="grid w-full grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Automatic legal document generation for any cause
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      You can quickly generate legal documents for their
                      personal needs, such as wills, contracts, and agreements..
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Legal advice from an AI assistant
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      You can ask legal questions to an AI-powered chatbot that
                      provides answers based on relevant laws and regulations.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Legalese simplification based on AI
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      You can input legal documents that are difficult to read
                      and have the AI simplify the language for better
                      understanding.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Access to legal resources
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      You wil access a library of legal resources, including
                      FAQs, legal guides, and templates.
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Consumer protection
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      Legalmindz will help you file complaints against
                      businesses and other entities that may have violated
                      consumer protection laws.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Small claims court
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      You can get assistance in filing and preparing for small
                      claims court cases, helping them navigate the legal
                      process with ease.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Family law
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      Legalmindz can assist you with legal issues related to
                      family law, such as divorce, child custody, and child
                      support.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Intellectual property
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      legalmindz can assist you with legal issues related to
                      intellectual property, such as trademarks, copyrights, and
                      patents.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Employment law
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      AIawyr can assist you with legal issues related to
                      employment law, such as discrimination, harassment, and
                      wrongful termination.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Landlord-tenant disputes
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      You can get assistance in navigating landlord-tenant
                      disputes, such as evictions, lease agreements, and
                      security deposits.
                    </p>
                  </div>
                </div>

                {/*Right Col*/}
                <div className="w-full overflow-hidden p-12 xl:w-3/5">
                  {/* <img
              className="mx-auto w-full -rotate-6 transform transition duration-700 ease-in-out hover:rotate-6 hover:scale-105 md:w-4/5"
              src="macbook.svg"
            /> */}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LearnMoreModel;
