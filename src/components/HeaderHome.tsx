/* eslint-disable @next/next/no-img-element */
/* This example requires Tailwind CSS v2.0+ */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState, Fragment } from "react";
import Head from "next/head";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModel";
import { menuItems, navigation } from "../utils/header";
import {
  ArrowDownIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === "loading";
  const [showModal, setShowModal] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const inputHandler = (e) => {
    //convert input text to lower case
    // const lowerCase = e.target.value.toLowerCase();
    // setInputText(lowerCase);
    // console.log(inputText);
    // // const useStore = create((set) => ({
    // //   searchText: inputText,
    // // }));
    // addsearchText(inputText);
    // if ((inputText = "")) {
    //   removeSearchText();
    // }
  };

  const handleClear = (e) => {
    if (!e.target.value.length) {
      console.log(e);
      console.log("clear");
    }
  };

  const toggleSearch = (event) => {
    // 👇️ toggle visibility
    setIsSearchVisible((current) => !current);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    // window.$crisp = [];
    // window.CRISP_WEBSITE_ID = "5e14e397-dbda-4e17-a12e-b12ffdbfde2b";
    // (() => {
    //   const d = document;
    //   const s = d.createElement("script");
    //   s.src = "https://client.crisp.chat/l.js";
    //   s.async = 1;
    //   d.getElementsByTagName("body")[0].appendChild(s);
    // })();
  });

  return (
    <>
      <Head>
        <title>Sota Models - Customize AI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <script async src="https://cdn.splitbee.io/sb.js"></script> */}
      </Head>
      <Disclosure as="nav" className="">
        {(open) => (
          <>
            <div className="mx-auto max-w-7xl px-2 pt-3 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <ArrowDownIcon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <div className="block w-auto lg:hidden">
                      {/* <a
                        className="flex items-center text-2xl font-bold text-indigo-400 no-underline hover:no-underline lg:text-4xl"
                        href="#"
                      >
                        AI
                        <span className="bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                          Lawyr
                        </span>
                      </a> */}
                      <Link href={"/"}>
                        <Image
                          // className="block lg:hidden h-8 w-auto"
                          src="/logo.png"
                          alt="Workflow"
                          width="200"
                          height="50"
                        />
                      </Link>
                    </div>
                    <div className="hidden w-auto lg:contents ">
                      <Link href={"/"}>
                        <Image
                          src="/logo.png"
                          alt="Workflow"
                          width="250"
                          height="60"
                        />
                      </Link>
                      {/* <a
                        className="flex items-center text-2xl font-bold text-indigo-400 no-underline hover:no-underline lg:text-4xl"
                        href="#"
                      >
                        AI
                        <span className="bg-gradient-to-r from-green-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                          Lawyr
                        </span>
                      </a> */}
                    </div>
                  </div>
                  <div className="mt-3 hidden sm:ml-6 sm:block md:w-auto">
                    <div className="flex md:space-x-4">
                      {navigation.map((item) => (
                        // <Link href={item.href} key={item.name}>
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.name
                              ? "text-white"
                              : "hover:text-pink text-white hover:bg-gray-700",
                            "rounded-md px-2 py-2 text-sm font-medium"
                          )}
                          aria-current={item.name ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                        // </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div className=" mt-10 flex flex-col gap-2 md:mt-0 md:flex-row">
                      {/* <Link href={"/sales"}> */}
                      <a
                        href={"/sales"}
                        className="ml-5 items-center rounded-md pt-1 align-middle text-white hover:bg-gray-700 hover:text-pink-500"
                      >
                        Talk to sales
                      </a>
                      {/* </Link> */}
                      {isLoadingUser ? (
                        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
                      ) : user ? (
                        <Menu as="div" className="relative z-50">
                          <Menu.Button className="group flex items-center space-x-px">
                            <div className="relative ml-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 md:ml-0">
                              {user?.image ? (
                                <img
                                  src={user?.image}
                                  alt={user?.name || "Avatar"}
                                  layout="fill"
                                />
                              ) : (
                                <UserIcon className=" text-pink-500" />
                              )}
                            </div>
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-1 w-72 origin-top-right divide-y divide-gray-700 overflow-hidden rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="mb-2 flex items-center space-x-2 py-4 px-4">
                                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                                  {user?.image ? (
                                    <img
                                      src={user?.image}
                                      alt={user?.name || "Avatar"}
                                      layout="fill"
                                    />
                                  ) : (
                                    <UserIcon className="h-6 w-6 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex flex-col truncate text-gray-400">
                                  <span>{user?.name}</span>
                                  <span className="text-sm text-gray-500">
                                    {user?.email}
                                  </span>
                                </div>
                              </div>

                              <div className="py-2">
                                {menuItems.map(
                                  ({ label, href, onClick, icon: Icon }) => (
                                    <div
                                      key={label}
                                      className="px-2 last:mt-2 last:border-t last:pt-2 "
                                    >
                                      <Menu.Item>
                                        {href ? (
                                          //   <Link href={href}>
                                          <a className="flex items-center space-x-2 rounded-md py-2 px-4 text-gray-500 hover:bg-gray-500 hover:text-pink-400 ">
                                            <Icon className="h-5 w-5 shrink-0 " />
                                            <span className="  ">{label}</span>
                                          </a>
                                        ) : (
                                          //   </Link>
                                          <button
                                            className="flex w-full items-center space-x-2 rounded-md py-2 px-4 text-gray-500 hover:bg-gray-500 hover:text-pink-500"
                                            onClick={onClick}
                                          >
                                            <Icon className="h-5 w-5 shrink-0 " />
                                            <span className=" ">{label}</span>
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  )
                                )}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <button
                          type="button"
                          onClick={openModal}
                          className="ml-4 rounded-md bg-pink-400 px-4 py-1 text-white transition hover:bg-pink-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
                        >
                          Log in
                        </button>
                      )}
                    </div>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.name
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.name ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Partnerships
                      <ChevronDownIcon
                        className={`${open ? "" : "text-opacity-70"}
                      ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  ></Transition>
                </Menu>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div
        className="relative w-full bg-gray-600 shadow-xl transition delay-150 ease-in-out"
        id="search-content"
        style={{
          display: isSearchVisible ? "block" : "none",
        }}
      >
        <div className="container mx-auto py-4 text-white">
          <input
            id="searchfield"
            type="search"
            placeholder="Search..."
            autoFocus="autofocus"
            onChange={inputHandler}
            // onComm={handleClear}
            className="w-full appearance-none bg-gray-600 p-2 text-xl leading-normal text-white transition focus:border-transparent focus:outline-none lg:text-2xl"
          />
        </div>
      </div>
      <AuthModal show={showModal} onClose={closeModal} />
    </>
  );
}
