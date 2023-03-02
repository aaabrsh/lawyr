/* eslint-disable @typescript-eslint/ban-ts-comment */
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
// import ConvertKitForm from "convertkit-react";

const MY_FORM_ID = 4900122;

export default function SubscribeForm({ show = false, onClose = () => null }) {
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    setTimeout(() => setShowModal(true), 3000);
  }, []);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://fabulous-inventor-5051.ck.page/36d6fb58ad/index.js";
    script.async = true;
    // script.data-uid = "36d6fb58ad";

    document.body.appendChild(script);

    // return () => {
    //   document.body.removeChild(script);
    // };
  }, []);

  return (
    <>
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
                  close
                </button>

                <section className="overflow-hidden bg-white py-32">
                  <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-xl text-center">
                      <div className="relative mx-auto mb-6 h-16 w-16 rounded-full bg-indigo-600">
                        <img
                          className="absolute top-0 left-0"
                          src="flaro-assets/images/applications/blur.svg"
                          alt=""
                        />
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 transform">
                          <svg
                            width={40}
                            height={40}
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.00098 13.3335L18.152 22.1008C19.2716 22.8473 20.7303 22.8473 21.85 22.1008L35.001 13.3335M8.33431 31.6668H31.6676C33.5086 31.6668 35.001 30.1744 35.001 28.3335V11.6668C35.001 9.82588 33.5086 8.3335 31.6676 8.3335H8.33431C6.49336 8.3335 5.00098 9.82588 5.00098 11.6668V28.3335C5.00098 30.1744 6.49336 31.6668 8.33431 31.6668Z"
                              stroke="white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <h2 className="font-heading tracking-px-n mb-3 text-center text-6xl font-bold leading-tight md:text-7xl">
                        Join Our Newsletter
                      </h2>
                      <p className="mb-11 font-medium leading-relaxed text-gray-600">
                        Lorem ipsum dolor sit amet, to the consectr adipiscing
                        elit. Volutpat tempor to the condimentum vitae vel
                        purus.
                      </p>
                      <form className="mb-9">
                        <div className="mb-5">
                          <input
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-500 placeholder-gray-500 outline-none focus:ring focus:ring-indigo-300"
                            id="newsletterInput1-1"
                            type="text"
                            placeholder="First & last name"
                          />
                        </div>
                        <div className="mb-5">
                          <input
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-medium text-gray-500 placeholder-gray-500 outline-none focus:ring focus:ring-indigo-300"
                            id="newsletterInput1-2"
                            type="text"
                            placeholder="Email address"
                          />
                        </div>
                        <button
                          className="shadow-4xl w-full rounded-xl border border-indigo-700 bg-indigo-600 py-4 px-6 font-semibold text-white transition duration-200 ease-in-out hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
                          type="button"
                        >
                          Subscribe Now
                        </button>
                      </form>
                      <div className="-m-1.5 flex flex-wrap items-center justify-center">
                        <div className="w-auto p-1.5">
                          <svg
                            width={16}
                            height={16}
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.00033 10.0002V11.3336M4.00033 14.0002H12.0003C12.7367 14.0002 13.3337 13.4033 13.3337 12.6669V8.66691C13.3337 7.93053 12.7367 7.33358 12.0003 7.33358H4.00033C3.26395 7.33358 2.66699 7.93053 2.66699 8.66691V12.6669C2.66699 13.4033 3.26395 14.0002 4.00033 14.0002ZM10.667 7.33358V4.66691C10.667 3.19415 9.47308 2.00024 8.00033 2.00024C6.52757 2.00024 5.33366 3.19415 5.33366 4.66691V7.33358H10.667Z"
                              stroke="#A1A1AA"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div className="w-auto p-1.5">
                          <p className="font-sans text-sm text-gray-600">
                            We never share your information to any third party
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
  //   <ConvertKitForm formId={MY_FORM_ID} />
}
