/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import Head from "next/head";
import React, { useEffect, useState, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import AuthModal from "../components/AuthModel";
// import {menuItems,navigation} from "../utils/header"
import {
  ArrowDownIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

import Header from "../components/HeaderHome";

export default function Home() {
  // const { data: session, status } = useSession();
  // const user = session?.user;
  // const isLoadingUser = status === "loading";
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <body
        className="m-6 h-full bg-cover bg-fixed leading-normal tracking-normal text-indigo-400"
        style={{
          backgroundImage: 'url("lady.png")',
          backdropFilter: "blur(50px)",
        }}
      >
        {/*Nav*/}
        <Header />
        {/* <div className="container mx-auto w-full">
      <div className="flex w-full items-center justify-between">
        <a
          className="flex items-center text-2xl font-bold text-indigo-400 no-underline hover:no-underline lg:text-4xl"
          href="#"
        >
          AI
          <span className="bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Lawyr
          </span>
        </a>
        <div className="flex w-1/2 content-center justify-end">
          <a
            className="hover:text-underline inline-block h-10 transform p-2 text-center text-blue-300 no-underline duration-300 ease-in-out hover:scale-125 hover:text-pink-500 md:h-auto md:p-4"
            href="https://twitter.com/intent/tweet?url=#"
          >
            <svg
              className="h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
            >
              <path d="M30.063 7.313c-.813 1.125-1.75 2.125-2.875 2.938v.75c0 1.563-.188 3.125-.688 4.625a15.088 15.088 0 0 1-2.063 4.438c-.875 1.438-2 2.688-3.25 3.813a15.015 15.015 0 0 1-4.625 2.563c-1.813.688-3.75 1-5.75 1-3.25 0-6.188-.875-8.875-2.625.438.063.875.125 1.375.125 2.688 0 5.063-.875 7.188-2.5-1.25 0-2.375-.375-3.375-1.125s-1.688-1.688-2.063-2.875c.438.063.813.125 1.125.125.5 0 1-.063 1.5-.25-1.313-.25-2.438-.938-3.313-1.938a5.673 5.673 0 0 1-1.313-3.688v-.063c.813.438 1.688.688 2.625.688a5.228 5.228 0 0 1-1.875-2c-.5-.875-.688-1.813-.688-2.75 0-1.063.25-2.063.75-2.938 1.438 1.75 3.188 3.188 5.25 4.25s4.313 1.688 6.688 1.813a5.579 5.579 0 0 1 1.5-5.438c1.125-1.125 2.5-1.688 4.125-1.688s3.063.625 4.188 1.813a11.48 11.48 0 0 0 3.688-1.375c-.438 1.375-1.313 2.438-2.563 3.188 1.125-.125 2.188-.438 3.313-.875z" />
            </svg>
          </a>
          <a
            className="hover:text-underline inline-block h-10 transform p-2 text-center text-blue-300 no-underline duration-300 ease-in-out hover:scale-125 hover:text-pink-500 md:h-auto md:p-4"
            href="https://www.facebook.com/sharer/sharer.php?u=#"
          >
            <svg
              className="h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
            >
              <path d="M19 6h5V0h-5c-3.86 0-7 3.14-7 7v3H8v6h4v16h6V16h5l1-6h-6V7c0-.542.458-1 1-1z" />
            </svg>
          </a>
        </div>
      </div>
    </div> */}
        {/*Main*/}
        <div className="mx-2 mt-52 text-center">
          <h1 className="xs:text-5xl text-4xl font-extrabold text-gray-100 md:text-6xl">
            <span className="text-white">AILawyr for</span> Companies
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
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Legal research and analysis
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Conduct legal research quickly and efficiently with our
                AI-powered legal research tool. Our platform provides access to
                a vast database of legal information and analyzes it to provide
                relevant and accurate results.
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Contract Drafting and Review
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Generate and review legal contracts with ease using our
                AI-powered platform. Our tool ensures that your contracts are
                accurate, complete, and legally sound.
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
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Compliance Management
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Stay up-to-date with changing regulations and maintain
                compliance with our AI-powered compliance management tool. We
                offer customized compliance solutions tailored to your business
                needs.
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
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Document Management
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Manage and organize all your legal documents in one centralized
                location with our document management tool. Our platform makes
                it easy to search, filter, and access all your legal documents.
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
                    d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Trademark Monitoring
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Protect your brand and stay informed of any potential
                infringement with our trademark monitoring tool. Our AI-powered
                platform continuously scans trademark databases and alerts you
                of any potential issues.
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
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Risk Assessment
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Identify and mitigate potential legal risks with our AI-powered
                risk assessment tool. Our platform analyzes data and provides
                insights to help you make informed decisions and reduce legal
                liabilities.
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
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800 md:text-xl">
                Litigation Support
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Get the legal support you need for your business disputes with
                our AI-powered litigation support tool. Our platform provides
                valuable insights and analysis to help you build a strong case
                and increase your chances of success.
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
      </body>
      <AuthModal show={showModal} onClose={closeModal} />
    </>
  );
}
