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
                Your feature here
              </h3>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Your feature description summary here.
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
