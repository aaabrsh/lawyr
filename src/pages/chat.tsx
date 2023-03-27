/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import Head from "next/head";
import globalMeta from "../../globalmeta";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import Image from "next/image";
import Catagories from "../components/Dashboard/Catagories";
import { prisma } from "../server/db";
import { pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
import { toast } from "react-hot-toast";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// import axios from "axios";
export default function Chat({ pdf_files, chat }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [context, setContext] = useState({});
  const { data: session } = useSession();
  const user = session?.user?.email;

  function closeModal() {
    setIsOpen(false);
  }
  function openStartModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    getPdfFiles(pdf_files);
    setChatHistory(chat);
  }, [pdf_files]);

  async function getPdfFiles(files: any[]) {
    files.forEach(async (file: any, index: number) => {
      let response = await fetch(`/api/aws/download/${file.file_name}`);

      if (response.status >= 400) {
        console.error("Failed to get object");
        return;
      }

      let pdfBlob = await response.blob();

      const fileType = pdfBlob.type;
      let fileFromBlob = new File([pdfBlob], file.file_name, {
        type: fileType,
      });

      const reader = new FileReader();

      reader.onload = async () => {
        const fileData = new Uint8Array(reader.result);

        // Load the PDF file and get the first page
        const loadingTask = pdfjs.getDocument({
          data: fileData,
        });
        const pdf = await loadingTask.promise;
        const totalPagesCount = pdf.numPages;
        let text = "";

        // Loop over all pages and extract text content
        for (let i = 1; i <= totalPagesCount; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + " ";
        }

        text = text.trim();
        let contextKey = `document ${index + 1}`;
        setContext((currentContext) => ({
          ...currentContext,
          [contextKey]: text,
        }));
      };
      reader.readAsArrayBuffer(fileFromBlob);
    });
  }

  function handleInputTextChange(event: any) {
    setInputText(event.target.value);
  }

  function handleChatInput() {
    let input = inputText;
    let data = { sender: "user", text: input, userId: session?.user?.id };
    if (input !== "") {
      setChatHistory((history) => [...history, data]);
      chatWithOpenai(input);
      setInputText("");
      saveChat(data);
    }
  }

  async function chatWithOpenai(text: string) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: text,
        context: JSON.stringify(context),
      }),
    };

    const domain = window.location.hostname;
    const protocol = window.location.protocol;
    const apiUrl = `${protocol}//${domain}:8000/api/chat`;

    let response = await fetch(apiUrl, requestOptions)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    let data = { sender: "bot", text: response, userId: session?.user?.id };
    setChatHistory((history) => [...history, data]);
    saveChat(data);
  }

  function saveChat(data: any) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    };
    fetch("/api/chat", requestOptions);
  }

  return (
    <>
      <Head>
        <title>Ailawyr Chat - Your AI Assistant Lawyer</title>
        <meta
          name="description"
          content="Ailawyr Chat is your AI assistant lawyer, providing fast and efficient legal advice and support. Our AI-powered chatbot can assist with legal questions, document review, and more."
        />

        {/*
        	Open graph meta tags.
    	*/}
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={globalMeta.siteName} />
        <meta property="og:type" content={globalMeta.ogType} />
        <meta property="og:description" content={globalMeta.description} />
        <meta property="og:image" content={globalMeta.siteLogo} />
        <meta property="og:url" content={globalMeta.canonicalUrl} />
      </Head>
      <Header />
      <div className="bg-[#fdfdff] sm:flex">
        <div className=" flex-none ">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div className={active ? "flex-1 duration-1000 sm:block" : "flex-1"}>
          <div className="mx-auto max-w-2xl py-16 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Chat start */}
            <>
              {/* component */}
              <div className="p:2 flex h-screen flex-1 flex-col justify-between sm:p-6">
                <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
                  <div className="relative flex items-center space-x-4">
                    <div className="relative">
                      <span className="absolute right-0 bottom-0 text-green-500">
                        <svg width={20} height={20}>
                          <circle cx={8} cy={8} r={8} fill="currentColor" />
                        </svg>
                      </span>
                      <Image
                        src="/logosmall.png"
                        width="200"
                        height="50"
                        alt=""
                        className="h-10 w-10 rounded-full sm:h-16 sm:w-16"
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="mt-1 flex items-center text-2xl">
                        <span className="mr-3 text-gray-700">AI Lawyr</span>
                      </div>
                      <span className="text-lg text-gray-600">
                        your only lawyer
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  id="messages"
                  className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col space-y-4 overflow-y-auto p-3"
                >
                  <div className="chat-message">
                    <div className="flex items-end">
                      <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
                        <div>
                          <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                            Hello 👋, how can I help you?
                          </span>
                        </div>
                      </div>
                      <img
                        src="logosmall.png"
                        alt="My profile"
                        className="order-1 h-6 w-6 rounded-full"
                      />
                    </div>
                  </div>
                  {chatHistory.map((chat: any, index: number) => (
                    <div key={index}>
                      {chat.sender === "user" && (
                        <>
                          <div className="chat-message">
                            <div className="flex items-end justify-end">
                              <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
                                <div>
                                  <span className="inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white ">
                                    {chat.text}
                                  </span>
                                </div>
                              </div>
                              <img
                                src={session?.user?.image ?? ""}
                                alt="My profile"
                                className="order-2 h-6 w-6 rounded-full"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {chat.sender === "bot" && (
                        <>
                          <div className="chat-message">
                            <div className="flex items-end">
                              <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
                                <div>
                                  <span className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
                                    {chat.text}
                                  </span>
                                </div>
                              </div>
                              <img
                                src="logosmall.png"
                                alt="My profile"
                                className="order-1 h-6 w-6 rounded-full"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="fixed bottom-0 mb-2 w-3/5 border-t-2 border-gray-200 px-4 pt-4 sm:mb-0">
                  <div className="relative flex">
                    <span className="absolute inset-y-0 flex items-center">
                      <button
                        type="button"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                      </button>
                    </span>
                    <input
                      type="text"
                      placeholder="Write your message!"
                      className="w-full rounded-md bg-gray-200 py-3 pl-12 text-gray-600 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
                      value={inputText}
                      onChange={handleInputTextChange}
                    />
                    <div className="absolute inset-y-0 right-0 hidden items-center sm:flex">
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleChatInput}
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-white transition duration-500 ease-in-out hover:bg-blue-400 focus:outline-none"
                      >
                        <span className="font-bold">Send</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="ml-2 h-6 w-6 rotate-90 transform"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    "\n.scrollbar-w-2::-webkit-scrollbar {\n  width: 0.25rem;\n  height: 0.25rem;\n}\n\n.scrollbar-track-blue-lighter::-webkit-scrollbar-track {\n  --bg-opacity: 1;\n  background-color: #f7fafc;\n  background-color: rgba(247, 250, 252, var(--bg-opacity));\n}\n\n.scrollbar-thumb-blue::-webkit-scrollbar-thumb {\n  --bg-opacity: 1;\n  background-color: #edf2f7;\n  background-color: rgba(237, 242, 247, var(--bg-opacity));\n}\n\n.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n}\n",
                }}
              />
            </>
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
      userId: session.user?.id,
    },
  });

  // if (!customer || !customer.billingPlan) {
  //   return {
  //     redirect: {
  //       destination: "/setting",
  //       permanent: false,
  //     },
  //   };
  // }

  let pdf_files = await prisma.pdfFile
    .findMany({
      where: { userId: `${session?.user?.id}` },
      select: {
        id: true,
        file_name: true,
      },
    })
    .catch(() => {
      return [];
    });

  let chat = await prisma.chat.findMany({
    where: {
      userId: session.user?.id,
    },
  });

  return {
    props: {
      pdf_files,
      chat,
    },
  };
}
