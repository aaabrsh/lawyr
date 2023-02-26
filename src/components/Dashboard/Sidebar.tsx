/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { Disclosure } from "@headlessui/react";

import {
  AiFillCode,
  AiTwotoneFileText,
  AiTwotoneSound,
  AiTwotoneVideoCamera,
  AiFillFilePdf,
} from "react-icons/ai";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

export default function Sidebar({ active, setActive }: any) {
  const router = useRouter();
  //   const [active, setActive] = useState(false);
  console.log(router.pathname.replace(/\//g, ""));
  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();
  const data = [
    {
      name: "Dashboard",
      icon: AiFillCode,
      link: "/dashboard",
      items: [],
    },
    {
      name: "Documents",
      icon: AiFillFilePdf,
      link: "/documents",
      items: [],
    },
    {
      name: "Chat",
      icon: AiFillCode,
      link: "/chat",
      items: [],
    },

    {
      name: "Services",
      icon: AiTwotoneFileText,
      link: "/catagories",
      items: [],
    },
    {
      name: "Legalese",
      icon: AiTwotoneFileText,
      link: "/legalese",
      items: [],
    },
    {
      name: "Copilot",
      icon: AiTwotoneFileText,
      link: "/copilot",
      items: [],
    },
    {
      name: "Sign Documents",
      icon: AiTwotoneFileText,
      link: "/sign",
      items: [],
    },
    {
      name: "Plans",
      icon: AiTwotoneFileText,
      link: "/plans",
      items: [],
    },
  ];
  const showMore = () => {
    controls.start({
      width: "250px",
      transition: { duration: 0.1 },
    });
    controlText.start({
      opacity: 1,
      display: "block",
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });

    setActive(true);
  };
  const showLess = () => {
    controls.start({
      width: "0px",
      transition: { duration: 0.1 },
    });
    controlText.start({
      opacity: 0,
      display: "none",
      transition: { delay: 0.3 },
    });

    controlTitleText.start({
      opacity: 0,
    });

    setActive(false);
  };
  useEffect(() => {
    showMore();
  }, []);

  return (
    <motion.div>
      {!active && (
        <div className=" cursor-pointer">
          <BsFillArrowRightSquareFill
            onClick={showMore}
            className=" cursor-pointer text-2xl text-white"
          />
        </div>
      )}
      <div
        className={
          active
            ? "  h-full items-center rounded rounded-tr-md bg-[#fff] bg-gray-200 text-gray-700 shadow-2xl"
            : "  hidden   rounded-tr-md opacity-0 duration-1000 "
        }
      >
        <motion.div
          animate={controls}
          className="animate  group relative flex min-h-screen max-w-[250px] flex-col border-r py-10 duration-300 "
        >
          {active && (
            <BsFillArrowLeftSquareFill
              onClick={showLess}
              className="absolute -right-5 top-10 cursor-pointer text-2xl group-hover:block "
            />
          )}
          <div className="grow ">
            {data.map((group) => (
              <div key={group.name} className="my-2">
                <motion.div
                  animate={controlTitleText}
                  className="mb-2 ml-4 flex items-center text-lg font-bold text-gray-600"
                >
                  <Link
                    className={
                      router.pathname.replace(/\//g, "") ==
                      group.name.toLowerCase()
                        ? "mt-2 flex h-12 w-full items-center rounded bg-gray-300 px-3"
                        : "mt-2 flex h-12 w-full items-center rounded px-3 hover:bg-gray-300"
                    }
                    href={group.link}
                  >
                    <group.icon className="mr-1 text-lg text-pink-500" />

                    {group.name}
                  </Link>
                </motion.div>

                {group.items.map((item) => (
                  <motion.p
                    key={item.title}
                    animate={controlText}
                    className={`${
                      item.activeMenu &&
                      "ml-4 mr-32 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4  py-1 text-gray-200"
                    }ml-4 mr-3 cursor-pointer rounded-lg from-indigo-500 via-purple-500 to-pink-500 px-4  py-1 text-sm font-bold text-gray-400 hover:bg-gradient-to-r hover:text-gray-200`}
                  >
                    <Link href={item.link}>{item.title}</Link>
                  </motion.p>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
