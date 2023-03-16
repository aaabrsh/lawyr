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
                  <span className="text-white">How can Ailawyr</span> help you
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Your feature here
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      Your feature description summary here.
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Consumer protection
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      aiLawyr will help you file complaints against businesses
                      and other entities that may have violated consumer
                      protection laws.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Family law
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      AIlawyr can assist you with legal issues related to family
                      law, such as divorce, child custody, and child support.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                      Intellectual property
                    </h3>
                    <p className="mt-4 text-base text-gray-600 md:text-lg">
                      AIlawyr can assist you with legal issues related to
                      intellectual property, such as trademarks, copyrights, and
                      patents.
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-6 md:p-10">
                    <div className="inline-flex rounded-full bg-white p-4">
                      <svg
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
                        className="text-primary h-8 w-8 fill-current text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <defs>
                          <style
                            dangerouslySetInnerHTML={{
                              __html: ".fa-secondary{opacity:.4}",
                            }}
                          />
                        </defs>
                        <path
                          d="M560 224h-29.51a159.88 159.88 0 0 0-37.38-52.46L512 96h-32c-29.4 0-55.39 13.5-73 34.32-7.57-1.1-15.12-2.32-23-2.32H256c-94.82 0-160 78.88-160 160a159.75 159.75 0 0 0 64 128v80a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-48h128v48a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-80.72A160.37 160.37 0 0 0 511.28 384H560a16 16 0 0 0 16-16V240a16 16 0 0 0-16-16zm-128 64a16 16 0 1 1 16-16 16 16 0 0 1-16 16z"
                          className="fa-secondary"
                        />
                        <path d="M51.26 255.52a24 24 0 0 1-18.74-28.3C34.74 215.82 45.4 208 57 208h1a6 6 0 0 0 6-6v-20a6 6 0 0 0-6-6C29.5 176 4.1 196.4.47 224.62a54.64 54.64 0 0 0-.47 7.23A56.08 56.08 0 0 0 56 288h40a155.05 155.05 0 0 1 3.37-32H56a23.63 23.63 0 0 1-4.74-.48zM432 256a16 16 0 1 0 16 16 16 16 0 0 0-16-16zM306.5 0a96 96 0 0 0-88.81 132.51A162.64 162.64 0 0 1 256 128h128a104.31 104.31 0 0 1 12.71.88A96.06 96.06 0 0 0 306.5 0z" />
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
