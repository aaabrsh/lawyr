// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import Head from "next/head";
import globalMeta from "../../globalmeta";
import { useState, Fragment, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../../pdf-worker";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSession, getSession } from "next-auth/react";
import Header from "../components/Header";
import Image from "next/image";
import { useRef } from "react";
import useStore from "../../store/useStore";
import { prisma } from "../server/db";
import { toast } from "react-hot-toast";

// import axios from "axios";

export default function Copilot({ plans }) {
  const [legalese, setLegalese] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageScale, setPageScale] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputText, setInputText] = useState("");
  const [context, setContext] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const ref = useRef(null);
  const user = session?.user?.email;
  const { blobFile } = useStore();

  useEffect(() => {
    loadPdf();
  }, []);

  useEffect(() => {
    if (file) {
      getPdfText(file);
    }
  }, [file]);

  async function loadPdf() {
    if (blobFile) {
      const fileType = blobFile.type;
      const file = new File([blobFile], "pdf.pdf", { type: fileType });

      setFile(file);
    } else {
      try {
        const response = await fetch("../../pdf.pdf");

        const pdfBlob = await response.blob();

        const fileType = pdfBlob.type;
        const file = new File([pdfBlob], "pdf.pdf", { type: fileType });

        setFile(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function getPdfText(pdfFile) {
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
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + " ";
      }

      setContext(text.trim());
    };

    reader.readAsArrayBuffer(pdfFile);
  }

  function handleNext() {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  }
  function handlePrevious() {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  }

  function handleZoomIn() {
    if (pageScale < 3) {
      setPageScale(pageScale + 0.2);
    }
  }

  function handleZoomOut() {
    if (pageScale > 0.3) {
      setPageScale(pageScale - 0.2);
    }
  }

  function onFileChange(event) {
    setFile(event.target.files[0]);
    setPageNumber(1);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openStartModal() {
    setIsOpen(true);
  }

  const queryPrompt = (prompt) => {
    const DEFAULT_PARAMS = {
      model: "text-davinci-003",
      temperature: 0.3,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    fetch("/prompts/legalese.prompt")
      .then((response) => response.text())
      .then((text) => text.replace("$legalese", prompt))
      // .then((text) => text.replace("$legalese", JSON.stringify(legalese)))
      .then((prompt) => {
        console.log(prompt);

        const params = { ...DEFAULT_PARAMS, prompt: prompt };
      });
  };

  const handleClick = (event) => {
    setLegalese(ref.current.value);
    queryPrompt(legalese);
  };

  function inputSavedQuestion(text: string) {
    setChatHistory((history) => [...history, { sender: "user", text: text }]);
    if (text === "Draft a contract") {
      setChatHistory((history) => [
        ...history,
        {
          sender: "bot",
          text: "Please explain what kind of contract you need.",
        },
      ]);
    } else {
      chatWithOpenai(text);
    }
  }

  function handleInputTextChange(event: any) {
    setInputText(event.target.value);
  }

  function handleChatInput(event) {
    event.preventDefault();

    let input = inputText;
    if (input !== "") {
      if (chatHistory[chatHistory.length - 2]?.text === "Draft a contract") {
        input = `Draft a contract using the following information: ${input}`;
      }

      setChatHistory((history) => [
        ...history,
        { sender: "user", text: input },
      ]);
      chatWithOpenai(input);
      setInputText("");
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
        context: context,
      }),
    };

    const domain = window.location.hostname;
    const protocol = window.location.protocol;
    const apiUrl = `${protocol}//${domain}:8000/api/chat`;

    let response = await fetch(apiUrl, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        setChatHistory((history) => [...history, { sender: "bot", text: res }]);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error! Could not generate response");
      });
  }

  return (
    <>
      <Head>
        <title>
          Ailawyr Copilot - Upload, Analyze, and Get Answers on Your Legal
          Documents
        </title>
        <meta
          name="description"
          content="Ailawyr Copilot allows you to upload legal documents, ask questions, and get answers. Our AI-powered platform can analyze legal language and provide explanations and sources."
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
      <div className="flex bg-[#fdfdff]">
        <div className=" flex-none ">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div
          className={active ? "hidden flex-1 duration-1000 sm:block" : "flex-1"}
        >
          <div className="max-w-12xl lg:max-w-8xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
            {/* Chat start */}
            <>
              <div className="flex min-h-screen">
                <div className="w-64 flex-auto border-r-2 border-indigo-300 bg-indigo-50 p-4">
                  <div>
                    {/* load a new document */}
                    <div className="m-auto mb-8 w-1/2 rounded-md border border-gray-100 bg-white p-4 shadow-md">
                      <label
                        htmlFor="upload"
                        className="flex cursor-pointer flex-col items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 fill-white stroke-indigo-500"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="font-medium text-gray-600">
                          Load a new document
                        </span>
                      </label>
                      <input
                        onChange={onFileChange}
                        id="upload"
                        type="file"
                        className="hidden"
                      />
                    </div>

                    <div className="pdfdiv-assistant">
                      <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        width={500}
                      >
                        {/* {Array.from({ length: numPages }, (_, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      ))} */}
                        <Page
                          pageNumber={pageNumber}
                          scale={pageScale}
                          renderTextLayer={false}
                        />
                      </Document>
                    </div>
                  </div>
                  <div className="footer m-auto w-1/3">
                    <div className="button-container">
                      {/* <button onClick={handleZoomIn} disabled={pageScale >= 3}>
                        Zoom +
                      </button> */}
                      <button
                        onClick={handleZoomIn}
                        disabled={pageScale >= 3}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        <span>Zoom +</span>
                      </button>
                      <button
                        onClick={handleZoomOut}
                        disabled={pageScale <= 0.3}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        Zoom -
                      </button>
                    </div>
                    <div className="page-text">
                      Page {pageNumber} of {totalPages}
                    </div>
                    <div className="button-container">
                      <button
                        onClick={handlePrevious}
                        disabled={pageNumber === 1}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        ‹ Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={pageNumber === totalPages}
                        className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="flex-1 bg-indigo-50 p-4"> */}
                <div className="sticky top-0	ml-4 flex h-[42rem] w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg border-2 border-solid border-indigo-600 bg-white shadow-xl">
                  <div className="flex h-0 flex-grow flex-col overflow-auto p-4">
                    {/* <div className="mt-2 flex w-full max-w-xs space-x-3">
                      <Image
                        src="/logosmall.png"
                        width="500"
                        height="50"
                        alt=""
                        className="h-10 w-10 rounded-full sm:h-16 sm:w-16"
                      />
                      <div>
                        <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                          </p>
                        </div>
                        <span className="text-xs leading-none text-gray-500">
                          2 min ago
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 ml-auto flex w-full max-w-xs justify-end space-x-3">
                      <div>
                        <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                          <p className="text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod.
                          </p>
                        </div>
                        <span className="text-xs leading-none text-gray-500">
                          2 min ago
                        </span>
                      </div>
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
                    </div> */}
                    <div className="mt-2 flex w-full max-w-xs space-x-3">
                      <img
                        src="/logosmall.png"
                        alt="My profile"
                        className="h-6 w-6 rounded-full"
                      />
                      <div>
                        <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                          <p className="text-sm">
                            Hello 👋, how can I help you?
                          </p>
                        </div>
                      </div>
                    </div>
                    {chatHistory.map((chat: any, index: number) => (
                      <div key={index}>
                        {chat.sender === "bot" && (
                          <div className="mt-2 flex w-full max-w-xs space-x-3">
                            <img
                              src="/logosmall.png"
                              alt="My profile"
                              className="h-6 w-6 rounded-full"
                            />
                            <div>
                              <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                                <p className="text-sm">{chat.text}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {chat.sender === "user" && (
                          <div className="mt-2 ml-auto flex w-full max-w-xs justify-end space-x-3">
                            <div>
                              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                                <p className="text-sm">{chat.text}</p>
                              </div>
                            </div>
                            <img
                              src={session?.user?.image ?? ""}
                              alt="My profile"
                              className="h-6 w-6 rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col-reverse items-end">
                    <button
                      onClick={() =>
                        inputSavedQuestion("Review the following contract")
                      }
                      className="hover:bg-blue text-blue-dark mt-2 mr-2 rounded-lg border-2 border-black bg-transparent py-2 px-4 font-semibold hover:border-pink-700 hover:text-blue-900"
                    >
                      Review the following contract
                    </button>
                    <button
                      onClick={() =>
                        inputSavedQuestion("Summarize the following contract")
                      }
                      className="hover:bg-blue text-blue-dark mt-2 mr-2 rounded-lg border-2 border-black bg-transparent py-2 px-4 font-semibold hover:border-pink-700 hover:text-blue-900"
                    >
                      Summarize the following contract
                    </button>
                    <button
                      onClick={() => inputSavedQuestion("Draft a contract")}
                      className="hover:bg-blue text-blue-dark mt-2 mr-2 rounded-lg border-2 border-black bg-transparent py-2 px-4 font-semibold hover:border-pink-700 hover:text-blue-900"
                    >
                      Draft a contract
                    </button>
                  </div>

                  <div className="bg-gray-100 p-4">
                    {/* <input
                      className="flex h-10 w-full items-center rounded px-3 text-sm"
                      type="text"
                      placeholder="Type your message…"
                    /> */}

                    <form>
                      <label htmlFor="chat" className="sr-only">
                        Your message
                      </label>
                      <div className="flex items-center rounded-lg bg-gray-50 py-2 px-3 dark:bg-gray-700">
                        <div className="rounded-md border border-gray-100 bg-white p-4 shadow-md">
                          <label
                            htmlFor="upload"
                            className="flex cursor-pointer flex-col items-center gap-2"
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
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                              />
                            </svg>
                          </label>
                          <input
                            onChange={onFileChange}
                            id="upload"
                            type="file"
                            className="hidden"
                          />
                        </div>

                        <textarea
                          id="chat"
                          rows={1}
                          className="mx-4 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Your message..."
                          value={inputText}
                          onChange={handleInputTextChange}
                        />
                        <button
                          type="submit"
                          className="inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                          onClick={handleChatInput}
                        >
                          <svg
                            className="h-6 w-6 rotate-90"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* </div> */}
              </div>
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
export async function getServerSideProps(context) {
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

  if (!customer || !customer.billingPlan) {
    return {
      redirect: {
        destination: "/setting",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
