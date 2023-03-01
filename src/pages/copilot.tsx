// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
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
import Catagories from "../components/Dashboard/Catagories";
import { checkout } from "../lib/getStripe";
import initStripe from "stripe";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useRef } from "react";
import useStore from "../../store/useStore";

// import axios from "axios";

export default function Copilot({ plans }) {
  const [legalese, setLegalese] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [active, setActive] = useState(false);
  const { data: session } = useSession();
  const [file, setFile] = useState("../../pdf.pdf");
  const [numPages, setNumPages] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageScale, setPageScale] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const ref = useRef(null);
  const user = session?.user?.email;
  const { pdf_url, blobFile } = useStore();

  useEffect(() => {
    if (blobFile) {
      setFile(blobFile);
    }
  }, []);

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
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
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
  //   const getFiles = async () => {
  //     const { data } = await axios.get(`/api/file?email=${user}`);
  //     const key = "title";
  //     const array = data.datas
  //     const arrayUniqueByKey = [
  //       ...new Map(array.map((item) => [item[key], item])).values(),
  //     ];

  //     setFiles(arrayUniqueByKey);
  //   };
  useEffect(() => {
    // getFiles();
  }, []);

  const handleClick = (event) => {
    setLegalese(ref.current.value);
    queryPrompt(legalese);
  };

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
          <div className="max-w-12xl lg:max-w-8xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
            {/* Chat start */}
            <>
              <div className="flex min-h-screen">
                <div className="w-64 flex-auto border-r-2 border-indigo-300 bg-indigo-50 p-4">
                  <div>
                    <div className="m-auto w-1/2">
                      <label htmlFor="file">Load a new pdf:</label>{" "}
                      <input
                        onChange={onFileChange}
                        type="file"
                        className="mb-8 rounded-full border-2 border-gray-900 px-6 py-2 uppercase transition duration-200 ease-in hover:bg-gray-800 hover:text-white focus:outline-none"
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
                          pageNumber={numPages}
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
                    <div className="mt-2 flex w-full max-w-xs space-x-3">
                      {/* <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" /> */}
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
                    </div>
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
                        <button
                          type="button"
                          disabled="disabled"
                          className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <textarea
                          id="chat"
                          rows={1}
                          className="mx-4 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Your message..."
                          defaultValue={""}
                        />
                        <button
                          type="submit"
                          className="inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
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

  return {
    props: {
      session,
    },
  };
}
