/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Dialog, Transition } from "@headlessui/react";
import { prisma } from "../server/db";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Header";
import { getSession } from "next-auth/react";
import useStore from "../../store/useStore";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Documents({ pdf_files }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [active, setActive] = useState(false);
  const { addPdfFile } = useStore();
  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  async function handleLinkClick(fileName: string) {
    let response = await fetch(`/api/aws/download/${fileName}`);

    if (response.status >= 400) {
      console.error("Failed to get object");
      return;
    }

    let pdfBlob = await response.blob();
    addPdfFile(pdfBlob);
    router.push("/copilot");
  }

  function handleDeleteClick(fileId: any) {
    setFileToDelete(fileId);
    setIsModalOpen(true);
  }

  async function deleteFile() {
    if (fileToDelete) {
      toast.loading("Loading...")
      await axios.delete(`/api/aws/delete/${fileToDelete}`);
      closeConfirmationModal();
      router.reload();
    }
  }

  function closeConfirmationModal() {
    setFileToDelete(null);
    setIsModalOpen(false);
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
                    <th>File Name</th>
                    <th className="pr-5">Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="">
                  {pdf_files.map((file: any) => (
                    <tr className="border-b-2" key={file.id}>
                      <td className="cursor-pointer py-2">
                        <div
                          onClick={() => handleLinkClick(file.file_name)}
                          className="flex w-full items-center text-cyan-800 underline"
                        >
                          <span className="min-w-[300px] max-w-[400px] flex-grow">
                          {file.file_name}
                          </span>
                          <span className="px-5">
                            <FiExternalLink />
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pr-5">{file.created_at}</td>
                      <td className="py-2">
                        <AiFillDelete
                          onClick={() => handleDeleteClick(file.id)}
                          className="m-auto cursor-pointer text-xl text-red-500"
                        />
                      </td>
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeConfirmationModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Do You Want to Delete the Selected File?
                  </Dialog.Title>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-red-900 bg-red-300 px-4 py-2 text-sm font-medium hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeConfirmationModal}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-green-900 bg-green-300 px-4 py-2 text-sm font-medium hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={deleteFile}
                    >
                      Yes
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  //redirect to home page if user is not logged in
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const customer = await prisma.customer.findFirst({
    where: {
      userId: session.user?.id
    }
  })

  if(!customer || !customer.billingPlan){
    return {
      redirect: {
        destination: "/setting",
        permanent: false
      }
    }
  }

  let pdf_files = await prisma.pdfFile
    .findMany({
      where: { userId: `${session?.user?.id}` },
    })
    .then((res) => {
      res.map(
        (file) =>
          (file.created_at = `${file.created_at.getDate()}-${file.created_at.getMonth()}-${file.created_at.getFullYear()}`)
      );
      return res;
    })
    .catch(() => {
      return [];
    });

  return {
    props: {
      pdf_files,
    },
  };
}
