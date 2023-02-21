import { Dialog, Transition } from "@headlessui/react";
import { prisma } from "../server/db";
import Link from "next/link";
import { Fragment, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Header";
import { getSession } from "next-auth/react";

export default function Documents({ pdf_files }) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  async function getUrl(file_name: string) {
    const { url } = await fetch(`api/getUrl/${file_name}`).then((res) =>
      res.json()
    );
    window.open(url, "_blank");
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
          <div className="py-8 px-12">
            <h1 className="py-4 text-2xl font-medium text-zinc-800">
              Your Documents
            </h1>

            {pdf_files.length === 0 ? (
              <h1 className="text-lg font-medium text-zinc-700">
                No Files Found
              </h1>
            ) : (
              <table>
                <thead className="">
                  <tr className="w-full border-b-2 border-b-zinc-700 py-3 text-left text-zinc-800">
                    <th>PDF File</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody className="">
                  {pdf_files.map((file: any) => (
                    <tr className="border-b-2">
                      <td className="cursor-pointer py-2">
                        <a
                          onClick={() => getUrl(file.file_name)}
                          target="_blank"
                          className="flex w-full items-center text-cyan-800 underline"
                        >
                          <span className="min-w-[300px] max-w-[400px] flex-grow truncate">
                            {file.file_name}
                          </span>
                          <span className="px-5">
                            <FiExternalLink />
                          </span>
                        </a>
                      </td>
                      <td className="py-2 pr-5">{file.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  let pdf_files = await prisma.pdfFile
    .findMany({
      where: { userId: session?.user?.id },
    })
    .then((res) => {
      res.map(
        (file) =>
          (file.created_at = `${file.created_at.getDate()}-${file.created_at.getMonth()}-${file.created_at.getFullYear()}`)
      );
      return res;
    });

  return {
    props: {
      pdf_files,
    },
  };
}
