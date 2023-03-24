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
import useStore from "../../store/useStore";

import {
  BsFillArrowLeftSquareFill,
  BsFillArrowDownSquareFill,
} from "react-icons/bs";

import { IoIosArrowDown } from "react-icons/io";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Search() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === "loading";
  const [showModal, setShowModal] = useState(false);
  const { addsearchText, removeSearchText } = useStore();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  let [inputText, setInputText] = useState("");

  useEffect(() => {
    addsearchText(inputText);
    if ((inputText = "")) {
      removeSearchText();
    }
  }, [inputText]);

  const inputHandler = (e) => {
    //convert input text to lower case
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
    // const useStore = create((set) => ({
    //   searchText: inputText,
    // }));
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
      {/* <Head>
        <title>Sota Models - Customize AI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head> */}

      <div className="max-w-2x mx-auto lg:max-w-5xl ">
        <div className="relative flex h-12 w-full items-center overflow-hidden rounded-lg bg-white shadow-lg focus-within:shadow-xl">
          <div className="grid h-full w-12 place-items-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            className="peer h-full w-full pr-2 text-sm text-gray-700 outline-none"
            id="searchfield"
            type="search"
            onChange={inputHandler}
            placeholder="Search something.."
          />
        </div>
      </div>

      <AuthModal show={showModal} onClose={closeModal} />
    </>
  );
}
